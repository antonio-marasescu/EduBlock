import {Inject, Service, Token} from "typedi";
import {ServerLogger, ServerLoggerToken} from "../../logger/server-logger.interface";
import {EccService, EccServiceToken} from "../security/ecc.service";
import {IdentityService, IdentityServiceToken} from "../security/identity.service";
import {EduFileDto, EduFileMapper} from "../../dto/common/edu-file.dto";
import {EduFileEntity} from "../../entities/files/edu-file.entity";
import {IFilesRepository, IFilesRepositoryToken} from "../../repositories/vault/files.interface.repository";

export const FilesServiceToken = new Token<FilesService>('services.common.files');

@Service(FilesServiceToken)
export class FilesService {
    constructor(
        @Inject(ServerLoggerToken) private logger: ServerLogger,
        @Inject(EccServiceToken) private eccService: EccService,
        @Inject(IFilesRepositoryToken) private filesRepository: IFilesRepository,
        @Inject(IdentityServiceToken) private identityService: IdentityService
    ) {
    }

    public async saveFile(fileDto: EduFileDto): Promise<EduFileEntity> {
        this.logger.logInfo(this, "Saving file....");
        const fileEntity = EduFileMapper.toEntity(fileDto);
        fileEntity.ownerPublicKey = await this.identityService.getPersonalIdentity();
        fileEntity.version = 1.0;
        fileEntity.hash = await this.eccService.hashData(fileEntity);
        const savedFile = await this.filesRepository.saveFile(fileEntity);
        this.logger.logSuccess(this, "The file " + savedFile.hash + " was saved....");
        return savedFile;
    }

    public async getFile(hashId: string): Promise<EduFileEntity> {
        this.logger.logInfo(this, "Getting file " + hashId + " ....");
        const file = await this.filesRepository.findFile(hashId);
        this.logger.logSuccess(this, "The file " + hashId + " was found....");
        return file;
    }
}
