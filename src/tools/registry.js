const TOOLS = [
  { id: "workspace.search", surface: "local", sideEffects: false, risk: "low" },
  { id: "calendar.read", surface: "native", sideEffects: false, risk: "low" },
  { id: "notifications.send", surface: "native", sideEffects: true, risk: "medium" },
  { id: "browser.lookup", surface: "web", sideEffects: false, risk: "medium" },
];

export class ToolRegistry {
  constructor() {
    this.byId = new Map(TOOLS.map((tool) => [tool.id, tool]));
  }

  list() {
    return Array.from(this.byId.values());
  }

  get(id) {
    return this.byId.get(id) || null;
  }
}