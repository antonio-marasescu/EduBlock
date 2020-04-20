import {PersonalIdentity} from "../../entities/identity/personal-identity.entity";
import {Token} from "typedi";
import {Repository} from "typeorm";

export default interface IPersonalIdentityRepository extends Repository<PersonalIdentity> {
    findPersonalIdentity(): Promise<PersonalIdentity | null>
}

export const IPersonalIdentityRepositoryToken = new Token<IPersonalIdentityRepository>('repositories.personal-identity');
