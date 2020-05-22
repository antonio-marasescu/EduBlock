import {Inject, Service, Token} from 'typedi';
import {BasicApi} from '../basic.api';
import express from 'express';
import asyncHandler from 'express-async-handler';
import {AuthenticationService, AuthenticationServiceToken} from '../../services/auth/authentication.service';
import {EduUserDto} from '../../dto/common/edu-user.dto';

export const UsersApiToken = new Token<UsersApi>('api.routes.users');

@Service(UsersApiToken)
export class UsersApi implements BasicApi {

    private readonly router: express.Router;

    constructor(@Inject(AuthenticationServiceToken) private authenticationService: AuthenticationService) {
        this.router = express.Router();
        this.registerRoutes();
    }

    public getRouter(): express.Router {
        return this.router;
    }

    private registerRoutes() {
        this.router.get('/api/users/me',
            asyncHandler(async (req, res) => this.handleGetMe(req, res)));
    }

    private async handleGetMe(req, res) {
        const bearerToken = req.headers['authorization'];
        const token = bearerToken.split(' ')[1];
        const user: EduUserDto | null = await this.authenticationService.verifyToken(token);
        res.json(user);
    }
}
