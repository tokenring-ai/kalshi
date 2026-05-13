# @tokenring-ai/kalshi

Kalshi prediction markets integration for Token Ring AI agents. This package provides a service for interacting with the
Kalshi API and tools for AI agents to query market data, series information, events, and orderbooks.

## Overview

The `@tokenring-ai/kalshi` package enables seamless integration with the Kalshi API for querying prediction markets and
events. It is designed specifically for use within the Token Ring AI agent framework, allowing agents to access
real-time prediction market data without authentication.

### Key Features

- **Kalshi Service**: Core service for direct API interactions with Kalshi
- **Agent Tools**: Four pre-built tools for AI workflows:
- `kalshi_getSeries`: Get series information by ticker
- `kalshi_getMarkets`: List and filter markets with pagination
- `kalshi_getEvent`: Retrieve event details by ticker
- `kalshi_getOrderbook`: Get orderbook data for a market
- **TypeScript Support**: Full TypeScript definitions and type safety
- **Input Validation**: Zod schemas for robust input validation
- **Error Handling**: Built-in error handling for invalid inputs
- **Configurable**: Support for custom API base URLs
- **Plugin Architecture**: Integrates seamlessly with Token Ring app ecosystem
- **No Authentication Required**: Access public market data endpoints

## Installation

```bash
bun add @tokenring-ai/kalshi
```

## Features

- Query Kalshi prediction market series by ticker
- List and filter markets with pagination support
- Retrieve detailed event information
- Access market orderbook data (bids only)
- Type-safe API with Zod validation
- Plugin-based integration with Token Ring applications

## Tools

The package provides four tools for AI agent interaction:

| Tool                  | Description                                                                  |
|-----------------------|------------------------------------------------------------------------------|
| `kalshi_getSeries`    | Get information about a Kalshi market series by ticker                       |
| `kalshi_getMarkets`   | Get Kalshi markets with optional filtering by series, status, and pagination |
| `kalshi_getEvent`     | Get a specific Kalshi event by ticker                                        |
| `kalshi_getOrderbook` | Get the orderbook (bids) for a specific Kalshi market                        |

## Configuration

### Environment Variables

This package does not require any environment variables. Configuration is passed via the plugin configuration object.

### Configuration Options

| Option    | Type     | Required | Default                                         | Description             |
|-----------|----------|----------|-------------------------------------------------|-------------------------|
| `baseUrl` | `string` | No       | `https://api.elections.kalshi.com/trade-api/v2` | Base URL for Kalshi API |

### Configuration Example

```yaml
kalshi:
  baseUrl: "https://api.elections.kalshi.com/trade-api/v2"
```

### Plugin Configuration Schema

The plugin accepts a configuration object with optional Kalshi settings:

```typescript
import { z } from "zod";

const packageConfigSchema = z.object({
  kalshi: z.object({
    baseUrl: z.string().exactOptional(),
  }).exactOptional(),
});
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

## License

MIT License - see LICENSE file for details.

## Developer Reference

### Core Components

#### KalshiService (Core Service)

The core service class for Kalshi API interactions. Implements `TokenRingService`.

**Location**: `pkg/kalshi/KalshiService.ts`

**Constructor:**

```typescript
constructor(config?: KalshiConfig)
```

**Parameters:**

- `config.baseUrl` (string, optional): Base URL for Kalshi API (defaults to
  `"https://api.elections.kalshi.com/trade-api/v2"`)

**Properties:**

- `name`: `"KalshiService"` - Service identifier
- `description`: `"Service for querying Kalshi prediction markets"` - Human-readable description

**Methods:**

##### getSeries(ticker: string): Promise

Get series information by ticker.

**Parameters:**

- `ticker` (string): Series ticker (required)

**Returns:** Promise resolving to series object

**Throws:** Error if ticker is empty

**Example:**

```typescript
const kalshi = new KalshiService();
const series = await kalshi.getSeries("KXHIGHNY");
```

##### getMarkets(opts?: KalshiMarketOptions): Promise

List markets with optional filtering.

**Parameters:**

- `opts` (KalshiMarketOptions, optional):
- `series_ticker` (string): Filter by series ticker
- `status` (string): Filter by status (e.g., "open", "closed")
- `limit` (number): Maximum number of results (max 200)
- `cursor` (string): Pagination cursor

**Returns:** Promise resolving to markets response object

**Example:**

```typescript
const kalshi = new KalshiService();
const markets = await kalshi.getMarkets({
  series_ticker: "KXHIGHNY",
  status: "open",
  limit: 10
});
```

##### getEvent(ticker: string): Promise

Retrieve event details by ticker.

**Parameters:**

- `ticker` (string): Event ticker (required)

**Returns:** Promise resolving to event object

**Throws:** Error if ticker is empty

**Example:**

```typescript
const kalshi = new KalshiService();
const event = await kalshi.getEvent("KXHIGHNY-25JAN01");
```

##### getOrderbook(ticker: string): Promise

Get orderbook data for a market.

**Parameters:**

- `ticker` (string): Market ticker (required)

**Returns:** Promise resolving to orderbook object with yes/no bids

**Throws:** Error if ticker is empty

**Example:**

```typescript
const kalshi = new KalshiService();
const orderbook = await kalshi.getOrderbook("KXHIGHNY-25JAN01-T70");
```

### Services

#### KalshiService

The `KalshiService` is a `TokenRingService` that can be required by agents using the `requireServiceByType` method.

**Provider Type:**

```typescript
import KalshiService from "@tokenring-ai/kalshi";

