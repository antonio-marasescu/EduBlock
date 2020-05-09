import {Container, Inject, Service, Token} from "typedi";
import {
    IRecordTransactionRepository,
    IRecordTransactionRepositoryToken
} from "../../repositories/ledger/record-transaction.interface.repository";
import {ServerLogger, ServerLoggerToken} from "../../logger/server-logger.interface";
import {CreateTransactionDto, CreateTransactionDtoMapper} from "../../dto/common/create-transaction.dto";
import {
    CertificateAuthorityTransactionSignatureBlacklist,
    CertifiedTransactionHashBlacklist,
    PendingTransactionHashBlacklist,
    RecordTransactionEntity
} from "../../entities/ledger/record-transaction.entity";
import {IFilesRepository, IFilesRepositoryToken} from "../../repositories/vault/files.interface.repository";
import {
    createAttachmentsNotFoundLocallyError,
    createCertificateAuthorityCouldNotBeFoundError,
    createInvalidHashError,
    createInvalidSignatureError,
    createNotEnoughTransactionsForBlockError,
    createNoTransactionStatusError,
    createSignatureDoesNotExistError,
    createValidationError
} from "../../errors/edu.error.factory";
import {RecordTransactionStatus} from "../../entities/ledger/record-transaction-status.enum";
import {IdentityService, IdentityServiceToken} from "../security/identity.service";
import {objectWithoutKeys} from "../../utils/dictionary.utils";
import {CertificateAuthorityService, CertificateAuthorityServiceToken} from "../common/certificate-authority.service";
import {CaTransactionDtoMapper} from "../../dto/ca/ca-transaction.dto";
import {CaSignatureDto} from "../../dto/ca/ca-signature.dto";
import {EccService, EccServiceToken} from "../security/ecc.service";
import {TransactionPublisher, TransactionPublisherToken} from "../rabbitmq/publishers/transaction.publisher";
import {NetworkTransactionDto, NetworkTransactionDtoMapper} from "../../dto/network/blockchain/network-transaction.dto";
import {validate, ValidationError} from "class-validator";
import {NetworkMembersService, NetworkMembersServiceToken} from "../common/network-members.service";
import {NodeConfigurationModel, NodeConfigurationModelToken} from "../../entities/config/node-configuration.model";
import {IBlockRepository, IBlockRepositoryToken} from "../../repositories/ledger/block.interface.repository";
import {BlockEntity, BlockSignatureBlacklist} from "../../entities/ledger/block.entity";
import {IConsensusServiceToken} from "./consensus/consensus.pow.service";
import {BlockPublisherToken} from "../rabbitmq/publishers/block.publisher";
import {NetworkBlockDtoMapper} from "../../dto/network/blockchain/network-block.dto";


export const BlockchainServiceToken = new Token<BlockchainService>('services.ledger.blockchain');

@Service(BlockchainServiceToken)
export class BlockchainService {

    constructor(
        @Inject(IBlockRepositoryToken) private blockRepository: IBlockRepository,
        @Inject(NodeConfigurationModelToken) private nodeConfigurationModelToken: NodeConfigurationModel,
        @Inject(IRecordTransactionRepositoryToken) private recordTransactionRepository: IRecordTransactionRepository,
        @Inject(IFilesRepositoryToken) private filesRepository: IFilesRepository,
        @Inject(IdentityServiceToken) private identityService: IdentityService,
        @Inject(CertificateAuthorityServiceToken) private certificateAuthorityService: CertificateAuthorityService,
        @Inject(EccServiceToken) private eccService: EccService,
        @Inject(TransactionPublisherToken) private transactionPublisher: TransactionPublisher,
        @Inject(NetworkMembersServiceToken) private networkMembersService: NetworkMembersService,
        @Inject(ServerLoggerToken) private logger: ServerLogger,
    ) {
    }

