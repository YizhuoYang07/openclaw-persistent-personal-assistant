const TOOLS = [
  { id: "workspace.search", surface: "local", sideEffects: false },
  { id: "calendar.read", surface: "native", sideEffects: false },
  { id: "notifications.send", surface: "native", sideEffects: true },
  { id: "browser.lookup", surface: "web", sideEffects: false },
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