# Product Overview

## Positioning

The OpenClaw-based Jarvis version was a personal assistant product designed around a single user's existing communication surfaces rather than a standalone chat application.

The assistant was meant to feel:

- persistent
- reachable through familiar channels
- local and user-controlled
- extensible through tools and device integrations

## Product Shape

The product combined four layers:

1. A central gateway that managed sessions, routing, events, and configuration.
2. Channel integrations that delivered messages to and from external communication platforms.
3. Native companion apps and device nodes that exposed voice, camera, canvas, and device-side capabilities.
4. Agent and tool execution that turned inbound requests into actions, replies, and automated workflows.

## User Experience Model

The assistant was intended to behave like one continuously available personal system rather than a collection of disconnected apps.

Users could:

- message the assistant from supported chat surfaces
- talk to it through device-native interfaces
- trigger tools and automations
- use live visual interfaces such as a canvas or control UI
- connect remote devices and route different channels into isolated sessions

## Major Capability Areas

### Communication surfaces

The product exposed the assistant through a broad set of messaging and chat integrations, allowing the user to interact from whichever surface was already part of daily use.

### Native device presence

Companion clients and nodes extended the system onto user devices. This enabled direct interaction patterns such as voice, push-to-talk, camera capture, screen recording, and device-originated actions.

### Tooling and automation

The assistant was not limited to plain conversation. It could call tools, drive browser workflows, respond to webhooks, run scheduled jobs, and operate against UI surfaces.

### Session and routing control

The gateway supported routing messages, sessions, and accounts into different contexts so one personal assistant system could still maintain some operational separation between surfaces or roles.

## Operating Assumptions

The historical product assumed:

- user-managed runtime ownership
- persistent background services
- access to external model providers
- channel credentials managed by the user
- device pairing and trust boundaries controlled locally

## What Is Not Included Here

This archive deliberately omits:

- account setup instructions
- persona text and private prompt design
- deployment details with real hosts or secrets
- identity-specific workflow design
- private datasets or memories