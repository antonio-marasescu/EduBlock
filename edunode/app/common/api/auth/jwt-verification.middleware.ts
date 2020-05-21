import {AuthenticationService, AuthenticationServiceToken} from '../../services/auth/authentication.service';
import {Container} from 'typedi';

export async function jwtVerification(req, res, next) {
    const bearerToken = req.headers['authorization'];
    if (bearerToken) {
        const authenticationService: AuthenticationService = Container.get(AuthenticationServiceToken);
        const isValid: boolean = await authenticationService.verifyToken(bearerToken);
        if (isValid) {
            next();
        } else {
            res.sendStatus(403);
        }

    } else {
        res.sendStatus(403);
    }
}
