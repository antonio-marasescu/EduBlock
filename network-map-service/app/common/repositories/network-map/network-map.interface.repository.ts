import {Token} from "typedi";
import {NetworkMapEntity} from "../../entities/network-map/network-map.entity";

export interface INetworkMapRepository {
    addNetworkMember(entity: NetworkMapEntity): Promise<NetworkMapEntity>;
}

export const INetworkMapRepositoryToken = new Token<INetworkMapRepository>('repositories.network-map');
