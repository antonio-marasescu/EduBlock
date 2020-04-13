import {Token} from "typedi";

export interface DoormanLogger {
    logError(location: any, message: string): void;

    logSuccess(location: any, message: string): void;

    logWarning(location: any, message: string): void;

    logInfo(location: any, message: string): void;
}

export const DoormanLoggerToken = new Token<DoormanLogger>('node.server-logger');
