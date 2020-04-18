import {ValidationError} from "class-validator/validation/ValidationError";
import {NmsError} from "./nms.error";

export function createInvalidSignatureError(target: any): NmsError {
    const error = new ValidationError();
    error.target = target;
    error.constraints = {signatureValidation: 'Signature validity check failed'};
    return new NmsError(400, [error]);
}

export function createValidationError(validationErrors: ValidationError[]): NmsError {
    return new NmsError(400, validationErrors);
}

export function createObjectNotFoundError(target: any) {
    const error = new ValidationError();
    error.target = target;
    error.constraints = {notFound: 'Object was not found!'};
    return new NmsError(404, [error]);
}

export function createObjectCouldNotBeSavedError(target: any, reason?: string) {
    const error = new ValidationError();
    error.target = target;
    error.constraints = {notFound: 'The object could not be created!'};
    if (reason) {
        error.constraints['reason'] = reason;
    }
    return new NmsError(500, [error]);
}

export function createIdentityNotFound(target: any): NmsError {
    const error = new ValidationError();
    error.target = target;
    error.constraints = {identityNotFound: 'Identity not found for the target'};
    return new NmsError(404, [error]);
}
