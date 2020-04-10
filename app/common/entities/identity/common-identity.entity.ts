import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class CommonIdentity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    publicKey: string;
    @Column()
    legalName: string;
}
