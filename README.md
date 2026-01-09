# @tokenring-ai/kalshi

Kalshi prediction markets integration for Token Ring AI agents. This package provides a service for interacting with the Kalshi API and tools for AI agents to query market data, series information, events, and orderbooks.

## Overview

The `@tokenring-ai/kalshi` package enables seamless integration with the Kalshi API for querying prediction markets and events. It is designed specifically for use within the Token Ring AI agent framework, allowing agents to access real-time prediction market data without authentication.

### Key Features

- **Kalshi Service**: Core service for direct API interactions with Kalshi
- **Agent Tools**: Four pre-built tools for AI workflows:
  - `kalshi_getSeries`: Get series information by ticker
  - `kalshi_getMarkets`: List and filter markets with pagination
  - `kalshi_getEvent`: Retrieve event details by ticker
  - `kalshi_getOrderbook`: Get orderbook data for a market
- **TypeScript Support**: Full TypeScript definitions and type safety
- **Input Validation**: Zod schemas for robust input validation
- **Error Handling**: Built-in error handling and retry logic
- **Configurable**: Support for custom API base URLs
- **Plugin Architecture**: Integrates seamlessly with Token Ring app ecosystem
- **No Authentication Required**: Access public market data endpoints

## Installation

```bash
bun install @tokenring-ai/kalshi
```

## Chat Commands

This package does not define chat commands. The functionality is exposed through agent tools instead.

## Plugin Configuration

The plugin accepts a configuration object with optional Kalshi settings:

```typescript
interface KalshiPluginConfig {
  kalshi?: {
    baseUrl?: string;  // Kalshi API base URL (default: https://api.elections.kalshi.com/trade-api/v2)
  }
}
```

**Example configuration:**

```typescript
import TokenRingApp from "@tokenring-ai/app";
import kalshiPlugin from "@tokenring-ai/kalshi";

const app = new TokenRingApp();
app.install(kalshiPlugin, {
  kalshi: {
    baseUrl: "https://api.elections.kalshi.com/trade-api/v2"  // Optional, defaults to Kalshi API
  }
});
```

## Tools

The package provides the following tools that can be used by Token Ring agents:

### kalshi_getSeries

Get information about a Kalshi market series by ticker.

**Tool Input Schema:**
```typescript
z.object({
  ticker: z.string().min(1).describe("Series ticker (e.g., KXHIGHNY)"),
})
```

**Example usage:**
```typescript
const result = await agent.executeTool("kalshi_getSeries", {
  ticker: "KXHIGHNY"
});
// Returns: { series: { title, frequency, category, ... } }
```

### kalshi_getMarkets

Get Kalshi markets with optional filtering by series, status, and pagination.

**Tool Input Schema:**
```typescript
z.object({
  series_ticker: z.string().optional().describe("Filter by series ticker"),
  status: z.string().optional().describe("Filter by status (e.g., 'open', 'closed')"),
  limit: z.number().int().positive().max(200).optional().describe("Number of results (default: 100)"),
  cursor: z.string().optional().describe("Pagination cursor"),
})
```

**Example usage:**
```typescript
const result = await agent.executeTool("kalshi_getMarkets", {
  series_ticker: "KXHIGHNY",
  status: "open",
  limit: 10
});
// Returns: { markets: [...] }
```

### kalshi_getEvent

Get a specific Kalshi event by ticker.

**Tool Input Schema:**
```typescript
z.object({
  ticker: z.string().min(1).describe("Event ticker"),
})
```

**Example usage:**
```typescript
const result = await agent.executeTool("kalshi_getEvent", {
  ticker: "KXHIGHNY-25JAN01"
});
// Returns: { event: { title, category, markets, ... } }
```

### kalshi_getOrderbook

Get the orderbook (bids) for a specific Kalshi market.

**Tool Input Schema:**
```typescript
z.object({
  ticker: z.string().min(1).describe("Market ticker"),
})
```

**Example usage:**
```typescript
const result = await agent.executeTool("kalshi_getOrderbook", {
  ticker: "KXHIGHNY-25JAN01-T70"
});
// Returns: { orderbook: { yes: [[price, quantity], ...], no: [[price, quantity], ...] } }
```

## Services

### KalshiService

The core service class for Kalshi API interactions.

**Constructor:**
```typescript
constructor(config?: KalshiConfig)
```

**Parameters:**
- `config.baseUrl` (string, optional): Base URL for Kalshi API (defaults to "https://api.elections.kalshi.com/trade-api/v2")

**Methods:**

#### getSeries(ticker: string): Promise<any>

Get series information by ticker.

**Parameters:**
- `ticker` (string): Series ticker (required)

**Returns:** Promise resolving to series object

#### getMarkets(options?: KalshiMarketOptions): Promise<any>

List markets with optional filtering.

**Parameters:**
- `options` (KalshiMarketOptions, optional):
  - `series_ticker` (string): Filter by series ticker
  - `status` (string): Filter by status (e.g., "open", "closed")
  - `limit` (number): Maximum number of results (default: 100)
  - `cursor` (string): Pagination cursor

**Returns:** Promise resolving to markets array

#### getEvent(ticker: string): Promise<any>

Retrieve event details by ticker.

**Parameters:**
- `ticker` (string): Event ticker (required)

**Returns:** Promise resolving to event object

#### getOrderbook(ticker: string): Promise<any>

Get orderbook data for a market.

**Parameters:**
- `ticker` (string): Market ticker (required)

**Returns:** Promise resolving to orderbook object with yes/no bids

