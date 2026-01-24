import {TokenRingPlugin} from "@tokenring-ai/app";
import {ChatService} from "@tokenring-ai/chat";
import {z} from "zod";
import KalshiService, {KalshiConfigSchema} from "./KalshiService.ts";
import packageJSON from './package.json' with {type: 'json'};

import tools from "./tools.ts";

const packageConfigSchema = z.object({
  kalshi: KalshiConfigSchema.optional()
});

export default {
  name: packageJSON.name,
  version: packageJSON.version,
  description: packageJSON.description,
  install(app, config) {
    if (config.kalshi) {
      app.waitForService(ChatService, chatService =>
        chatService.addTools(tools)
      );
      app.addServices(new KalshiService(config.kalshi));
    }
  },
  config: packageConfigSchema
} satisfies TokenRingPlugin<typeof packageConfigSchema>;
