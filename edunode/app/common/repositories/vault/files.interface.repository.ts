import {EduFileEntity} from '../../entities/files/edu-file.entity';
import {Token} from 'typedi';

export interface SaveFilesOptions {
    shouldNotConvert: boolean;
    isPureFile: boolean;
}

export interface IFilesRepository {
    findFile(id: string): Promise<EduFileEntity>;

    findFileByIds(ids: string[]): Promise<EduFileEntity[]>;

    saveFile(entity: EduFileEntity, options?: SaveFilesOptions): Promise<EduFileEntity>;
}


export const IFilesRepositoryToken = new Token<IFilesRepository>('repositories.vault.files');