    public async createTransaction(transactionDto: CreateTransactionDto): Promise<RecordTransactionEntity> {
        this.logger.logInfo(this, "Creating Transaction Flow started...");
        this.logger.logInfo(this, "Validating transaction data transfer object...");
        await this.validateCreateTransactionDto(transactionDto);
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
        this.logger.logInfo(this, "Adding Transaction Flow has started...");
        this.logger.logInfo(this, "Validating network transaction data transfer object...");
        const validationErrors: ValidationError[] = await validate(networkTransactionDto);
        if (validationErrors.length > 0) {
            const error = createValidationError(validationErrors);
            this.logger.logError(this, JSON.stringify(error));
            throw error;
        }
        this.logger.logSuccess(this, "Validation of network transaction data transfer object succeeded...");

        const transaction: RecordTransactionEntity = NetworkTransactionDtoMapper.toEntity(networkTransactionDto);
        await this.validateNetworkTransaction(transaction);

        if (!transaction.status) {
            const error = createNoTransactionStatusError(transaction.status);
            this.logger.logError(this, JSON.stringify(error));
            throw error;
        }
        await this.checkpointTransaction(transaction, transaction.status);
        this.runtimeTransactionCheck();
    }

    public async createBlock(): Promise<number> {
        this.logger.logInfo(this, "Getting transactions for block creation...");
        const certifiedTransactions = await this.recordTransactionRepository.find({status: RecordTransactionStatus.Certified});
        if (!certifiedTransactions || certifiedTransactions.length === 0) {
            const error = createNotEnoughTransactionsForBlockError();
            this.logger.logWarning(this, JSON.stringify(error));
            throw error;
        }
        this.logger.logInfo(this, "Transaction found, block will be created with " + certifiedTransactions.length + " transactions");
        const noBlocks = await this.blockRepository.count({});
        const previousIndex = noBlocks - 1;
        let previousBlock = await this.blockRepository.findOne({index: previousIndex});
        if (!previousBlock) {
            previousBlock = await this.createGenesisBlock(); // TODO: Just for testing
        }
        const blockEntity = new BlockEntity();
        blockEntity.index = noBlocks + 1;
        blockEntity.previousHash = previousBlock.hash;
        blockEntity.transactions = certifiedTransactions.map(x => x.hash!!);
        const blockSignatureObject = objectWithoutKeys(blockEntity, BlockSignatureBlacklist);
        blockEntity.creatorSignature = await this.identityService.signData(blockSignatureObject);
        blockEntity.creatorPublicKey = await this.identityService.getPersonalIdentity();
        const consensusService = Container.get(IConsensusServiceToken);
        consensusService.generateProof(blockEntity).then(async (hashedBlock) => {
            const logger = Container.get(ServerLoggerToken);
            const blockPublisher = Container.get(BlockPublisherToken);

            hashedBlock.timestamp = new Date(Date.now()).toISOString();
            logger.logInfo(this, "Block work has finished on " + hashedBlock.timestamp);
            const blockDto = NetworkBlockDtoMapper.toDto(hashedBlock);
            logger.logInfo(this, "Block will be published to the network");
            logger.logInfo(this, JSON.stringify(blockDto));
            await blockPublisher.publish(blockDto);
            logger.logSuccess(this, "Block has been published to the network");

        });
        return blockEntity.index;
    }

    //
    // public async addBlock(networkBlockDto: NetworkBlockDto) {
    // }

    private async runtimeTransactionCheck(): Promise<void> {
        this.logger.logInfo(this, "Running runtime transaction checks...");
        const certifiedTransactionCount = await this.recordTransactionRepository.count({status: RecordTransactionStatus.Certified});
        if (certifiedTransactionCount >= this.nodeConfigurationModelToken.blockchainConfiguration.numberOfTransactionUntilBlock) {
            this.logger.logInfo(this, "Automatic block creation process started!");
            this.createBlock();
        }
        this.logger.logSuccess(this, "Runtime transaction checks have finished...");
    }

