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
import {
    createAttachmentsNotFoundLocallyError,
    createInvalidSignatureError,
    createNotEnoughTransactionsForBlockError,
    createNoTransactionStatusError,
    createObjectNotFoundError,
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
import {NodeConfigurationModel, NodeConfigurationModelToken} from "../../config/node-configuration.model";
import {IBlockRepository, IBlockRepositoryToken} from "../../repositories/ledger/block.interface.repository";
import {BlockEntity, BlockSignatureBlacklist} from "../../entities/ledger/block.entity";
import {AxiosTokenWorker} from "../axios/axios.config";
import {AxiosInstance, AxiosResponse} from "axios";
import {NetworkBlockDto, NetworkBlockDtoMapper} from "../../dto/network/blockchain/network-block.dto";
import {validateAxiosResponse} from "../../utils/validators.utils";
import {BlockchainValidatorService, BlockchainValidatorServiceToken} from "./blockchain-validator.service";
import {NetworkMembersService, NetworkMembersServiceToken} from "../common/network-members.service";
import {buildAxiosInstance} from "../axios/axios.builder";


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
        @Inject(BlockchainValidatorServiceToken) private blockchainValidatorService: BlockchainValidatorService,
        @Inject(NetworkMembersServiceToken) private networkMembersService: NetworkMembersService,
        @Inject(AxiosTokenWorker) private workerAxiosInstance: AxiosInstance,
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
        await this.blockchainValidatorService.validateNetworkTransaction(transaction);

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
        blockEntity.index = noBlocks;
        blockEntity.previousHash = previousBlock.hash;
        blockEntity.transactions = certifiedTransactions.map(x => x.hash!!);
        const blockSignatureObject = objectWithoutKeys(blockEntity, BlockSignatureBlacklist);
        blockEntity.creatorSignature = await this.identityService.signData(blockSignatureObject);
        blockEntity.creatorPublicKey = await this.identityService.getPersonalIdentity();
        const blockDto = NetworkBlockDtoMapper.toDto(blockEntity);
        const response: AxiosResponse = await this.workerAxiosInstance.post('blockchain', blockDto);
        await validateAxiosResponse(this, response);
        return blockEntity.index;
    }

    public async addBlock(networkBlockDto: NetworkBlockDto): Promise<void> {
        try {
            this.logger.logInfo(this, "Request to add block to the blockchain started...");
            const networkEntity: BlockEntity = NetworkBlockDtoMapper.toEntity(networkBlockDto);
            this.logger.logInfo(this, JSON.stringify(networkEntity));
            this.logger.logInfo(this, "Validating block...");
            await this.blockchainValidatorService.validateBlock(networkEntity);
            this.logger.logSuccess(this, "The validation for the block has succeeded...");
            this.logger.logInfo(this, "Adding the block to the ledger...");
            await this.blockRepository.save(networkEntity);
            this.logger.logSuccess(this, "The block was added to the ledger.");
            this.logger.logInfo(this, "Updating local transactions block hash to the new block.");
            await this.reassignTransactionForBlocks(networkEntity);
            this.logger.logSuccess(this, "Local transactions block hash updated.");
        } catch (error) {
            throw error;
        } finally {
            this.blockChainConsensus();
        }
    }

    private async blockChainConsensus(): Promise<void> {
        this.logger.logInfo(this, "Blockchain Consensus Flow has started...");
        const members = await this.networkMembersService.learnMembers();
        const consensusBlockchainModels: BlockEntity[][] = [];

        this.logger.logInfo(this, "Getting blockchain from each known member...");
        for (let member of members) {
            const memberAxiosInstance = buildAxiosInstance(member.host, member.port);
            const response = await memberAxiosInstance.get<NetworkBlockDto[]>('/blockchain');
            if (response.status !== 200) {
                continue;
            }
            const data: BlockEntity[] = response.data.map(b => NetworkBlockDtoMapper.toEntity(b));
            consensusBlockchainModels.push(data);
        }
        this.logger.logSuccess(this, "Received blockchain from each known member");

        this.logger.logInfo(this, "Sorting blockchain's by length");
        consensusBlockchainModels.sort((a, b) => b.length - a.length);

        this.logger.logInfo(this, "Updating local blockchain through the consensus mechanism");
        for (const blockchain of consensusBlockchainModels) {
            const valid = await this.blockchainValidatorService.validateChain(blockchain);
            if (valid) {
                this.logger.logInfo(this, "New blockchain length: " + blockchain.length);

                this.logger.logInfo(this, "Updating local blockchain.");
                await this.blockRepository.save(blockchain);
                this.logger.logSuccess(this, "Local blockchain updated.");

                this.logger.logInfo(this, "Updating local transactions block hash to the new blockchain.");
                for (const block of blockchain) {
                    await this.reassignTransactionForBlocks(block);
                }
                this.logger.logSuccess(this, "Local transactions for the new blockchain updated.");
            }
        }
        this.logger.logSuccess(this, "Local blockchain was updated through the consensus mechanism");
        this.logger.logSuccess(this, "Blockchain Consensus Flow has finished.");
    }

    public async getBlockChain(): Promise<NetworkBlockDto[]> {
        this.logger.logInfo(this, "Get local blockchain flow started.");
        const localBlockchain = await this.blockRepository.find({});
        this.logger.logSuccess(this, "Get local blockchain flow has ended.");
        return localBlockchain.map(b => NetworkBlockDtoMapper.toDto(b));
    }

    public async getBlockByHash(hash: string): Promise<NetworkBlockDto> {
        this.logger.logInfo(this, "Searching for block by hash: " + hash);
        const block = await this.blockRepository.findOne({hash: hash});
        if (!block) {
            const error = createObjectNotFoundError(hash);
            this.logger.logWarning(this, JSON.stringify(error));
            throw error;
        }
        this.logger.logSuccess(this, "Block found in the local vault!");
        return block;
    }

    public async getTransactionDetailsByHash(hash: string): Promise<NetworkTransactionDto> {
        this.logger.logInfo(this, "Searching for transaction by hash: " + hash);
        const transaction = await this.recordTransactionRepository.findOne({hash: hash});
        if (!transaction) {
            const error = createObjectNotFoundError(hash);
            this.logger.logWarning(this, JSON.stringify(error));
            throw error;
        }
        this.logger.logSuccess(this, "Transaction found in the local vault!");
        return NetworkTransactionDtoMapper.toDto(transaction);
    }

    public async getAllTransactions(): Promise<NetworkTransactionDto[]> {
        this.logger.logInfo(this, "Getting all transactions flow started.");
        const transactions = await this.recordTransactionRepository.find();
        this.logger.logSuccess(this, "Getting all transactions flow has ended.");
        return transactions.map(t => NetworkTransactionDtoMapper.toDto(t));
    }

    private async reassignTransactionForBlocks(networkEntity: BlockEntity): Promise<void> {
        for (let transaction of networkEntity.transactions) {
            const localTransaction = await this.recordTransactionRepository.findOne({hash: transaction});
            if (!localTransaction) {
                this.logger.logWarning(this, "We do not own transaction: " + transaction);
                continue;
            }
            localTransaction.blockHash = networkEntity.hash;
            localTransaction.status = RecordTransactionStatus.Created;
            await this.recordTransactionRepository.save(localTransaction);
        }
    }

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
