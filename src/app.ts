import express, { Express } from 'express';
import { Server } from 'http';
import { LoggerService } from './logger/logger.service';
import { UserController } from './users/users.controller';
import { ExceptionFilter } from './errors/exception.filter';
import { ILogger } from './logger/logger.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';
import { json } from 'body-parser';
import 'reflect-metadata';
import { IConfigService } from './config/config.service.interface';
import { IUserController } from './users/user.contoller.interface';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { PrismaService } from './database/prisma.service';
import { AuthMiddleware } from './common/auth.middleware';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.UserController) private userController: UserController,
		@inject(TYPES.ExceptionFilter) private exceptionFilter: IExceptionFilter,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
	) {
		this.app = express();
		this.port = 8000;
		this.logger = logger;
		this.userController = userController;
		this.exceptionFilter = exceptionFilter;

	}
	useMiddleware():void{
		this.app.use(json())
		const authMiddleware = new AuthMiddleware(this.configService.get('SECRET'))
		this.app.use(authMiddleware.execute.bind(authMiddleware))
	}

	useRoutes(): void {
		this.app.use('/users', this.userController.router);
	}
	useExceptionFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}
	public async init(): Promise<void> {
		this.useMiddleware()
		this.useRoutes();
		this.useExceptionFilters();
		await this.prismaService.connect();
		this.server = this.app.listen(this.port);
		this.logger.log(`Server listening on http://localhost:${this.port}`);
	}
}
