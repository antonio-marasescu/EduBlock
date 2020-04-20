import {Inject, Service, Token} from "typedi";
import {NmsLogger, NmsLoggerToken} from "../logger/nms-logger.interface";
import {
    INetworkMapRepository,
    INetworkMapRepositoryToken
} from "../repositories/network-map/network-map.interface.repository";

export const AuthServiceToken = new Token<AuthService>("services.auth");

@Service(AuthServiceToken)
export class AuthService {
    constructor(
        @Inject(INetworkMapRepositoryToken) private networkMapRepository: INetworkMapRepository,
        @Inject(NmsLoggerToken) private logger: NmsLogger,
    ) {
    }


    public async validateCredentials(publicKey: string): Promise<boolean> {
        this.logger.logInfo(this, 'Validating request credentials...');
        const valid = await this.networkMapRepository.networkMemberExists(publicKey);
        if (!valid)
            this.logger.logError(this, 'Validation of request credentials failed... ');
        else
            this.logger.logSuccess(this, 'Validation of request credentials succeeded...');
        return valid
    }
}
