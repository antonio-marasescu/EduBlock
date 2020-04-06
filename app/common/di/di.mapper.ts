import {DIInterface} from "./di.interface";
import {BlockchainDI} from "./main/blockchain.di";
import {NetworkDi} from "./main/network.di";

const DI_MAPPER: DIInterface[] = [new BlockchainDI(), new NetworkDi()];
export default DI_MAPPER;
