import {Inject, Service, Token} from "typedi";
import {IdentityService, IdentityServiceToken} from "./identity.service";
import {ISignatureRepositoryToken} from "../repositories/signatures/signature.interface.repository";
import {SignatureRepository} from "../repositories/signatures/signature.repository";
import {SignatureEntity} from "../entities/signatures/signature.entity";
import {CaLogger, CaLoggerToken} from "../logger/ca-logger.interface";
import {createNoDataToSignError} from "../errors/ca.error.factory";
import {SignatureDto} from "../dto/signature.dto";
import {objectWithoutKeys} from "../utils/dictionary.utils";

export const CertificateAuthorityServiceToken = new Token<CertificateAuthorityService>('services.certificate-authority');

@Service(CertificateAuthorityServiceToken)
export class CertificateAuthorityService {
    constructor(
        @Inject(CaLoggerToken) private logger: CaLogger,
        @Inject(IdentityServiceToken) private identityService: IdentityService,
        @Inject(ISignatureRepositoryToken) private signatureRepository: SignatureRepository
    ) {
    }


    public async signData(networkData: any): Promise<SignatureDto> {
        this.logger.logInfo(this, "Starting sign record data flow...");
        this.logger.logWarning(this, "This is just a mock signature, should not be considered as a legal signature of a record");
        const data = objectWithoutKeys(networkData, []);
        if (!data) {
            const error = createNoDataToSignError(data);
            this.logger.logError(this, JSON.stringify(error));
            throw error;
        }
        const signature = await this.identityService.signData(data);
        const now = new Date(Date.now()).toISOString();

        this.logger.logInfo(this, "Signature data is been notarized...");
        const signedData: SignatureEntity = {
            signedData: JSON.stringify(data),
            signature: signature,
            dateSigned: now
        };
        await this.signatureRepository.save(signedData);
        this.logger.logSuccess(this, "Signature data has been notarized...");

        this.logger.logInfo(this, "Creating data transfer object.....");
        const identity = await this.identityService.getPersonalIdentity();
        const signatureDto: SignatureDto = {
            signature: signature,
            publicKey: identity,
            dateSigned: now
        };
        this.logger.logSuccess(this, "Data transfer object has been created!");
        return signatureDto;
    }
}
