# AI Agents and Agentic Systems — Cheat Sheet

[← Back to index](../../README.md) · [Full Q&A](./questions.md)

## Core concepts
- **Agent loop**: think → act (tool call) → observe → repeat until done, max-steps, or budget hit.
- **ReAct**: interleaved Thought/Action/Observation; flexible, token-heavy, drift-prone.
- **Plan-and-Execute**: planner builds steps upfront, executor runs them; cheaper, less adaptive.
- **Tool use / function calling**: typed schemas the model fills in to invoke external code.
- **MCP (Model Context Protocol)**: open protocol decoupling agent hosts from tool/data servers.
- **Memory tiers**: short-term (context window), long-term (vector/KV store), episodic (past trajectories).
- **Reflection**: self-critique step that catches errors at extra token cost.
- **Single vs multi-agent**: one loop vs specialized agents (planner/researcher/coder/critic) coordinated by orchestrator.
- **Orchestration**: routing, state, handoffs, retries — supervisor agent or workflow graph (LangGraph, Temporal).
- **Guardrails**: input filters, output validators, tool allowlists, action quotas, sandboxing, approval gates.
- **Human-in-the-loop**: approval checkpoints for irreversible or high-risk actions.
- **Sandboxing**: isolated containers/microVMs (Docker, gVisor, Firecracker, E2B) for code execution.
- **Code-gen vs tool-call**: write-and-run code (flexible, risky) vs select-from-fixed-set (safe, limited).
- **Harness**: scaffolding around the model — prompts, tools, loops, memory, observability.
- **State externalization**: store task state in DB/KV; pass references not blobs into context.
- **Coding agent**: LLM agent that reads/edits/tests code in a repo loop (Claude Code, Cursor, Aider, Devin) — differ in autonomy and harness.
- **Harness engineering (coding)**: edit format (diff vs. search-replace vs. whole-file), tool granularity, test integration, recovery — often dominates model choice on SWE-Bench.
- **SWE-Bench**: real GitHub issue → patch → hidden tests pass; SWE-Bench Verified (500 curated tasks) is the standard coding-agent benchmark.
- **LangGraph / CrewAI / AutoGen / Agents SDK**: stateful graph / role-crew / conversational multi-agent / minimal handoff primitives.
- **smolagents + CodeAct**: agent emits Python code as its action; one step composes loops + multiple tool calls; needs sandbox.
- **Code-action vs tool-call**: Python snippet executed in sandbox vs. JSON function call — code-action fewer round trips, tool-call easier to audit.
- **microVM sandboxing**: Firecracker-based isolation (E2B, Fly Machines) — stronger than containers, fast spin-up, the standard for agent code execution.

## Decision rules
- **ReAct vs Plan-and-Execute**: ReAct for exploratory/uncertain tasks; Plan-Execute for predictable decomposable workflows with cost pressure.
- **Single vs multi-agent**: default single; go multi only when one agent provably cannot handle role diversity or parallelism.
- **Code-gen vs tool-calling**: tool-calling for narrow regulated domains; code-gen for open-ended computation with sandboxing.
- **When to add reflection**: high-value final outputs or critical actions; skip for cheap exploratory steps.
- **When to add HITL**: irreversible actions, high blast radius, regulatory requirement, low-confidence outputs.
- **Tool catalog size**: keep ≤10–20 directly exposed; beyond that, use tool retrieval per turn.
- **Framework choice**: LangGraph for durable stateful workflows; CrewAI for role-based prototypes; AutoGen for conversational multi-agent research; Agents SDK / smolagents for minimal primitives.
- **Build vs. buy framework**: prototype on existing framework; build custom only when prompt control, latency, or non-standard control flow makes the framework fight you.
- **Sandbox choice**: E2B for turnkey agent sandboxes; Modal for heavy/GPU compute; Fly Machines for custom microVM runtimes; gVisor for container-level isolation when microVM unavailable.

## Key parameters
- **Max steps / iterations**: typical 10–30 for narrow tasks, 50–200 for coding agents; HARD cap always.
- **Token budget per task**: track and abort at threshold; e.g., 50K–500K tokens depending on task class.
- **Tool catalog size**: ≤10–20 directly exposed; beyond, use tool retrieval per turn.
- **Reflection cost multiplier**: ~2× tokens for self-critique step.
- **Multi-agent coordination overhead**: 1.5–3× tokens for handoffs vs single-agent.
- **Memory recall top-k**: 3–10 relevant snippets per turn from long-term store.
- **Sandbox boot time**: microVM (Firecracker) ~125 ms cold; container ~1–3 s.

## Common pitfalls
- **Infinite loops**: missing max-step cap or repeated identical (action, args) — add hashing detector + hard backstop.
- **Tool hallucination**: vague names/schemas — tighten descriptions, use enums, add few-shot examples.
- **Wrong parameters**: loose schemas — add types, regex, required fields, validation errors fed back for retry.
- **Runaway cost**: no per-task budget — wrap client in middleware that tracks tokens/dollars and aborts on threshold.
- **Irreversible damage**: agents with write/delete in production scope — least privilege, soft-delete, approval gates, backups.
- **Prompt injection via retrieved content**: treat all external content as untrusted; constrain tool scope under untrusted context.
- **Context bloat**: dumping everything into prompt — summarize, retrieve, externalize state with references.
- **Wrong tool selection in large catalogs**: consolidate overlap, sharpen differentiators, retrieve top-k tools per turn.
- **Context management on large codebases**: loading whole repo blows context — use repo maps, semantic retrieval, lazy reads, and pin a small high-signal set.
- **Framework lock-in**: hidden prompt templates and abstraction churn make debugging hard — keep core loop swappable, treat framework as a thin layer.
- **Sandbox escape**: containers with shared kernel, host network, or excess capabilities are weak — use microVMs (Firecracker/E2B), drop caps, deny egress, treat read files as untrusted (prompt injection vector).
