import {Inject, Service, Token} from "typedi";
import {ServerLogger, ServerLoggerToken} from "../../logger/server-logger.interface";
import {AxiosTokenCA} from "../axios/axios.config";
import {AxiosInstance, AxiosResponse} from "axios";
import {CaTransactionDto} from "../../dto/ca/ca-transaction.dto";
import {validateAxiosResponse} from "../../utils/validators.utils";
import {CaSignatureDto} from "../../dto/ca/ca-signature.dto";

export const CertificateAuthorityServiceToken = new Token<CertificateAuthorityService>('services.common.certificate-authority');

@Service(CertificateAuthorityServiceToken)
export class CertificateAuthorityService {
    constructor(
        @Inject(ServerLoggerToken) private logger: ServerLogger,
        @Inject(AxiosTokenCA) private caAxiosInstance: AxiosInstance,
    ) {
    }

    public async signTransaction(transaction: CaTransactionDto): Promise<CaSignatureDto> {
        this.logger.logInfo(this, "Creating certification of the transaction of record...");
        const response: AxiosResponse = await this.caAxiosInstance.post('/ca/sign', transaction);

        this.logger.logInfo(this, "Validating response of the Certificate Authority...");
        await validateAxiosResponse(this, response);

        const caSignatureDto = CertificateAuthorityService.axiosResponseToCaSignature(response);
        this.logger.logSuccess(this, "Certification of the transaction of record was created..");

        return caSignatureDto;
    }

    private static axiosResponseToCaSignature(response: AxiosResponse): CaSignatureDto {
        const caSignatureDto = new CaSignatureDto();
        Object.assign(caSignatureDto, response.data);
        return caSignatureDto;
    }
}
