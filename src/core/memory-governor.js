export class MemoryGovernor {
  evaluate(message) {
    const normalized = String(message || "").trim();
    if (!normalized) {
      return [];
    }

    const candidates = [];

    if (/\b(i am|i'm|my goal is|i want to|i need to)\b/i.test(normalized)) {
      candidates.push({
        type: "profile_or_goal",
        confidence: "medium",
        text: normalized,
        retention: "candidate_only",
      });
    }

    if (/\bevery|usually|always|often\b/i.test(normalized)) {
      candidates.push({
        type: "behavior_pattern",
        confidence: "low",
        text: normalized,
        retention: "needs_repeat_observation",
      });
    }

    return candidates;
  }
}