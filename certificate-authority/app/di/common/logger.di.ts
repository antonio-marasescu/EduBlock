import {DIInterface} from "../di.interface";
import {Container} from "typedi";
import {CaLoggerService} from "../../common/logger/ca-logger.service";
import {CaLoggerToken} from "../../common/logger/ca-logger.interface";
import {CaConfigurationModelToken} from "../../common/config/ca-configuration.model";

export class LoggerDI implements DIInterface {
    inject(_: any): void {
        Container.set(CaLoggerToken, new CaLoggerService(Container.get(CaConfigurationModelToken)));
    }
}
