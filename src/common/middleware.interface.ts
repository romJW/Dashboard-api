import {Request, Response,NextFunction } from "express";


export interface IMiddleWare{
    execute:(req:Request, res:Response, next:NextFunction)=>void;
}