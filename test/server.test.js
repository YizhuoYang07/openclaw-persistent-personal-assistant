import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";

import { InteractionKernel } from "../src/core/interaction-kernel.js";
import { ToolOrchestrator } from "../src/core/tool-orchestrator.js";
import { MemoryGovernor } from "../src/core/memory-governor.js";
import { DeliveryController } from "../src/core/delivery-controller.js";
import { CoordinatorKernel } from "../src/core/coordinator-kernel.js";
import { SpecialistRegistry } from "../src/specialists/registry.js";
import { ToolRegistry } from "../src/tools/registry.js";
import { createServer } from "../src/server.js";

test("health endpoint is public", async () => {
  const { server, close } = await startServer();
  const response = await request(server, { method: "GET", path: "/health" });

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.ok, true);

  await close();
});

test("evaluation endpoint enforces bearer token and returns structured plan", async () => {
  const { server, close } = await startServer({ authToken: "test-token" });

  const unauthorized = await request(server, {
    method: "POST",
    path: "/v1/interaction/evaluate",
    body: { message: "Help me debug this architecture issue" },
  });
  assert.equal(unauthorized.statusCode, 401);

  const authorized = await request(server, {
    method: "POST",
    path: "/v1/interaction/evaluate",
    token: "test-token",
    body: { message: "Help me debug this architecture issue" },
  });

  assert.equal(authorized.statusCode, 200);
  assert.equal(authorized.body.interaction.mode, "project");
  assert.equal(authorized.body.interaction.executionPath, "specialist");
  assert.ok(Array.isArray(authorized.body.specialists));
  assert.ok(Array.isArray(authorized.body.nextActions));

  await close();
});

async function startServer(options = {}) {
  const specialistRegistry = new SpecialistRegistry();
  const toolRegistry = new ToolRegistry();
  const coordinator = new CoordinatorKernel({
    interactionKernel: new InteractionKernel(),
    specialistRegistry,
    toolOrchestrator: new ToolOrchestrator(toolRegistry),
    memoryGovernor: new MemoryGovernor(),
    deliveryController: new DeliveryController(),
  });

  const server = createServer({
    coordinator,
    specialistRegistry,
    toolRegistry,
    authToken: options.authToken || null,
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));

  return {
    server,
    close: () => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())),
  };
}

async function request(server, { method, path, body, token }) {
  const address = server.address();
  const payload = body ? JSON.stringify(body) : null;

  return new Promise((resolve, reject) => {
    const req = http.request({
      host: "127.0.0.1",
      port: address.port,
      method,
      path,
      headers: {
        ...(payload ? { "content-type": "application/json", "content-length": Buffer.byteLength(payload) } : {}),
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
    }, (res) => {
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => {
        const raw = Buffer.concat(chunks).toString("utf8");
        resolve({
          statusCode: res.statusCode,
          body: raw ? JSON.parse(raw) : null,
        });
      });
    });

    req.on("error", reject);

    if (payload) {
      req.write(payload);
    }

    req.end();
  });
}