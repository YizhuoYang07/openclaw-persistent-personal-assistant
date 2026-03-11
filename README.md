# OpenClaw-Based Jarvis Archive

中文 | English

这是一个脱敏后的产品与工程参考仓库，用于系统化记录早期基于 OpenClaw 平台实现的 Jarvis 版本，并提供一套可复用的最小参考实现。

This is a sanitized product and engineering reference repository that preserves an earlier Jarvis implementation built on top of the OpenClaw platform and includes a reusable minimum reference implementation.

本仓库的目标不是复刻原始私有环境，而是以公开、专业、可复用的方式保留该版本的产品定义、工程组织和架构思路，并给出一套他人可以继续扩展的代码骨架。

The purpose of this repository is not to recreate the original private environment. Its purpose is to preserve the product framing, engineering model, and architectural thinking behind that version in a public, professional, reusable form while providing code that others can extend safely.

## 1. 仓库定位 | Positioning

这个版本的 Jarvis 可以理解为一个“建立在 OpenClaw 之上的个人智能助理产品层”。

That version of Jarvis can be understood as a personal assistant product layer built on top of OpenClaw.

它并不把自己定义为单一聊天窗口或单一 App，而是试图把“一个持续存在的个人智能体”分发到用户已经在使用的通信渠道、设备端能力和自动化入口上。

Instead of behaving like a single chat window or a single app, it aimed to express one persistent personal assistant across the communication surfaces, device capabilities, and automation entry points already present in the user's environment.

从产品角度，它追求的是：

From a product perspective, it pursued the following goals:

- 单用户、长期在线的个人助理体验
- 多渠道触达，而不是局限在单一前端
- 用户自主管理基础设施与运行环境
- 对话、工具、自动化和设备能力的统一编排
- 在本地优先前提下实现远程可达与持续运行

- A single-user, continuously available assistant experience
- Presence across multiple channels rather than a single front end
- User-owned infrastructure and runtime control
- Unified orchestration of conversation, tools, automation, and device capabilities
- Remote reachability and persistent operation under a local-first model

## 2. 归档边界 | Archive Boundaries

本仓库刻意不包含以下内容：

This repository intentionally excludes the following:

- 真实密钥、令牌、域名、部署地址和任何运行时凭证
- 个人身份信息、命名习惯、角色设定和私有 prompt
- 私有对话内容、记忆数据、设备状态和账户配置
- 足以直接复刻原始环境的运维脚本和自动化细节

- Real secrets, tokens, domains, endpoints, or deployment credentials
- Personal identity details, naming conventions, persona design, or private prompts
- Private conversations, memory data, device state, or account configuration
- Operational automation detailed enough to recreate the original environment directly

因此，这个仓库不是原始私有系统的公开镜像，而是“文档 + 参考实现”组合。

As a result, this repository should be understood as a documentation-plus-reference-implementation package rather than a mirror of the original private system.

## 3. 产品视角 | Product View

### 3.1 核心产品命题 | Core Product Thesis

OpenClaw 版本的 Jarvis 试图解决的不是“再做一个聊天机器人”，而是把个人助理从单点交互升级为一个可持续在线、可跨入口触达、可调用外部能力的个人系统。

The OpenClaw-based Jarvis was not trying to be just another chatbot. It was trying to elevate the assistant into a persistent personal system that could remain available, span multiple entry points, and invoke external capabilities when needed.

### 3.2 用户体验模型 | Experience Model

用户与系统的交互不局限于单一界面，而是分布在以下几类入口：

User interaction was intentionally distributed across several classes of entry points:

- 即时通信渠道：把助理嵌入已有聊天表面
- 原生设备端：通过移动端或桌面端承接更直接的交互
- 语音与环境感知入口：提升“随时可唤起”的感受
- 自动化与任务入口：让系统不仅回答问题，也能执行动作

- Messaging channels that embed the assistant into existing communication surfaces
- Native device clients that enable more direct interaction patterns
- Voice and environment-linked entry points that improve immediacy
- Automation and task entry points that let the system act, not only respond

### 3.3 能力版图 | Capability Surface

该版本的能力大致可以分为四层：

The capability surface of that version can be described in four layers:

1. 通信层：把用户消息和外部事件接入系统。
2. 控制层：由 Gateway 统一路由、调度、鉴权和管理会话。
3. 智能层：由 agent runtime、模型调用和工具系统组成。
4. 执行层：包含浏览器控制、设备动作、计划任务和自动化触发。

1. Communication layer for ingesting messages and external events.
2. Control layer centered on the Gateway for routing, coordination, and policy.
3. Intelligence layer consisting of agent runtime, model execution, and tools.
4. Execution layer spanning browser control, device actions, scheduled jobs, and automation hooks.

## 4. 工程视角 | Engineering View

### 4.1 工程组织原则 | Engineering Principles

这个版本的工程设计体现出几个明显特点：

Several engineering characteristics defined this version:

