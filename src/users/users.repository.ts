import { inject, injectable } from "inversify";
import { PrismaService } from "../database/prisma.service";
import { IUsersRepository } from "./users.repository.interface";
import { User } from "./ user.entity";
import { UserModel } from "@prisma/client";



@injectable()
export class UsersRepository implements IUsersRepository {
    constructor(@inject(PrismaService) private prismaService: PrismaService) {

}
async create ({email, password, name}: User):Promise<UserModel>{

return this.prismaService.client.userModel.create({
    data:
     {email, password, name}
})
}

async find (email:string):Promise<UserModel | null>{
    return this.prismaService.client.userModel.findFirst({
       where:{
        email
       }
    })
}
}