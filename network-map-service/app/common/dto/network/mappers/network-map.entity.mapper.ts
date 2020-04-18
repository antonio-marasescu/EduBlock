import {NewNetworkMemberDto} from "../new-network-member.dto";
import {NetworkMapEntity} from "../../../entities/network-map/network-map.entity";
import {NetworkMemberDto} from "../network-member.dto";

export class NetworkMapEntityMapper {
    public static toEntity(newNetworkMemberDto: NewNetworkMemberDto): NetworkMapEntity {
        const networkMapEntity = new NetworkMapEntity();
        networkMapEntity.publicKey = newNetworkMemberDto.publicKey;
        networkMapEntity.legalIdentity = newNetworkMemberDto.legalIdentity;
        networkMapEntity.host = newNetworkMemberDto.host;
        networkMapEntity.port = newNetworkMemberDto.port;
        networkMapEntity.joinedDate = newNetworkMemberDto.joinedDate;
        networkMapEntity.promoterPublicKey = newNetworkMemberDto.proof.publicKey;
        networkMapEntity.promoterSignature = newNetworkMemberDto.proof.signature;
        return networkMapEntity;
    }

    public static toDto(entity: NetworkMapEntity): NetworkMemberDto {
        const dto = new NetworkMemberDto();
        Object.assign(dto, entity);
        return dto;
    }
}
