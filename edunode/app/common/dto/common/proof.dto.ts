import {IsNotEmpty, IsString} from "class-validator";

export class ProofDto {
    @IsString()
    @IsNotEmpty()
    signature: string;
    
    @IsString()
    @IsNotEmpty()
    publicKey: string;
}
