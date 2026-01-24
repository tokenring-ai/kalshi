import Agent from "@tokenring-ai/agent/Agent";
import {TokenRingToolDefinition} from "@tokenring-ai/chat/schema";
import {z} from "zod";
import KalshiService from "../KalshiService.ts";

const name = "kalshi_getMarkets";
const displayName = "Kalshi/getMarkets";

async function execute(
  {series_ticker, status, limit, cursor}: z.infer<typeof inputSchema>,
  agent: Agent,
): Promise<{markets?: any}> {
  const kalshi = agent.requireServiceByType(KalshiService);

  agent.infoMessage(`[kalshiGetMarkets] Fetching markets`);
  const markets = await kalshi.getMarkets({series_ticker, status, limit, cursor});
  return {markets};
}

const description = "Get Kalshi markets with optional filtering by series, status, and pagination.";

const inputSchema = z.object({
  series_ticker: z.string().optional().describe("Filter by series ticker"),
  status: z.string().optional().describe("Filter by status (e.g., 'open', 'closed')"),
  limit: z.number().int().positive().max(200).optional().describe("Number of results (default: 100)"),
  cursor: z.string().optional().describe("Pagination cursor"),
});

export default {
  name, displayName, description, inputSchema, execute,
} satisfies TokenRingToolDefinition<typeof inputSchema>;
