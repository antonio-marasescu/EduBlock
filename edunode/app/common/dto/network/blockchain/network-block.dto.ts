import {BlockEntity} from "../../../entities/ledger/block.entity";

export class NetworkBlockDto {
    hash: string;
    index: number;
    previousHash: string;
    nonce: number;
    timestamp: string;
    creatorPublicKey: string;
    creatorSignature: string;
    transactions: string[];
}

export class NetworkBlockDtoMapper {

    public static toEntity(dto: NetworkBlockDto): BlockEntity {
        const entity = new BlockEntity();
        entity.hash = dto.hash;
        entity.index = dto.index;
        entity.previousHash = dto.previousHash;
        entity.nonce = dto.nonce;
        entity.timestamp = dto.timestamp;
        entity.creatorPublicKey = dto.creatorPublicKey;
        entity.creatorSignature = dto.creatorSignature;
        entity.transactions = dto.transactions;
        return entity;
    }

    public static toDto(entity: BlockEntity): NetworkBlockDto {
        const dto = new NetworkBlockDto();
        dto.hash = entity.hash;
        dto.index = entity.index;
        dto.previousHash = entity.previousHash;
        dto.nonce = entity.nonce;
        dto.timestamp = entity.timestamp;
        dto.creatorPublicKey = entity.creatorPublicKey;
        dto.creatorSignature = entity.creatorSignature;
        dto.transactions = entity.transactions;
        return dto;
    }
}
