import {DIInterface} from "../di.interface";

export default class RepositoryDI implements DIInterface {

    inject(_: any): void {
        // Container.set(IPersonalIdentityRepositoryToken, getCustomRepository(PersonalIdentityRepository));
    }
}
