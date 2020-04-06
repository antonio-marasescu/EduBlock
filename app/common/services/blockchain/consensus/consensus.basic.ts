import {ConsensusService, ConsensusServiceToken} from "./consensus";
import {Block} from "../entities/block.model";
import {Service} from "typedi";
import {consensusChar, difficultyLevel} from "./consensus.config";
import {Proof} from "../entities/proof.model";
import {Base64SHA256} from "../crypto/crypto.util";

@Service(ConsensusServiceToken)
export class ConsensusServiceBasic implements ConsensusService {

    private proofOfWorkHashBlock(previousHash: string, currentBlock: Block, nonce: number): string {
        const data = previousHash + nonce.toString() + JSON.stringify(currentBlock);
        return Base64SHA256(data);
    }

    async proofOfWorkGenerate(previousHash: string, currentBlock: Block): Promise<Proof> {
        let nonce = 0;
        let hash = this.proofOfWorkHashBlock(previousHash, currentBlock, nonce);
        const hashCheck = consensusChar.repeat(difficultyLevel);
        while (hash.substring(0, difficultyLevel) !== hashCheck) {
            nonce++;
            hash = this.proofOfWorkHashBlock(previousHash, currentBlock, nonce);
        }
        return {
            nonce: nonce,
            hash: hash
        } as Proof;
    }

}
