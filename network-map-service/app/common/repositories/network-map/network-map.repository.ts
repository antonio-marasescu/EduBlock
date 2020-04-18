import {INetworkMapRepository} from "./network-map.interface.repository";
import {EntityRepository, Repository} from "typeorm";
import {NetworkMapEntity} from "../../entities/network-map/network-map.entity";

@EntityRepository(NetworkMapEntity)
export class NetworkMapRepository extends Repository<NetworkMapEntity> implements INetworkMapRepository {

    public async createNetworkMember(entity: NetworkMapEntity): Promise<NetworkMapEntity> {
        return await this.save(entity);
    }

    findNetworkMember(publicKey: string): Promise<NetworkMapEntity> {
        return this.findOneOrFail({publicKey});
    }

    getAllNetworkMembers(): Promise<NetworkMapEntity[]> {
        return this.find({});
    }

}
