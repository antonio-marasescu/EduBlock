import {AbstractRepository, EntityRepository} from "typeorm";

@EntityRepository(Identity)
export class NodeIdentityRepository extends AbstractRepository<NodeIdentityModel> {

}
