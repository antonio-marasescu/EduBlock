import {Container, Inject, Service, Token} from "typedi";
import {ServerLogger, ServerLoggerToken} from "../../logger/server-logger.interface";
import {IConsensusServiceToken} from "./consensus/consensus.pow.service";
import {BlockPublisherToken} from "../rabbitmq/block.publisher";
import {IConsensusService} from "./consensus/consensus.interface.service";
import {NetworkBlockDto} from "../../dto/network-block.dto";


export const BlockchainServiceToken = new Token<BlockchainService>('services.ledger.blockchain');

@Service(BlockchainServiceToken)
export class BlockchainService {

    constructor(
        @Inject(ServerLoggerToken) private logger: ServerLogger,
        @Inject(IConsensusServiceToken) private consensusService: IConsensusService,
    ) {
    }


    public async createBlock(blockEntity: NetworkBlockDto): Promise<void> {
        this.consensusService.generateProof(blockEntity).then(async (hashedBlock) => {
            const blockPublisher = Container.get(BlockPublisherToken);
            hashedBlock.timestamp = new Date(Date.now()).toISOString();
            this.logger.logInfo(this, "Block work has finished on " + hashedBlock.timestamp);
            this.logger.logInfo(this, "Block will be published to the network");
            this.logger.logInfo(this, JSON.stringify(hashedBlock));
            await blockPublisher.publish(hashedBlock);
        });
    }
}
