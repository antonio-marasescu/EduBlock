import {ValidationError} from "class-validator/validation/ValidationError";
import {EduError} from "./edu.error";
import {NmsError} from "../../../../network-map-service/app/common/errors/nms.error";

export function createInvalidSignatureError(target: any): NmsError {
    const error = new ValidationError();
    error.target = target;
    error.constraints = {signatureValidation: 'Signature validity check failed'};
    return new NmsError(400, [error]);
}

export function createValidationError(validationErrors: ValidationError[]): EduError {
    return new EduError(400, validationErrors);
}

export function createObjectNotFoundError(target: any) {
    const error = new ValidationError();
    error.target = target;
    error.constraints = {notFound: 'Object was not found!'};
    return new EduError(404, [error]);
}

export function createObjectCouldNotBeSavedError(target: any, reason?: string) {
    const error = new ValidationError();
    error.target = target;
    error.constraints = {notFound: 'The object could not be created!'};
    if (reason) {
        error.constraints['reason'] = reason;
    }
    return new EduError(500, [error]);
}

export function createIdentityNotFound(target: any): EduError {
    const error = new ValidationError();
    error.target = target;
    error.constraints = {identityNotFound: 'Identity not found for the target'};
    return new EduError(404, [error]);
}

export function createAxiosResponseError(axiosError: any) {
    return new EduError(axiosError.status, [axiosError.body]);
}