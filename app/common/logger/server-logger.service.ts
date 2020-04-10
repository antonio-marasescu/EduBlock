import {Inject, Service} from "typedi";
import {ServerLogger, ServerLoggerToken} from "./server-logger.interface";
import * as winston from 'winston';
import {format, Logger as WinstonLogger} from 'winston';
import {SERVER_LOGGER_LEVELS, SERVER_LOGGER_OPTIONS} from "./server-logger.config";
import {NodeConfigurationModel, NodeIdentityModelToken} from "../server/models/node-configuration.model";

@Service(ServerLoggerToken)
export class ServerLoggerService implements ServerLogger {
    private readonly logger: WinstonLogger;

    constructor(@Inject(NodeIdentityModelToken) private nodeConfiguration: NodeConfigurationModel) {
        this.logger = winston.createLogger(SERVER_LOGGER_OPTIONS);
        this.logger.add(
            new winston.transports.Console(
                {
                    format: format.combine(format.colorize(), format.simple(), winston.format.colorize()),
                    level: SERVER_LOGGER_OPTIONS.level,
                    handleExceptions: true
                }
            )
        );
        if (nodeConfiguration.useFileLogging)
            this.logger.add(
                new winston.transports.File(
                    {
                        dirname: 'logs',
                        filename: this.nodeConfiguration.alias + '.log',
                        maxsize: 1000,
                        maxFiles: 1,
                        tailable: true,
                        format: format.combine(format.simple(), format.prettyPrint()),
                        level: SERVER_LOGGER_OPTIONS.level,
                        handleExceptions: true
                    }
                )
            );
        winston.addColors(SERVER_LOGGER_LEVELS.colors);
    }

    logError(location: any, message: string): void {
        this.logger.log({
            level: 'error',
            message: JSON.stringify({origin: location.constructor.name, message: message})
        });
    }

    logInfo(location: any, message: string): void {
        this.logger.log({
            level: 'info',
            message: JSON.stringify({origin: location.constructor.name, message: message})
        });
    }

    logSuccess(location: any, message: string): void {
        this.logger.log({
            level: 'success',
            message: JSON.stringify({origin: location.constructor.name, message: message})
        });
    }

    logWarning(location: any, message: string): void {
        this.logger.log({
            level: 'warn',
            message: JSON.stringify({origin: location.constructor.name, message: message})
        });
    }
}
