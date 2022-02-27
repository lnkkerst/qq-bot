import { Bot, BotSetting } from "./types/Bot";
import { Logger } from "mirai-ts";
import { isMsgEqual, readSetting } from "../share/utils";
import { exit } from "process";
import { MessageType } from "mirai-ts";
import { Dictionary } from "typescript-collections";

const logger = new Logger({ prefix: "[Init]", type: true });
let botSetting: BotSetting;

logger.info("读取 bot 配置文件");
try {
    botSetting = readSetting("botSetting.yml", __dirname);
} catch (_e: unknown) {
    const e = _e as Error;
    logger.error(e.message);
    exit(1);
}

let msgCache = new Dictionary<String, MessageType.ChatMessage[]>();
const bot = new Bot(botSetting);
logger.info(botSetting.admin);
bot.api.sendFriendMessage("bot 已上线", botSetting.admin);
bot.on("message", (msg: MessageType.ChatMessage) => {
    let from: string;
    if (msg.type === "GroupMessage") {
        from = "g" + msg.sender.group.id.toString();
    } else {
        from = "u" + msg.sender.id.toString();
    }
    if (msgCache.containsKey(from)) {
        let msgSet = msgCache.getValue(from) as MessageType.ChatMessage[];
        msgSet.push(msg);
        if (msgSet.length > 3) {
            msgSet.shift();
        }
        if (msgSet.length == 3 && Math.random() > 0.5) {
            let isSame: boolean = true;
            msgSet.forEach((element: MessageType.ChatMessage) => {
                if (!isMsgEqual(element, msg)) {
                    isSame = false;
                }
            });
            if (isSame) {
                msgSet.splice(0);
                logger.info("repeating...");
                // logger.info(msg.messageChain);
                msg.reply(msg.messageChain);
            }
        }
    } else {
        msgCache.setValue(from, [msg]);
    }
});

bot.listen();