import {DIInterface} from "./di.interface";
import {DI_REGISTER, DI_REGISTER_DEPENDENTS} from "./di.register";
import {ArgumentHandler} from "./arguments/argument.handler";

export default class DIExecutor {
    public inject(params: any) {
        DI_REGISTER.forEach((x: DIInterface) => x.inject(params))
    }

    public injectDependents(params: any) {
        DI_REGISTER_DEPENDENTS.forEach((x: DIInterface) => x.inject(params))
    }

    public async initalize(params: any) {
        const argumentHandler = new ArgumentHandler();
        argumentHandler.readArguments();
        this.inject(params);
        await this.initializeDependents();
        this.injectDependents(params);
    }

    private async initializeDependents() {
        // const vaultConnection = Container.get(VaultConnectionToken);
        // const eccService = Container.get(EccServiceToken);
        // await vaultConnection.initializeConnection();
        // await eccService.initializeService();
    }
}
