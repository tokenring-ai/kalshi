import type { TokenRingService } from "@tokenring-ai/app/types";
import type { JSONValue } from "@tokenring-ai/utility/json/safeParse";
import { JSONValueSchema } from "@tokenring-ai/utility/json/schema";
import { HTTPRetriever } from "@tokenring-ai/utility/http/HTTPRetriever";
import { z } from "zod";

export const KalshiConfigSchema = z.object({
  baseUrl: z.string().exactOptional(),
});

export type KalshiConfig = z.infer<typeof KalshiConfigSchema>;

export type KalshiMarketOptions = {
  series_ticker?: string | undefined;
  status?: string | undefined;
  limit?: number | undefined;
  cursor?: string | undefined;
};

export default class KalshiService implements TokenRingService {
  readonly name = "KalshiService";
  description = "Service for querying Kalshi prediction markets";

  private readonly retriever: HTTPRetriever;

  constructor(config: KalshiConfig = {}) {
    this.retriever = new HTTPRetriever({
      baseUrl: config.baseUrl || "https://api.elections.kalshi.com/trade-api/v2",
      headers: {},
      timeout: 10_000,
    });
  }

  getSeries(ticker: string): Promise<JSONValue> {
    if (!ticker) throw new Error("ticker is required");
    return this.retriever.fetchValidatedJson({
      url: `/series/${ticker}`,
      opts: { method: "GET" },
      schema: JSONValueSchema,
      context: "Kalshi get series",
    });
  }

  getMarkets(opts: KalshiMarketOptions = {}): Promise<JSONValue> {
    const params = new URLSearchParams();
    if (opts.series_ticker) params.set("series_ticker", opts.series_ticker);
    if (opts.status) params.set("status", opts.status);
    if (opts.limit) params.set("limit", String(opts.limit));
    if (opts.cursor) params.set("cursor", opts.cursor);

    const query = params.toString();
    return this.retriever.fetchValidatedJson({
      url: `/markets${query ? `?${query}` : ""}`,
      opts: { method: "GET" },
      schema: JSONValueSchema,
      context: "Kalshi get markets",
    });
  }

  getEvent(ticker: string): Promise<JSONValue> {
    if (!ticker) throw new Error("ticker is required");
    return this.retriever.fetchValidatedJson({
      url: `/events/${ticker}`,
      opts: { method: "GET" },
      schema: JSONValueSchema,
      context: "Kalshi get event",
    });
  }

  getOrderbook(ticker: string): Promise<JSONValue> {
    if (!ticker) throw new Error("ticker is required");
    return this.retriever.fetchValidatedJson({
      url: `/markets/${ticker}/orderbook`,
      opts: { method: "GET" },
      schema: JSONValueSchema,
      context: "Kalshi get orderbook",
    });
  }
}
