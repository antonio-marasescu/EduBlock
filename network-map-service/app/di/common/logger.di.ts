import {DIInterface} from "../di.interface";
import {Container} from "typedi";
import {NmsLoggerService} from "../../common/logger/nms-logger.service";
import {NmsLoggerToken} from "../../common/logger/nms-logger.interface";
import {NmsConfigurationModelToken} from "../../common/entities/config/nms-configuration.model";

export class LoggerDI implements DIInterface {
    inject(_: any): void {
        Container.set(NmsLoggerToken, new NmsLoggerService(Container.get(NmsConfigurationModelToken)));
    }
}
