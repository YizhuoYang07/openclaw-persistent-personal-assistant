# Architecture Overview

## High-Level Model

The OpenClaw-based Jarvis version used a gateway-centered architecture.

External channels, native clients, automation endpoints, and device nodes all converged on one control plane. That control plane then coordinated agent execution, tool access, stateful sessions, and outbound replies.

## Core Components

### 1. Gateway control plane

The gateway was the operational core of the system. It handled:

- inbound and outbound event flow
- session lifecycle
- channel routing
- policy enforcement
- configuration and control surfaces
- operational diagnostics

This layer effectively unified the rest of the system behind one long-running service.

### 2. Channel adapters

Channel adapters connected the assistant to external communication surfaces. Their role was to normalize inbound messages and media into gateway events, then deliver outbound assistant replies back into the originating surface.

Key architectural value:

- one assistant identity could appear across many surfaces
- the gateway could centralize routing, trust policy, and reply behavior

### 3. Agent runtime

The agent runtime executed assistant reasoning and tool calls. It operated behind the gateway rather than as a directly user-facing component.

Responsibilities included:

- building model requests
- streaming replies
- invoking tools
- interacting with session state
- coordinating structured outputs for downstream surfaces

### 4. Native apps and nodes

Native apps and device nodes extended the assistant beyond messaging platforms.

They provided capabilities such as:

- device-local voice interaction
- canvas or visual workspace rendering
- camera and screen capture
- device telemetry or commands
- remote gateway interaction from personal devices

Architecturally, these acted as trusted user-side endpoints connected back to the gateway.

### 5. Tool and automation layer

The system exposed a set of tools and automations that could be invoked by the assistant or by external triggers.

Examples of this layer included:

- browser control
- scheduled jobs
- webhook-triggered flows
- UI interactions
- device actions

This layer made the assistant operational rather than purely conversational.

## Data Flow

Typical request flow:

1. A message or event enters from a channel, device, UI, or automation hook.
2. The gateway normalizes the event and resolves the target session or route.
3. The agent runtime processes the event, optionally using tools or model providers.
4. The gateway emits the result to the appropriate outbound surface.
5. Operational metadata, logs, and session state remain centralized at the gateway layer.

## Deployment Shape

The historical system favored a user-operated, always-on deployment pattern.

Typical characteristics:

- long-running gateway service
- local or self-managed hosting
- optional remote access tunnel or secure exposure layer
- companion apps connecting back to the control plane
- external model providers accessed from the gateway side

## Security Boundaries

Important boundaries in this design were:

- untrusted inbound messages from public channels
- trusted user devices after explicit pairing or configuration
- privileged tools behind the gateway
- external providers used for model execution

This meant the gateway needed to enforce pairing, allowlisting, routing, and execution boundaries instead of assuming every inbound event was trustworthy.

## Why This Architecture Mattered

This design made it possible to treat the assistant as one persistent personal system while still supporting many interaction modes:

- chat across multiple platforms
- device-native experiences
- remote access
- automation and tooling
- centralized operational control

That combination is the main architectural characteristic preserved by this archive.