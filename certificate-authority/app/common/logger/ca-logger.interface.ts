import {Token} from "typedi";

export interface CaLogger {
    logError(location: any, message: string): void;

    logSuccess(location: any, message: string): void;

    logWarning(location: any, message: string): void;

    logInfo(location: any, message: string): void;
}

export const CaLoggerToken = new Token<CaLogger>('node.server-logger');
