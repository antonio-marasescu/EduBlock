import {PersonalIdentity} from '../../common/entities/identity/personal-identity.entity';
import {CommonIdentity} from '../../common/entities/identity/common-identity.entity';
import {EduFileEntity} from '../../common/entities/files/edu-file.entity';
import {BlockEntity} from '../../common/entities/ledger/block.entity';
import {RecordTransactionEntity} from '../../common/entities/ledger/record-transaction.entity';
import {EduStudentEntity} from '../../common/entities/university/edu-student.entity';
import {EduUserEntity} from '../../common/entities/university/edu-user.entity';

export const VAULT_SCHEMA = [
    PersonalIdentity,
    CommonIdentity,
    EduFileEntity,
    BlockEntity,
    RecordTransactionEntity,
    EduStudentEntity,
    EduUserEntity
];
