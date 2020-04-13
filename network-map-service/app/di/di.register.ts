import {DIInterface} from "./di.interface";
import RepositoryDI from "./common/repository.di";
import {LoggerDI} from "./common/logger.di";

export const DI_REGISTER: DIInterface[] = [new LoggerDI()];
export const DI_REGISTER_DEPENDENTS: DIInterface[] = [new RepositoryDI()];

