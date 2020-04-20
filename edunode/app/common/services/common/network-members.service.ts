import {Inject, Service, Token} from "typedi";
import {ServerLogger, ServerLoggerToken} from "../../logger/server-logger.interface";
import {EduNewNetworkMemberDto} from "../../dto/network/edu-new-network-member.dto";
import {AxiosInstance, AxiosResponse} from 'axios'
import {AxiosTokenNMS} from "../axios/axios.config";
import {NmsNewNetworkMemberMapper} from "../../dto/nms/nms-new-network-member.dto";
import {validate, ValidationError} from "class-validator";
import {IdentityService, IdentityServiceToken} from "../security/identity.service";
import {
    createAxiosResponseError,
    createInvalidSignatureError,
    createValidationError
} from "../../errors/edu.error.factory";
import {NmsCommonIdentityDto, NmsCommonIdentityDtoMapper} from "../../dto/nms/nms-common-identity.dto";
import {
    ICommonIdentityRepository,
    ICommonIdentityRepositoryToken
} from "../../repositories/identity/common-identity.interface.repository";
import {objectWithoutKeys} from "../../utils/dictionary.utils";
import {EduCommonIdentityDto, EduCommonIdentityDtoMapper} from "../../dto/network/edu-common-identity.dto";
import {CommonIdentity} from "../../entities/identity/common-identity.entity";

export const NetworkMembersServiceToken = new Token<NetworkMembersService>('common.network-members');

@Service(NetworkMembersServiceToken)
export class NetworkMembersService {
    constructor(
        @Inject(ServerLoggerToken) private logger: ServerLogger,
        @Inject(IdentityServiceToken) private identityService: IdentityService,
        @Inject(AxiosTokenNMS) private nmsAxiosInstance: AxiosInstance,
        @Inject(ICommonIdentityRepositoryToken) private commonIdentityRepository: ICommonIdentityRepository
    ) {
    }

    public async getSingleNetworkMember(publicKey: string): Promise<EduCommonIdentityDto> {
        this.logger.logInfo(this, "Handling get network member request.");
        const localCommonIdentity = await this.commonIdentityRepository.findOne({publicKey: publicKey});
        if (!localCommonIdentity) {
            return await this.learnSingleMember(publicKey)
        }
        this.logger.logSuccess(this, "Get network member request handled.");
        return EduCommonIdentityDtoMapper.toDto(localCommonIdentity);
    }

    public async getNetworkMembers(): Promise<EduCommonIdentityDto[]> {
        this.logger.logInfo(this, "Handling get network members request.");
        const localCommonIdentities = await this.commonIdentityRepository.find({});
        this.logger.logSuccess(this, "Get network members request handled.");
        return localCommonIdentities.map(identity => EduCommonIdentityDtoMapper.toDto(identity));
    }

    public async learnSingleMember(publicKey: string): Promise<EduCommonIdentityDto> {
        this.logger.logInfo(this, "Initializing Learn Single Member Flow");
        this.logger.logInfo(this, "Sending get member request....");
        const personalIdentity = await this.identityService.getPersonalIdentity();
        const response: AxiosResponse = await this.nmsAxiosInstance.get('network/members/' + publicKey, {headers: {'public-key': personalIdentity}});
        this.logger.logInfo(this, "Get member request response was received!");

        await this.validateAxiosResponse(response);
        const nmsResponseDto = await NetworkMembersService.axiosResponseToNmsDto(response);

        await this.validateCommonIdentityDto(nmsResponseDto);
        const savedEntity = await this.saveCommonIdentityDto(nmsResponseDto);

        return EduCommonIdentityDtoMapper.toDto(savedEntity);
    }

    public async learnMembers() {
        this.logger.logInfo(this, "Initializing learn members flow");
        this.logger.logInfo(this, "Sending get members request....");
        const personalIdentity = await this.identityService.getPersonalIdentity();
        const response: AxiosResponse = await this.nmsAxiosInstance.get('network/members', {headers: {'public-key': personalIdentity}});
        this.logger.logInfo(this, "Get members request response was received!");

        await this.validateAxiosResponse(response);
        const nmsResponseDtoList = await NetworkMembersService.axiosResponseToNmsDtoList(response);
        for (const dto of nmsResponseDtoList) {
            await this.validateCommonIdentityDto(dto);
        }

        await this.commonIdentityRepository.clear();
        const entityList = await this.saveCommonIdentityDtoList(nmsResponseDtoList);
        return entityList.map(e => EduCommonIdentityDtoMapper.toDto(e));
    }

