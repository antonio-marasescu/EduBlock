import {Inject, Service} from "typedi";
import {NmsLogger, NmsLoggerToken} from "./nms-logger.interface";
import * as winston from 'winston';
import {format, Logger as WinstonLogger} from 'winston';
import {SERVER_LOGGER_LEVELS, SERVER_LOGGER_OPTIONS} from "./nms-logger.config";
import {
    NmsConfigurationModel,
    NmsConfigurationModelToken
} from "../config/nms-configuration.model";

@Service(NmsLoggerToken)
export class NmsLoggerService implements NmsLogger {
    private readonly logger: WinstonLogger;

    constructor(@Inject(NmsConfigurationModelToken) private nodeConfiguration: NmsConfigurationModel) {
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
                        filename: this.nodeConfiguration.identity.alias + '.log',
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
