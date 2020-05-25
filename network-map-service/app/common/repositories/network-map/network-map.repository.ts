import {INetworkMapRepository} from './network-map.interface.repository';
import {EntityRepository, Repository} from 'typeorm';
import {NetworkMapEntity} from '../../entities/network-map/network-map.entity';

@EntityRepository(NetworkMapEntity)
export class NetworkMapRepository extends Repository<NetworkMapEntity> implements INetworkMapRepository {

    public async createNetworkMember(entity: NetworkMapEntity): Promise<NetworkMapEntity> {
        return await this.save(entity);
    }

    public async findNetworkMember(publicKey: string): Promise<NetworkMapEntity> {
        return this.findOneOrFail({publicKey});
    }

    public async getAllNetworkMembers(): Promise<NetworkMapEntity[]> {
        return this.find({});
    }

    public async networkMemberExists(publicKey: string): Promise<boolean> {
        const member = this.findOne({publicKey: publicKey});
        return !!member;
    }

    public async clearMembers(): Promise<void> {
        return this.clear();
    }

}
