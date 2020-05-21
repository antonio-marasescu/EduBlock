import {Inject, Service, Token} from 'typedi';
import {BasicApi} from '../basic.api';
import express from 'express';
import asyncHandler from 'express-async-handler';
import {AuthenticationService, AuthenticationServiceToken} from '../../services/auth/authentication.service';
import {EduUserDto} from '../../dto/common/edu-user.dto';
import {EduUserCredentialsDto} from '../../dto/common/edu-user-credentials.dto';

export const AuthenticationApiToken = new Token<AuthenticationApi>('api.auth.authentication-api');

@Service(AuthenticationApiToken)
export class AuthenticationApi implements BasicApi {
    private readonly router: express.Router;

    constructor(@Inject(AuthenticationServiceToken) private authenticationService: AuthenticationService) {
        this.router = express.Router();
        this.registerRoutes();

    }

    public getRouter(): express.Router {
        return this.router;
    }

    private registerRoutes() {
        this.router.post('/api/login', asyncHandler(
            async (req, res) => this.handleLogin(req, res)));
        this.router.post('/api/register', asyncHandler(
            async (req, res) => this.handleRegister(req, res)));
    }

    private async handleLogin(req, res) {
        const dto = new EduUserCredentialsDto();
        Object.assign(dto, req.body);
        const loggedUser: EduUserDto = await this.authenticationService.login(dto);
        const token: string = await this.authenticationService.signRequest(loggedUser);
        res.set('authorization', token);
        res.json(loggedUser);
    }

    private async handleRegister(req, res) {
        const dto = new EduUserDto();
        Object.assign(dto, req.body);
        const savedUser: EduUserDto = await this.authenticationService.registerUser(dto);
        res.json(savedUser);
    }
}
