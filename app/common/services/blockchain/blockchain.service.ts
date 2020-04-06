import {Block} from "./entities/block.model";
import {Transaction} from "./entities/transaction.model";
import {Inject, Service} from "typedi";
import {ConsensusService, ConsensusServiceToken} from "./consensus/consensus";
import {Proof} from "./entities/proof.model";
import * as uuid from "uuid/v1";
import {Blockchain} from "./entities/blockchain.model";
import MerkleTree from "merkletreejs";
import {Base64SHA256, SHA256} from "./crypto/crypto.util";
import {BlockchainServiceToken, IBlockchainService} from "./blockchain.service.interface";
import {BlockchainConfig} from "../../config/blockchain.config";

@Service(BlockchainServiceToken)
export class BlockchainService implements IBlockchainService {
    private readonly blockchain: Blockchain;

    constructor(@Inject(ConsensusServiceToken) private consensusService: ConsensusService,
                @Inject('services.blockchain.config') private configuration: BlockchainConfig) {
        this.blockchain = new Blockchain();
    }


    public async createTransaction(sender: string, recipient: string, data: string): Promise<Transaction> {
        const raw = {
            uuid: uuid().split('-').join(''),
            sender: sender,
            recipient: recipient,
            data: data
        };
        return {
            ...raw,
            hash: Base64SHA256(raw)
        }
    }

    public async addTransactionToPending(t: Transaction): Promise<number> {
        return this.blockchain.pendingTransactions.push(t);
    }

    public async createNewBlock(previousHash: string, proof: Proof): Promise<Block> {
        const block: Block = {
            index: Object.keys(this.blockchain.chain).length + 1,
            timestamp: Date.now(),
            merkleRoot: new MerkleTree(this.blockchain.pendingTransactions.map(x => SHA256(x)), SHA256, {duplicateOdd: true}),
            transactions: this.blockchain.pendingTransactions,
            proof: proof,
            previousHash: previousHash
        };
        this.blockchain.pendingTransactions = [];
        this.blockchain.chain[proof.hash] = block;
        return block;
    }

    public async getBlockchain(): Promise<Blockchain> {
        return this.blockchain;
    }

    public async getGenesisBlock(): Promise<Block> {
        return this.blockchain.chain[this.configuration.genesis.proof.hash];
    }

    public async getLastBlock(): Promise<Block> {
        const chainKeys = Object.keys(this.blockchain.chain);
        const noBlocks = chainKeys.length;
        return this.blockchain.chain[chainKeys[noBlocks - 1]];
    }

    public async getBlock(blockHash: string): Promise<Block> {
        return this.blockchain.chain[blockHash];
    }

    public async getTransaction(blockHash: string, transactionId: string): Promise<Transaction | null> {
        const transaction = this.blockchain.chain[blockHash].transactions.find(x => x.uuid === transactionId);
        return transaction || null;
    }

    public async work(previousHash: string, currentBlock: Block): Promise<Proof> {
        return this.consensusService.proofOfWorkGenerate(previousHash, currentBlock);
    }
}