// In an agent context
const kalshi = agent.requireServiceByType(KalshiService);
```

### Tool Definitions

The package exports four tools that can be used by Token Ring agents:

**Location**: `pkg/kalshi/tools.ts`

#### kalshi_getSeries

Get information about a Kalshi market series by ticker.

- **Name**: `kalshi_getSeries`
- **Display Name**: `Kalshi/getSeries`
- **Description**: Get information about a Kalshi market series by ticker.

**Input Schema:**

```typescript
z.object({
  ticker: z.string().min(1).describe("Series ticker (e.g., KXHIGHNY)"),
})
```

#### kalshi_getMarkets

Get Kalshi markets with optional filtering by series, status, and pagination.

- **Name**: `kalshi_getMarkets`
- **Display Name**: `Kalshi/getMarkets`
- **Description**: Get Kalshi markets with optional filtering by series, status, and pagination.

**Input Schema:**

```typescript
z.object({
  series_ticker: z.string().exactOptional().describe("Filter by series ticker"),
  status: z.string().exactOptional().describe("Filter by status (e.g., 'open', 'closed')"),
  limit: z.number().int().positive().max(200).exactOptional().describe("Number of results (default: 100)"),
  cursor: z.string().exactOptional().describe("Pagination cursor"),
})
```

#### kalshi_getEvent

Get a specific Kalshi event by ticker.

- **Name**: `kalshi_getEvent`
- **Display Name**: `Kalshi/getEvent`
- **Description**: Get a specific Kalshi event by ticker.

**Input Schema:**

```typescript
z.object({
  ticker: z.string().min(1).describe("Event ticker"),
})
```

#### kalshi_getOrderbook

Get the orderbook (bids) for a specific Kalshi market.

- **Name**: `kalshi_getOrderbook`
- **Display Name**: `Kalshi/getOrderbook`
- **Description**: Get the orderbook (bids) for a specific Kalshi market.

**Input Schema:**

```typescript
z.object({
  ticker: z.string().min(1).describe("Market ticker"),
})
```

### Usage Examples

#### Basic Service Usage

```typescript
import KalshiService from "@tokenring-ai/kalshi";

const kalshi = new KalshiService({
  baseUrl: "https://api.elections.kalshi.com/trade-api/v2"
});

// Get series information
const series = await kalshi.getSeries("KXHIGHNY");
console.log("Series:", series.series.title);

// List open markets for a series
const markets = await kalshi.getMarkets({
  series_ticker: "KXHIGHNY",
  status: "open",
  limit: 10
});
console.log("Markets:", markets.markets);

// Get event details
const event = await kalshi.getEvent("KXHIGHNY-25JAN01");
console.log("Event:", event.event.title);

// Get orderbook
const orderbook = await kalshi.getOrderbook("KXHIGHNY-25JAN01-T70");
console.log("Orderbook:", orderbook.orderbook);
```

#### Agent Workflow Example

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

#### Pagination Example

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

### Integration

#### Plugin Registration

The package provides a Token Ring plugin that automatically registers the KalshiService and tools:

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

When installed with a Kalshi configuration, the plugin:

1. Creates and registers a `KalshiService` instance
2. Registers all four tools with the `ChatService`

#### Service Registration

You can also manually register the service:

```typescript
import TokenRingApp from "@tokenring-ai/app";
import KalshiService from "@tokenring-ai/kalshi";

const app = new TokenRingApp();

app.addServices(new KalshiService({
  baseUrl: "https://api.elections.kalshi.com/trade-api/v2"
}));
```

#### Tool Registration

Tools are automatically registered when using the plugin. For manual registration:

```typescript
import { ChatService } from "@tokenring-ai/chat";
import tools from "@tokenring-ai/kalshi/tools";

app.waitForService(ChatService, chatService =>
  chatService.addTools(...tools)
);
```

### Testing

Run the test suite:

```bash
bun run test
```

**Test commands:**

- `bun run test` - Run all tests
- `bun run test:watch` - Run tests in watch mode
- `bun run test:coverage` - Run tests with coverage report

**Testing setup:**

The package uses Vitest for testing. Configuration is in `vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["**/*.test.ts"],
    environment: "node",
    globals: true,
    isolate: true,
  },
});
```

### Package Structure

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
└── design/                  # Design documents
    └── quick_start_market_data.md  # Quick start guide for market data access
```

### Dependencies

#### Production Dependencies

- `@tokenring-ai/app` (0.2.0) - Base application framework with service management
- `@tokenring-ai/chat` (0.2.0) - Chat service for agent communication
- `@tokenring-ai/agent` (0.2.0) - Agent orchestration system
- `@tokenring-ai/utility` (0.2.0) - Shared utilities including HTTPRetriever
- `zod` (^4.3.6) - Schema validation

#### Development Dependencies

- `vitest` (^4.1.1) - Testing framework
- `typescript` (^6.0.2) - TypeScript compiler

### Error Handling

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

### Related Components

- **@tokenring-ai/app**: Base application framework
- **@tokenring-ai/agent**: Agent orchestration system
- **@tokenring-ai/chat**: Chat service and tool definitions
- **@tokenring-ai/utility**: HTTP service and utilities

### Quick Start

For a quick start guide on accessing market data without authentication, see
the [Design Document](./design/quick_start_market_data.md).
