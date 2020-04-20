import {NetworkMapService} from "../../common/services/network-map.service";
import * as fs from "fs";
import {NewNetworkMemberDto} from "../../common/dto/network/new-network-member.dto";
import {NetworkMemberDto} from "../../common/dto/network/network-member.dto";
import {Container} from "typedi";
import {NmsLoggerToken} from "../../common/logger/nms-logger.interface";

export class SeederHandler {
    public async seed(service: NetworkMapService) {
        const rawData: Buffer = fs.readFileSync('resources/network-identities-seed.json');
        const seedData: { [key: string]: NewNetworkMemberDto[] } = JSON.parse(rawData.toString());
        const seedElements = seedData['seed'];
        const logger = Container.get(NmsLoggerToken);
        const members: NetworkMemberDto[] = await service.getAllNetworkMembers();
        logger.logInfo(this, "The seed procedure has started");
        if (members.length == 0) {
            for (const element of seedElements) {
                element.joinedDate = new Date(Date.now()).toISOString();
                await service.addNetworkMember(element, false);
            }
            logger.logSuccess(this, "The seed procedure has terminated with success!");
        } else {
            logger.logWarning(this, "The seed procedure terminated. The database has elements already!")
        }
    }
}
