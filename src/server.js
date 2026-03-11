import http from "node:http";
import { URL } from "node:url";

export function createServer({ coordinator, specialistRegistry, toolRegistry, channelRegistry, sessionStore, toolAuditLog, memoryReviewQueue, authToken }) {
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
          channels: channelRegistry.list(),
          audit_layers: ["tool_audit_log", "memory_review_queue"],
        });
      }

      if (request.method === "GET" && url.pathname === "/v1/tool-audit-log") {
        return sendJson(response, 200, { entries: toolAuditLog.list() });
      }

      if (request.method === "PATCH" && url.pathname.startsWith("/v1/tool-audit-log/")) {
        const entryId = url.pathname.split("/").filter(Boolean)[2];
        const body = await readJson(request);
        return sendJson(response, 200, {
          entry: toolAuditLog.updateStatus(entryId, body.status || "reviewed", body.note || null),
        });
      }

      if (request.method === "GET" && url.pathname === "/v1/memory-review-queue") {
        return sendJson(response, 200, { items: memoryReviewQueue.list(url.searchParams.get("status")) });
      }

      if (request.method === "PATCH" && url.pathname.startsWith("/v1/memory-review-queue/")) {
        const itemId = url.pathname.split("/").filter(Boolean)[2];
        const body = await readJson(request);
        return sendJson(response, 200, {
          item: memoryReviewQueue.review(itemId, body.decision || "approved", body.note || null),
        });
      }

      if (request.method === "GET" && url.pathname === "/v1/channels") {
        return sendJson(response, 200, { channels: channelRegistry.list() });
      }

      if (request.method === "GET" && url.pathname === "/v1/sessions") {
        return sendJson(response, 200, { sessions: sessionStore.list() });
      }

      if (request.method === "POST" && url.pathname === "/v1/sessions") {
        const body = await readJson(request);
        return sendJson(response, 201, { session: sessionStore.ensureSession(body) });
      }

      if (request.method === "PATCH" && url.pathname.startsWith("/v1/sessions/")) {
        const sessionId = url.pathname.split("/").filter(Boolean)[2];
        const body = await readJson(request);
        return sendJson(response, 200, { session: sessionStore.updateSession(sessionId, body) });
      }

      if (request.method === "POST" && url.pathname === "/v1/channels/ingest") {
        const body = await readJson(request);
        const event = channelRegistry.normalizeInboundEvent(body);
        const session = sessionStore.ensureSession({
          sessionId: body.sessionId,
          title: body.sessionTitle || `${event.channel} session`,
          channel: event.channel,
          mode: body.mode,
          participants: [event.senderId],
        });
        sessionStore.recordEvent(session.id);

        const evaluation = coordinator.evaluate({
          message: event.text,
          sessionId: session.id,
          ambientContext: {
            channel: event.channel,
            senderId: event.senderId,
            trustModel: event.trustModel,
          },
        });

        return sendJson(response, 200, {
          event,
          session,
          evaluation,
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