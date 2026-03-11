const CHANNELS = [
  {
    id: "imessage",
    category: "messaging",
    adapter: "message-bridge",
    capabilities: ["inbound_text", "outbound_text", "session_routing"],
    trustModel: "paired_device",
  },
  {
    id: "telegram",
    category: "messaging",
    adapter: "message-bridge",
    capabilities: ["inbound_text", "outbound_text", "attachments"],
    trustModel: "allowlist_required",
  },
  {
    id: "slack",
    category: "workspace",
    adapter: "workspace-bridge",
    capabilities: ["inbound_text", "outbound_text", "thread_context"],
    trustModel: "workspace_policy",
  },
  {
    id: "macos-client",
    category: "native",
    adapter: "native-client",
    capabilities: ["direct_interaction", "ambient_context", "notifications"],
    trustModel: "local_user",
  },
];

export class ChannelRegistry {
  list() {
    return CHANNELS;
  }

  get(channelId) {
    return CHANNELS.find((channel) => channel.id === channelId) || null;
  }

  normalizeInboundEvent(input = {}) {
    const channel = this.get(input.channel) || {
      id: input.channel || "unknown",
      category: "custom",
      adapter: "custom-adapter",
      capabilities: [],
      trustModel: "explicit_policy_required",
    };

    return {
      channel: channel.id,
      adapter: channel.adapter,
      category: channel.category,
      trustModel: channel.trustModel,
      sessionKey: input.sessionKey || `${channel.id}:${input.senderId || "anonymous"}`,
      senderId: input.senderId || "anonymous",
      text: input.text || "",
      attachments: Array.isArray(input.attachments) ? input.attachments : [],
      receivedAt: input.receivedAt || new Date().toISOString(),
    };
  }
}