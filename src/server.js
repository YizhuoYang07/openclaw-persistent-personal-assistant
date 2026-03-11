import http from "node:http";
import { URL } from "node:url";

export function createServer({ coordinator, specialistRegistry, toolRegistry, authToken }) {
  return http.createServer(async (request, response) => {
    try {
      const url = new URL(request.url || "/", "http://localhost");

      if (request.method === "GET" && url.pathname === "/health") {
        return sendJson(response, 200, {
          ok: true,
          auth_enabled: Boolean(authToken),
          architecture: "gateway-coordinator-specialists-tools-memory-governor",
        });
      }

      if (!authorize(request, authToken)) {
        return sendJson(response, 401, { error: "unauthorized" });
      }

      if (request.method === "GET" && url.pathname === "/v1/reference-capabilities") {
        return sendJson(response, 200, {
          interaction_modes: ["companion", "utility", "project", "environment"],
          execution_paths: ["direct", "procedural_executor", "specialist", "deliberation"],
          specialists: specialistRegistry.list(),
          tools: toolRegistry.list(),
        });
      }

      if (request.method === "POST" && url.pathname === "/v1/interaction/evaluate") {
        const body = await readJson(request);
        return sendJson(response, 200, coordinator.evaluate(body));
      }

      return sendJson(response, 404, { error: "not found" });
    } catch (error) {
      return sendJson(response, error.statusCode || 500, { error: error.message || "internal server error" });
    }
  });
}

function authorize(request, authToken) {
  if (!authToken) {
    return true;
  }

  return request.headers.authorization === `Bearer ${authToken}`;
}

async function readJson(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  });
  response.end(JSON.stringify(payload, null, 2));
}