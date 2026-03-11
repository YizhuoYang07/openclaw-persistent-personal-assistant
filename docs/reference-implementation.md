# Reference Implementation Guide

## Purpose

This repository includes a sanitized reference scaffold that translates the public product and architecture documents into a runnable codebase.

It is intentionally minimal. The goal is to make the system shape reusable without publishing private data, private prompts, or environment-specific automation.

## Current Layers

### Gateway HTTP layer

Implemented in `src/server.js`.

Responsibilities:

- public health endpoint
- bearer-token protection for non-public endpoints
- capability discovery
- interaction evaluation
- channel ingestion
- session creation and mutation

### Coordinator kernel

Implemented in `src/core/coordinator-kernel.js`.

Responsibilities:

- combine interaction classification, specialist selection, tool selection, memory triage, and outward delivery planning
- sanitize ambient context before it flows deeper into the system

### Interaction kernel

Implemented in `src/core/interaction-kernel.js`.

This is the public reference form of the V2 idea that every input should first be classified by:

- interaction mode
- execution path
- effort level

### Channel adapters

Implemented in `src/channels/registry.js`.

This layer demonstrates how multiple input surfaces can be normalized into one internal event contract.

### Session state

Implemented in `src/core/session-store.js`.

This is an intentionally small in-memory store that shows how channel events map into durable assistant sessions.

### Specialist registry

Implemented in `src/specialists/registry.js`.

This layer shows how specialist capability can remain internal and structured rather than becoming multiple user-facing personas.

### Tool orchestration

Implemented in `src/core/tool-orchestrator.js` and `src/tools/registry.js`.

This layer demonstrates selection and boundary control, not full tool execution.

### Tool audit log

Implemented in `src/core/tool-audit-log.js`.

This layer records planned tool usage before any real side effects are allowed. It is intentionally review-oriented.

### Memory governance

Implemented in `src/core/memory-governor.js`.

The scaffold intentionally uses sparse candidate generation rather than automatic long-term persistence.

### Memory review queue

Implemented in `src/core/memory-review-queue.js`.

This queue holds candidate memory items until an explicit review decision is applied.

## Endpoints

- `GET /health`
- `GET /v1/reference-capabilities`
- `GET /v1/channels`
- `POST /v1/channels/ingest`
- `GET /v1/sessions`
- `POST /v1/sessions`
- `PATCH /v1/sessions/:id`
- `GET /v1/tool-audit-log`
- `PATCH /v1/tool-audit-log/:id`
- `GET /v1/memory-review-queue`
- `PATCH /v1/memory-review-queue/:id`
- `POST /v1/interaction/evaluate`

## Deliberate Omissions

The following are intentionally not included in the public scaffold:

- real messaging credentials
- device pairing flows
- private user memory
- native Apple integrations
- production deployment scripts tied to a private environment
- private model prompts or identity configuration

## How To Extend

Recommended extension order:

1. replace the in-memory session store with a database-backed session service
2. replace channel registry stubs with real adapters
3. add audited tool execution behind explicit side-effect policies
4. add memory review workflows before any automatic persistence
5. add a model runtime only after the control boundaries are stable