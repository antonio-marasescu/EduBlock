import {Inject, Service, Token} from "typedi";
import IPersonalIdentityRepository, {IPersonalIdentityRepositoryToken} from "../../repositories/identity/personal-identity.interface.repository";
import {EccService, EccServiceToken} from "../security/ecc.service";
import {PersonalIdentity} from "../../entities/identity/personal-identity.entity";
import {NodeIdentityModel, NodeIdentityModelToken} from "../../server/models/node-identity.model";

export const IdentityServiceToken = new Token<IdentityService>('services.identity');

@Service(IdentityServiceToken)
export class IdentityService {
    constructor(
        @Inject(EccServiceToken) private eccService: EccService,
        @Inject(NodeIdentityModelToken) private nodeIdentity: NodeIdentityModel,
        @Inject(IPersonalIdentityRepositoryToken) private  personalIdentityRepository: IPersonalIdentityRepository
    ) {
    }

    public async checkOrGenerateIdentity(): Promise<string> {
        let identity = await this.personalIdentityRepository.findPersonalIdentity();
        if (identity == null) {
            console.log("Generating Identity.......");
            const partialIdentity: PersonalIdentity = await this.eccService.generateIdentity();
            const fullIdentity: PersonalIdentity = {
                publicKey: partialIdentity.publicKey,
                privateKey: partialIdentity.privateKey,
                legalName: this.nodeIdentity.legalName
            };
            identity = await this.personalIdentityRepository.savePersonalIdentity(fullIdentity);
        }
        return identity.publicKey;
    }
}
