import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Identity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    publicKey: string;
    @Column()
    privateKey: string;
}
