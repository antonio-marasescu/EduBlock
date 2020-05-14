import {AxiosResponse} from "axios";
import {createAxiosResponseError} from "../errors/edu.error.factory";
import {ServerLoggerToken} from "../logger/server-logger.interface";
import {Container} from "typedi";

export async function validateAxiosResponse(location: any, response: AxiosResponse): Promise<void> {
    if (response.status !== 200) {
        const error = createAxiosResponseError(response);
        const logger = Container.get(ServerLoggerToken);
        logger.logError(location, JSON.stringify(error));
        throw error;
    }
}
