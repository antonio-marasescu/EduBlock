import {Inject, Service, Token} from "typedi";
import {EccService, EccServiceToken} from "./ecc.service";
import {NmsConfigurationModel, NmsConfigurationModelToken} from "../config/nms-configuration.model";
import {NmsLogger, NmsLoggerToken} from "../logger/nms-logger.interface";
import IPersonalIdentityRepository, {IPersonalIdentityRepositoryToken} from "../repositories/identity/personal-identity.interface.repository";
import {PersonalIdentity} from "../entities/identity/personal-identity.entity";
import {createIdentityNotFound} from "../errors/nms.error.factory";
import {objectWithoutKeys} from "../utils/dictionary.utils";

export const IdentityServiceToken = new Token<IdentityService>('common.identity');

@Service(IdentityServiceToken)
export class IdentityService {
    constructor(
        @Inject(EccServiceToken) private eccService: EccService,
        @Inject(NmsConfigurationModelToken) private nodeConfiguration: NmsConfigurationModel,
        @Inject(IPersonalIdentityRepositoryToken) private  personalIdentityRepository: IPersonalIdentityRepository,
        @Inject(NmsLoggerToken) private logger: NmsLogger
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

    public async getPersonalInformation(): Promise<Partial<PersonalIdentity>> {
        const identity = await this.getPersonalData();
        return objectWithoutKeys(identity, ['id', 'privateKey']);
    }

    public async getPersonalIdentity(): Promise<string> {
        const identity = await this.getPersonalData();
        return identity.publicKey;
    }

    public async signData(data: any): Promise<string> {
        this.logger.logInfo(this, "Signing of data initialized....");
        const identity = await this.getPersonalData();

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

    private async getPersonalData(): Promise<PersonalIdentity> {
        this.logger.logInfo(this, "Getting personal identity.......");
        const identity = await this.personalIdentityRepository.findPersonalIdentity();
        if (!identity) {
            const error = createIdentityNotFound(this.nodeConfiguration.identity.legalName);
            this.logger.logError(this, JSON.stringify(error));
            throw error;
        }
        this.logger.logInfo(this, "Identity found: " + identity.publicKey);
        return identity;
    }
}
