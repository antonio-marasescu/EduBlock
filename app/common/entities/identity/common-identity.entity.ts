import {Column, Entity} from "typeorm";
import {IdentityModel} from "./identity.model";

@Entity()
export class CommonIdentity extends IdentityModel {
    @Column()
    isWellKnown: boolean;
}
