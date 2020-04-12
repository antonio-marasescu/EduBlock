import ecc from 'eosjs-ecc'
import {Service, Token} from "typedi";
import {PersonalIdentity} from "../../entities/identity/personal-identity.entity";

export const EccServiceToken = new Token<EccService>('services.ecc');

@Service(EccServiceToken)
export class EccService {
    private initialized: boolean = false;

    public isServiceInitialized(): boolean {
        return this.initialized;
    }

    public async initializeService(): Promise<void> {
        if (this.isServiceInitialized()) {
            return;
        }
        await ecc.initialize();
        this.initialized = true;
    }

    public async generateIdentity(): Promise<PersonalIdentity> {
        const privateKey: String = await ecc.randomKey();
        const publicKey: String = ecc.privateToPublic(privateKey);
        return {privateKey: privateKey, publicKey: publicKey} as PersonalIdentity;
    }
}
