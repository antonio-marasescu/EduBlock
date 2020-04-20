import {CommonIdentity} from "../../entities/identity/common-identity.entity";
import {objectWithoutKeys} from "../../utils/dictionary.utils";

export class EduCommonIdentityDto {
    id?: number;
    publicKey: string;
    legalIdentity: string;
    host: string;
    port: number;
    joinedDate: Date;
    promoterSignature?: string;
    promoterPublicKey?: string;
    validatorSignature?: string;
    validatorPublicKey?: string;
}

export class EduCommonIdentityDtoMapper {
    public static toDto(entity: CommonIdentity): EduCommonIdentityDto {
        const dto = new EduCommonIdentityDto();
        Object.assign(dto, objectWithoutKeys(entity, ['version', 'entityHash']));
        return dto;
    }
}
