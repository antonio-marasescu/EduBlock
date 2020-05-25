import {EntityRepository, Repository} from 'typeorm';
import {EduFileEntity} from '../../entities/files/edu-file.entity';
import {IFilesRepository, SaveFilesOptions} from './files.interface.repository';

@EntityRepository(EduFileEntity)
export class FilesRepository extends Repository<EduFileEntity> implements IFilesRepository {

    async findFile(id: string): Promise<EduFileEntity> {
        return await this.findOneOrFail(id);
    }

    async findFileByIds(ids: string[]): Promise<EduFileEntity[]> {
        return await this.findByIds(ids);
    }

    async saveFile(entity: EduFileEntity, options?: SaveFilesOptions): Promise<EduFileEntity> {
        if (!options?.shouldNotConvert) {
            entity.content = ('\\x' + entity.content.toString('hex')) as any;
        }
        const savedFile = await this.save(entity);
        if (options && options.isPureFile)
            return savedFile;
        return this.mapFileToReadable(savedFile);
    }

    async clearFiles(): Promise<void> {
        await this.clear();
    }

    private mapFileToReadable(file: EduFileEntity): EduFileEntity {
        file.content = new Buffer(file.content.toString().substring(2), 'hex');
        return file;
    }
}
