import {Token} from 'typedi';
import {Repository} from 'typeorm';
import {EduUserEntity} from '../../entities/university/edu-user.entity';

export interface IUserRepository extends Repository<EduUserEntity> {
}

export const IUserRepositoryToken = new Token<IUserRepository>('repositories.university.user');
