import {Transaction} from "./entities/transaction.model";
import {Proof} from "./entities/proof.model";
import {Block} from "./entities/block.model";
import {Blockchain} from "./entities/blockchain.model";
import {Token} from "typedi";

export interface IBlockchainService {
    createTransaction(sender: string, recipient: string, data: string): Promise<Transaction>;

    addTransactionToPending(t: Transaction): Promise<number>;

    createNewBlock(previousHash: string, proof: Proof): Promise<Block>;

    getBlockchain(): Promise<Blockchain>;

    getGenesisBlock(): Promise<Block>;

    getLastBlock(): Promise<Block>;

    getBlock(blockHash: string): Promise<Block>;

    getTransaction(blockHash: string, transactionId: string): Promise<Transaction | null>;

    work(previousHash: string, currentBlock: Block): Promise<Proof>;
}

export const BlockchainServiceToken = new Token<IBlockchainService>('IBlockchainService');

