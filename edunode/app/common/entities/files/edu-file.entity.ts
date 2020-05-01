import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class EduFileEntity {
    @PrimaryColumn()
    hash: string;

    @Column()
    version: number;

    @Column()
    ownerPublicKey: string;

    @Column()
    filename: string;

    @Column()
    mimeType: string;

    @Column()
    encoding: string;

    @Column()
    size: number;

    @Column({type: "bytea", nullable: false})
    content: Buffer;
}
