import {DIInterface} from "./di.interface";
import {BlockchainDI} from "./common/blockchain.di";
import RepositoryDI from "./common/repository.di";
import {LoggerDI} from "./common/logger.di";
import {NetworkRabbitMQDi} from "./common/network.rabbitmq.di";

export const DI_REGISTER: DIInterface[] = [new LoggerDI(), new BlockchainDI()];
export const DI_REGISTER_DEPENDENTS: DIInterface[] = [new RepositoryDI(), new NetworkRabbitMQDi()];

