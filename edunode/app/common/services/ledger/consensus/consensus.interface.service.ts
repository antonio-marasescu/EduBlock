import {BlockEntity} from "../../../entities/ledger/block.entity";

export interface IConsensusService {
    generateProof(block: BlockEntity): Promise<BlockEntity>;
}
