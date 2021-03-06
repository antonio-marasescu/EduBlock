import {Inject, Service, Token} from "typedi";
import {IConsensusService} from "./consensus.interface.service";
import {EccService, EccServiceToken} from "../../security/ecc.service";
import {NodeConfigurationModel, NodeConfigurationModelToken} from "../../../config/node-configuration.model";
import {NetworkBlockDto} from "../../../dto/network-block.dto";
import {objectWithoutKeys} from "../../../utils/dictionary.utils";

export const IConsensusServiceToken = new Token<ConsensusPowService>('services.ledger.consensus');

@Service(IConsensusServiceToken)
export class ConsensusPowService implements IConsensusService {

    constructor(
        @Inject(EccServiceToken) private eccService: EccService,
        @Inject(NodeConfigurationModelToken) private nodeConfigurationModel: NodeConfigurationModel,
    ) {
    }

    public async generateProof(block: NetworkBlockDto): Promise<NetworkBlockDto> {
        const difficultyLevel = this.nodeConfigurationModel.blockchainConfiguration.difficultyLevel;
        const consensusChar = this.nodeConfigurationModel.blockchainConfiguration.consensusChar;

        block.nonce = 0;
        let sortedObject = objectWithoutKeys(block, ['hash']);
        block.hash = await this.eccService.hashData(sortedObject);
        const hashCheck = consensusChar.repeat(difficultyLevel);
        while (block.hash.substring(0, difficultyLevel) !== hashCheck) {
            block.nonce = block.nonce + 1;
            sortedObject = objectWithoutKeys(block, ['hash']);
            block.hash = await this.eccService.hashData(sortedObject);
        }
        const finalObject = new NetworkBlockDto();
        Object.assign(finalObject, objectWithoutKeys(block, []));
        return finalObject;
    }
}
