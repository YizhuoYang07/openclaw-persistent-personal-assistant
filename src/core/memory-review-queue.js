import { randomUUID } from "node:crypto";

export class MemoryReviewQueue {
  constructor() {
    this.items = [];
  }

  list(status = null) {
    return this.items.filter((item) => !status || item.status === status);
  }

  enqueueCandidates({ sessionId = null, candidates = [] }) {
    const created = [];

    for (const candidate of candidates) {
      const item = {
        id: randomUUID(),
        sessionId,
        status: "pending_review",
        createdAt: new Date().toISOString(),
        candidate,
      };
      this.items.unshift(item);
      created.push(item);
    }

    return created;
  }

  review(itemId, decision, note = null) {
    const item = this.items.find((entry) => entry.id === itemId);
    if (!item) {
      const error = new Error("memory review item not found");
      error.statusCode = 404;
      throw error;
    }

    item.status = decision;
    item.reviewedAt = new Date().toISOString();
    item.note = note;
    return item;
  }
}