import {EccService, EccServiceToken} from "../security/ecc.service";
import {Inject, Service, Token} from "typedi";

export const IdentityServiceToken = new Token<IdentityService>('services.identity');

@Service(IdentityServiceToken)
export class IdentityService {
    constructor(@Inject(EccServiceToken) eccService: EccService) {
    }

    public async checkOrGenerateIdentity(): Promise<string> {

    }
}
