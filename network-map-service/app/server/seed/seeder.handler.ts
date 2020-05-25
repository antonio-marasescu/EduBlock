import {NetworkMapServiceToken} from '../../common/services/network-map.service';
import * as fs from 'fs';
import {NewNetworkMemberDto} from '../../common/dto/network/new-network-member.dto';
import {NetworkMemberDto} from '../../common/dto/network/network-member.dto';
import {Container} from 'typedi';
import {NmsLoggerToken} from '../../common/logger/nms-logger.interface';
import {INetworkMapRepositoryToken} from '../../common/repositories/network-map/network-map.interface.repository';

export class SeederHandler {
    public async seed(clearOnSeed: boolean) {
        const service = Container.get(NetworkMapServiceToken);
        const rawData: Buffer = fs.readFileSync('resources/network-identities-seed.json');
        const seedData: { [key: string]: NewNetworkMemberDto[] } = JSON.parse(rawData.toString());
        const seedElements = seedData['seed'];
        const logger = Container.get(NmsLoggerToken);

        if (clearOnSeed) {
            logger.logInfo(this, 'Database clear on seed....');
            const repository = Container.get(INetworkMapRepositoryToken);
            await repository.clearMembers();
            logger.logSuccess(this, 'Database clear on seed has finished');
        }

        const members: NetworkMemberDto[] = await service.getAllNetworkMembers();
        logger.logInfo(this, 'The seed procedure has started');
        if (members.length == 0) {
            for (const element of seedElements) {
                element.joinedDate = new Date(Date.now()).toISOString();
                await service.addNetworkMember(element, false);
            }
            logger.logSuccess(this, 'The seed procedure has terminated with success!');
        } else {
            logger.logWarning(this, 'The seed procedure terminated. The database has elements already!')
        }
    }
}
