import {Inject, Service, Token} from "typedi";
import {IConsensusService} from "./consensus.interface.service";
import {BlockEntity} from "../../../entities/ledger/block.entity";
import {EccService, EccServiceToken} from "../../security/ecc.service";
import {deepClone} from "../../../utils/dictionary.utils";
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
        const blockClone = deepClone(block);

        blockClone.nonce = 0;
        blockClone.hash = await this.eccService.hashData(blockClone);
        const hashCheck = consensusChar.repeat(difficultyLevel);
        while (blockClone.hash.substring(0, difficultyLevel) !== hashCheck) {
            blockClone.nonce = block.nonce + 1;
            blockClone.hash = await this.eccService.hashData(blockClone);
        }
        return blockClone;
    }
}
