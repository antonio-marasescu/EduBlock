import {NetworkBlockDto} from "../../../dto/network-block.dto";

export interface IConsensusService {
    generateProof(block: NetworkBlockDto): Promise<NetworkBlockDto>;
}
