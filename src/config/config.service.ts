import { inject,injectable } from "inversify";
import { ILogger } from "../logger/logger.interface";
import { TYPES } from "../types";
import { IConfigService } from "./config.service.interface";
import { DotenvConfigOutput, DotenvParseOutput, config } from "dotenv";

@injectable()
export class ConfigService implements IConfigService {
    private config: DotenvParseOutput;
    constructor(@inject(TYPES.ILogger) private logger: ILogger){
        const result:DotenvConfigOutput = config()
        if (result.error){
            this.logger.error("[ConfigService] не удалось прочитать файл или он отсутсвует")
        }else{
            this.logger.log("[ConfigService] Конфигурация .env загружена")
            this.config = result.parsed as DotenvParseOutput;
        }
    }
    get(key:string):string{
        return this.config[key] as string;
    }
}