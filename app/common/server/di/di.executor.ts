import {DIInterface} from "./di.interface";
import {DI_REGISTER, DI_REGISTER_DEPENDENTS} from "./di.register";

export default class DIExecutor {
    inject(params: any) {
        DI_REGISTER.forEach((x: DIInterface) => x.inject(params))
    }

    injectDependents(params: any) {
        DI_REGISTER_DEPENDENTS.forEach((x: DIInterface) => x.inject(params))
    }
}
