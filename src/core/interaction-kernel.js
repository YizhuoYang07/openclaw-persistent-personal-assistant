const MODE_RULES = [
  { mode: "environment", terms: ["file", "folder", "workspace", "calendar", "device", "notification", "location", "schedule", "mac", "iphone"] },
  { mode: "project", terms: ["build", "code", "debug", "design", "implement", "write", "draft", "analyze", "architecture", "plan"] },
  { mode: "utility", terms: ["remind", "check", "find", "list", "show", "summarize", "rename", "search"] },
];

export class InteractionKernel {
  evaluate(message) {
    const normalized = normalize(message);
    const mode = selectMode(normalized);
    const executionPath = selectExecutionPath(mode, normalized);

    return {
      mode,
      executionPath,
      effortLevel: selectEffortLevel(mode, executionPath),
      rationale: buildRationale(mode, executionPath),
    };
  }
}

function selectMode(message) {
  for (const rule of MODE_RULES) {
    if (rule.terms.some((term) => message.includes(term))) {
      return rule.mode;
    }
  }

  if (message.includes("feel") || message.includes("stuck") || message.includes("worried") || message.includes("thinking")) {
    return "companion";
  }

  return "utility";
}

function selectExecutionPath(mode, message) {
  if (mode === "companion") {
    return "direct";
  }
  if (mode === "environment") {
    return "procedural_executor";
  }
  if (mode === "project" && (message.includes("strategy") || message.includes("tradeoff") || message.includes("decision"))) {
    return "deliberation";
  }
  if (mode === "project") {
    return "specialist";
  }
  return "direct";
}

function selectEffortLevel(mode, executionPath) {
  if (executionPath === "deliberation") {
    return "deep_pass";
  }
  if (executionPath === "specialist" || mode === "environment") {
    return "silent_assist";
  }
  return "direct";
}

function buildRationale(mode, executionPath) {
  return `Classified as ${mode} with ${executionPath} because the input implies that handling style.`;
}

function normalize(value) {
  return String(value || "").toLowerCase();
}