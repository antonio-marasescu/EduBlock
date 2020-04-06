import {Proof} from "./proof.model";
import {MerkleTree} from 'merkletreejs'
import {Transaction} from "./transaction.model";

export interface Block {
    index: number;
    timestamp: number;
    merkleRoot: MerkleTree;
    transactions: Transaction[];
    proof: Proof;
    previousHash: string;
}
