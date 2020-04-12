import {format, LoggerOptions} from "winston";

export const SERVER_LOGGER_LEVELS = {
    levels: {
        error: 0,
        warn: 1,
        success: 2,
        info: 3
    },
    colors: {
        error: 'red',
        warn: 'yellow',
        success: 'green',
        info: 'blue'
    }
};

export const SERVER_LOGGER_OPTIONS: LoggerOptions = {
    exitOnError: false,
    levels: SERVER_LOGGER_LEVELS.levels,
    level: 'info',
    format: format.combine(
        format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'})
        ,
        format.errors({stack: true}),
        format.align(),
        format.splat(),
        format.json()
    )
};
