import {Token} from "typedi";

export interface NmsLogger {
    logError(location: any, message: string): void;

    logSuccess(location: any, message: string): void;

    logWarning(location: any, message: string): void;

    logInfo(location: any, message: string): void;
}

export const NmsLoggerToken = new Token<NmsLogger>('node.server-logger');
