import {RecordTransactionEntity} from "../../../entities/ledger/record-transaction.entity";
import {IsNotEmpty, IsNumber, IsString} from "class-validator";
import {RecordTransactionStatus} from "../../../entities/ledger/record-transaction-status.enum";

export class NetworkTransactionDto {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    hash: string;

    blockHash?: string;

    @IsNumber()
    version: number;

    @IsString()
    @IsNotEmpty()
    creatorPublicKey: string;

    @IsString()
    @IsNotEmpty()
    creatorSignature: string;

    @IsString()
    @IsNotEmpty()
    certificateAuthorityPublicKey: string;

    @IsString()
    @IsNotEmpty()
    certificateSignature: string;

    @IsString()
    @IsNotEmpty()
    creationDate: string;

    @IsString()
    @IsNotEmpty()
    targetPublicKey: string;

    attachments: string[];

    status: RecordTransactionStatus;
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
        dto.status = entity.status as any;
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
        entity.status = dto.status;
        return entity;
    }
}
