import {Inject, Service, Token} from "typedi";
import {IBlockRepository, IBlockRepositoryToken} from "../../repositories/ledger/block.interface.repository";
import {BlockEntity, BlockHashBlacklist, BlockSignatureBlacklist} from "../../entities/ledger/block.entity";
import {objectWithoutKeys} from "../../utils/dictionary.utils";
import {EccService, EccServiceToken} from "../security/ecc.service";
import {IdentityService, IdentityServiceToken} from "../security/identity.service";
import {
    createCertificateAuthorityCouldNotBeFoundError,
    createInvalidBlockEntityError,
    createInvalidHashError,
    createInvalidSignatureError,
    createObjectNotFoundError,
    createSignatureDoesNotExistError
} from "../../errors/edu.error.factory";
import {ServerLogger, ServerLoggerToken} from "../../logger/server-logger.interface";
import {NodeConfigurationModel, NodeConfigurationModelToken} from "../../config/node-configuration.model";
import {
    IRecordTransactionRepository,
    IRecordTransactionRepositoryToken
} from "../../repositories/ledger/record-transaction.interface.repository";
import {
    CertificateAuthorityTransactionSignatureBlacklist,
    CertifiedTransactionHashBlacklist,
    PendingTransactionHashBlacklist,
    RecordTransactionEntity
} from "../../entities/ledger/record-transaction.entity";
import {NetworkMembersService, NetworkMembersServiceToken} from "../common/network-members.service";


export const BlockchainValidatorServiceToken = new Token<BlockchainValidatorService>('services.ledger.blockchain-validator');

@Service(BlockchainValidatorServiceToken)
export class BlockchainValidatorService {
    constructor(
        @Inject(IBlockRepositoryToken) private blockRepository: IBlockRepository,
        @Inject(IRecordTransactionRepositoryToken) private recordTransactionRepository: IRecordTransactionRepository,
        @Inject(EccServiceToken) private eccService: EccService,
        @Inject(IdentityServiceToken) private identityService: IdentityService,
        @Inject(NodeConfigurationModelToken) private nodeConfigurationModelToken: NodeConfigurationModel,
        @Inject(NetworkMembersServiceToken) private networkMembersService: NetworkMembersService,
        @Inject(ServerLoggerToken) private logger: ServerLogger
    ) {

    }

    public async validateBlock(block: BlockEntity): Promise<void> {
        const noBlocks = await this.blockRepository.count({});
        if (noBlocks !== block.index) {
            const error = createInvalidBlockEntityError(block.index, "This block is too old to be considered valid!");
            this.logger.logError(this, JSON.stringify(error));
            throw error;
        }

        const previousBlock = await this.blockRepository.findOne({index: block.index - 1});
        if (!previousBlock) {
            const error = createInvalidBlockEntityError(block.previousHash, "Previous block by index not found!");
            this.logger.logError(this, JSON.stringify(error));
            throw error;
        }
        if (previousBlock.hash !== block.previousHash) {
            const error = createInvalidBlockEntityError(block.previousHash,
                "Hashes between actual previous block and network previous block differ");
            this.logger.logError(this, JSON.stringify(error));
            throw error;
        }

        const blockSignatureObject = objectWithoutKeys(block, BlockSignatureBlacklist);
        const validSignature = await this.identityService.verifyData(blockSignatureObject, block.creatorSignature, block.creatorPublicKey);
        if (!validSignature) {
            const error = createInvalidBlockEntityError(block.creatorSignature, "Block creator signature invalid!");
            this.logger.logError(this, JSON.stringify(error));
            throw error;
        }

        const blockHashObject = objectWithoutKeys(block, BlockHashBlacklist);
        const blockHash = await this.eccService.hashData(blockHashObject);
        const hashCondition = this.nodeConfigurationModelToken.blockchainConfiguration.consensusChar.repeat(
            this.nodeConfigurationModelToken.blockchainConfiguration.difficultyLevel);
        if (blockHash !== block.hash || blockHash.substring(0, this.nodeConfigurationModelToken.blockchainConfiguration.difficultyLevel) !== hashCondition) {
            const error = createInvalidBlockEntityError(block.hash, "Block hash is invalid!");
            this.logger.logError(this, JSON.stringify(error));
            throw error;
        }

        for (let transaction of block.transactions) {
            const localTransaction = await this.recordTransactionRepository.findOne({hash: transaction});
            if (!localTransaction) {
                this.logger.logWarning(this, "We do not own the transaction: " + transaction);
                continue;
            }
            if (localTransaction?.blockHash) {
                const error = createInvalidBlockEntityError(transaction, "This transaction already belongs to a different block!");
                this.logger.logError(this, JSON.stringify(error));
                throw error;
            }
        }
    }

    public async validateNetworkTransaction(transaction: RecordTransactionEntity): Promise<void> {
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
        const valid = await this.identityService.verifyData(creatorTransactionSignatureObject, transactionCreatorSignature, transaction.creatorPublicKey);
        if (!valid) {
            const error = createInvalidSignatureError(transactionCreatorSignature);
            this.logger.logError(this, JSON.stringify(error));
            throw error;
        }
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
        const validCaSignature = await this.identityService.verifyData(certificateAuthorityTransactionSignatureObject, transactionCertificateAuthoritySignature, transaction.certificateAuthorityPublicKey);
        if (!validCaSignature) {
            const error = createInvalidSignatureError(transactionCertificateAuthoritySignature);
            this.logger.logError(this, JSON.stringify(error));
            throw error;
        }
        this.logger.logSuccess(this, "Validation of the certificate authority signature of the data succeeded...");

        if (transaction.blockHash) {
            this.logger.logInfo(this, "Validating transaction block connection...");
            const block = await this.blockRepository.findOne({hash: transaction.blockHash});
            if (!block) {
                const error = createObjectNotFoundError(transaction.blockHash);
                this.logger.logError(this, JSON.stringify(error));
                throw error;
            }
            const transactionId = block.transactions.find(x => x === transaction.hash);
            if (!transactionId) {
                const error = createObjectNotFoundError(transaction.blockHash);
                this.logger.logError(this, JSON.stringify(error));
                throw error;
            }
            this.logger.logSuccess(this, "Validation of the transaction block succeeded!");
        }
    }

    public async validateChain(blockchain: BlockEntity[]): Promise<boolean> {

        this.logger.logInfo(this, "Validating new blockchain");
        for (let i = 1; i < blockchain.length; i++) {
            const currentBlock = blockchain[i];
            const previousBlock = blockchain[i - 1];
            if (!currentBlock.previousHash || currentBlock.previousHash !== previousBlock.hash) {
                this.logger.logWarning(this, "Validating new blockchain has failed!");
                return false;
            }

            const blockHashObject = objectWithoutKeys(currentBlock, BlockHashBlacklist);
            const blockHash = await this.eccService.hashData(blockHashObject);
            const hashCondition = this.nodeConfigurationModelToken.blockchainConfiguration.consensusChar.repeat(
                this.nodeConfigurationModelToken.blockchainConfiguration.difficultyLevel);

            if (blockHash !== currentBlock.hash || blockHash.substring(0, this.nodeConfigurationModelToken.blockchainConfiguration.difficultyLevel) !== hashCondition) {
                this.logger.logWarning(this, "Validating new blockchain has failed!");
                return false;
            }
        }
        this.logger.logSuccess(this, "Validating new blockchain has succeeded!");
        return true;
    }

}
