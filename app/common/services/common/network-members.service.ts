import {Service, Token} from "typedi";

export const NetworkMembersServiceToken = new Token<NetworkMembersService>('services.network-members');

@Service(NetworkMembersServiceToken)
export class NetworkMembersService {

}
