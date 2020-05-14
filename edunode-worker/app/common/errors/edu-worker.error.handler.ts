import {EduWorkerError} from "./edu-worker.error";
import {QueryFailedError} from "typeorm";

export class EduWorkerErrorHandler {
    public static handleError(error, res) {
        if (error instanceof EduWorkerError) {
            res.status(error.status);
            res.json(error.errors);
        } else if (error instanceof QueryFailedError) {
            res.status(400);
            res.json({message: error.message});
        } else {
            res.status(500);
            res.json(error);
        }
    }
}