    public async addMember(memberDto: EduNewNetworkMemberDto): Promise<EduCommonIdentityDto> {
        this.logger.logInfo(this, "Initializing Add Member Flow");
        const validationErrors: ValidationError[] = await validate(memberDto);
        if (validationErrors.length > 0) {
            const error = createValidationError(validationErrors);
            this.logger.logError(this, JSON.stringify(error));
            throw error;
        }

        const nmsDto = NmsNewNetworkMemberMapper.toDtoNms(memberDto);
        nmsDto.joinedDate = new Date(Date.now()).toISOString();
        const publicKey: string = await this.identityService.getPersonalIdentity();
        const signature: string = await this.identityService.signData(nmsDto);
        nmsDto.proof = {publicKey: publicKey, signature: signature};

        this.logger.logInfo(this, "Sending add member request....");
        const personalIdentity = await this.identityService.getPersonalIdentity();
        const response: AxiosResponse = await this.nmsAxiosInstance.post('network/members', nmsDto, {headers: {'public-key': personalIdentity}});
        this.logger.logInfo(this, "Add member request response was received!");

        await this.validateAxiosResponse(response);
        const nmsResponseDto = await NetworkMembersService.axiosResponseToNmsDto(response);

        await this.validateCommonIdentityDto(nmsResponseDto);
        const savedEntity = await this.saveCommonIdentityDto(nmsResponseDto);

        return EduCommonIdentityDtoMapper.toDto(savedEntity);
    }

    private async validateCommonIdentityDto(nmsResponseDto: NmsCommonIdentityDto): Promise<void> {
        this.logger.logInfo(this, "Validation of member request response structure initiated...");


        const responseValidationErrors: ValidationError[] = await validate(nmsResponseDto);
        if (responseValidationErrors.length > 0) {
            const error = createValidationError(responseValidationErrors);
            this.logger.logError(this, JSON.stringify(error));
            throw error;
        }
        this.logger.logSuccess(this, "Succeeded in validating member request response structure!");

        this.logger.logInfo(this, "Validation of Network Member Service signature initiated...");

        const blacklist = ['validatorPublicKey', 'validatorSignature', 'version', 'entityHash', 'id'];
        if (!nmsResponseDto.promoterSignature && !nmsResponseDto.promoterPublicKey) {
            blacklist.push('promoterSignature');
            blacklist.push('promoterPublicKey');
        }

        const filteredData = objectWithoutKeys(nmsResponseDto, blacklist);
        const valid: boolean = await this.identityService.verifyData(filteredData, nmsResponseDto.validatorSignature, nmsResponseDto.validatorPublicKey);
        if (!valid) {
            const error = createInvalidSignatureError(nmsResponseDto);
            this.logger.logError(this, JSON.stringify(error));
            throw error;
        }
        this.logger.logSuccess(this, "Validation of Network Member Service signature succeeded");
    }

    private async saveCommonIdentityDto(nmsResponseDto: NmsCommonIdentityDto): Promise<CommonIdentity> {
        this.logger.logInfo(this, "Saving new network member to local Vault...");
        const commonIdentityEntity = NmsCommonIdentityDtoMapper.mapToEduEntity(nmsResponseDto);
        const savedEntity = await this.commonIdentityRepository.save(commonIdentityEntity);
        this.logger.logSuccess(this, "Succeeded in saving the new network member to the local vault!");
        return savedEntity;
    }

    private async saveCommonIdentityDtoList(nmsResponseDtoList: NmsCommonIdentityDto[]): Promise<CommonIdentity[]> {
        this.logger.logInfo(this, "Saving new network member to local Vault...");
        const commonIdentityEntityList = nmsResponseDtoList.map(dto => NmsCommonIdentityDtoMapper.mapToEduEntity(dto));
        const savedEntityList = await this.commonIdentityRepository.save(commonIdentityEntityList);
        this.logger.logSuccess(this, "Succeeded in saving the new network member to the local vault!");
        return savedEntityList;
    }

    private async validateAxiosResponse(response: AxiosResponse): Promise<void> {
        if (response.status !== 200) {
            const error = createAxiosResponseError(response);
            this.logger.logError(this, JSON.stringify(error));
            throw error;
        }
    }

    private static async axiosResponseToNmsDto(response: AxiosResponse): Promise<NmsCommonIdentityDto> {
        const nmsResponseDto = new NmsCommonIdentityDto();
        Object.assign(nmsResponseDto, response.data);
        return nmsResponseDto;
    }

    private static async axiosResponseToNmsDtoList(response: AxiosResponse): Promise<NmsCommonIdentityDto[]> {
        const responseArray: any[] = response.data;
        const identityArray: NmsCommonIdentityDto[] = [];
        responseArray.forEach(x => {
            const nmsResponseDto = new NmsCommonIdentityDto();
            Object.assign(nmsResponseDto, x);
            identityArray.push(nmsResponseDto);
        });
        return identityArray
    }
}
