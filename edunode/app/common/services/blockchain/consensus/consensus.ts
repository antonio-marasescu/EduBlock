import {Block} from "../entities/block.model";
import {Token} from "typedi";
import {Proof} from "../entities/proof.model";

export interface ConsensusService {
    proofOfWorkGenerate(previousHash: string, currentBlock: Block): Promise<Proof>;
}

export const ConsensusServiceToken = new Token<ConsensusService>();
