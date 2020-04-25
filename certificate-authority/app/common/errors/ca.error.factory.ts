import {ValidationError} from "class-validator/validation/ValidationError";
import {CaError} from "./ca.error";

export function createInvalidCredentialsError(target: any): CaError {
    const error = new ValidationError();
    error.target = target;
    error.constraints = {signatureValidation: 'The request had insufficient or invalid credentials'};
    return new CaError(401, [error]);
}

export function createInvalidSignatureError(target: any): CaError {
    const error = new ValidationError();
    error.target = target;
    error.constraints = {signatureValidation: 'Signature validity check failed'};
    return new CaError(400, [error]);
}

export function createInvalidRequestParamsError(target: any): CaError {
    const error = new ValidationError();
    error.target = target;
    error.constraints = {signatureValidation: 'The request had invalid parameters'};
    return new CaError(400, [error]);
}

export function createValidationError(validationErrors: ValidationError[]): CaError {
    return new CaError(400, validationErrors);
}

export function createObjectNotFoundError(target: any) {
    const error = new ValidationError();
    error.target = target;
    error.constraints = {notFound: 'Object was not found!'};
    return new CaError(404, [error]);
}

export function createObjectCouldNotBeSavedError(target: any, reason?: string) {
    const error = new ValidationError();
    error.target = target;
    error.constraints = {notFound: 'The object could not be created!'};
    if (reason) {
        error.constraints['reason'] = reason;
    }
    return new CaError(500, [error]);
}

export function createIdentityNotFound(target: any): CaError {
    const error = new ValidationError();
    error.target = target;
    error.constraints = {identityNotFound: 'Identity not found for the target'};
    return new CaError(404, [error]);
}
