import {DIInterface} from "../di.interface";
import {Container} from "typedi";
import {ServerLoggerToken} from "../../common/logger/doorman-logger.interface";
import {DoormanLoggerService} from "../../common/logger/doorman-logger.service";
import {NodeIdentityModelToken} from "../../common/entities/config/doorman-configuration.model";

export class LoggerDI implements DIInterface {
    inject(_: any): void {
        Container.set(ServerLoggerToken, new DoormanLoggerService(Container.get(NodeIdentityModelToken)));
    }
}
