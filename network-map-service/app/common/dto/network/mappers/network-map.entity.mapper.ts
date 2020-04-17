import {NewNetworkMemberDto} from "../new-network-member.dto";
import {NetworkMapEntity} from "../../../entities/network-map/network-map.entity";

export class NetworkMapEntityMapper {
    public static fromEntity(newNetworkMemberDto: NewNetworkMemberDto): NetworkMapEntity {
        const networkMapEntity = new NetworkMapEntity();
        networkMapEntity.publicKey = newNetworkMemberDto.publicKey;
        networkMapEntity.legalIdentity = newNetworkMemberDto.legalIdentity;
        networkMapEntity.host = newNetworkMemberDto.host;
        networkMapEntity.port = newNetworkMemberDto.port;
        networkMapEntity.joinedDate = new Date(newNetworkMemberDto.addedDate);
        networkMapEntity.promoterPublicKey = newNetworkMemberDto.proof.publicKey;
        networkMapEntity.promoterSignature = newNetworkMemberDto.proof.signature;
        return networkMapEntity;
    }
}
