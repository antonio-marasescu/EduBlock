import {EntityRepository, Repository} from "typeorm";
import {PersonalIdentity} from "../../entities/identity/personal-identity.entity";
import IPersonalIdentityRepository from "./personal-identity.interface.repository";

@EntityRepository(PersonalIdentity)
export class PersonalIdentityRepository extends Repository<PersonalIdentity> implements IPersonalIdentityRepository {


    async findPersonalIdentity(): Promise<PersonalIdentity | null> {
        const personalIdentities: PersonalIdentity[] = await this.find({take: 1});
        if (personalIdentities.length < 1)
            return null;
        return personalIdentities[0];
    }

    async savePersonalIdentity(identity: PersonalIdentity): Promise<PersonalIdentity> {
        return await this.save(identity);
    }
}
