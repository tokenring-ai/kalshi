import type Agent from "@tokenring-ai/agent/Agent";
import type { TokenRingToolDefinition, TokenRingToolResult } from "@tokenring-ai/chat/schema";
import { z } from "zod";
import KalshiService from "../KalshiService.ts";

const name = "kalshi_getMarkets";
const displayName = "Kalshi/getMarkets";

async function execute({ series_ticker, status, limit, cursor }: z.output<typeof inputSchema>, agent: Agent): Promise<TokenRingToolResult> {
  const kalshi = agent.requireServiceByType(KalshiService);

  agent.infoMessage(`[${name}] Fetching markets`);
  const markets = await kalshi.getMarkets({
    series_ticker,
    status,
    limit,
    cursor,
  });
  return JSON.stringify(markets);
}

const description = "Get Kalshi markets with optional filtering by series, status, and pagination.";

const inputSchema = z.object({
  series_ticker: z.string().exactOptional().describe("Filter by series ticker"),
  status: z.string().exactOptional().describe("Filter by status (e.g., 'open', 'closed')"),
  limit: z.number().int().positive().max(200).exactOptional().describe("Number of results (default: 100)"),
  cursor: z.string().exactOptional().describe("Pagination cursor"),
});

export default {
  name,
  displayName,
  description,
  inputSchema,
  execute,
} satisfies TokenRingToolDefinition<typeof inputSchema>;
