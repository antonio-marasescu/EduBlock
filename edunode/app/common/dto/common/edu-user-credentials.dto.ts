import {IsNotEmpty, IsString} from 'class-validator';

export class EduUserCredentialsDto {
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
