# @tokenring-ai/kalshi

Kalshi prediction market integration for Token Ring. This package provides a service for interacting with the Kalshi API
and tools for AI agents to query market data, series information, events, and orderbooks.

## Overview

The `@tokenring-ai/kalshi` package enables seamless integration with the Kalshi API for querying prediction markets
and events. It is designed specifically for use within the Token Ring AI agent framework, allowing agents to access
real-time prediction market data without authentication.

This package provides the `KalshiService` for direct API interactions and integrates with the Token Ring plugin
system, registering tools with the `ChatService` for agent use.

## Features

- **KalshiService**: Core service for direct API interactions with Kalshi
- **Agent Tools**: Four pre-built tools for AI workflows
- **TypeScript Support**: Full TypeScript definitions and type safety
- **Input Validation**: Zod schemas for robust input validation
- **Error Handling**: Built-in error handling for invalid inputs
- **Configurable**: Support for custom API base URLs
- **Plugin Architecture**: Integrates seamlessly with Token Ring app ecosystem
- **No Authentication Required**: Access public market data endpoints
- **Pagination Support**: Cursor-based pagination for market listings

## Installation

```bash
bun add @tokenring-ai/kalshi
```

## Chat Commands

This package does not define any chat commands.

## Tools

The package provides four tools for AI agent interaction:

| Tool | Description |
|------|-------------|
| `kalshi_getSeries` | Get information about a Kalshi market series by ticker |
| `kalshi_getMarkets` | Get Kalshi markets with optional filtering by series, status, and pagination |
| `kalshi_getEvent` | Get a specific Kalshi event by ticker |
| `kalshi_getOrderbook` | Get the orderbook (bids) for a specific Kalshi market |

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
// Returns: JSON string of series data
```

### kalshi_getMarkets

Get Kalshi markets with optional filtering by series, status, and pagination.

**Tool Input Schema:**

```typescript
z.object({
  series_ticker: z.string().exactOptional().describe("Filter by series ticker"),
  status: z.string().exactOptional().describe("Filter by status (e.g., 'open', 'closed')"),
  limit: z.number().int().positive().max(200).exactOptional().describe("Number of results (default: 100)"),
  cursor: z.string().exactOptional().describe("Pagination cursor"),
})
```

**Example usage:**

```typescript
const result = await agent.executeTool("kalshi_getMarkets", {
  status: "open",
  limit: 10
});
// Returns: JSON string of markets data
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
// Returns: JSON string of event data
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
// Returns: JSON string of orderbook data
```

## Core Components

### KalshiService

The core service class for Kalshi API interactions. Implements `TokenRingService`.

**Location**: `pkg/kalshi/KalshiService.ts`

**Constructor:**

```typescript
constructor(config?: KalshiConfig)
```

**Parameters:**

- `config.baseUrl` (string, optional): Base URL for Kalshi API (defaults to `https://api.elections.kalshi.com/trade-api/v2`)

**Properties:**

- `name` (string): `"KalshiService"`
- `description` (string): `"Service for querying Kalshi prediction markets"`

**Methods:**

#### getSeries(ticker: string): Promise\<JSONValue\>

Get series information by ticker.

**Parameters:**

- `ticker` (string): Series ticker (required)

**Returns:** Promise resolving to series data

**Throws:** Error if ticker is empty

**API Endpoint:** `GET /series/{ticker}`

#### getMarkets(opts?: KalshiMarketOptions): Promise\<JSONValue\>

List markets with optional filtering.

**Parameters:**

- `opts` (KalshiMarketOptions, optional):
  - `series_ticker` (string): Filter by series ticker
  - `status` (string): Filter by status (e.g., `"open"`, `"closed"`)
  - `limit` (number): Maximum number of results
  - `cursor` (string): Pagination cursor

**Returns:** Promise resolving to markets data

**API Endpoint:** `GET /markets`

#### getEvent(ticker: string): Promise\<JSONValue\>

Retrieve event details by ticker.

**Parameters:**

- `ticker` (string): Event ticker (required)

**Returns:** Promise resolving to event data

**Throws:** Error if ticker is empty

**API Endpoint:** `GET /events/{ticker}`

#### getOrderbook(ticker: string): Promise\<JSONValue\>

Get orderbook data for a market.

**Parameters:**

- `ticker` (string): Market ticker (required)

**Returns:** Promise resolving to orderbook data

**Throws:** Error if ticker is empty

