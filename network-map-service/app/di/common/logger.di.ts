import {DIInterface} from "../di.interface";
import {Container} from "typedi";
import {DoormanLoggerService} from "../../common/logger/doorman-logger.service";
import {DoormanLoggerToken} from "../../common/logger/doorman-logger.interface";
import {DoormanConfigurationModelToken} from "../../common/entities/config/doorman-configuration.model";

export class LoggerDI implements DIInterface {
    inject(_: any): void {
        Container.set(DoormanLoggerToken, new DoormanLoggerService(Container.get(DoormanConfigurationModelToken)));
    }
}
