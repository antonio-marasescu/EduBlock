import {ProofDto} from "../common/proof.dto";
import {EduNewNetworkMemberDto} from "../network/edu-new-network-member.dto";

export class NmsNewNetworkMemberDto {
    publicKey: string;
    legalIdentity: string;
    host: string;
    port: number;
    joinedDate: string;
    proof: ProofDto;
}


export class NmsNewNetworkMemberMapper {
    public static toDtoNms(edu: EduNewNetworkMemberDto): NmsNewNetworkMemberDto {
        const nms = new NmsNewNetworkMemberDto();
        nms.publicKey = edu.publicKey;
        nms.legalIdentity = edu.legalIdentity;
        nms.host = edu.host;
        nms.port = edu.port;
        return nms;
    }
}
