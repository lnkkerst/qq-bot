import { Mirai, MiraiApiHttpSetting, Logger } from "mirai-ts";
import { DefaultSerializer, writeHeapSnapshot } from "v8";

export interface BotSetting {
    apiSetting: MiraiApiHttpSetting;
    qqId: number;
    admin: number;
}

export class Bot extends Mirai {
    logger: Logger;
    constructor(botSetting: BotSetting) {
        super(botSetting.apiSetting);
        this.logger = new Logger({ prefix: "[Bot]", type: true });
    }
}

export default Bot;