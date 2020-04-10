import {DIInterface} from "./di.interface";
import {BlockchainDI} from "./services/blockchain.di";
import {NetworkDi} from "./services/network.di";
import RepositoryDI from "./repository/repository.di";
import {LoggerDI} from "./services/logger.di";

export const DI_MAPPER: DIInterface[] = [new LoggerDI(), new NetworkDi(), new BlockchainDI()];
export const DI_MAPPER_EXTERNAL: DIInterface[] = [new RepositoryDI()];

