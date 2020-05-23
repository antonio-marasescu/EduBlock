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
    createInvalidSignatureError,
    createObjectNotFoundError,
    createValidationError
} from '../../errors/edu.error.factory';
import {EduUserCredentialsDto} from '../../dto/common/edu-user-credentials.dto';
import * as crypto from 'crypto'
import {AccessTokenDto} from '../../dto/network/access-token.dto';
import {IdentityService, IdentityServiceToken} from '../security/identity.service';
import {NetworkMembersService, NetworkMembersServiceToken} from '../common/network-members.service';
import {
    ICommonIdentityRepository,
    ICommonIdentityRepositoryToken
} from '../../repositories/identity/common-identity.interface.repository';
import {AccessTokenPublisher, AccessTokenPublisherToken} from '../rabbitmq/publishers/access-token.publisher';

export const AuthenticationServiceToken = new Token<AuthenticationService>('services.auth.authentication');

@Service(AuthenticationServiceToken)
export class AuthenticationService {
    private inMemorySecret: string;

    constructor(
        @Inject(EccServiceToken) private eccService: EccService,
        @Inject(IdentityServiceToken) private identityService: IdentityService,
        @Inject(IUserRepositoryToken) private userRepository: IUserRepository,
        @Inject(NetworkMembersServiceToken) private networkMembersService: NetworkMembersService,
        @Inject(ICommonIdentityRepositoryToken) private commonIdentityRepository: ICommonIdentityRepository,
        @Inject(AccessTokenPublisherToken) private accessTokenPublisher: AccessTokenPublisher,
        @Inject(ServerLoggerToken) private logger: ServerLogger,
    ) {
    }

    public async initializeService(): Promise<void> {
        this.logger.logInfo(this, 'Initializing Authentication Service...');
        this.inMemorySecret = Buffer.from(crypto.randomBytes(256)).toString('hex');
        this.logger.logInfo(this, 'Authentication Service Secret: ' + this.inMemorySecret);

        this.logger.logInfo(this, 'Creating network access token');
        const accessToken = new AccessTokenDto();
        const accessIdentity = await this.identityService.getPersonalIdentityDetails();
        accessToken.token = await jwt.sign(JSON.stringify(accessIdentity), this.inMemorySecret);
        accessToken.identitySignature = await this.identityService.signData(accessToken.token);
        accessToken.identityPublicKey = await this.identityService.getPersonalIdentity();

        this.logger.logSuccess(this, 'Network access token was created');
        await this.accessTokenPublisher.publish(accessToken);
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

    public async addAuthorizationToIdentity(accessToken: AccessTokenDto): Promise<void> {
        this.logger.logInfo(this, 'Add Authorization Token to Network Member Flow has started...');

        this.logger.logInfo(this, 'Validating Access token data transfer object...');
        const validationErrors: ValidationError[] = await validate(accessToken);
        if (validationErrors.length > 0) {
            const error = createValidationError(validationErrors);
            this.logger.logError(this, JSON.stringify(error));
            throw error;
        }
        const valid = await this.identityService.verifyData(accessToken.token, accessToken.identitySignature, accessToken.identityPublicKey);
        if (!valid) {
            const error = createInvalidSignatureError(accessToken);
            this.logger.logError(this, JSON.stringify(error));
            throw error;
        }
        this.logger.logSuccess(this, 'Validation of Access token data transfer object has succeeded!');

        this.logger.logInfo(this, 'Searching for network member identity...');
        await this.networkMembersService.getSingleNetworkMember(accessToken.identityPublicKey);
        const member = await this.commonIdentityRepository.findOneOrFail({publicKey: accessToken.identityPublicKey});
        this.logger.logSuccess(this, 'Network member was found for the access token!');

        this.logger.logInfo(this, 'Adding access token to the identity...');
        member.accessToken = accessToken.token;
        await this.commonIdentityRepository.save(member);
        this.logger.logSuccess(this, 'Access token added! Add Authorization Token to Network Member Flow has ended!');
    }
}
