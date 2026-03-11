const SPECIALISTS = [
  {
    id: "engineering",
    domains: ["code", "debug", "architecture", "implementation", "data"],
    contract: ["conclusion", "rationale", "uncertainties", "suggested_actions"],
  },
  {
    id: "writing",
    domains: ["write", "draft", "edit", "tone", "summary"],
    contract: ["draft_direction", "rationale", "revision_points"],
  },
  {
    id: "strategy",
    domains: ["strategy", "decision", "tradeoff", "career", "priority"],
    contract: ["framing", "options", "risks", "recommended_action"],
  },
  {
    id: "wellbeing",
    domains: ["health", "stress", "habit", "routine"],
    contract: ["observations", "risks", "gentle_next_steps"],
  },
];

export class SpecialistRegistry {
  list() {
    return SPECIALISTS;
  }

  select({ executionPath, message }) {
    if (executionPath !== "specialist" && executionPath !== "deliberation") {
      return [];
    }

    const normalized = String(message || "").toLowerCase();
    const matches = SPECIALISTS.filter((specialist) => specialist.domains.some((domain) => normalized.includes(domain)));
    return matches.length > 0 ? matches : [SPECIALISTS[0]];
  }
}