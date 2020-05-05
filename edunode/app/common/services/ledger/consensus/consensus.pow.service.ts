import {Inject, Service, Token} from "typedi";
import {IConsensusService} from "./consensus.interface.service";
import {BlockEntity} from "../../../entities/ledger/block.entity";
import {EccService, EccServiceToken} from "../../security/ecc.service";
import {NodeConfigurationModel, NodeConfigurationModelToken} from "../../../entities/config/node-configuration.model";

export const IConsensusServiceToken = new Token<ConsensusPowService>('services.ledger.consensus');

@Service(IConsensusServiceToken)
export class ConsensusPowService implements IConsensusService {

    constructor(
        @Inject(EccServiceToken) private eccService: EccService,
        @Inject(NodeConfigurationModelToken) private nodeConfigurationModel: NodeConfigurationModel,
    ) {
    }

    public async generateProof(block: BlockEntity): Promise<BlockEntity> {
        const difficultyLevel = this.nodeConfigurationModel.blockchainConfiguration.difficultyLevel;
        const consensusChar = this.nodeConfigurationModel.blockchainConfiguration.consensusChar;

        block.nonce = 0;
        block.hash = await this.eccService.hashData(block);
        const hashCheck = consensusChar.repeat(difficultyLevel);
        while (block.hash.substring(0, difficultyLevel) !== hashCheck) {
            block.nonce = block.nonce + 1;
            block.hash = await this.eccService.hashData(block);
        }
        return block;
    }
}
