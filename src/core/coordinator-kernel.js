export class CoordinatorKernel {
  constructor({ interactionKernel, specialistRegistry, toolOrchestrator, memoryGovernor, deliveryController }) {
    this.interactionKernel = interactionKernel;
    this.specialistRegistry = specialistRegistry;
    this.toolOrchestrator = toolOrchestrator;
    this.memoryGovernor = memoryGovernor;
    this.deliveryController = deliveryController;
  }

  evaluate({ message, ambientContext = {} }) {
    const interaction = this.interactionKernel.evaluate(message);
    const specialists = this.specialistRegistry.select({
      mode: interaction.mode,
      executionPath: interaction.executionPath,
      message,
    });
    const tools = this.toolOrchestrator.selectTools(message, interaction.mode);
    const memoryCandidates = this.memoryGovernor.evaluate(message);

    const payload = {
      interaction,
      specialists,
      tools,
      memoryCandidates,
      ambientContext: sanitizeAmbientContext(ambientContext),
      privacyNotes: [
        "No secrets or raw personal history should be persisted by default.",
        "Memory candidates require human review or repeat observation before promotion.",
      ],
      nextActions: buildNextActions(interaction, specialists, tools),
    };

    return {
      ...payload,
      delivery: this.deliveryController.build(payload),
    };
  }
}

function sanitizeAmbientContext(ambientContext) {
  const sanitized = {};

  for (const [key, value] of Object.entries(ambientContext || {})) {
    if (/(token|secret|password|key)/i.test(key)) {
      sanitized[key] = "[redacted]";
      continue;
    }
    sanitized[key] = value;
  }

  return sanitized;
}

function buildNextActions(interaction, specialists, tools) {
  const actions = [];

  if (interaction.executionPath === "procedural_executor") {
    actions.push("Resolve environment context before generating the final answer.");
  }
  if (specialists.length > 0) {
    actions.push("Collect structured specialist outputs and preserve fidelity in the final response.");
  }
  if (tools.length > 0) {
    actions.push("Run tools behind explicit policy and audit boundaries.");
  }
  if (actions.length === 0) {
    actions.push("Reply directly with a concise, unified Jarvis-facing answer.");
  }

  return actions;
}