import {Token} from 'typedi';
import {Repository} from 'typeorm';
import {EduStudentEntity} from '../../entities/university/edu-student.entity';

export interface IStudentRepository extends Repository<EduStudentEntity> {
}

export const IStudentRepositoryToken = new Token<IStudentRepository>('repositories.university.student');
