import {NewNetworkMemberDto} from "../new-network-member.dto";
import {NetworkMapEntity} from "../../../entities/network-map/network-map.entity";
import {NetworkMemberDto} from "../network-member.dto";
import {objectWithoutKeys} from "../../../utils/dictionary.utils";

export class NetworkMapEntityMapper {
    public static toEntity(newNetworkMemberDto: NewNetworkMemberDto): NetworkMapEntity {
        const networkMapEntity = new NetworkMapEntity();
        networkMapEntity.publicKey = newNetworkMemberDto.publicKey;
        networkMapEntity.legalIdentity = newNetworkMemberDto.legalIdentity;
        networkMapEntity.host = newNetworkMemberDto.host;
        networkMapEntity.port = newNetworkMemberDto.port;
        networkMapEntity.joinedDate = newNetworkMemberDto.joinedDate;
        if (newNetworkMemberDto.proof) {
            networkMapEntity.promoterPublicKey = newNetworkMemberDto.proof.publicKey;
            networkMapEntity.promoterSignature = newNetworkMemberDto.proof.signature;
        }
        const sortedNetworkMapEntity = new NetworkMapEntity();
        Object.assign(sortedNetworkMapEntity, objectWithoutKeys(networkMapEntity, []));
        return sortedNetworkMapEntity;
    }

    public static toDto(entity: NetworkMapEntity): NetworkMemberDto {
        const dto = new NetworkMemberDto();
        Object.assign(dto, objectWithoutKeys(entity, []));
        return dto;
    }
}