**API Endpoint:** `GET /markets/{ticker}/orderbook`

## Services

### KalshiService Registration

The `KalshiService` is a `TokenRingService` that can be required by agents using the `requireServiceByType` method.

**Service Registration:**

The service is automatically registered when the plugin is installed:

```typescript
import TokenRingApp from "@tokenring-ai/app";
import kalshiPlugin from "@tokenring-ai/kalshi";

const app = new TokenRingApp();
app.install(kalshiPlugin);
```

**Service Access:**

The service can be accessed by agents using the `requireServiceByType` method:

```typescript
import KalshiService from "@tokenring-ai/kalshi";

// In an agent context
const kalshi = agent.requireServiceByType(KalshiService);
```

## Integration

### Plugin Installation

The package integrates with Token Ring through its plugin system:

```typescript
import TokenRingApp from "@tokenring-ai/app";
import kalshiPlugin from "@tokenring-ai/kalshi";

const app = new TokenRingApp();
app.install(kalshiPlugin, {
  kalshi: {
    baseUrl: "https://api.elections.kalshi.com/trade-api/v2"
  }
});
```

When installed, the plugin:

1. Creates and registers a `KalshiService` instance
2. Registers all four tools with the `ChatService`

### Tool Registration

Tools are automatically registered when using the plugin. For manual registration:

```typescript
import { ChatService } from "@tokenring-ai/chat";
import tools from "@tokenring-ai/kalshi/tools";

app.waitForService(ChatService, chatService =>
  chatService.addTools(...tools)
);
```

## Configuration

### Plugin Configuration

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

### Configuration Schema

The configuration is defined using Zod schemas:

```typescript
import { z } from "zod";

export const KalshiConfigSchema = z.object({
  baseUrl: z.string().exactOptional(),
});

export type KalshiConfig = z.infer<typeof KalshiConfigSchema>;
```

### KalshiMarketOptions

Type definition for getMarkets options:

```typescript
export type KalshiMarketOptions = {
  series_ticker?: string | undefined;
  status?: string | undefined;
  limit?: number | undefined;
  cursor?: string | undefined;
};
```

## Schema Documentation

The package exports the following Zod schemas:

### KalshiConfigSchema

Configuration schema for the Kalshi service:

```typescript
export const KalshiConfigSchema = z.object({
  baseUrl: z.string().exactOptional(),
});
```

The `exactOptional()` modifier allows the config to be omitted entirely or passed with an undefined `baseUrl` value.
When omitted or undefined, the default API endpoint is used.

### Tool Input Schemas

#### getSeries

```typescript
z.object({
  ticker: z.string().min(1).describe("Series ticker (e.g., KXHIGHNY)"),
});
```

The `min(1)` constraint ensures the ticker is non-empty. Throws `ToolCallError` if validation fails.

#### getMarkets

```typescript
z.object({
  series_ticker: z.string().exactOptional().describe("Filter by series ticker"),
  status: z.string().exactOptional().describe("Filter by status (e.g., 'open', 'closed')"),
  limit: z.number().int().positive().max(200).exactOptional().describe("Number of results (default: 100)"),
  cursor: z.string().exactOptional().describe("Pagination cursor"),
});
```

All fields use `exactOptional()` to allow omission or undefined values. The `limit` field has constraints: must be
integer, positive, and max 200. No default values are set in the schema; the API uses its own defaults (100). When
all parameters are omitted, returns all markets (paginated).

#### getEvent

```typescript
z.object({
  ticker: z.string().min(1).describe("Event ticker"),
});
```

The `min(1)` constraint ensures the ticker is non-empty. Throws `ToolCallError` if validation fails.

#### getOrderbook

```typescript
z.object({
  ticker: z.string().min(1).describe("Market ticker"),
});
```

The `min(1)` constraint ensures the ticker is non-empty. Throws `ToolCallError` if validation fails.

## State Management

This package does not implement state persistence or restoration. The service is stateless and maintains no internal
state between requests.

## Usage Examples

