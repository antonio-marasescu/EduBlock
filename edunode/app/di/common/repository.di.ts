import {DIInterface} from "../di.interface";
import {Container} from "typedi";
import {IPersonalIdentityRepositoryToken} from "../../common/repositories/identity/personal-identity.interface.repository";
import {PersonalIdentityRepository} from "../../common/repositories/identity/personal-identity.repository";
import {getCustomRepository} from "typeorm";
import {ICommonIdentityRepositoryToken} from "../../common/repositories/identity/common-identity.interface.repository";
import {CommonIdentityRepository} from "../../common/repositories/identity/common-identity.repository";

export default class RepositoryDI implements DIInterface {

    inject(_: any): void {
        Container.set(IPersonalIdentityRepositoryToken, getCustomRepository(PersonalIdentityRepository));
        Container.set(ICommonIdentityRepositoryToken, getCustomRepository(CommonIdentityRepository));
    }
}
