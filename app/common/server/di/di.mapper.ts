import {DIInterface} from "./di.interface";
import {BlockchainDI} from "./services/blockchain.di";
import {NetworkDi} from "./services/network.di";
import RepositoryDI from "./repository/repository.di";

export const DI_MAPPER: DIInterface[] = [new NetworkDi(), new BlockchainDI()];
export const DI_MAPPER_EXTERNAL: DIInterface[] = [new RepositoryDI()];

