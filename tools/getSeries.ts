import Agent from "@tokenring-ai/agent/Agent";
import {TokenRingToolDefinition, type TokenRingToolJSONResult} from "@tokenring-ai/chat/schema";
import {z} from "zod";
import KalshiService from "../KalshiService.ts";

const name = "kalshi_getSeries";
const displayName = "Kalshi/getSeries";

async function execute(
  {ticker}: z.output<typeof inputSchema>,
  agent: Agent,
): Promise<TokenRingToolJSONResult<{series?: any}>> {
  const kalshi = agent.requireServiceByType(KalshiService);

  if (!ticker) {
    throw new Error(`[${name}] ticker is required`);
  }

  agent.infoMessage(`[kalshiGetSeries] Fetching series: ${ticker}`);
  const series = await kalshi.getSeries(ticker);
  return {
    type: "json",
    data: {series}
  };
}

const description = "Get information about a Kalshi market series by ticker.";

const inputSchema = z.object({
  ticker: z.string().min(1).describe("Series ticker (e.g., KXHIGHNY)"),
});

export default {
  name, displayName, description, inputSchema, execute,
} satisfies TokenRingToolDefinition<typeof inputSchema>;
