import {ValidationError} from "class-validator/validation/ValidationError";
import {EduError} from "./edu.error";
import {NmsError} from "../../../../network-map-service/app/common/errors/nms.error";

export function createInvalidSignatureError(target: any): EduError {
    const error = new ValidationError();
    error.target = target;
    error.constraints = {signatureValidation: 'Signature validity check failed'};
    return new EduError(400, [error]);
}

export function createSignatureDoesNotExistError(target: any): EduError {
    const error = new ValidationError();
    error.target = target;
    error.constraints = {signatureDoesNotExist: 'Signature does not exist!'};
    return new EduError(400, [error]);
}

export function createValidationError(validationErrors: ValidationError[]): EduError {
    return new EduError(400, validationErrors);
}

export function createInvalidRequestParamsError(target: any): EduError {
    const error = new ValidationError();
    error.target = target;
    error.constraints = {signatureValidation: 'The request had invalid parameters'};
    return new EduError(400, [error]);
}

export function createAttachmentsNotFoundLocallyError(target: any): EduError {
    const error = new ValidationError();
    error.target = target;
    error.constraints = {notFound: 'The attachments for the required object were not found!'};
    return new EduError(404, [error]);
}

export function createObjectNotFoundError(target: any): EduError {
    const error = new ValidationError();
    error.target = target;
    error.constraints = {notFound: 'Object was not found!'};
    return new EduError(404, [error]);
}

export function createObjectCouldNotBeSavedError(target: any, reason?: string): EduError {
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

export function createMessageCouldNotBeSentError(target: any): EduError {
    const error = new ValidationError();
    error.target = target;
    error.constraints = {messageCouldNotBeSent: 'The message could not be sent to the target!'};
    return new EduError(400, [error]);
}

export function createInvalidHashError(target: any): NmsError {
    const error = new ValidationError();
    error.target = target;
    error.constraints = {hashError: 'The hash of the data is not correct!'};
    return new NmsError(400, [error]);
}

export function createCertificateAuthorityCouldNotBeFoundError(target: any) {
    const error = new ValidationError();
    error.target = target;
    error.constraints = {certificateAuthorityCouldNotBeFound: 'The certificate authority could not be found for this transaction!'};
    return new NmsError(400, [error]);
}

export function createNoTransactionStatusError(target: any): NmsError {
    const error = new ValidationError();
    error.target = target;
    error.constraints = {transactionStatusError: 'The transaction status was invalid!'};
    return new NmsError(400, [error]);
}

export function createNotEnoughTransactionsForBlockError(): NmsError {
    const error = new ValidationError();
    error.constraints = {transactionBlockCount: 'We do not have enough transactions to create a block!'};
    return new NmsError(409, [error]);
}