    private async validateCreateTransactionDto(transactionDto: CreateTransactionDto): Promise<void> {
        this.logger.logInfo(this, "Validating transaction attachments...");
        const files = await this.filesRepository.findFileByIds(transactionDto.attachments);
        if (files.length !== transactionDto.attachments.length) {
            const error = createAttachmentsNotFoundLocallyError(transactionDto.attachments);
            this.logger.logError(this, JSON.stringify(error));
            throw error;
        }
        this.logger.logSuccess(this, "Validation succeeded of transaction attachments...");
    }

    private async validateNetworkTransaction(transaction: RecordTransactionEntity): Promise<void> {
        this.logger.logInfo(this, "Validating identity of the transaction creator...");
        await this.networkMembersService.getSingleNetworkMember(transaction.creatorPublicKey);
        this.logger.logSuccess(this, "Validation of the identity of the transaction creator succeeded...");

        this.logger.logInfo(this, "Validating the transaction hash...");
        const certifiedTransactionHashObject = objectWithoutKeys(transaction, CertifiedTransactionHashBlacklist);
        const verificationHash = await this.eccService.hashData(certifiedTransactionHashObject);
        if (verificationHash !== transaction.hash) {
            const error = createInvalidHashError(transaction.hash);
            this.logger.logError(this, JSON.stringify(error));
            throw error;
        }
        this.logger.logSuccess(this, "Validation of the transaction hash succeeded...");


        this.logger.logInfo(this, "Validating the creator signature of the data...");
        if (!transaction.creatorSignature) {
            const error = createSignatureDoesNotExistError('transaction.creatorSignature');
            this.logger.logError(this, JSON.stringify(error));
            throw error;
        }
        const creatorTransactionSignatureObject = objectWithoutKeys(transaction, PendingTransactionHashBlacklist);
        const transactionCreatorSignature: string = transaction.creatorSignature;
        await this.identityService.verifyData(creatorTransactionSignatureObject, transactionCreatorSignature, transaction.creatorPublicKey);
        this.logger.logSuccess(this, "Validation of the creator signature of the data succeeded...");


        this.logger.logInfo(this, "Validating the certificate authority signature of the data...");
        if (!transaction.certificateSignature) {
            const error = createSignatureDoesNotExistError('transaction.certificateSignature');
            this.logger.logError(this, JSON.stringify(error));
            throw error;
        }
        if (!transaction.certificateAuthorityPublicKey) {
            const error = createCertificateAuthorityCouldNotBeFoundError('transaction.certificateAuthorityPublicKey');
            this.logger.logError(this, JSON.stringify(error));
            throw error;
        }
        const certificateAuthorityTransactionSignatureObject = objectWithoutKeys(transaction, CertificateAuthorityTransactionSignatureBlacklist);
        const transactionCertificateAuthoritySignature: string = transaction.certificateSignature;
        await this.identityService.verifyData(certificateAuthorityTransactionSignatureObject, transactionCertificateAuthoritySignature, transaction.certificateAuthorityPublicKey);
        this.logger.logSuccess(this, "Validation of the certificate authority signature of the data succeeded...");
    }

    private async checkpointTransaction(transaction: RecordTransactionEntity, newStatus: RecordTransactionStatus): Promise<RecordTransactionEntity> {
        this.logger.logInfo(this, "Checkpointing transaction to status: " + newStatus);
        transaction.status = newStatus;
        const savedTransaction: any = await this.recordTransactionRepository.save(transaction).catch(error => this.logger.logError(this, JSON.stringify(error)));
        this.logger.logSuccess(this, "Checkpointing transaction " + transaction.id + " succeeded.");
        return savedTransaction;
    }

    private async createGenesisBlock(): Promise<BlockEntity> {
        const genesis = new BlockEntity();
        genesis.index = 0;
        genesis.previousHash = '0';
        genesis.timestamp = new Date(Date.now()).toISOString();
        genesis.nonce = 0;
        genesis.transactions = [];
        genesis.creatorPublicKey = '';
        genesis.creatorSignature = '';
        genesis.hash = '0';
        return await this.blockRepository.save(genesis);
    }
}
