import {DIInterface} from "../di.interface";
import {Container} from "typedi";
import {BlockchainServiceToken} from "../../../services/blockchain/blockchain.service.interface";
import {ConsensusServiceToken} from "../../../services/blockchain/consensus/consensus";
import {BlockchainValidatorToken} from "../../../services/blockchain/validators/blockchain-validator";
import {BlockchainService} from "../../../services/blockchain/blockchain.service";
import {ConsensusServiceBasic} from "../../../services/blockchain/consensus/consensus.basic";
import {BlockchainValidatorBasic} from "../../../services/blockchain/validators/blockchain-validator.basic";
import {BLOCKCHAIN_CONFIG} from "../../../services/blockchain/blockchain.config";

export class BlockchainDI implements DIInterface {
    inject(_: any): void {
        Container.set('services.blockchain.config', BLOCKCHAIN_CONFIG);
        Container.set(ConsensusServiceToken, new ConsensusServiceBasic());
        Container.set(BlockchainValidatorToken, new BlockchainValidatorBasic());
        Container.set(BlockchainServiceToken, new BlockchainService(
            Container.get(ConsensusServiceToken),
            Container.get('services.blockchain.config'))
        );
    }

}
