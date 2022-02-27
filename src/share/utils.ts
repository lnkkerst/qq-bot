import { existsSync, readFileSync } from "fs";
import { Logger, MessageType } from "mirai-ts";
import { resolve } from "path/posix";
import yaml, { load } from "js-yaml";

export function readSetting(name: string, basedir: string = __dirname, type: string = "yaml"): any {
    let filePosition: string;
    if (existsSync(resolve(basedir, "./config", name))) {
        filePosition = resolve(basedir, "./config", name);
    } else if (existsSync(resolve(basedir, "./configDefault", name))) {
        filePosition = resolve(basedir, "./configDefault", name);
        new Logger({ prefix: "[Read setting]", type: true }).warning("未找到用户配置，读取默认配置文件");
    } else {
        new Logger({ prefix: "[Read setting]", type: true }).error("读取配置文件失败，请检查配置文件是否存在");
        throw new Error("读取配置文件时发生错误");
    }
    if (type === "json") {
        return JSON.parse(readFileSync(filePosition, "utf8"));
    }
    return yaml.load(readFileSync(filePosition, "utf8"));
}

export function isMsgEqual(a: MessageType.ChatMessage, b: MessageType.ChatMessage): boolean {
    const cmp = (key: any, value: any): any => {
        if (key === "url") {
            value = "url";
        }
        return value;
    }
    return JSON.stringify(a.messageChain.slice(1), cmp) === JSON.stringify(b.messageChain.slice(1), cmp);
}