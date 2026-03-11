import { randomUUID } from "node:crypto";

export class SessionStore {
  constructor() {
    this.sessions = new Map();
  }

  list() {
    return Array.from(this.sessions.values()).sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
  }

  ensureSession(input = {}) {
    if (input.sessionId && this.sessions.has(input.sessionId)) {
      return this.getSession(input.sessionId);
    }

    const session = {
      id: input.sessionId || randomUUID(),
      title: input.title?.trim() || "Untitled session",
      channel: input.channel?.trim() || "direct",
      mode: input.mode?.trim() || "companion",
      status: input.status?.trim() || "active",
      participants: Array.isArray(input.participants) ? input.participants : [],
      tags: Array.isArray(input.tags) ? input.tags : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      eventCount: 0,
    };

    this.sessions.set(session.id, session);
    return session;
  }

  getSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      const error = new Error("session not found");
      error.statusCode = 404;
      throw error;
    }
    return session;
  }

  recordEvent(sessionId) {
    const session = this.getSession(sessionId);
    session.eventCount += 1;
    session.updatedAt = new Date().toISOString();
    return session;
  }

  updateSession(sessionId, patch = {}) {
    const session = this.getSession(sessionId);
    if (typeof patch.title === "string" && patch.title.trim()) {
      session.title = patch.title.trim();
    }
    if (typeof patch.status === "string" && patch.status.trim()) {
      session.status = patch.status.trim();
    }
    if (Array.isArray(patch.tags)) {
      session.tags = patch.tags;
    }
    session.updatedAt = new Date().toISOString();
    return session;
  }
}