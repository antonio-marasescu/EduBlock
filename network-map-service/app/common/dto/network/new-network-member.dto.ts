import {IsDateString, IsNotEmpty, IsNumber, IsString} from "class-validator";
import {ProofDto} from "../../../../../edunode/app/common/dto/common/proof.dto";

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
    joinedDate: string;

    @IsNotEmpty()
    proof: ProofDto;
}
