import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class NetworkMapEntity {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column({unique: true})
    entityHash?: string;

    @Column()
    version?: number;

    @Column({unique: true})
    publicKey: string;

    @Column()
    legalIdentity: string;

    @Column()
    host: string;

    @Column()
    port: number;

    @Column()
    joinedDate: string;

    @Column({nullable: true})
    promoterSignature?: string;

    @Column({nullable: true})
    promoterPublicKey?: string;

    @Column({nullable: true})
    validatorSignature?: string;

    @Column({nullable: true})
    validatorPublicKey?: string;
}