### Basic Service Usage

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

  // Parse the JSON string result and get orderbook for first market
  const marketsData = JSON.parse(marketsResult);
  if (marketsData.markets?.length > 0) {
    const firstMarket = marketsData.markets[0];
    const orderbookResult = await agent.executeTool("kalshi_getOrderbook", {
      ticker: firstMarket.ticker
    });

    return {
      series: JSON.parse(seriesResult),
      topMarket: firstMarket,
      orderbook: JSON.parse(orderbookResult)
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

// Fetch next page using cursor from response
const page1Data = page1 as { cursor?: string };
if (page1Data.cursor) {
  const page2 = await kalshi.getMarkets({
    status: "open",
    limit: 100,
    cursor: page1Data.cursor
  });
}
```

## Best Practices

### API Usage

- **Ticker Format**: Use exact tickers from Kalshi for accurate lookups
- **Pagination**: Use cursor-based pagination for large result sets (max 200 per request)
- **Filtering**: Use series_ticker and status filters to narrow results
- **Rate Limiting**: Implement delays between requests for production use

### Market Analysis

- **Compare Markets**: Use getMarkets with different filters for comparison
- **Track Series**: Use getSeries to understand market structure
- **Analyze Orderbooks**: Use getOrderbook for market depth analysis
- **Event Research**: Use getEvent for comprehensive event details

### Performance Considerations

- **Caching**: Cache API responses when appropriate to reduce API calls
- **Batch Operations**: Use getMarkets for multiple markets instead of individual calls
- **Error Recovery**: Implement retry logic for transient failures

## Error Handling

The service includes comprehensive error handling:

- **Invalid inputs**: Throws descriptive errors for missing required parameters
- **API failures**: Handles HTTP errors through the `HTTPRetriever`
- **JSON parsing**: Validates and sanitizes API responses using Zod schemas

**Error examples:**

```typescript
// Empty ticker throws error
await kalshi.getSeries("");  // Error: "ticker is required"
await kalshi.getEvent("");   // Error: "ticker is required"
await kalshi.getOrderbook(""); // Error: "ticker is required"

// Valid usage
await kalshi.getSeries("KXHIGHNY"); // OK
```

## Troubleshooting

### API Errors

**Problem**: API requests fail with HTTP errors

**Solution:**

- Verify the baseUrl is correct
- Check network connectivity to Kalshi API
- Ensure the API is not temporarily down
- Check for rate limiting

### Empty Results

**Problem**: getMarkets returns no results

**Solution:**

- Verify the series_ticker is correct
- Check that markets exist for the given filters
- Try without filters to see available markets

### Market Not Found

**Problem**: getOrderbook or getEvent returns error

**Solution:**

- Verify the ticker is correct (check from getMarkets results)
- Ensure the market/event exists
- Check that the ticker matches the API format
- Use getMarkets to find valid tickers

### Configuration Issues

**Problem**: API requests fail with incorrect configuration

**Solution:**

- Verify baseUrl is set correctly
- Check that the URL uses HTTPS
- Test the URL in a browser or curl

## Package Structure

```text
pkg/kalshi/
├── index.ts                 # Main entry point - exports KalshiService
├── KalshiService.ts         # Core Kalshi API service
├── plugin.ts                # Token Ring plugin integration
├── tools.ts                 # Tool exports
├── tools/
│   ├── getEvent.ts          # Get event tool
│   ├── getMarkets.ts        # Get markets tool
│   ├── getOrderbook.ts      # Get orderbook tool
│   └── getSeries.ts         # Get series tool
├── package.json             # Package metadata and dependencies
├── vitest.config.ts         # Vitest configuration
├── README.md                # This documentation
└── LICENSE                  # MIT License
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

**Test configuration:**

The package uses vitest with the following configuration:

- Environment: Node.js
- Globals: Enabled
- Isolation: Enabled
- Test files: `**/*.test.ts`

## Dependencies

### Production Dependencies

- `@tokenring-ai/app` (workspace:*) - Base application framework with service management
- `@tokenring-ai/chat` (workspace:*) - Chat service for agent communication
- `@tokenring-ai/agent` (workspace:*) - Agent orchestration system
- `@tokenring-ai/utility` (workspace:*) - Shared utilities including HTTPRetriever
- `zod` (^4.4.3) - Schema validation

### Development Dependencies

- `vitest` (^4.1.1) - Testing framework
- `typescript` (^6.0.2) - TypeScript compiler

## Related Components

- **@tokenring-ai/app**: Base application framework providing plugin and service architecture
- **@tokenring-ai/agent**: Agent system that uses the Kalshi tools
- **@tokenring-ai/chat**: Chat service that registers the Kalshi tools
- **@tokenring-ai/utility**: Provides HTTPRetriever for API interactions
- **@tokenring-ai/polymarket**: Alternative prediction market integration

## License

MIT License - see [LICENSE](./LICENSE) file for details.
