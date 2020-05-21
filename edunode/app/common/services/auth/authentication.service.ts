import {Inject, Service, Token} from 'typedi';
import {EccService, EccServiceToken} from '../security/ecc.service';
import {ServerLogger, ServerLoggerToken} from '../../logger/server-logger.interface';
import jwt from 'jsonwebtoken'
import {IUserRepository, IUserRepositoryToken} from '../../repositories/university/user.interface.repository';
import {EduUserDto, EduUserDtoMapper} from '../../dto/common/edu-user.dto';
import {EduUserEntity, EduUserRoles} from '../../entities/university/edu-user.entity';
import {validate, ValidationError} from 'class-validator';
import {
    createInvalidCredentials,
    createObjectNotFoundError,
    createValidationError
} from '../../errors/edu.error.factory';
import {EduUserCredentialsDto} from '../../dto/common/edu-user-credentials.dto';
import * as crypto from 'crypto'

export const AuthenticationServiceToken = new Token<AuthenticationService>('services.auth.authentication');

@Service(AuthenticationServiceToken)
export class AuthenticationService {
    private inMemorySecret: string;

    constructor(
        @Inject(EccServiceToken) private eccService: EccService,
        @Inject(IUserRepositoryToken) private userRepository: IUserRepository,
        @Inject(ServerLoggerToken) private logger: ServerLogger,
    ) {
    }

    public async initializeService(): Promise<void> {
        this.logger.logInfo(this, 'Initializing Authentication Service...');
        this.inMemorySecret = Buffer.from(crypto.randomBytes(256)).toString('hex');
        this.logger.logInfo(this, 'Authentication Service Secret: ' + this.inMemorySecret);
        this.logger.logSuccess(this, 'Authentication Service was initialized!');
    }

    public async login(data: EduUserCredentialsDto): Promise<EduUserDto> {
        this.logger.logInfo(this, 'Login user request is been handled');
        this.logger.logInfo(this, 'Searching for user by id: ' + data.email);
        const actualUser = await this.userRepository.findOne({email: data.email});
        if (!actualUser) {
            const error = createObjectNotFoundError(data.email);
            this.logger.logError(this, JSON.stringify(error));
            throw error;
        }
        this.logger.logSuccess(this, 'User has been found!');
        this.logger.logInfo(this, 'Verifying user password....');
        const passwordHash = await this.eccService.hashStringData(data.password);
        const isValid = actualUser.password === passwordHash;
        if (!isValid) {
            const error = createInvalidCredentials(data.password);
            this.logger.logError(this, JSON.stringify(error));
            throw error;
        }
        this.logger.logInfo(this, 'Password verification has succeeded!');
        return EduUserDtoMapper.toDto(actualUser);
    }

    public async registerUser(data: EduUserDto): Promise<EduUserDto> {
        this.logger.logInfo(this, 'Registering a new user...');

        this.logger.logInfo(this, 'Validating new user data transfer object..');
        const validationErrors: ValidationError[] = await validate(data);
        if (validationErrors.length > 0) {
            const error = createValidationError(validationErrors);
            this.logger.logError(this, JSON.stringify(error));
            throw error;
        }
        this.logger.logSuccess(this, 'Validation was a success!');

        const user: EduUserEntity = EduUserDtoMapper.toEntity(data);
        user.role = EduUserRoles.USER;
        user.password = await this.eccService.hashStringData(user.password);
        const savedUser = await this.userRepository.save(user);
        this.logger.logSuccess(this, 'Registering a new user was a success!');
        return savedUser;
    }

    public async signRequest(data: EduUserDto): Promise<string> {
        this.logger.logInfo(this, 'Signing data using jwt....');
        let token;
        try {
            token = await jwt.sign(JSON.stringify(data), this.inMemorySecret);
        } catch (e) {
            this.logger.logError(this, JSON.stringify(e));
            throw e;
        }
        return token;
    }

    public async verifyToken(token: string): Promise<EduUserDto | null> {
        this.logger.logInfo(this, 'Verifying jwt token....');
        let decodedToken: EduUserDto | any = null;
        try {
            decodedToken = jwt.verify(token, this.inMemorySecret, {ignoreExpiration: true});
        } catch (e) {
            this.logger.logError(this, JSON.stringify(e));
            return null;
        }
        this.logger.logInfo(this, 'Verification result of jwt token: ' + decodedToken);
        return decodedToken;
    }
}
