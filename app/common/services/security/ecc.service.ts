import ecc from 'eosjs-ecc'
import {Service, Token} from "typedi";

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
}
