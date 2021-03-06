import {RecordTransactionEntity} from '../../entities/ledger/record-transaction.entity';
import {IsNotEmpty, IsString} from 'class-validator';

export class CreateTransactionDto {
    @IsString()
    @IsNotEmpty()
    studentPublicKey: string;

    attachments: string[];

    @IsString()
    @IsNotEmpty()
    title: string;
}

export class CreateTransactionDtoMapper {
    public static toEntity(dto: CreateTransactionDto): RecordTransactionEntity {
        const entity = new RecordTransactionEntity();
        entity.attachments = dto.attachments;
        entity.targetPublicKey = dto.studentPublicKey;
        entity.title = dto.title;
        return entity;
    }
}
