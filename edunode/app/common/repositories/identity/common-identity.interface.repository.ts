import {Repository} from "typeorm";
import {CommonIdentity} from "../../entities/identity/common-identity.entity";
import {Token} from "typedi";

export interface ICommonIdentityRepository extends Repository<CommonIdentity> {
}

export const ICommonIdentityRepositoryToken = new Token<ICommonIdentityRepository>('repositories.common-identity');
