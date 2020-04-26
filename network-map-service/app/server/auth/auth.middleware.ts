import {Inject, Service, Token} from "typedi";
import {AuthService, AuthServiceToken} from "../../common/services/auth.service";
import {createInvalidCredentialsError} from "../../common/errors/nms.error.factory";
import {NmsErrorHandler} from "../../common/errors/nms.error.handler";

export const AuthMiddlewareToken = new Token<AuthMiddleware>('network.auth-middleware');

const headerTokenName = 'public-key';

@Service(AuthMiddlewareToken)
export class AuthMiddleware {
    constructor(@Inject(AuthServiceToken) private authService: AuthService) {
    }

    public async validate(req, res, next) {
        const publicKey = req.headers[headerTokenName];
        if (!publicKey) {
            NmsErrorHandler.handleError(createInvalidCredentialsError(headerTokenName), res);
        }
        const valid = await this.authService.validateCredentials(publicKey);
        if (!valid) {
            NmsErrorHandler.handleError(createInvalidCredentialsError(headerTokenName), res);
        }
        next();
    }
}
