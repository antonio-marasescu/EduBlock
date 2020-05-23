import {Column, Entity} from 'typeorm';
import {IdentityModel} from './identity.model';

@Entity()
export class CommonIdentity extends IdentityModel {

    @Column({unique: true})
    entityHash?: string;

    @Column()
    version?: number;

    @Column()
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
    promoterLegalIdentity?: string;

    @Column({nullable: true})
    promoterSignature?: string;

    @Column({nullable: true})
    promoterPublicKey?: string;

    @Column({nullable: true})
    validatorSignature?: string;

    @Column({nullable: true})
    validatorPublicKey?: string;

    @Column({nullable: true})
    accessToken: string;
}
