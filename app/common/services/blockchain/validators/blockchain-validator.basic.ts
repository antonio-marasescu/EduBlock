import {Service} from "typedi";
import {BlockchainValidator, BlockchainValidatorToken} from "./blockchain-validator";
import {Blockchain} from "../entities/blockchain.model";
import MerkleTree from "merkletreejs";
import {BufferFromBase64, SHA256} from "../crypto/crypto.util";

@Service(BlockchainValidatorToken)
export class BlockchainValidatorBasic implements BlockchainValidator {
    async validate(blockchain: Blockchain): Promise<boolean> {
        const blockchainKeys = Object.keys(blockchain.chain);

        const areTransactionsModified = blockchainKeys.map(key => {
            const block = blockchain.chain[key];
            const suspectMerkleTree = new MerkleTree(block.transactions.map(x => BufferFromBase64(x.hash)), SHA256);
            const suspectProof = suspectMerkleTree.getRoot().toString('base64');
            return suspectProof === block.merkleRoot.getRoot().toString('base64')
        }).reduce((accum, val) => accum && val, true);

        const latestBlock = blockchain.chain[blockchainKeys[blockchainKeys.length - 1]];
        const areLatestTransactionsValid = latestBlock.transactions.map(t => t.data !== '')
            .reduce((accum, val) => accum && val, true);

        return areTransactionsModified && areLatestTransactionsValid;
    }
}
