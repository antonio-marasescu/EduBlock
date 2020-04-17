import {IsDateString, IsNotEmpty, IsNumber, IsString} from "class-validator";
import {SignatureDto} from "../common/signature.dto";

export class EduNewNetworkMemberDto {
    @IsString()
    @IsNotEmpty()
    publicKey: string;

    @IsString()
    @IsNotEmpty()
    legalIdentity: string;

    @IsString()
    @IsNotEmpty()
    host: string;

    @IsNumber()
    @IsNotEmpty()
    port: number;

    @IsDateString()
    @IsNotEmpty()
    joinedDate: string;

    @IsNotEmpty()
    signature: SignatureDto;
}
