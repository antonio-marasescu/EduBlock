import {INetworkMapRepository} from "./network-map.interface.repository";
import {EntityRepository, Repository} from "typeorm";
import {NetworkMapEntity} from "../../entities/network-map/network-map.entity";

@EntityRepository(NetworkMapEntity)
export class NetworkMapRepository extends Repository<NetworkMapEntity> implements INetworkMapRepository {

    public async addNetworkMember(entity: NetworkMapEntity): Promise<NetworkMapEntity> {
        return await this.save(entity);
    }

}
