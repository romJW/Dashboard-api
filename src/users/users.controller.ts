import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../common/base.controller';
import { LoggerService } from '../logger/logger.service';
import { HTTPError } from '../errors/http-error.class';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import 'reflect-metadata';
import { IUserController } from './user.contoller.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { ValidateMiddleWare } from '../common/validate.middleware';
import { sign } from 'jsonwebtoken';
import { IConfigService } from '../config/config.service.interface';
import { IUserService } from './users.service.interface';
import { AuthGuard } from '../common/auth.guard';


@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger 
		) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: IUserService,
		@inject(TYPES.ConfigService) private configService: IConfigService ,
			)	
		 {
		super(loggerService);
		this.bindRoutes([
			{ path: '/register', method: 'post', func: this.register, middlewares:[new ValidateMiddleWare(UserRegisterDto)] },
			{ path: '/login', method: 'post', func: this.login, middlewares:[new ValidateMiddleWare(UserLoginDto)] },
			{ path: '/info', method: 'get', func: this.info, middlewares:[ new AuthGuard()] },

		]);
	}

	async login(req: Request<{},{},UserLoginDto>, res: Response, next: NextFunction): Promise<void> {
		const result = await this.userService.validateUser(req.body);
		if (!result){
			return next(new HTTPError(401, 'Ошибка авторизации'));
		}
		const jwt = await this.signJWT(req.body.email,"ssd")
		this.ok(res,{jwt});
	}

	async register({body}: Request<{},{},UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
		const result = await this.userService.createUser(body);
		if (!result){
			return next(new HTTPError(422,"Такой пользователь уже существует!"))
		}
		this.ok(res,{email: result.email, id:result.id});
	}
	async info({user}: Request<{},{},UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
		const userInfo = await this.userService.getUserInfo(user);
		this.ok(res,{email: userInfo?.email,id:userInfo?.id});
	}
	private signJWT(email:string,secret:string):Promise<string> {
	return new Promise<string> ((resolve, reject) =>{
		sign({
			email,
			iat:Math.floor(Date.now() / 1000)},
			secret,
{algorithm:"HS256"},
 (err,token) => {
		if (err){
		reject(err);
		}
		resolve(token as string);
		})
		})
	}
	}
