import {Column, PrimaryGeneratedColumn} from "typeorm";

export class IdentityModel {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column({unique: true})
    publicKey: string;

    @Column()
    legalName: string;
}
