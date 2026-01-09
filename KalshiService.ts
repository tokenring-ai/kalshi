import {TokenRingService} from "@tokenring-ai/app/types";
import {HttpService} from "@tokenring-ai/utility/http/HttpService";
import {z} from "zod";

export const KalshiConfigSchema = z.object({
  baseUrl: z.string().optional(),
});

export type KalshiConfig = z.infer<typeof KalshiConfigSchema>;

export type KalshiMarketOptions = {
  series_ticker?: string;
  status?: string;
  limit?: number;
  cursor?: string;
};

export default class KalshiService extends HttpService implements TokenRingService {
  name = "KalshiService";
  description = "Service for querying Kalshi prediction markets";

  defaultHeaders = {};
  protected baseUrl: string;

  constructor(config: KalshiConfig = {}) {
    super();
    this.baseUrl = config.baseUrl || "https://api.elections.kalshi.com/trade-api/v2";
  }

  async getSeries(ticker: string): Promise<any> {
    if (!ticker) throw new Error("ticker is required");
    return this.fetchJson(`/series/${ticker}`, {method: "GET"}, "Kalshi get series");
  }

  async getMarkets(opts: KalshiMarketOptions = {}): Promise<any> {
    const params = new URLSearchParams();
    if (opts.series_ticker) params.set("series_ticker", opts.series_ticker);
    if (opts.status) params.set("status", opts.status);
    if (opts.limit) params.set("limit", String(opts.limit));
    if (opts.cursor) params.set("cursor", opts.cursor);

    const query = params.toString();
    return this.fetchJson(`/markets${query ? `?${query}` : ""}`, {method: "GET"}, "Kalshi get markets");
  }

  async getEvent(ticker: string): Promise<any> {
    if (!ticker) throw new Error("ticker is required");
    return this.fetchJson(`/events/${ticker}`, {method: "GET"}, "Kalshi get event");
  }

  async getOrderbook(ticker: string): Promise<any> {
    if (!ticker) throw new Error("ticker is required");
    return this.fetchJson(`/markets/${ticker}/orderbook`, {method: "GET"}, "Kalshi get orderbook");
  }
}
