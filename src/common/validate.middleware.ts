import {Request, Response,NextFunction } from "express";
import { IMiddleWare } from "./middleware.interface";
import { ClassConstructor, plainToClass } from "class-transformer";
import { validate } from "class-validator";


export class ValidateMiddleWare implements IMiddleWare{
    constructor ( private classToValidate:ClassConstructor<object>){
        console.log('classToValidate:', this.classToValidate);

    }
    execute({ body }:Request, res:Response, next:NextFunction):void{
        const instance = plainToClass(this.classToValidate,body);
        validate(instance).then((
            errors
        )=>{
            if(errors.length>0){
                res.status(422).send(errors);
            }
            else{
                next()
            }
        })

        
    }
}