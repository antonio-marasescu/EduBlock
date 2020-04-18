import {NetworkMapService} from "../../common/services/network-map.service";
import * as fs from "fs";
import {NewNetworkMemberDto} from "../../common/dto/network/new-network-member.dto";

export class SeederHandler {
    public async seed(service: NetworkMapService) {
        const rawData: Buffer = fs.readFileSync('resources/network-identities-seed.json');
        const seedData: { [key: string]: NewNetworkMemberDto[] } = JSON.parse(rawData.toString());
        const seedElements = seedData['seed'];
        for (const element of seedElements) {
            element.joinedDate = new Date(Date.now()).toISOString();
            await service.addNetworkMember(element, false);
        }
    }
}
