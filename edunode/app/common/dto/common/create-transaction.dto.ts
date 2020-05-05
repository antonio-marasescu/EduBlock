import {RecordTransactionEntity} from "../../entities/ledger/record-transaction.entity";

export class CreateTransactionDto {
    studentPublicKey: string;
    attachments: string[];
}

export class CreateTransactionDtoMapper {
    public static toEntity(dto: CreateTransactionDto): RecordTransactionEntity {
        const entity = new RecordTransactionEntity();
        entity.attachments = dto.attachments;
        entity.targetPublicKey = dto.studentPublicKey;
        return entity;
    }
}
