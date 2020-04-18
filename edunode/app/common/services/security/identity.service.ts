import {Inject, Service, Token} from "typedi";
import IPersonalIdentityRepository, {IPersonalIdentityRepositoryToken} from "../../repositories/identity/personal-identity.interface.repository";
import {PersonalIdentity} from "../../entities/identity/personal-identity.entity";
import {EccService, EccServiceToken} from "./ecc.service";
import {NodeConfigurationModel, NodeIdentityModelToken} from "../../entities/config/node-configuration.model";
import {ServerLogger, ServerLoggerToken} from "../../logger/server-logger.interface";
import {createIdentityNotFound} from "../../errors/edu.error.factory";

export const IdentityServiceToken = new Token<IdentityService>('common.identity');

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
                legalIdentity: this.nodeConfiguration.identity.legalName
            };
            const savedIdentity = await this.personalIdentityRepository.save(fullIdentity);
            return savedIdentity.publicKey;
        }
        return identity.publicKey;
    }


    public async getPersonalIdentity(): Promise<string> {
        this.logger.logInfo(this, "Getting personal identity.......");
        const identity = await this.personalIdentityRepository.findPersonalIdentity();
        if (!identity) {
            const error = createIdentityNotFound(this.nodeConfiguration.identity.legalName);
            this.logger.logError(this, JSON.stringify(error));
            throw error;
        }
        this.logger.logInfo(this, "Identity found: " + identity.publicKey);
        return identity.publicKey;
    }

    public async signData(data: any): Promise<string> {
        this.logger.logInfo(this, "Signing of data initialized....");

        this.logger.logInfo(this, "Getting personal identity.......");
        const identity = await this.personalIdentityRepository.findPersonalIdentity();
        if (!identity) {
            const error = createIdentityNotFound(this.nodeConfiguration.identity.legalName);
            this.logger.logError(this, JSON.stringify(error));
            throw error;
        }
        this.logger.logInfo(this, "Identity found: " + identity.publicKey);

        const stringData: string = JSON.stringify(data);
        const signature: string = await this.eccService.signData(stringData, identity.privateKey);

        this.logger.logInfo(this, "Data has being signed....)");
        return signature;
    }

    public async verifyData(data: any, signature: string, signerPublicKey: string): Promise<boolean> {
        this.logger.logInfo(this, "Verifying of data initialized....");
        const result = await this.eccService.verifyData(JSON.stringify(data), signature, signerPublicKey);
        this.logger.logInfo(this, "Verifying of data concluded!");
        return result;
    }
}
