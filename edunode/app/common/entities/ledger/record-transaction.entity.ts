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
    certificateAuthorityPublicKey: string;

    @Column()
    certificateSignature: string;

    @Column()
    creationDate: string;

    @Column("simple-array")
    attachments: string[];
}
