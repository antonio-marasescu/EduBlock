import {DIInterface} from "../di.interface";
import {Container} from "typedi";
import {getCustomRepository} from "typeorm";
import {IPersonalIdentityRepositoryToken} from "../../common/repositories/identity/personal-identity.interface.repository";
import {PersonalIdentityRepository} from "../../common/repositories/identity/personal-identity.repository";
import {ISignatureRepositoryToken} from "../../common/repositories/signatures/signature.interface.repository";
import {SignatureRepository} from "../../common/repositories/signatures/signature.repository";

export default class RepositoryDI implements DIInterface {

    inject(_: any): void {
        Container.set(IPersonalIdentityRepositoryToken, getCustomRepository(PersonalIdentityRepository));
        Container.set(ISignatureRepositoryToken, getCustomRepository(SignatureRepository));
    }
}
