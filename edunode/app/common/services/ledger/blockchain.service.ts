import {Inject, Service, Token} from "typedi";
import {
    IRecordTransactionRepository,
    IRecordTransactionRepositoryToken
} from "../../repositories/ledger/record-transaction.interface.repository";
import {ServerLogger, ServerLoggerToken} from "../../logger/server-logger.interface";
import {CreateTransactionDto, CreateTransactionDtoMapper} from "../../dto/common/create-transaction.dto";
import {
    CertifiedTransactionHashBlacklist,
    PendingTransactionHashBlacklist,
    RecordTransactionEntity
} from "../../entities/ledger/record-transaction.entity";
import {IFilesRepository, IFilesRepositoryToken} from "../../repositories/vault/files.interface.repository";
import {createAttachmentsNotFoundLocallyError, createInvalidSignatureError} from "../../errors/edu.error.factory";
import {RecordTransactionStatus} from "../../entities/ledger/record-transaction-status.enum";
import {IdentityService, IdentityServiceToken} from "../security/identity.service";
import {objectWithoutKeys} from "../../utils/dictionary.utils";
import {CertificateAuthorityService, CertificateAuthorityServiceToken} from "../common/certificate-authority.service";
import {CaTransactionDtoMapper} from "../../dto/ca/ca-transaction.dto";
import {CaSignatureDto} from "../../dto/ca/ca-signature.dto";
import {EccService, EccServiceToken} from "../security/ecc.service";
import {TransactionPublisher, TransactionPublisherToken} from "../../network/rabbitmq/publishers/transaction.publisher";
import {NetworkTransactionDto, NetworkTransactionDtoMapper} from "../../dto/network/blockchain/network-transaction.dto";

export const BlockchainServiceToken = new Token<BlockchainService>('services.ledger.blockchain');

@Service(BlockchainServiceToken)
export class BlockchainService {
    constructor(
        // @Inject(IConsensusServiceToken) private consensusService: IConsensusService,
        // @Inject(IBlockRepositoryToken) private blockRepository: IBlockRepository,
        @Inject(IRecordTransactionRepositoryToken) private recordTransactionRepository: IRecordTransactionRepository,
        @Inject(IFilesRepositoryToken) private filesRepository: IFilesRepository,
        @Inject(IdentityServiceToken) private identityService: IdentityService,
        @Inject(CertificateAuthorityServiceToken) private certificateAuthorityService: CertificateAuthorityService,
        @Inject(EccServiceToken) private eccService: EccService,
        @Inject(TransactionPublisherToken) private transactionPublisher: TransactionPublisher,
        @Inject(ServerLoggerToken) private logger: ServerLogger,
    ) {
    }

    public async createTransaction(transactionDto: CreateTransactionDto): Promise<RecordTransactionEntity> {
        this.logger.logInfo(this, "Creating Transaction Flow started...");
        this.logger.logInfo(this, "Validating transaction data transfer object...");
        await this.validateTransactionDto(transactionDto);
        this.logger.logSuccess(this, "Validation of transaction data transfer object succeeded");

        const transaction: RecordTransactionEntity = CreateTransactionDtoMapper.toEntity(transactionDto);
        transaction.version = 1.0;
        transaction.creatorPublicKey = await this.identityService.getPersonalIdentity();
        const pendingTransactionHashObject = objectWithoutKeys(transaction, PendingTransactionHashBlacklist);
        transaction.creatorSignature = await this.identityService.signData(pendingTransactionHashObject);
        const pendingTransaction = await this.checkpointTransaction(transaction, RecordTransactionStatus.Pending);

        const caDto = CaTransactionDtoMapper.toDto(pendingTransaction);
        const caSignatureDto: CaSignatureDto = await this.certificateAuthorityService.signTransaction(caDto);

        const validCaSignature = await this.identityService.verifyData(caDto, caSignatureDto.signature, caSignatureDto.publicKey);
        if (!validCaSignature) {
            const error = createInvalidSignatureError(caSignatureDto);
            this.logger.logError(this, JSON.stringify(error));
            throw error;
        }

        pendingTransaction.certificateAuthorityPublicKey = caSignatureDto.publicKey;
        pendingTransaction.certificateSignature = caSignatureDto.signature;
        pendingTransaction.creationDate = caSignatureDto.dateSigned;
        const certifiedTransactionHashObject = objectWithoutKeys(pendingTransaction, CertifiedTransactionHashBlacklist);
        pendingTransaction.hash = await this.eccService.hashData(certifiedTransactionHashObject);
        const certifiedTransaction = await this.checkpointTransaction(transaction, RecordTransactionStatus.Certified);

        const networkTransactionDto = NetworkTransactionDtoMapper.toDto(certifiedTransaction);
        await this.transactionPublisher.publish(networkTransactionDto);

        return certifiedTransaction;
    }

    public async getTransactionDetailsByHash() {

    }

    public async addTransaction(networkTransactionDto: NetworkTransactionDto) {

    }

    // public async createBlock() {
    // }
    //
    // public async addBlock(networkBlockDto: NetworkBlockDto) {
    // }

    private async validateTransactionDto(transactionDto: CreateTransactionDto): Promise<void> {
        this.logger.logInfo(this, "Validating transaction attachments...");
        const files = await this.filesRepository.findFileByIds(transactionDto.attachments);
        if (files.length !== transactionDto.attachments.length) {
            const error = createAttachmentsNotFoundLocallyError(transactionDto.attachments);
            this.logger.logError(this, JSON.stringify(error));
            throw error;
        }
        this.logger.logSuccess(this, "Validation succeeded of transaction attachments...");
    }

    private async checkpointTransaction(transaction: RecordTransactionEntity, newStatus: RecordTransactionStatus): Promise<RecordTransactionEntity> {
        this.logger.logInfo(this, "Checkpointing transaction to status: " + newStatus);
        transaction.status = newStatus;
        const savedTransaction: any = await this.recordTransactionRepository.save(transaction).catch(error => console.log(error));
        this.logger.logSuccess(this, "Checkpointing transaction " + transaction.id + " succeeded.");
        return savedTransaction;
    }
}