- Gateway-first：所有渠道、设备和工具能力最终汇聚到同一个控制平面
- Channel abstraction：不同外部通信表面被抽象为统一的接入模式
- Device extension：通过原生 App 或节点能力扩展设备侧上下文
- Operations-aware design：默认考虑常驻运行、远程接入、诊断与恢复
- Local-first with optional exposure：优先本地控制，再按需做安全暴露

- Gateway-first composition, with channels, devices, and tools converging on one control plane
- Channel abstraction, so external messaging surfaces share a normalized integration model
- Device extension through native apps or node endpoints
- Operations-aware design that assumes long-running services, diagnostics, and recovery paths
- Local-first control with optional secure exposure for remote access

### 4.2 工程复杂度来源 | Sources of Engineering Complexity

这类系统的复杂度并不主要来自单次模型调用，而来自“把一个助理系统放进真实环境”之后出现的工程问题：

The main engineering complexity did not come from a single model call. It came from placing an assistant into a real operational environment:

- 多渠道协议差异和消息语义不一致
- 长连接、会话状态和重试策略
- 设备配对、权限边界和信任模型
- 工具调用与外部副作用管理
- 远程可达、后台常驻和故障恢复

- Inconsistent protocols and message semantics across channels
- Long-lived connections, session state, and retry behavior
- Pairing, permissions, and trust boundaries for devices
- Tool invocation and side-effect management
- Remote reachability, background runtime, and failure recovery

### 4.3 为什么值得单独归档 | Why It Merits Its Own Archive

从工程史角度看，这个版本代表了一种特定路线：不是把智能能力封装进单一应用，而是把它建成一个可分布到多入口的个人操作系统式助理层。

From an engineering-history perspective, this version represents a specific product route: not packaging intelligence into one isolated app, but building a personal assistant layer that can be distributed across many entry points.

## 5. 架构视角 | Architecture View

### 5.1 高层结构 | High-Level Structure

可以把该系统理解为一个以 Gateway 为核心的多端协同架构：

The system can be understood as a gateway-centered, multi-endpoint architecture:

```text
Channels / Native Clients / Device Nodes / Automation Hooks
				 |
				 v
			 Gateway Control Plane
				 |
	    +--------------+--------------+
	    |                             |
	    v                             v
     Agent Runtime                Tool / Action Layer
	    |                             |
	    +--------------+--------------+
				 |
				 v
			Replies / Events / State
```

### 5.2 核心组件 | Core Components

#### Gateway Control Plane

这是系统的路由与控制中心，负责：

This was the routing and control core of the system, responsible for:

- 接入外部事件
- 解析目标会话或目标 agent
- 管理运行状态与配置
- 统一安全策略、授权边界和运维入口

- ingesting external events
- resolving sessions or target agents
- managing runtime state and configuration
- centralizing security policy, authorization, and operational control

#### Channel Adapters

渠道适配层负责把不同平台的消息、媒体、身份和回复语义转换为统一内部事件模型。

The channel adapter layer normalized platform-specific messages, media, identity semantics, and reply mechanics into a shared internal event model.

#### Agent Runtime

Agent runtime 负责模型调用、上下文拼接、工具触发、结果流式输出以及会话级行为协调。

The agent runtime handled model execution, context assembly, tool invocation, streamed outputs, and session-level coordination.

#### Native Clients and Device Nodes

原生客户端和设备节点扩展了系统的感知与执行边界，使 Jarvis 不只是“接消息”，而是能够进入用户设备环境。

Native clients and device nodes extended both the sensing and execution boundary of the system, making Jarvis more than a message endpoint and allowing it to participate in the user's device environment.

#### Tool and Automation Layer

这一层让系统具备操作性，包括但不限于：浏览器控制、计划任务、Webhook 触发、设备动作和 UI 表面操作。

This layer made the system operational rather than purely conversational, covering browser control, scheduled jobs, webhooks, device actions, and UI-surface operations.

### 5.3 运行模型 | Operating Model

该版本天然偏向常驻服务模型：

This version naturally favored a persistent-service operating model:

- 后台常驻的 Gateway
- 由用户维护的接入凭证和设备连接
- 可选的远程访问或隧道暴露能力
- 依赖外部模型服务，但控制逻辑由用户自己掌握

- A long-running gateway service
- User-managed channel credentials and device connectivity
- Optional secure remote exposure or tunneling
- Dependence on external model providers while keeping control logic user-owned

### 5.4 安全边界 | Security Boundaries

这类系统最关键的不是“能不能接更多渠道”，而是如何区分可信与不可信输入，以及如何约束工具的执行边界。

The most important architectural question in this kind of system is not simply how many channels can be connected, but how trusted and untrusted inputs are separated and how tool execution is constrained.

重点边界包括：

Key boundaries include:

- 来自公开通信渠道的非可信消息
- 已配对设备与未配对设备之间的信任差异
- 模型推理层与真实执行层之间的权限隔离
- 对外暴露接口与本地控制面的隔离

- Untrusted inbound content from public communication channels
- Trust differences between paired and unpaired devices
- Permission boundaries between reasoning and real execution
- Separation between exposed remote surfaces and local control surfaces

## 6. 仓库内容 | Repository Contents

本仓库当前包含：

This repository currently includes:

