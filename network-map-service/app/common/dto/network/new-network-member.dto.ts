import {IsDateString, IsNotEmpty, IsNumber, IsString} from "class-validator";
import {ProofDto} from "../common/proof.dto";

export class NewNetworkMemberDto {
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
    addedDate: string;

    @IsNotEmpty()
    proof: ProofDto;
}
