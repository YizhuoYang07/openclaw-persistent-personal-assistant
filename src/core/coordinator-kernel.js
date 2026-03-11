export class CoordinatorKernel {
  constructor({ interactionKernel, specialistRegistry, toolOrchestrator, memoryGovernor, deliveryController, toolAuditLog, memoryReviewQueue }) {
    this.interactionKernel = interactionKernel;
    this.specialistRegistry = specialistRegistry;
    this.toolOrchestrator = toolOrchestrator;
    this.memoryGovernor = memoryGovernor;
    this.deliveryController = deliveryController;
    this.toolAuditLog = toolAuditLog;
    this.memoryReviewQueue = memoryReviewQueue;
  }

  evaluate({ message, ambientContext = {}, sessionId = null }) {
    const interaction = this.interactionKernel.evaluate(message);
    const specialists = this.specialistRegistry.select({
      mode: interaction.mode,
      executionPath: interaction.executionPath,
      message,
    });
    const tools = this.toolOrchestrator.selectTools(message, interaction.mode);
    const memoryCandidates = this.memoryGovernor.evaluate(message);
    const toolAuditEntries = this.toolAuditLog
      ? this.toolAuditLog.recordPlannedTools({ sessionId, message, tools })
      : [];
    const memoryReviewItems = this.memoryReviewQueue
      ? this.memoryReviewQueue.enqueueCandidates({ sessionId, candidates: memoryCandidates })
      : [];

    const payload = {
      interaction,
      specialists,
      tools,
      memoryCandidates,
      toolAuditEntries,
      memoryReviewItems,
      ambientContext: sanitizeAmbientContext(ambientContext),
      privacyNotes: [
        "No secrets or raw personal history should be persisted by default.",
        "Memory candidates require human review or repeat observation before promotion.",
      ],
      nextActions: buildNextActions(interaction, specialists, tools, memoryCandidates),
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

function buildNextActions(interaction, specialists, tools, memoryCandidates) {
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
  if (memoryCandidates.length > 0) {
    actions.push("Route memory candidates into a review queue before promoting any long-term memory.");
  }
  if (actions.length === 0) {
    actions.push("Reply directly with a concise, unified Jarvis-facing answer.");
  }

  return actions;
}