**Example usage:**
```typescript
import KalshiService from "@tokenring-ai/kalshi";

const kalshi = new KalshiService({
  baseUrl: "https://api.elections.kalshi.com/trade-api/v2"
});

// Get series information
const series = await kalshi.getSeries("KXHIGHNY");

// List open markets for a series
const markets = await kalshi.getMarkets({
  series_ticker: "KXHIGHNY",
  status: "open",
  limit: 10
});

// Get event details
const event = await kalshi.getEvent("KXHIGHNY-25JAN01");

// Get orderbook
const orderbook = await kalshi.getOrderbook("KXHIGHNY-25JAN01-T70");
```

## Providers

### KalshiService Provider

The `KalshiService` is a TokenRingService that can be required by agents using the `requireServiceByType` method.

**Provider Type:**
```typescript
import KalshiService from "@tokenring-ai/kalshi";

// In an agent context
const kalshi = agent.requireServiceByType(KalshiService);
```

**Usage in tools:**
```typescript
import Agent from "@tokenring-ai/agent/Agent";
import {z} from "zod";
import KalshiService from "../KalshiService.ts";

async function execute({ticker}: z.infer<typeof inputSchema>, agent: Agent): Promise<any> {
  const kalshi = agent.requireServiceByType(KalshiService);
  const series = await kalshi.getSeries(ticker);
  return {series};
}
```

## RPC Endpoints

This package does not define RPC endpoints.

## State Management

This package does not implement state persistence or restoration.

## Package Structure

```
pkg/kalshi/
├── index.ts                 # Main entry point and plugin export
├── KalshiService.ts         # Core Kalshi API service
├── plugin.ts                # Token Ring plugin integration
├── tools.ts                 # Tool exports
├── tools/
│   ├── getSeries.ts         # Get series tool
│   ├── getMarkets.ts        # Get markets tool
│   ├── getEvent.ts          # Get event tool
│   └── getOrderbook.ts      # Get orderbook tool
├── package.json             # Package metadata and dependencies
├── vitest.config.ts         # Vitest configuration
└── README.md                # This documentation
```

## Testing

Run the test suite:

```bash
bun run test
```

**Test commands:**
- `bun run test` - Run all tests
- `bun run test:watch` - Run tests in watch mode
- `bun run test:coverage` - Run tests with coverage report

## Configuration

### Base URL Configuration

You can configure the service to use different API endpoints:

```typescript
import KalshiService from "@tokenring-ai/kalshi";

// Production API (default)
const kalshi = new KalshiService();

// Custom endpoint
const customKalshi = new KalshiService({
  baseUrl: "https://custom-api.example.com"
});
```

## Error Handling

The service includes comprehensive error handling:

- **Invalid inputs**: Throws descriptive errors for missing required parameters
- **API failures**: Handles HTTP errors and non-OK responses
- **Network issues**: Uses retry logic for transient failures
- **JSON parsing**: Validates and sanitizes API responses

**Error examples:**
```typescript
// Empty ticker throws error
await kalshi.getSeries("");  // Error: "ticker is required"

// Empty ticker throws error
await kalshi.getEvent("");  // Error: "ticker is required"
```

## Examples

### Basic Series and Markets Query

```typescript
import KalshiService from "@tokenring-ai/kalshi";

const kalshi = new KalshiService();

// Get series information
const series = await kalshi.getSeries("KXHIGHNY");
console.log("Series:", series.series.title);

// List open markets for this series
const markets = await kalshi.getMarkets({
  series_ticker: "KXHIGHNY",
  status: "open"
});
console.log("Markets:", markets.markets);
```

### Agent Workflow Example

```typescript
// In a Token Ring agent
async function analyzeMarket(seriesTicker: string) {
  // Get series information
  const seriesResult = await agent.executeTool("kalshi_getSeries", {
    ticker: seriesTicker
  });

  // Get open markets for this series
  const marketsResult = await agent.executeTool("kalshi_getMarkets", {
    series_ticker: seriesTicker,
    status: "open",
    limit: 5
  });

  // Get orderbook for first market
  if (marketsResult.markets?.markets?.length > 0) {
    const firstMarket = marketsResult.markets.markets[0];
    const orderbookResult = await agent.executeTool("kalshi_getOrderbook", {
      ticker: firstMarket.ticker
    });

    return {
      series: seriesResult.series,
      topMarket: firstMarket,
      orderbook: orderbookResult.orderbook
    };
  }

  throw new Error("No markets found");
}
```

### Pagination Example

```typescript
import KalshiService from "@tokenring-ai/kalshi";

const kalshi = new KalshiService();

// Fetch first page
const page1 = await kalshi.getMarkets({
  status: "open",
  limit: 100
});

// Fetch next page using cursor
if (page1.cursor) {
  const page2 = await kalshi.getMarkets({
    status: "open",
    limit: 100,
    cursor: page1.cursor
  });
}
```

## Understanding Kalshi Markets

### Series, Events, and Markets

- **Series**: A recurring question (e.g., "Highest temperature in NYC")
- **Event**: A specific instance of a series (e.g., "January 1, 2025")
- **Market**: A specific outcome within an event (e.g., "Temperature will be 70°F or higher")

### Orderbook Structure

Kalshi orderbooks only return bids (not asks) due to the reciprocal relationship between YES and NO positions. A YES bid at 60¢ is equivalent to a NO ask at 40¢.

## License

MIT License - see [LICENSE](./LICENSE) file for details.
