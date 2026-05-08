# AI System Design — Cheat Sheet

[← Back to index](../../README.md) · [Full Q&A](./questions.md)

## Core concepts
- **AI gateway:** central proxy enforcing auth, quotas, routing, caching, redaction, logging across all LLM calls.
- **Semantic cache:** embedding-similarity cache that catches paraphrased queries; tune threshold to balance hit rate vs correctness.
- **Prefix/KV cache:** reuse attention state for shared system prompts; major cost/latency win for repeated context.
- **Multi-region deployment:** active-active or active-passive across regions for residency, latency, and disaster recovery.
- **Fallback chain:** primary model → secondary provider → cached response → rule-based reply → user-visible degraded mode.
- **Graceful degradation:** explicit ladder of reduced-quality responses rather than hard failure.
- **A/B and shadow routing:** run new models in shadow against production traffic before promoting; A/B for quality measurement.
- **Rate limiting & queuing:** per-tenant RPM/TPM/$ caps with priority queues to absorb bursts and prevent noisy neighbors.
- **Multi-tenancy isolation:** logical (namespaces, ACLs) vs physical (separate clusters); choose by compliance and trust profile.
- **Batch vs streaming:** streaming for UX-critical paths; batch async for cost efficiency on non-interactive workloads.
- **Capacity planning:** QPS × tokens-per-request → provider TPM and GPU sizing; reserve 30–50% peak headroom.
- **Cost-per-request:** track $/req by route and tenant; alert on regressions; chargeback drives accountability.
- **Latency budget:** explicit p95 budget per stage (retrieval, model, post-processing); fail builds that exceed.
- **Hybrid retrieval:** combine BM25 + dense embeddings + reranker for both recall and precision.
- **Human-in-the-loop:** route low-confidence outputs to reviewers; capture labels for retraining.
- **Coding-agent platform:** per-session microVM sandbox + repo embedding/symbol index + planner-executor loop with streamed diffs and SWE-Bench-style eval gates.
- **Realtime voice stack:** WebRTC edge → VAD → streaming STT → LLM (speculative on partials) → streaming TTS, with barge-in cancellation and GPU pool admission control.
- **Latency budget breakdown:** decompose end-to-end p95 across stages (e.g., voice 300ms = VAD 20 + STT 80 + LLM TTFT 120 + TTS 60); fail any stage that exceeds its slice.

## Decision rules
- **Single model vs router:** add a router when query distribution spans clearly different difficulties or modalities; otherwise one model + caching is simpler.
- **Sync vs async:** sync only when user waits on result and budget < 5s end-to-end; otherwise queue and notify.
- **Cache vs not:** always cache when (a) repeated queries exist or (b) cost dominates and answers are stable; skip when answers are user-specific and unique.
- **Active-active vs active-passive:** active-active when downtime cost > infra cost or RPO ~0 required; active-passive otherwise.
- **Self-host vs API:** self-host when scale × per-token cost beats GPU TCO, or for compliance; API when speed-to-market and bursty traffic dominate.
- **Fine-tune vs RAG vs prompt:** prompt first, RAG when knowledge is large/changing, fine-tune for stable behavior/style or domain reasoning.

## Key parameters
- **Latency budget** (chat): TTFT < 500 ms ideal, < 1.5 s acceptable; full P95 < 5 s.
- **Latency budget** (voice): end-to-end < 800 ms target, < 300 ms STT, LLM streaming start < 400 ms, TTS start < 100 ms.
- **Cost-per-request**: ballpark $0.001–$0.05 for Q&A; $0.05–$0.50 for agentic tasks.
- **QPS scaling tiers**: 1–10 QPS single-pod; 10–1000 QPS load-balanced; 1K+ requires autoscaling + queueing.
- **Cache hit rate target**: 30–70% for semantic cache; 50–90% for prompt-prefix cache on repeated system prompts.
- **Multi-region failover RTO**: < 30 s for active-active; < 5 min for active-passive.
- **Per-tenant isolation**: rate limit + quota + namespace; quota typically 100–10K req/min/tenant.

## Standard patterns
- **Chatbot stack:** retrieval → tool use → guardrails → streaming response.
- **Doc Q&A:** parse → chunk → embed → store → retrieve → rerank → answer with citations.
- **Moderation:** classifier ensemble → confidence routing → human-in-loop for borderline.
- **Recommendation:** candidate generation (ANN) → ranker (with realtime features) → diversification.
- **Multi-agent:** planner → specialist workers → shared memory → orchestrator with step/cost caps.
- **Voice assistant:** streaming ASR → LLM/tools → streaming TTS, with barge-in.
- **Extraction pipeline:** OCR/parse → schema-constrained LLM → validation → review queue.
- **Anomaly detection:** stream metrics → unsupervised + supervised detectors → LLM incident summarization.
- **Coding-agent SaaS:** repo ingest → microVM sandbox → indexed retrieval → planner-executor with test verifier → streamed diffs → token-metered billing.
- **Realtime voice (frontier):** WebRTC + edge VAD → streaming STT partials → speculative LLM → chunked TTS, sub-300ms budget with barge-in and non-realtime fallback.

## Common pitfalls
- Hidden N+1 LLM calls in agent loops blowing latency and cost.
- No fallback when primary provider degrades; users see hard errors.
- Missing per-tenant rate limits → one tenant exhausts shared quota.
- Single-provider dependency creating availability and pricing risk.
- Silent fallback path serving degraded quality without metrics or user signaling.
- Cache keys missing model version or tool schema → stale or wrong responses.
- Logging raw prompts/responses with PII or secrets; no redaction at gateway.
- Vector index ACLs enforced only at UI, not at retrieval time → cross-tenant leaks.
- No cost circuit breaker on agents → runaway loops generate unbounded spend.
- Untested failover/region cutover; first real outage is the first real test.
