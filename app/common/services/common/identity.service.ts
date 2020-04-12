import {Inject, Service, Token} from "typedi";
import IPersonalIdentityRepository, {IPersonalIdentityRepositoryToken} from "../../repositories/identity/personal-identity.interface.repository";
import {PersonalIdentity} from "../../entities/identity/personal-identity.entity";
import {EccService, EccServiceToken} from "../security/ecc.service";
import {NodeConfigurationModel, NodeIdentityModelToken} from "../../entities/config/node-configuration.model";
import {ServerLogger, ServerLoggerToken} from "../../logger/server-logger.interface";

export const IdentityServiceToken = new Token<IdentityService>('services.identity');

@Service(IdentityServiceToken)
export class IdentityService {
    constructor(
        @Inject(EccServiceToken) private eccService: EccService,
        @Inject(NodeIdentityModelToken) private nodeConfiguration: NodeConfigurationModel,
        @Inject(IPersonalIdentityRepositoryToken) private  personalIdentityRepository: IPersonalIdentityRepository,
        @Inject(ServerLoggerToken) private logger: ServerLogger
    ) {
    }

    public async checkOrGeneratePersonalIdentity(): Promise<string> {
        this.logger.logInfo(this, "Getting personal identity.......");
        const identity = await this.personalIdentityRepository.findPersonalIdentity();
        if (!identity) {
            this.logger.logInfo(this, "Generating Identity.......");
            const partialIdentity: PersonalIdentity = await this.eccService.generateIdentity();
            const fullIdentity: PersonalIdentity = {
                publicKey: partialIdentity.publicKey,
                privateKey: partialIdentity.privateKey,
                legalName: this.nodeConfiguration.identity.legalName
            };
            const savedIdentity = await this.personalIdentityRepository.savePersonalIdentity(fullIdentity);
            return savedIdentity.publicKey;
        }
        return identity.publicKey;
    }


    public async getPersonalIdentity(): Promise<string> {
        this.logger.logInfo(this, "Getting personal identity.......");
        const identity = await this.personalIdentityRepository.findPersonalIdentity();
        if (!identity) {
            this.logger.logError(this, "No identity could be found!");
            throw new Error("No identity could be found!");
        }
        return identity.publicKey;
    }
}
