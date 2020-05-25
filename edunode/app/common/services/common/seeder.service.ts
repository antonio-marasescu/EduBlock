import {Inject, Service, Token} from 'typedi';
import {
    ICommonIdentityRepository,
    ICommonIdentityRepositoryToken
} from '../../repositories/identity/common-identity.interface.repository';
import {
    IRecordTransactionRepository,
    IRecordTransactionRepositoryToken
} from '../../repositories/ledger/record-transaction.interface.repository';
import {IFilesRepository, IFilesRepositoryToken} from '../../repositories/vault/files.interface.repository';
import {ServerLogger, ServerLoggerToken} from '../../logger/server-logger.interface';
import {NodeConfigurationModel, NodeConfigurationModelToken} from '../../config/node-configuration.model';
import {IStudentRepositoryToken} from '../../repositories/university/student.interface.repository';
import {StudentRepository} from '../../repositories/university/student.repository';
import {IBlockRepository, IBlockRepositoryToken} from '../../repositories/ledger/block.interface.repository';
import {NetworkMembersService, NetworkMembersServiceToken} from './network-members.service';
import {AuthenticationService, AuthenticationServiceToken} from '../auth/authentication.service';
import {IUserRepository, IUserRepositoryToken} from '../../repositories/university/user.interface.repository';
import {EduUserDto} from '../../dto/common/edu-user.dto';

export const SeederServiceToken = new Token<SeederService>('services.common.seeder');

@Service(SeederServiceToken)
export class SeederService {
    constructor(
        @Inject(ServerLoggerToken) private logger: ServerLogger,
        @Inject(NodeConfigurationModelToken) private nodeConfigurationModelToken: NodeConfigurationModel,
        @Inject(IFilesRepositoryToken) private filesRepository: IFilesRepository,
        @Inject(ICommonIdentityRepositoryToken) private commonIdentityRepository: ICommonIdentityRepository,
        @Inject(IRecordTransactionRepositoryToken) private recordTransactionRepository: IRecordTransactionRepository,
        @Inject(IStudentRepositoryToken) private studentRepository: StudentRepository,
        @Inject(IBlockRepositoryToken) private blockRepository: IBlockRepository,
        @Inject(IUserRepositoryToken) private userRepository: IUserRepository,
        @Inject(NetworkMembersServiceToken) private networkMembersService: NetworkMembersService,
        @Inject(AuthenticationServiceToken) private authenticationService: AuthenticationService,
    ) {
    }

    public async seed() {
        this.logger.logInfo(this, 'Seeding data...');

        if (!this.nodeConfigurationModelToken.isRunningTests) {
            this.logger.logError(this, 'Seeding is not allowed for this system configuration!');
            return;
        }

        this.logger.logInfo(this, 'Clearing database data...');
        await this.filesRepository.clearFiles();
        await this.commonIdentityRepository.clear();
        await this.recordTransactionRepository.clear();
        await this.studentRepository.clear();
        await this.blockRepository.clear();
        await this.userRepository.clear();
        this.logger.logSuccess(this, 'Clearing database data succeeded');

        this.logger.logInfo(this, 'Network members seeding....');
        await this.networkMembersService.learnMembers();
        await this.authenticationService.publishAuthorizationToken();

        this.logger.logInfo(this, 'Admin user seeding....');
        const seedAdmin = new EduUserDto();
        seedAdmin.email = 'admin@email.com';
        seedAdmin.password = 'admin';
        await this.authenticationService.registerUser(seedAdmin, true);

        //TODO: Should add actual seed data to the service
        this.logger.logSuccess(this, 'Seeding is done.')
    }
}
