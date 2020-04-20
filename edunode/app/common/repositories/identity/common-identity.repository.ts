import {ICommonIdentityRepository} from "./common-identity.interface.repository";
import {EntityRepository, Repository} from "typeorm";
import {CommonIdentity} from "../../entities/identity/common-identity.entity";

@EntityRepository(CommonIdentity)
export class CommonIdentityRepository extends Repository<CommonIdentity> implements ICommonIdentityRepository {
}
