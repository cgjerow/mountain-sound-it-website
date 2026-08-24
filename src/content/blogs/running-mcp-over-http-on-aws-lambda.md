---
title: Running MCP Over HTTP on AWS Lambda
description: Host MCP tool servers as request-scoped Lambda functions behind API Gateway—Express, serverless-http, and gateway auth without long-lived processes.
pubDate: 2026-08-23
---

MCP servers are usually long-lived processes. That is a poor fit for an API where every other endpoint is already a Lambda behind API Gateway.

Treat MCP like any other HTTP route instead. Use Express for routing, wrap it with `serverless-http`, and bridge MCP's Node handler into that request cycle. Auth stays at the gateway. Tools register the same way they would in a long-lived process—the process only lives for the duration of the invocation.

## Why this shape

- You already authenticate at the gateway (Cognito or similar). You do not want a second session model for MCP.
- Tools call the same services your REST handlers already use.
- Clients speak Streamable HTTP / JSON-RPC over POST. They expect a URL, not a container to babysit.
- Lambda payload and timeout limits matter—especially for tools that return documents.

## Architecture

```
MCP client
    │  POST /weather-mcp  (Bearer JWT)
    ▼
API Gateway  →  Cognito authorizer
    ▼
Lambda  (Express + serverless-http)
    │  App-level group / scope checks
    │  toNodeHandler(createMcpHandler(...))
    ▼
McpServer  →  registerTool(...)  →  your services
```

Three pieces do the work:

1. **`createMcpHandler`** — builds an `McpServer`, registers tools, returns the MCP request handler.
2. **`toNodeHandler`** — adapts that handler to Node's `(req, res, body)` shape for Express.
3. **`serverless-http`** — turns the Express app into a Lambda entrypoint.

No sticky sessions. Each POST is a full MCP exchange for that invocation.

## Wiring the Lambda

```ts
import express from "express";
import serverless from "serverless-http";
import { toNodeHandler } from "@modelcontextprotocol/node";
import { createWeatherMcpHandler } from "./mcp/Weather";
import { createCrmMcpHandler } from "./mcp/Crm";

const app = express();
app.use(express.json());

app.post("/weather-mcp", (req, res) => {
  if (!callerHasAccess(req.headers, ["weather-readers"])) {
    res.status(401).json({
      error: "invalid_token",
      error_description: "Permission denied.",
    });
    return;
  }

  return toNodeHandler(createWeatherMcpHandler)(req, res, req.body);
});

app.post("/crm-mcp", (req, res) => {
  if (!callerHasAccess(req.headers, ["crm-readers", "admins"])) {
    res.status(401).json({
      error: "invalid_token",
      error_description: "Permission denied.",
    });
    return;
  }

  return toNodeHandler(createCrmMcpHandler)(req, res, req.body);
});

export const lambdaHandler = serverless(app);
```

One Express app can host multiple MCP surfaces as separate routes when tool sets have different audiences or IAM footprints. Or split routes across Lambdas so memory, timeout, and policies match each tool set. Gateway auth alone is not enough if routes need different group membership—enforce that in the route.

In SAM, each surface is a normal `AWS::Serverless::Function`: `POST` on a dedicated path, the same Cognito authorizer as the rest of the API, and memory / timeout / IAM sized to the heaviest tool you expose. Stay under API Gateway's integration timeout.

## Defining tools

Keep domain logic in services. Keep the MCP layer as a thin schema + adapter.

```ts
import {
  McpServer,
  createMcpHandler,
  fromJsonSchema,
} from "@modelcontextprotocol/server";
import { WeatherService } from "../services/WeatherService";

export const createWeatherMcpHandler = createMcpHandler(() => {
  const server = new McpServer({ name: "Weather MCP", version: "1.0.0" });

  server.registerTool(
    "get_forecast",
    {
      title: "Get Forecast",
      description: `
        Returns a short-range forecast for a location.
        Prefer lat/lon when available. If only a city name is known,
        call resolve_location first, then this tool with coordinates.
      `.trim(),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: true,
      },
      inputSchema: fromJsonSchema({
        type: "object",
        additionalProperties: false,
        properties: {
          latitude: { type: "number" },
          longitude: { type: "number" },
          hours: { type: "integer", minimum: 1, maximum: 48 },
        },
        required: ["latitude", "longitude"],
      }),
    },
    async ({ latitude, longitude, hours }) => {
      const weather = new WeatherService();
      const results = await weather.forecast(latitude, longitude, hours ?? 12);

      return {
        structuredContent: { results },
        content: [
          { type: "text", text: `Found ${results.length} forecast periods.` },
        ],
      };
    }
  );

  return server;
});
```

What matters most:

- **Write descriptions for the model**—when to call the tool, what not to assume, how to chain related tools.
- **Tight JSON Schema** (`additionalProperties: false`) to cut garbage arguments.
- **Return `structuredContent` plus a short text summary.**
- **Annotate side effects** (`readOnlyHint`, `destructiveHint`, `openWorldHint`).

Split read and write tools across routes or Lambdas if auth treats them differently.

## Tradeoffs

**You get** the same deploy pipeline, auth, observability, and VPC story as the rest of the API—plus scale without running MCP containers, and clear isolation per tool pack.

**Watch for:**

- **Cold starts**, especially in a VPC under bursty traffic.
- **Payload limits**—prefer search → metadata → signed URL over returning large blobs.
- **Timeouts**—heavy RAG or multi-hop work may need async patterns instead of an inline tool response.
- **No long-lived local state**—in-memory caches are not for correctness.
- **Streaming**—validate what your MCP HTTP transport and API Gateway integration actually support before promising it.

If a client expects multi-turn session state on the server, store it elsewhere (DynamoDB, etc.) or keep each exchange self-contained. For most tool-calling workloads, request-scoped is enough.

## Checklist

1. MCP server + node adapter packages; tool modules separate from handlers.
2. Express route → auth check → `toNodeHandler(createXMcpHandler)`.
3. Export `serverless(app)` as the Lambda handler.
4. SAM: POST path, Cognito authorizer, memory/timeout/IAM sized to the tools.
5. Treat tool descriptions and JSON Schema like a public API contract—the model is the primary consumer.

That is the pattern: MCP as another POST route on infrastructure you already operate.

---

## Additional: auth discovery for MCP clients

Gateway auth answers “is this a valid caller?” App-level group checks answer “is this caller allowed on this MCP surface?”

MCP-aware clients also need a way to discover *how* to authenticate. Two complementary pieces:

1. **Protected resource metadata** at `GET /.well-known/oauth-protected-resource` (unauthenticated)—JSON naming the resource URL, authorization server(s), and supported scopes.
2. **`WWW-Authenticate` on gateway 401s** pointing at that metadata URL, e.g. `Bearer resource_metadata="https://mcp.example.com/.well-known/oauth-protected-resource"`.

In SAM / API Gateway this is usually a MOCK integration for the well-known route plus a `GatewayResponse` for `UNAUTHORIZED`. The MCP Lambda does not have to serve discovery if the gateway owns it.

Scopes on the API method can stay coarse (`openid`) while JWT groups do real authorization. Keep failures consistent: `401` with `invalid_token` / `Permission denied` when the route’s group check fails.
