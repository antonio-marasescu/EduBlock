import {Token} from "typedi";

export interface ServerLogger {
    logError(location: any, message: string): void;

    logSuccess(location: any, message: string): void;

    logWarning(location: any, message: string): void;

    logInfo(location: any, message: string): void;
}

export const ServerLoggerToken = new Token<ServerLogger>('node.server-logger');
