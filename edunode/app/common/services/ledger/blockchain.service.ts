import {Inject, Service, Token} from "typedi";
import {IBlockRepository, IBlockRepositoryToken} from "../../repositories/ledger/block.interface.repository";
import {
    IRecordTransactionRepository,
    IRecordTransactionRepositoryToken
} from "../../repositories/ledger/record-transaction.interface.repository";
import {IConsensusService} from "./consensus/consensus.interface.service";
import {IConsensusServiceToken} from "./consensus/consensus.pow.service";
import {ServerLogger, ServerLoggerToken} from "../../logger/server-logger.interface";

export const BlockchainServiceToken = new Token<BlockchainService>('services.ledger.blockchain');

@Service(BlockchainServiceToken)
export class BlockchainService {
    constructor(
        @Inject(IConsensusServiceToken) private consensusService: IConsensusService,
        @Inject(IBlockRepositoryToken) private blockRepository: IBlockRepository,
        @Inject(IRecordTransactionRepositoryToken) private recordTransactionRepository: IRecordTransactionRepository,
        @Inject(ServerLoggerToken) private logger: ServerLogger,
    ) {
    }

    public async addTransaction() {

    }
}
