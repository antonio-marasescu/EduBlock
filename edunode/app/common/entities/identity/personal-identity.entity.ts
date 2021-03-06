import {Column, Entity} from "typeorm";
import {IdentityModel} from "./identity.model";

@Entity()
export class PersonalIdentity extends IdentityModel {
    @Column({unique: true})
    privateKey: string;
}
