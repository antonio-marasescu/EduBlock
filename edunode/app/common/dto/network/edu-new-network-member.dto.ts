import {IsNotEmpty, IsNumber, IsString} from "class-validator";

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
}
