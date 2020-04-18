import {Inject, Service, Token} from "typedi";
import {ServerLogger, ServerLoggerToken} from "../../logger/server-logger.interface";
import {EduNewNetworkMemberDto} from "../../dto/network/edu-new-network-member.dto";
import {AxiosInstance} from 'axios'
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
import {EduCommonIdentityDtoMapper} from "../../dto/network/edu-common-identity.dto";

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

    public async getNetworkMembers() {
        this.logger.logInfo(this, "Getting known network members");
        return "Not implemented";
    }

    public async getWellKnownNetworkMembers() {
        this.logger.logInfo(this, "Getting well known network members");
        return "Not implemented";
    }

    public async learnMembers() {
        this.logger.logInfo(this, "Initializing learn members flow");
        return "Not implemented";
    }

    public async addMember(memberDto: EduNewNetworkMemberDto) {
        this.logger.logInfo(this, "Initializing add member flow");
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
        const response: any = await this.nmsAxiosInstance.post('network/members', nmsDto);
        this.logger.logInfo(this, "Add member request response was received!");

        if (response.status !== 200) {
            const error = createAxiosResponseError(response);
            this.logger.logError(this, JSON.stringify(error));
            throw error;
        }

        this.logger.logInfo(this, "Validation of member request response structure initiated...");
        const nmsResponseDto = new NmsCommonIdentityDto();
        Object.assign(nmsResponseDto, response.data);

        const responseValidationErrors: ValidationError[] = await validate(nmsResponseDto);
        if (responseValidationErrors.length > 0) {
            const error = createValidationError(responseValidationErrors);
            this.logger.logError(this, JSON.stringify(error));
            throw error;
        }
        this.logger.logSuccess(this, "Succeeded in validating member request response structure!");

        this.logger.logInfo(this, "Validation of Network Member Service signature initiated...");

        const filteredData = objectWithoutKeys(nmsResponseDto, ['validatorPublicKey', 'validatorSignature', 'version', 'entityHash', 'id']);
        const valid: boolean = await this.identityService.verifyData(filteredData, nmsResponseDto.validatorSignature, nmsResponseDto.validatorPublicKey);
        if (!valid) {
            const error = createInvalidSignatureError(nmsResponseDto);
            this.logger.logError(this, JSON.stringify(error));
            throw error;
        }
        this.logger.logSuccess(this, "Validation of Network Member Service signature succeeded");

        this.logger.logInfo(this, "Saving new network member to local Vault...");
        const commonIdentityEntity = NmsCommonIdentityDtoMapper.mapToEduEntity(nmsResponseDto);
        const savedEntity = await this.commonIdentityRepository.save(commonIdentityEntity);
        this.logger.logSuccess(this, "Succeeded in saving the new network member to the local vault!");

        return EduCommonIdentityDtoMapper.toDto(savedEntity);
    }
}
