import {EduCommonIdentityDto} from '../network/edu-common-identity.dto';
import {objectWithoutKeys} from '../../utils/dictionary.utils';
import {CommonIdentity} from '../../entities/identity/common-identity.entity';
import {IsDateString, IsNotEmpty, IsNumber, IsString} from 'class-validator';

export class NmsCommonIdentityDto {
    @IsNumber()
    id?: number;

    @IsString()
    @IsNotEmpty()
    entityHash?: string;

    @IsString()
    @IsNotEmpty()
    publicKey: string;

    @IsString()
    @IsNotEmpty()
    legalIdentity: string;

    @IsNumber()
    version?: number;

    @IsString()
    @IsNotEmpty()
    host: string;

    @IsNumber()
    port: number;

    @IsDateString()
    @IsNotEmpty()
    joinedDate: Date;

    promoterLegalIdentity?: string;
    promoterSignature: string;
    promoterPublicKey: string;

    @IsString()
    @IsNotEmpty()
    validatorSignature: string;

    @IsString()
    @IsNotEmpty()
    validatorPublicKey: string;
}

export class NmsCommonIdentityDtoMapper {
    public static mapToEduDto(nms: NmsCommonIdentityDto): EduCommonIdentityDto {
        const edu = new EduCommonIdentityDto();
        const nmsTrimmed = objectWithoutKeys(nms, ['entityHash', 'version']);
        Object.assign(edu, nmsTrimmed);
        return edu;
    }

    public static mapToEduEntity(nms: NmsCommonIdentityDto): CommonIdentity {
        const entity = new CommonIdentity();
        Object.assign(entity, nms);
        return entity;
    }
}
