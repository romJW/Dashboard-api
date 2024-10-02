import { NextFunction, Request, Response } from "express";
import { IMiddleWare } from "./middleware.interface";
import { JwtPayload, verify } from "jsonwebtoken";

export class AuthMiddleware implements IMiddleWare {
    constructor(private secret:string){}
    execute(req: Request, res: Response, next: NextFunction):void {
        if (req.headers.authorization){
            verify(req.headers.authorization.split(" ")[1], this.secret,(err, payload)=>{
                if (err){
                    next()
                }
                else if(payload && this.isJwtPayload(payload)){
                    req.user = payload.email;
                    next();
                }
            })
        }else{
            next()
        }
      
    }
    private isJwtPayload(payload: string | JwtPayload): payload is JwtPayload {
        return (payload as JwtPayload).email !== undefined;
    }
}