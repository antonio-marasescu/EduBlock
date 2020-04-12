import {DIInterface} from "./di.interface";
import {BlockchainDI} from "./services/blockchain.di";
import RepositoryDI from "./services/repository.di";
import {LoggerDI} from "./services/logger.di";
import {NetworkRabbitMQDi} from "./services/network.rabbitmq.di";

export const DI_REGISTER: DIInterface[] = [new LoggerDI(), new BlockchainDI()];
export const DI_REGISTER_DEPENDENTS: DIInterface[] = [new RepositoryDI(), new NetworkRabbitMQDi()];

