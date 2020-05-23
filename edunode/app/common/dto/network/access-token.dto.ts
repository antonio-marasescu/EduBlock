import {IsNotEmpty, IsString} from 'class-validator';

export class AccessTokenDto {
    @IsString()
    @IsNotEmpty()
    token: string;

    @IsString()
    @IsNotEmpty()
    identityPublicKey: string;

    @IsString()
    @IsNotEmpty()
    identitySignature: string;
}
