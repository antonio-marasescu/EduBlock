import {RecordTransactionEntity} from "../../../entities/ledger/record-transaction.entity";

export class NetworkTransactionDto {
    id: string;
    hash: string;
    blockHash?: string;
    version: number;
    creatorPublicKey: string;
    creatorSignature: string;
    certificateAuthorityPublicKey: string;
    certificateSignature: string;
    creationDate: string;
    targetPublicKey: string;
    attachments: string[];
}

export class NetworkTransactionDtoMapper {
    public static toDto(entity: RecordTransactionEntity): NetworkTransactionDto {
        const dto = new NetworkTransactionDto();
        dto.id = entity.id as any;
        dto.hash = entity.hash as any;
        dto.blockHash = entity.blockHash;
        dto.version = entity.version;
        dto.creatorPublicKey = entity.creatorPublicKey;
        dto.creatorSignature = entity.creatorSignature as any;
        dto.certificateAuthorityPublicKey = entity.certificateAuthorityPublicKey as any;
        dto.certificateSignature = entity.certificateSignature as any;
        dto.creationDate = entity.creationDate as any;
        dto.targetPublicKey = entity.targetPublicKey;
        dto.attachments = entity.attachments;
        return dto;
    }

    public static toEntity(dto: NetworkTransactionDto): RecordTransactionEntity {
        const entity = new NetworkTransactionDto();
        entity.id = dto.id as any;
        entity.hash = dto.hash as any;
        entity.blockHash = dto.blockHash;
        entity.version = dto.version;
        entity.creatorPublicKey = dto.creatorPublicKey;
        entity.creatorSignature = dto.creatorSignature as any;
        entity.certificateAuthorityPublicKey = dto.certificateAuthorityPublicKey as any;
        entity.certificateSignature = dto.certificateSignature as any;
        entity.creationDate = dto.creationDate as any;
        entity.targetPublicKey = dto.targetPublicKey;
        entity.attachments = dto.attachments;
        return entity;
    }
}
