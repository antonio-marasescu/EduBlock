import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class SignatureEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    signature: string;

    @Column()
    signedData: string;

    @Column()
    dateSigned: string;
}
