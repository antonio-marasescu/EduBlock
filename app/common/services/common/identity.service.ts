import {Inject, Service, Token} from "typedi";
import IPersonalIdentityRepository, {IPersonalIdentityRepositoryToken} from "../../repositories/identity/personal-identity.interface.repository";
import {EccService, EccServiceToken} from "../security/ecc.service";
import {PersonalIdentity} from "../../entities/identity/personal-identity.entity";
import {NodeConfigurationModel, NodeIdentityModelToken} from "../../server/models/node-configuration.model";
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

    public async checkOrGenerateIdentity(): Promise<string> {
        let identity = await this.personalIdentityRepository.findPersonalIdentity();
        if (identity == null) {
            this.logger.logInfo(this, "Generating Identity.......");
            const partialIdentity: PersonalIdentity = await this.eccService.generateIdentity();
            const fullIdentity: PersonalIdentity = {
                publicKey: partialIdentity.publicKey,
                privateKey: partialIdentity.privateKey,
                legalName: this.nodeConfiguration.legalName
            };
            identity = await this.personalIdentityRepository.savePersonalIdentity(fullIdentity);
        }
        return identity.publicKey;
    }
}
