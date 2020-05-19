import {Inject, Service, Token} from 'typedi';
import {ServerLogger, ServerLoggerToken} from '../../logger/server-logger.interface';
import {EccService, EccServiceToken} from '../security/ecc.service';
import {IdentityService, IdentityServiceToken} from '../security/identity.service';
import {EduFileDto, EduFileMapper} from '../../dto/common/edu-file.dto';
import {EduFileEntity} from '../../entities/files/edu-file.entity';
import {IFilesRepository, IFilesRepositoryToken} from '../../repositories/vault/files.interface.repository';
import {
    IRecordTransactionRepository,
    IRecordTransactionRepositoryToken
} from '../../repositories/ledger/record-transaction.interface.repository';
import {NetworkMembersService, NetworkMembersServiceToken} from './network-members.service';
import {buildAxiosInstance} from '../axios/axios.builder';
import {createFileOwnerUnreachable} from '../../errors/edu.error.factory';

export const FilesServiceToken = new Token<FilesService>('services.common.files');

@Service(FilesServiceToken)
export class FilesService {
    constructor(
        @Inject(ServerLoggerToken) private logger: ServerLogger,
        @Inject(EccServiceToken) private eccService: EccService,
        @Inject(IFilesRepositoryToken) private filesRepository: IFilesRepository,
        @Inject(IdentityServiceToken) private identityService: IdentityService,
        @Inject(NetworkMembersServiceToken) private networkMembersService: NetworkMembersService,
        @Inject(IRecordTransactionRepositoryToken) private recordTransactionRepository: IRecordTransactionRepository,
    ) {
    }

    public async saveFile(fileDto: EduFileDto): Promise<EduFileEntity> {
        this.logger.logInfo(this, 'Saving file....');
        const fileEntity = EduFileMapper.toEntity(fileDto);
        fileEntity.ownerPublicKey = await this.identityService.getPersonalIdentity();
        fileEntity.version = 1.0;
        fileEntity.hash = await this.eccService.hashData(fileEntity);
        const savedFile = await this.filesRepository.saveFile(fileEntity);
        this.logger.logSuccess(this, 'The file ' + savedFile.hash + ' was saved....');
        return savedFile;
    }

    public async getFile(hashId: string): Promise<EduFileEntity> {
        this.logger.logInfo(this, 'Getting file ' + hashId + ' ....');
        const file = await this.filesRepository.findFile(hashId);
        this.logger.logSuccess(this, 'The file ' + hashId + ' was found....');
        return file;
    }

    public async getFilesForTransaction(transactionHashId: string): Promise<EduFileEntity[]> {
        this.logger.logInfo(this, 'Searching for transaction ' + transactionHashId + ' ....');
        const transaction = await this.recordTransactionRepository.findOneOrFail({hash: transactionHashId});
        this.logger.logSuccess(this, 'Transaction ' + transactionHashId + ' found!');
        this.logger.logInfo(this, 'Searching for files ' + JSON.stringify(transaction.attachments) + '.');
        const files = await this.filesRepository.findFileByIds(transaction.attachments);
        if (files.length !== transaction.attachments.length) {
            const personalIdentity = await this.identityService.getPersonalIdentity();
            if (personalIdentity === transaction.creatorPublicKey) {
                this.logger.logError(this, 'We do not have our own files in the system vault!');
                return files;
            }
            this.logger.logInfo(this, 'Searching for files transaction owner..');
            const filesOwner = await this.networkMembersService.getSingleNetworkMember(transaction.creatorPublicKey);
            this.logger.logSuccess(this, 'Files transaction owner found.');

            this.logger.logInfo(this, 'Sending requests for files');
            const memberAxiosInstance = buildAxiosInstance(filesOwner.host, filesOwner.port);
            const response = await memberAxiosInstance.get<EduFileEntity[]>('/api/files/' + transactionHashId);
            this.logger.logInfo(this, 'Requests for files received');
            if (response.status !== 200) {
                const error = createFileOwnerUnreachable(transaction.creatorPublicKey);
                this.logger.logError(this, 'We could not reach the owner of the files. Please try again later!');
                this.logger.logError(this, JSON.stringify(error));
                throw error;
            }

            this.logger.logInfo(this, 'Saving files to local vault...');
            const responseFiles: EduFileEntity[] = response.data;
            const savedFiles: EduFileEntity[] = [];
            for (const responseFile of responseFiles) {
                responseFile.content = Buffer.from((responseFile.content as any).data);
                const savedFile: EduFileEntity = await this.filesRepository.saveFile(responseFile);
                savedFiles.push(savedFile);
            }
            this.logger.logSuccess(this, 'Files saved to local vault.');

            this.logger.logSuccess(this, 'Found a total of ' + savedFiles.length + ' files.');
            return savedFiles;
        }
        this.logger.logSuccess(this, 'Found a total of ' + files.length + ' files.');
        return files;
    }
}
