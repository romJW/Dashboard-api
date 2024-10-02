import { IsEmail,IsString } from "class-validator";

export class UserRegisterDto {
    @IsEmail({},{message:"Неверно указан email"})
    email:string;

    @IsString({message:"не указан пароль"})
    password:string;
   
    @IsString({message:"не указано имя"})
    name:string;
}