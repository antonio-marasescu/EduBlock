import {DIInterface} from "../di.interface";
import {Container} from "typedi";
import {IPersonalIdentityRepositoryToken} from "../../common/repositories/identity/personal-identity.interface.repository";
import {PersonalIdentityRepository} from "../../common/repositories/identity/personal-identity.repository";
import {getCustomRepository} from "typeorm";

export default class RepositoryDI implements DIInterface {

    inject(_: any): void {
        Container.set(IPersonalIdentityRepositoryToken, getCustomRepository(PersonalIdentityRepository));
    }
}
