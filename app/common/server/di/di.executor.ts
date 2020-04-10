import {DIInterface} from "./di.interface";
import {DI_MAPPER, DI_MAPPER_EXTERNAL} from "./di.mapper";

export default class DIExecutor {
    execute(params: any) {
        DI_MAPPER.forEach((x: DIInterface) => x.inject(params))
    }

    executeExternal(params: any) {
        DI_MAPPER_EXTERNAL.forEach((x: DIInterface) => x.inject(params))
    }
}
