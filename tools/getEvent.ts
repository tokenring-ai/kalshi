import Agent from "@tokenring-ai/agent/Agent";
import {TokenRingToolDefinition, type TokenRingToolJSONResult} from "@tokenring-ai/chat/schema";
import {z} from "zod";
import KalshiService from "../KalshiService.ts";

const name = "kalshi_getEvent";
const displayName = "Kalshi/getEvent";

async function execute(
  {ticker}: z.output<typeof inputSchema>,
  agent: Agent,
): Promise<TokenRingToolJSONResult<{event?: any}>> {
  const kalshi = agent.requireServiceByType(KalshiService);

  if (!ticker) {
    throw new Error(`[${name}] ticker is required`);
  }

  agent.infoMessage(`[kalshiGetEvent] Fetching event: ${ticker}`);
  const event = await kalshi.getEvent(ticker);
  return {
    type: "json",
    data: {event}
  };
}

const description = "Get a specific Kalshi event by ticker.";

const inputSchema = z.object({
  ticker: z.string().min(1).describe("Event ticker"),
});

export default {
  name, displayName, description, inputSchema, execute,
} satisfies TokenRingToolDefinition<typeof inputSchema>;
