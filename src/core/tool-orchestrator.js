const TOOL_RULES = [
  { id: "workspace.search", terms: ["find", "search", "workspace", "file", "folder"], risk: "low" },
  { id: "calendar.read", terms: ["calendar", "schedule", "meeting", "today"], risk: "low" },
  { id: "notifications.send", terms: ["notify", "remind", "alert"], risk: "medium" },
  { id: "browser.lookup", terms: ["lookup", "website", "web", "browser"], risk: "medium" },
];

export class ToolOrchestrator {
  constructor(toolRegistry) {
    this.toolRegistry = toolRegistry;
  }

  selectTools(message, mode) {
    const normalized = String(message || "").toLowerCase();
    const tools = TOOL_RULES
      .filter((rule) => rule.terms.some((term) => normalized.includes(term)))
      .map((rule) => this.toolRegistry.get(rule.id))
      .filter(Boolean);

    if (mode === "environment" && tools.length === 0) {
      const fallback = this.toolRegistry.get("workspace.search");
      return fallback ? [fallback] : [];
    }

    return tools;
  }
}