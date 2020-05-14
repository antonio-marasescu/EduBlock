import {ValidationError} from "class-validator/validation/ValidationError";
import {EduWorkerError} from "./edu-worker.error";


export function createValidationError(validationErrors: ValidationError[]): EduWorkerError {
    return new EduWorkerError(400, validationErrors);
}

export function createInvalidRequestParamsError(target: any): EduWorkerError {
    const error = new ValidationError();
    error.target = target;
    error.constraints = {signatureValidation: 'The request had invalid parameters'};
    return new EduWorkerError(400, [error]);
}
