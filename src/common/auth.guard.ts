import { IMiddleWare } from "./middleware.interface";
import {Request, Response,NextFunction } from "express";

export class AuthGuard implements IMiddleWare {
execute(req:Request, res:Response, next:NextFunction):void{
    if(req.user){
        return next()
    }
    res.status(401).send({error:" Unathorized"})
}
}