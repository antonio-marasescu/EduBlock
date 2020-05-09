import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class BlockEntity {
    @PrimaryColumn()
    hash: string;

    @Column()
    index: number;

    @Column()
    previousHash: string;

    @Column()
    nonce: number;

    @Column()
    timestamp: string;

    @Column()
    creatorPublicKey: string;

    @Column()
    creatorSignature: string;

    @Column("simple-array")
    transactions: string[];
}

export const BlockSignatureBlacklist = ['hash', 'nonce', 'timestamp', 'creatorPublicKey', 'creatorSignature'];
