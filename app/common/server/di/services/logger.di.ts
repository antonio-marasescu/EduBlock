import {DIInterface} from "../di.interface";
import {Container} from "typedi";
import {ServerLoggerToken} from "../../../logger/server-logger.interface";
import {ServerLoggerService} from "../../../logger/server-logger.service";
import {NodeIdentityModelToken} from "../../models/node-configuration.model";

export class LoggerDI implements DIInterface {
    inject(_: any): void {
        Container.set(ServerLoggerToken, new ServerLoggerService(Container.get(NodeIdentityModelToken)));
    }
}
