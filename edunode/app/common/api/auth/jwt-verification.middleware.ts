import {AuthenticationService, AuthenticationServiceToken} from '../../services/auth/authentication.service';
import {Container} from 'typedi';

export async function jwtVerification(req, res, next) {
    const bearerToken = req.headers['authorization'];
    if (bearerToken) {
        const token = bearerToken.split(' ')[1];
        const authenticationService: AuthenticationService = Container.get(AuthenticationServiceToken);
        const validationObject: any = await authenticationService.verifyToken(token);
        if (!!validationObject) {
            next();
        } else {
            res.sendStatus(403);
        }

    } else {
        res.sendStatus(403);
    }
}
