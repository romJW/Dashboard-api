import { IsEmail, IsString } from "class-validator";
export class UserLoginDto {
@IsEmail({},{message:"неверно указан пароль"})
   email:string;

@IsString()
    password:string;
    
}