import {AuthenticationService, AuthenticationServiceToken} from '../../services/auth/authentication.service';
import {Container} from 'typedi';

export async function jwtVerification(req, res, next) {
    const bearerToken = req.headers['authorization'];
    if (bearerToken) {
        const authenticationService: AuthenticationService = Container.get(AuthenticationServiceToken);
        const validationObject: any = await authenticationService.verifyToken(bearerToken);
        if (!!validationObject) {
            next();
        } else {
            res.sendStatus(403);
        }

    } else {
        res.sendStatus(403);
    }
}
