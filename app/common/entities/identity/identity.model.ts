import {Column, PrimaryGeneratedColumn} from "typeorm";

export class IdentityModel {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    publicKey: string;

    @Column()
    legalName: string;
}
