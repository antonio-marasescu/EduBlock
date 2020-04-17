import {Inject, Service, Token} from "typedi";
import {ServerLogger, ServerLoggerToken} from "../../logger/server-logger.interface";
import {EduNewNetworkMemberDto} from "../../dto/network/edu-new-network-member.dto";

export const NetworkMembersServiceToken = new Token<NetworkMembersService>('common.network-members');

@Service(NetworkMembersServiceToken)
export class NetworkMembersService {
    constructor(
        @Inject(ServerLoggerToken) private logger: ServerLogger
    ) {
    }

    public getNetworkMembers() {
        this.logger.logInfo(this, "Getting known network members");
        return "Not implemented";
    }

    public getWellKnownNetworkMembers() {
        this.logger.logInfo(this, "Getting well known network members");
        return "Not implemented";
    }

    public learnMembers() {
        this.logger.logInfo(this, "Initializing learn members flow");
        return "Not implemented";
    }

    public addMember(member: EduNewNetworkMemberDto) {
        this.logger.logInfo(this, "Initializing add member flow");
        return "Not implemented";
    }
}
