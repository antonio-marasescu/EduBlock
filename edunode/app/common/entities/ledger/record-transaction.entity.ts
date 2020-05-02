import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class RecordTransactionEntity {
    @PrimaryColumn()
    hash: string;

    @Column()
    blockHash: string;

    @Column()
    version: number;

    @Column()
    creatorPublicKey: string;

    @Column()
    creatorSignature: string;

    @Column()
    certificateAuthorityPublicKey: string;

    @Column()
    certificateSignature: string;

    @Column()
    creationDate: string;

    @Column("simple-array")
    attachments: string[];

    @Column({default: true, nullable: true})
    isPending?: boolean;
}

export const TransactionHashBlacklist =
    ['isPending', 'hash', 'blockHash'];
export const CreatorHashBlacklist =
    ['isPending', 'hash', 'blockHash', 'creatorSignature'];
export const CertificateAuthorityHashBlacklist =
    ['isPending', 'hash', 'blockHash', 'creatorSignature', 'creatorPublicKey', 'certificateSignature'];
