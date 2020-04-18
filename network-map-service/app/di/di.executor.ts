import {DIInterface} from "./di.interface";
import {DI_REGISTER, DI_REGISTER_DEPENDENTS} from "./di.register";
import {ArgumentHandler} from "./arguments/argument.handler";
import {VaultConnectionToken} from "../server/db/vault.connection";
import {Container} from "typedi";
import {EccServiceToken} from "../common/services/ecc.service";

export default class DIExecutor {
    public inject(params: any) {
        DI_REGISTER.forEach((x: DIInterface) => x.inject(params))
    }

    public injectDependents(params: any) {
        DI_REGISTER_DEPENDENTS.forEach((x: DIInterface) => x.inject(params))
    }

    public async initialize(params: any) {
        const argumentHandler = new ArgumentHandler();
        argumentHandler.readArguments();
        this.inject(params);
        await this.initializeDependents();
        this.injectDependents(params);
    }

    private async initializeDependents() {
        const vaultConnection = Container.get(VaultConnectionToken);
        await vaultConnection.initializeConnection();
        const eccService = Container.get(EccServiceToken);
        await eccService.initializeService();
    }
}
