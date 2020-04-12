import {DIInterface} from "../di.interface";
import {Container} from "typedi";
import {ServerLoggerToken} from "../../common/logger/server-logger.interface";
import {ServerLoggerService} from "../../common/logger/server-logger.service";
import {NodeIdentityModelToken} from "../../common/entities/config/node-configuration.model";

export class LoggerDI implements DIInterface {
    inject(_: any): void {
        Container.set(ServerLoggerToken, new ServerLoggerService(Container.get(NodeIdentityModelToken)));
    }
}
