import { readConfig } from "./config.js";
import { InteractionKernel } from "./core/interaction-kernel.js";
import { ToolOrchestrator } from "./core/tool-orchestrator.js";
import { MemoryGovernor } from "./core/memory-governor.js";
import { DeliveryController } from "./core/delivery-controller.js";
import { CoordinatorKernel } from "./core/coordinator-kernel.js";
import { SessionStore } from "./core/session-store.js";
import { ChannelRegistry } from "./channels/registry.js";
import { SpecialistRegistry } from "./specialists/registry.js";
import { ToolRegistry } from "./tools/registry.js";
import { createServer } from "./server.js";

const config = readConfig();
const specialistRegistry = new SpecialistRegistry();
const toolRegistry = new ToolRegistry();
const channelRegistry = new ChannelRegistry();
const sessionStore = new SessionStore();
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
  channelRegistry,
  sessionStore,
  authToken: config.apiAuthToken,
});

server.listen(config.port, config.host, () => {
  console.log(`reference assistant listening on http://${config.host}:${config.port}`);
});