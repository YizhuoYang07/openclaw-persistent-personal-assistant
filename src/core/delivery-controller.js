export class DeliveryController {
  build(payload) {
    return {
      contract: "single_visible_delivery",
      summary: buildSummary(payload),
      response_outline: [
        `interaction_mode: ${payload.interaction.mode}`,
        `execution_path: ${payload.interaction.executionPath}`,
        `selected_specialists: ${payload.specialists.map((item) => item.id).join(", ") || "none"}`,
        `selected_tools: ${payload.tools.map((item) => item.id).join(", ") || "none"}`,
      ],
    };
  }
}

function buildSummary(payload) {
  return `Use ${payload.interaction.executionPath} handling for a ${payload.interaction.mode} request with one outward-facing Jarvis response.`;
}