import {DIInterface} from "../di.interface";
import {Container} from "typedi";
import {INetworkMapRepositoryToken} from "../../common/repositories/network-map/network-map.interface.repository";
import {getCustomRepository} from "typeorm";
import {NetworkMapRepository} from "../../common/repositories/network-map/network-map.repository";

export default class RepositoryDI implements DIInterface {

    inject(_: any): void {
        Container.set(INetworkMapRepositoryToken, getCustomRepository(NetworkMapRepository));
    }
}
