import {ValidationError} from "class-validator/validation/ValidationError";
import {CaError} from "./ca.error";

export function createNoDataToSignError(target: any) {
    const error = new ValidationError();
    error.target = target;
    error.constraints = {dataNotFound: 'No data was found to be signed'};
    return new CaError(400, [error]);
}

export function createIdentityNotFound(target: any): CaError {
    const error = new ValidationError();
    error.target = target;
    error.constraints = {identityNotFound: 'Identity not found for the target'};
    return new CaError(404, [error]);
}
