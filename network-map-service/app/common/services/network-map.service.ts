import {Inject, Service, Token} from "typedi";
import {
    INetworkMapRepository,
    INetworkMapRepositoryToken
} from "../repositories/network-map/network-map.interface.repository";
import {NewNetworkMemberDto} from "../dto/network/new-network-member.dto";
import {validate} from "class-validator";
import {ValidationError} from "class-validator/validation/ValidationError";
import {NetworkMapEntityMapper} from "../dto/network/mappers/network-map.entity.mapper";

export const NetworkMapServiceToken = new Token<NetworkMapService>('services.network-map');

@Service(NetworkMapServiceToken)
export class NetworkMapService {
    constructor(@Inject(INetworkMapRepositoryToken) networkMapRepository: INetworkMapRepository) {
    }

    public async getAllNetworkMembers() {
    }

    public async getNetworkMember(publicKey: string) {

    }

    public async addNetworkMember(newMember: NewNetworkMemberDto) {
        const errors: ValidationError[] = await validate(newMember);
        if (errors.length > 0)
            return errors;
        return NetworkMapEntityMapper.fromEntity(newMember);
    }
}
