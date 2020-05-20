import {DIInterface} from '../di.interface';
import {Container} from 'typedi';
import {IPersonalIdentityRepositoryToken} from '../../common/repositories/identity/personal-identity.interface.repository';
import {PersonalIdentityRepository} from '../../common/repositories/identity/personal-identity.repository';
import {getCustomRepository} from 'typeorm';
import {ICommonIdentityRepositoryToken} from '../../common/repositories/identity/common-identity.interface.repository';
import {CommonIdentityRepository} from '../../common/repositories/identity/common-identity.repository';
import {IFilesRepositoryToken} from '../../common/repositories/vault/files.interface.repository';
import {FilesRepository} from '../../common/repositories/vault/files.repository';
import {IBlockRepositoryToken} from '../../common/repositories/ledger/block.interface.repository';
import {BlockRepository} from '../../common/repositories/ledger/block.repository';
import {IRecordTransactionRepositoryToken} from '../../common/repositories/ledger/record-transaction.interface.repository';
import {RecordTransactionRepository} from '../../common/repositories/ledger/record-transaction.repository';
import {IStudentRepositoryToken} from '../../common/repositories/university/student.interface.repository';
import {StudentRepository} from '../../common/repositories/university/student.repository';

export default class RepositoryDI implements DIInterface {

    inject(_: any): void {
        Container.set(IPersonalIdentityRepositoryToken, getCustomRepository(PersonalIdentityRepository));
        Container.set(ICommonIdentityRepositoryToken, getCustomRepository(CommonIdentityRepository));
        Container.set(IFilesRepositoryToken, getCustomRepository(FilesRepository));
        Container.set(IBlockRepositoryToken, getCustomRepository(BlockRepository));
        Container.set(IRecordTransactionRepositoryToken, getCustomRepository(RecordTransactionRepository));
        Container.set(IStudentRepositoryToken, getCustomRepository(StudentRepository));
    }
}
