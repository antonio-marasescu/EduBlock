import {Inject, Service, Token} from "typedi";
import {
    INetworkMapRepository,
    INetworkMapRepositoryToken
} from "../repositories/network-map/network-map.interface.repository";
import {NewNetworkMemberDto} from "../dto/network/new-network-member.dto";
import {validate} from "class-validator";
import {ValidationError} from "class-validator/validation/ValidationError";
import {NetworkMapEntityMapper} from "../dto/network/mappers/network-map.entity.mapper";
import {NetworkMemberDto} from "../dto/network/network-member.dto";
import {NmsLogger, NmsLoggerToken} from "../logger/nms-logger.interface";
import {IdentityService, IdentityServiceToken} from "./identity.service";
import {objectWithoutKeys} from "../utils/dictionary.utils";
import {
    createInvalidSignatureError,
    createObjectCouldNotBeSavedError,
    createObjectNotFoundError,
    createValidationError
} from "../errors/nms.error.factory";
import {EccService, EccServiceToken} from "./ecc.service";

export const NetworkMapServiceToken = new Token<NetworkMapService>('services.network-map');

@Service(NetworkMapServiceToken)
export class NetworkMapService {
    constructor(
        @Inject(INetworkMapRepositoryToken) private networkMapRepository: INetworkMapRepository,
        @Inject(IdentityServiceToken) private identityService: IdentityService,
        @Inject(NmsLoggerToken) private logger: NmsLogger,
        @Inject(EccServiceToken) private eccService: EccService
    ) {
    }

    public async getAllNetworkMembers(): Promise<NetworkMemberDto[]> {
        this.logger.logInfo(this, "Initializing get all network members...");
        const entities = await this.networkMapRepository.getAllNetworkMembers();
        return entities.map(e => NetworkMapEntityMapper.toDto(e))
    }

    public async findNetworkMember(publicKey: string): Promise<NetworkMemberDto> {
        this.logger.logInfo(this, "Initializing find network member...");
        const entity = await this.networkMapRepository.findNetworkMember(publicKey);
        if (!entity) {
            const error = createObjectNotFoundError(publicKey)
            this.logger.logError(this, JSON.stringify(error));
            throw error;
        }
        return NetworkMapEntityMapper.toDto(entity);
    }

    public async addNetworkMember(newMember: NewNetworkMemberDto): Promise<NetworkMemberDto> {
        this.logger.logInfo(this, "Initializing add network member...");
        this.logger.logInfo(this, "Validating network member data transfer object...");
        const validationErrors: ValidationError[] = await validate(newMember);
        if (validationErrors.length > 0) {
            const error = createValidationError(validationErrors);
            this.logger.logError(this, JSON.stringify(error));
            throw error;
        }
        this.logger.logSuccess(this, "Validation succeeded.");

        const filteredData = objectWithoutKeys(newMember, ['proof']);
        const valid: boolean = await this.identityService.verifyData(filteredData, newMember.proof.signature, newMember.proof.publicKey);

        if (!valid) {
            const error = createInvalidSignatureError(newMember);
            this.logger.logError(this, JSON.stringify(error));
            throw error;
        }


        this.logger.logInfo(this, "Adding personal signature to new network member...");
        const networkMapEntity = NetworkMapEntityMapper.toEntity(newMember);
        networkMapEntity.validatorSignature = await this.identityService.signData(networkMapEntity);
        networkMapEntity.validatorPublicKey = await this.identityService.getPersonalIdentity();
        networkMapEntity.version = 1.0;
        networkMapEntity.entityHash = await this.eccService.hashData(networkMapEntity);

        this.logger.logInfo(this, "Saving new network member to the Vault...");
        const savedEntity = await this.networkMapRepository.createNetworkMember(networkMapEntity);

        if (!savedEntity) {
            const error = createObjectCouldNotBeSavedError(networkMapEntity);
            this.logger.logError(this, JSON.stringify(error));
            throw error;
        }
        this.logger.logSuccess(this, "New network member added!");

        return NetworkMapEntityMapper.toDto(savedEntity);
    }
}