- `README.md`：中英双语总览，面向公开介绍
- `docs/product.md`：产品层定义、体验模型和能力边界
- `docs/architecture.md`：架构分层、组件关系和运行模型
- `src/`：可运行的 Node.js 参考实现骨架，体现 gateway、coordinator、specialists、tools、memory governor 的基本关系
- `src/channels/`：多渠道输入适配层的公开参考实现
- `src/core/session-store.js`：session state 的最小实现
- `src/core/tool-audit-log.js`：工具计划与审计记录
- `src/core/memory-review-queue.js`：记忆候选审核队列
- `test/`：最小接口测试，验证健康检查、鉴权和结构化评估返回
- `docs/reference-implementation.md`：参考实现分层说明与扩展顺序
- `.env.example`：最小环境变量模板
- `package.json`：运行与测试入口
- `CONTRIBUTING.md`：贡献边界与脱敏规则
- `LICENSE`：开放许可

- `README.md`: bilingual overview intended for public-facing reading
- `docs/product.md`: product framing, experience model, and capability boundaries
- `docs/architecture.md`: architectural layers, component relationships, and operating model
- `src/`: runnable Node.js reference scaffold showing the relationship between gateway, coordinator, specialists, tools, and memory governor
- `src/channels/`: public reference layer for multi-channel input normalization
- `src/core/session-store.js`: minimum session-state implementation
- `src/core/tool-audit-log.js`: audit trail for planned tool usage
- `src/core/memory-review-queue.js`: review queue for candidate memories
- `test/`: minimal API tests covering health, auth, and structured evaluation output
- `docs/reference-implementation.md`: implementation-layer guide and extension order
- `.env.example`: minimal environment variable template
- `package.json`: run and test entry points
- `CONTRIBUTING.md`: contribution scope and sanitization rules
- `LICENSE`: open license

## 7. 参考实现 | Reference Implementation

参考实现不是原系统源码的直接公开版本，而是根据公开设计文档重建出的最小可复用骨架。

The reference implementation is not a direct publication of the original system source code. It is a minimum reusable scaffold rebuilt from the public-facing design documents.

当前代码实现了以下核心骨架：

The current code covers the following core skeleton:

- Gateway-style HTTP entry layer
- Coordinator kernel with interaction mode and execution-path classification
- Channel adapters with a normalized inbound event contract
- Session state management for persistent assistant threads
- Tool audit logging before any side-effectful execution path
- Memory review queue before any long-term promotion decision
- Specialist registry with structured contracts
- Tool registry and orchestration boundary
- Memory governor for sparse candidate generation
- Delivery controller enforcing a single outward-facing response contract

它的作用不是“直接代替原系统”，而是给研究者或开发者一个干净、可运行、可扩展的起点。

Its role is not to replace the original system directly, but to give builders a clean, runnable, extensible starting point.

## 8. 快速开始 | Quick Start

```bash
npm install
cp .env.example .env
npm start
```

默认接口：

Default endpoints:

- `GET /health`
- `GET /v1/reference-capabilities`
- `POST /v1/interaction/evaluate`

示例请求：

Example request:

```bash
curl -X POST http://127.0.0.1:3030/v1/interaction/evaluate \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer replace-me" \
	-d '{
		"message": "Help me debug this architecture issue and decide whether it needs a specialist.",
		"ambientContext": {
			"workspace": "sample-project"
		}
	}'
```

## 9. 隐私与脱敏原则 | Privacy And Sanitization

这个仓库严格遵循以下原则：

This repository follows the following rules strictly:

- 不公开任何真实私钥、令牌、地址或身份信息
- 不包含私有对话、私有记忆或原始用户数据
- 不默认持久化敏感上下文
- 对 ambient context 中疑似密钥字段自动做红action

- No real keys, tokens, addresses, or identity-specific details are published
- No private conversations, memories, or raw user data are included
- Sensitive context is not persisted by default
- Suspected secret fields in ambient context are redacted automatically

## 10. 适合的阅读对象 | Intended Audience

这个仓库适合以下几类读者：

This repository is useful for several types of readers:

- 希望理解该版本 Jarvis 产品路线的人
- 想研究多渠道个人助理系统工程结构的人
- 希望复盘 OpenClaw 之上产品化方式的人
- 正在规划下一代 Jarvis 或个人智能系统的人

- People trying to understand the product direction of that Jarvis version
- Engineers studying multi-channel personal assistant systems
- Readers reviewing how a product layer can be built on top of OpenClaw
- Builders planning a next-generation Jarvis or personal intelligence system

## 11. 仓库性质说明 | Nature of the Repository

这是一个“成熟说明型仓库 + 可复用参考实现仓库”，而不是原始私有系统的完整公开发布。

This is a mature documentation repository plus a reusable reference-implementation repository, not a full public release of the original private system.

它的价值在于同时保留三件事：完整的产品表述、清晰的架构抽象，以及一套他人可以真正拿去继续开发的最小代码骨架。

Its value lies in preserving three things at once: a complete product description, a clear architectural abstraction, and a minimum code scaffold that others can actually reuse and extend.