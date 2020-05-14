import ecc from 'eosjs-ecc'
import {Service, Token} from "typedi";

export const EccServiceToken = new Token<EccService>('services.security.ecc');

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

    public async signData(data: string, privateKey: string): Promise<string> {
        return ecc.sign(data, privateKey);
    }

    public async verifyData(data: string, signature: string, publicKey: string): Promise<boolean> {
        try {
            return ecc.verify(signature, data, publicKey);
        } catch (e) {
            return false;
        }
    }

    public async hashData(data: any): Promise<string> {
        return ecc.sha256(JSON.stringify(data));
    }
}
