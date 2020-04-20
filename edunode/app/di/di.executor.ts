import {DIInterface} from "./di.interface";
import {DI_REGISTER, DI_REGISTER_DEPENDENTS} from "./di.register";
import {Container} from "typedi";
import {VaultConnectionToken} from "../server/db/vault.connection";
import {EccServiceToken} from "../common/services/security/ecc.service";
import {InitializationHandler} from "./initialization/initialization.handler";

export default class DIExecutor {
    public inject(params: any) {
        DI_REGISTER.forEach((x: DIInterface) => x.inject(params))
    }

    public injectDependents(params: any) {
        DI_REGISTER_DEPENDENTS.forEach((x: DIInterface) => x.inject(params))
    }

    public async initialize(params: any) {
        const argumentHandler = new InitializationHandler();
        argumentHandler.handleInitialization();
        this.inject(params);
        await this.initializeDependents();
        this.injectDependents(params);
    }

    private async initializeDependents() {
        const vaultConnection = Container.get(VaultConnectionToken);
        const eccService = Container.get(EccServiceToken);
        await vaultConnection.initializeConnection();
        await eccService.initializeService();
    }
}
