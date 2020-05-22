import {EntityRepository, Repository} from 'typeorm';
import {EduUserEntity} from '../../entities/university/edu-user.entity';
import {IUserRepository} from './user.interface.repository';

@EntityRepository(EduUserEntity)
export class UserRepository extends Repository<EduUserEntity> implements IUserRepository {
}
