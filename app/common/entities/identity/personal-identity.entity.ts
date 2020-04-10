import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class PersonalIdentity {
    @PrimaryGeneratedColumn()
    id?: number;
    @Column()
    publicKey: string;
    @Column()
    privateKey: string;
}
