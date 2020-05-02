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
    timestamp: number;
}
