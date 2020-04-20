import {Token} from "typedi";
import {NetworkMapEntity} from "../../entities/network-map/network-map.entity";

export interface INetworkMapRepository {
    createNetworkMember(entity: NetworkMapEntity): Promise<NetworkMapEntity>;

    findNetworkMember(publicKey: string): Promise<NetworkMapEntity>;

    getAllNetworkMembers(): Promise<NetworkMapEntity[]>;

    networkMemberExists(publicKey: string): Promise<boolean>;
}

export const INetworkMapRepositoryToken = new Token<INetworkMapRepository>('repositories.network-map');
