import {EntityRepository, Repository} from 'typeorm';
import {EduStudentEntity} from '../../entities/university/edu-student.entity';
import {IStudentRepository} from './student.interface.repository';

@EntityRepository(EduStudentEntity)
export class StudentRepository extends Repository<EduStudentEntity> implements IStudentRepository {
}
