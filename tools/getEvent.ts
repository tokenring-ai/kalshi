import Agent from "@tokenring-ai/agent/Agent";
import {TokenRingToolDefinition} from "@tokenring-ai/chat/schema";
import {z} from "zod";
import KalshiService from "../KalshiService.ts";

const name = "kalshi_getEvent";

async function execute(
  {ticker}: z.infer<typeof inputSchema>,
  agent: Agent,
): Promise<{event?: any}> {
  const kalshi = agent.requireServiceByType(KalshiService);

  if (!ticker) {
    throw new Error(`[${name}] ticker is required`);
  }

  agent.infoLine(`[kalshiGetEvent] Fetching event: ${ticker}`);
  const event = await kalshi.getEvent(ticker);
  return {event};
}

const description = "Get a specific Kalshi event by ticker.";

const inputSchema = z.object({
  ticker: z.string().min(1).describe("Event ticker"),
});

export default {
  name, description, inputSchema, execute,
} satisfies TokenRingToolDefinition<typeof inputSchema>;
