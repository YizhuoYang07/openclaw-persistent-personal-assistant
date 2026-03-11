export function readConfig(env = process.env) {
  return {
    host: env.HOST?.trim() || "0.0.0.0",
    port: parseInteger(env.PORT, 3030),
    apiAuthToken: env.API_AUTH_TOKEN?.trim() || null,
  };
}

function parseInteger(raw, fallbackValue) {
  const parsed = Number.parseInt(raw ?? "", 10);
  return Number.isInteger(parsed) ? parsed : fallbackValue;
}