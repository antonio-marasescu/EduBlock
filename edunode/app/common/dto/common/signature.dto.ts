import {IsNotEmpty, IsString} from "class-validator";

export class SignatureDto {
    @IsString()
    @IsNotEmpty()
    signature: string;
    
    @IsString()
    @IsNotEmpty()
    publicKey: string;
}
