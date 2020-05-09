import {ValidationError} from "class-validator";

export class EduWorkerError {
    status: number;
    errors: ValidationError[];

    constructor(status: number, errors: ValidationError[]) {
        this.status = status;
        this.errors = errors;
    }
}
