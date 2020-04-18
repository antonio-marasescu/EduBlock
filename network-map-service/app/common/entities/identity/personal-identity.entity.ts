import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class PersonalIdentity {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column({unique: true})
    publicKey: string;

    @Column()
    legalIdentity: string;

    @Column({unique: true})
    privateKey: string;
}
