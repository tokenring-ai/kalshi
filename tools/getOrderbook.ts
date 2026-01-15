import Agent from "@tokenring-ai/agent/Agent";
import {TokenRingToolDefinition} from "@tokenring-ai/chat/schema";
import {z} from "zod";
import KalshiService from "../KalshiService.ts";

const name = "kalshi_getOrderbook";

async function execute(
  {ticker}: z.infer<typeof inputSchema>,
  agent: Agent,
): Promise<{orderbook?: any}> {
  const kalshi = agent.requireServiceByType(KalshiService);

  if (!ticker) {
    throw new Error(`[${name}] ticker is required`);
  }

  agent.infoMessage(`[kalshiGetOrderbook] Fetching orderbook: ${ticker}`);
  const orderbook = await kalshi.getOrderbook(ticker);
  return {orderbook};
}

const description = "Get the orderbook (bids) for a specific Kalshi market.";

const inputSchema = z.object({
  ticker: z.string().min(1).describe("Market ticker"),
});

export default {
  name, description, inputSchema, execute,
} satisfies TokenRingToolDefinition<typeof inputSchema>;
