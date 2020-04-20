import {NmsError} from "./nms.error";
import {QueryFailedError} from "typeorm";

export class NmsErrorHandler {
    public static handleError(error, res) {
        if (error instanceof NmsError) {
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
