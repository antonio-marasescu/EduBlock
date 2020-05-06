import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {RecordTransactionStatus} from "./record-transaction-status.enum";

@Entity()
export class RecordTransactionEntity {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Column({nullable: true})
    hash?: string;

    @Column({nullable: true})
    blockHash?: string;

    @Column()
    version: number;

    @Column()
    creatorPublicKey: string;

    @Column({nullable: true})
    creatorSignature?: string;

    @Column({nullable: true})
    certificateAuthorityPublicKey?: string;

    @Column({nullable: true})
    certificateSignature?: string;

    @Column({nullable: true})
    creationDate?: string;

    @Column()
    targetPublicKey: string;

    @Column("simple-array")
    attachments: string[];

    @Column('enum', {name: 'record_transaction_status', enum: RecordTransactionStatus})
    status?: RecordTransactionStatus;
}

export const PendingTransactionHashBlacklist = [
    'id', 'hash', 'blockHash', 'creatorPublicKey', 'creatorSignature',
    'certificateAuthorityPublicKey', 'certificateSignature', 'creationDate', 'status'
];

export const CertificateAuthorityTransactionSignatureBlacklist = [
    'id', 'hash', 'blockHash', 'certificateAuthorityPublicKey', 'certificateSignature', 'creationDate', 'status'
];
export const CertifiedTransactionHashBlacklist = ['id', 'hash', 'blockHash', 'status'];
