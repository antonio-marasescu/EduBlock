import {RecordTransactionEntity} from "../../entities/ledger/record-transaction.entity";

export class CaTransactionDto {
    attachments: string[];
    creatorPublicKey: string;
    creatorSignature: string;
    targetPublicKey: string;
    version: number;
}

export class CaTransactionDtoMapper {
    public static toDto(entity: RecordTransactionEntity): CaTransactionDto {
        const dto = new CaTransactionDto();
        dto.attachments = entity.attachments;
        dto.creatorPublicKey = entity.creatorPublicKey;
        dto.creatorSignature = entity.creatorSignature as any;
        dto.targetPublicKey = entity.targetPublicKey;
        dto.version = entity.version;
        return dto;
    }
}
