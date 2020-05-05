import {RecordTransactionEntity} from "../../entities/ledger/record-transaction.entity";

export class CaTransactionDto {
    attachments: string[];
    targetPublicKey: string;
    creatorPublicKey: string;
}

export class CaTransactionDtoMapper {
    public static toDto(entity: RecordTransactionEntity): CaTransactionDto {
        const dto = new CaTransactionDto();
        dto.attachments = entity.attachments;
        dto.targetPublicKey = entity.targetPublicKey;
        dto.creatorPublicKey = entity.creatorPublicKey;
        return dto;
    }
}
