import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateClientDto {
    @IsString()
    @IsNotEmpty()
    userNameClient:string;

    @IsEmail()
    @IsOptional()
    emailClient?:string;

    @IsString()
    @IsOptional()
    phoneClient?:string;
}
