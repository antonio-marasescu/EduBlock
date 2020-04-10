import {DIInterface} from "./di.interface";
import DI_MAPPER from "./di.mapper";

export default class DIExecutor {
    execute(params: any) {
        DI_MAPPER.forEach((x: DIInterface) => x.inject(params))
    }
}
