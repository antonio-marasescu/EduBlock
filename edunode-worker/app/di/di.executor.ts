import {DIInterface} from "./di.interface";
import {DI_REGISTER, DI_REGISTER_DEPENDENTS} from "./di.register";
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
        //
        // const rabbitmq = Container.get(RabbitMqServiceToken);
        // await rabbitmq.initializeService();
    }

    private async initializeDependents() {
        // const eccService = Container.get(EccServiceToken);
        // await eccService.initializeService();
    }
}
