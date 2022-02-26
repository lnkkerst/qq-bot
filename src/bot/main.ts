import { Adapter, Mirai } from "mirai-ts";
import type { MiraiApiHttpSetting } from "mirai-ts";
import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import "dotenv/config";

const qq = 3206453990;
// setting 可直接读取 setting.yml 或参考 `src/types/setting.ts`
const setting: MiraiApiHttpSetting = yaml.load(
  fs.readFileSync(
    path.resolve(__dirname, "./setting.yml"),
    "utf8"
  )
) as MiraiApiHttpSetting;

const mirai = new Mirai(setting);

async function app() {
  await mirai.link(qq);
  mirai.on("message", (msg: any) => {
    console.log(msg);
    // 复读
    msg.reply(msg.messageChain);
  });
  mirai.listen();
}

app();