import {Inject, Service, Token} from "typedi";
import IPersonalIdentityRepository, {IPersonalIdentityRepositoryToken} from "../../repositories/identity/personal-identity.interface.repository";
import {EccService, EccServiceToken} from "../security/ecc.service";

export const IdentityServiceToken = new Token<IdentityService>('services.identity');

@Service(IdentityServiceToken)
export class IdentityService {
    constructor(
        @Inject(EccServiceToken) private eccService: EccService,
        @Inject(IPersonalIdentityRepositoryToken) private  personalIdentityRepository: IPersonalIdentityRepository
    ) {
    }

    public async checkOrGenerateIdentity(): Promise<string> {
        let identity = await this.personalIdentityRepository.findPersonalIdentity();
        if (identity == null) {
            console.log("Generating Identity.......");
            const generatedIdentity = await this.eccService.generateIdentity();
            identity = await this.personalIdentityRepository.savePersonalIdentity(generatedIdentity);
        }
        return identity.publicKey;
    }
}
