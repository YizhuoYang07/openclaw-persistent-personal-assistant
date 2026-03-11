import { randomUUID } from "node:crypto";

export class ToolAuditLog {
  constructor() {
    this.entries = [];
  }

  list(limit = 100) {
    return this.entries.slice(0, limit);
  }

  recordPlannedTools({ sessionId = null, message = "", tools = [] }) {
    const created = [];

    for (const tool of tools) {
      const entry = {
        id: randomUUID(),
        type: "planned",
        toolId: tool.id,
        risk: tool.risk || "unknown",
        sideEffects: Boolean(tool.sideEffects),
        sessionId,
        messagePreview: String(message).slice(0, 160),
        status: "pending_review",
        createdAt: new Date().toISOString(),
      };

      this.entries.unshift(entry);
      created.push(entry);
    }

    return created;
  }

  updateStatus(entryId, status, note = null) {
    const entry = this.entries.find((item) => item.id === entryId);
    if (!entry) {
      const error = new Error("audit entry not found");
      error.statusCode = 404;
      throw error;
    }

    entry.status = status;
    entry.reviewedAt = new Date().toISOString();
    entry.note = note;
    return entry;
  }
}