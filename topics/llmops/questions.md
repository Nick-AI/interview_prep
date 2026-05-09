---
title: "Questions"
parent: "LLMOps and Production AI"
nav_order: 2
flashcard: true
---

# LLMOps and Production AI

[← Back to index](../../README.md) · [Cheat sheet](./cheatsheet.md)

> Operating LLM-powered applications in production — deployment, monitoring, cost control, versioning, and reliability.

### Explain the AI product lifecycle from ideation to production.

**TL;DR:** Discover, prototype, evaluate, deploy, monitor, iterate — gated by evals at each stage.

The lifecycle starts with problem discovery and use-case scoping, followed by data collection and prompt or model prototyping. An evaluation harness with offline benchmarks and human review gates progression. Deployment introduces canary rollout, observability, and guardrails, while production monitoring tracks drift, cost, and user feedback. Continuous iteration loops new data and failures back into the next prompt or fine-tune cycle.

### What is LLMOps, and how does it differ from traditional MLOps?

**TL;DR:** LLMOps manages prompts, third-party APIs, tokens, and non-deterministic outputs; MLOps centers on training pipelines and model artifacts.

LLMOps extends MLOps to handle the unique surface area of large language models: prompt versioning, context management, token-based pricing, and external provider dependencies. Unlike MLOps, where models are typically trained in-house and outputs are deterministic, LLMOps must cope with stochastic generations, hallucinations, and rapidly evolving foundation models. Evaluation shifts from accuracy metrics to LLM-as-judge, rubrics, and human preference. Operational concerns add rate limits, prompt injection, and PII leakage that traditional ML rarely faced.

### How do you serve LLMs in production?

**TL;DR:** Use a managed API for speed, or self-host with vLLM/TGI behind an autoscaling gateway with batching and caching.

Serving choices range from provider APIs (OpenAI, Anthropic, Bedrock) to self-hosted runtimes like vLLM, TGI, or TensorRT-LLM on GPU clusters. Key serving features include continuous batching, paged attention, KV-cache reuse, and tensor parallelism for large models. A gateway in front handles routing, retries, auth, rate limiting, and observability. Autoscaling, warm pools, and quantized weights keep cost and latency predictable under load.

### What is model quantization?

**TL;DR:** Reducing weight precision (FP16 → INT8/INT4) to shrink memory and speed inference with minor accuracy loss.

Quantization maps high-precision weights and activations to lower-bit representations such as INT8, INT4, or FP8, cutting VRAM and increasing throughput. Common methods include post-training quantization (PTQ), GPTQ, AWQ, and quantization-aware training (QAT) when accuracy preservation matters. The tradeoff is small quality regressions that can be mitigated by per-channel scales, calibration data, and mixed-precision layers. It enables running larger models on smaller GPUs or edge devices. Reference: [AI Engineering Explained: LLM, RAG, MCP, Agent, Fine-Tuning, Quantization](https://www.youtube.com/watch?v=lnfWvX66FUk).

### How do you monitor LLM applications in production?

**TL;DR:** Track latency, cost, quality (eval scores, user feedback), and safety signals via traces and dashboards.

Monitoring spans system metrics (latency, throughput, error rate, token usage) and quality signals (LLM-as-judge scores, thumbs feedback, refusal rate). Distributed tracing captures every prompt, retrieval, tool call, and model response with token counts and cost per span. Alerting fires on drift, cost spikes, jailbreak attempts, and SLA violations. Sampled production traffic feeds offline eval suites to detect silent regressions after model or prompt changes.

### What is LLM observability?

**TL;DR:** End-to-end visibility into prompts, responses, tool calls, retrieval context, tokens, latency, and quality.

LLM observability records the full execution graph of a request — prompt template, variables, retrieved chunks, tool invocations, intermediate reasoning, and final output. Tools like LangSmith, Langfuse, Arize, and Helicone provide trace trees with token and cost attribution per span. It enables root-cause analysis of hallucinations, slow steps, and broken chains. Combined with evals it closes the loop between production behavior and offline regression testing.

### What are guardrails for LLMs, and how do you implement them?

**TL;DR:** Input/output validators that block unsafe, off-topic, or malformed responses before they reach users.

Guardrails are policy layers around the model that validate inputs (prompt-injection detection, PII scrubbing, topic filters) and outputs (toxicity, hallucination checks, schema validation). Implementations range from regex and classifier models to libraries like NeMo Guardrails, Guardrails AI, and provider-side moderation endpoints. They can rewrite, retry, or reject responses based on policy verdicts. Guardrails should fail closed for safety-critical use cases and be evaluated like any other component.

### How do you implement content filtering for AI outputs?

**TL;DR:** Run moderation classifiers on outputs and block, redact, or regenerate when policy is violated.

Content filtering pipes generated text through moderation models (OpenAI Moderation, Perspective API, Llama Guard) that score categories like hate, violence, self-harm, and sexual content. Outputs above thresholds are blocked, redacted, or sent back to the model with a corrective prompt. Policies should be configurable per use case and audience, and decisions logged for review. Multi-layer filtering (input + output + retrieval context) reduces both leaks and false positives.

### How do you estimate the cost of running an AI-powered feature in production?

**TL;DR:** Cost ≈ requests/day × (input_tokens × in_price + output_tokens × out_price) + infra + eval overhead.

Estimation starts with measured token distributions (P50/P95 in and out) per user action and provider pricing. Multiply by expected daily volume, then add infra (vector DB, gateway, cache), eval runs, and human review. Account for retries, fallback model calls, and prompt-cache hit rate which can cut input cost significantly. Stress-test with peak traffic assumptions and add a buffer for prompt growth as features evolve.

### How do you optimize LLM inference costs in production?

**TL;DR:** Smaller models, prompt/KV caching, shorter prompts, batching, quantization, and routing easy queries to cheaper models.

Cost optimization combines model-tier routing (cheap model first, escalate on low confidence), prompt caching for repeated system prompts, and aggressive context trimming. Self-hosting quantized models with continuous batching cuts per-token cost at sufficient volume. Cache complete responses for deterministic queries and use semantic cache for near-duplicates. Measure cost per successful task — not per token — to avoid optimizing the wrong axis.

### How do you implement A/B testing for LLM systems?

**TL;DR:** Split traffic across prompt/model variants, log outcomes, and compare quality, cost, and latency with statistical tests.

A/B testing assigns users or sessions to variants of prompts, models, retrieval configs, or temperatures using a feature-flag system. Each variant logs token usage, latency, user feedback, task completion, and downstream business metrics. Because LLM outputs are noisy, tests need larger samples and often LLM-as-judge for quality comparison. Guardrails on cost and safety let you abort losing variants quickly, and shadow traffic helps de-risk new models before live exposure.

### What is CI/CD for AI applications, and how does it differ from traditional CI/CD?

**TL;DR:** Adds prompt/eval regression tests, model artifact promotion, and canary rollout alongside code tests.

AI CI/CD pipelines run unit tests on code plus eval suites on prompts, retrievers, and agents whenever any of those change. Prompt and model versions are first-class artifacts promoted through dev → staging → prod with approval gates. Canary or shadow deployment compares new versions against baselines on live traffic before full rollout. Unlike traditional CI/CD, regressions are statistical, requiring threshold-based pass/fail on eval scores rather than binary test outcomes.

### How do you version and manage prompts in production?

**TL;DR:** Treat prompts as code — store in Git or a prompt registry with versions, evals, and environment promotion.

Prompts live in version control or a dedicated registry (LangSmith, Langfuse, PromptLayer) with semantic versioning, metadata, and linked eval results. Each deployment pins a specific prompt version, enabling reproducibility and rollback. Changes flow through PR review, automated eval, and staged rollout the same way as code. Production logs reference the prompt version per request so regressions are attributable.

### What is model versioning, and how do you handle model rollbacks?

**TL;DR:** Pin exact model IDs/checkpoints; route traffic via a gateway so rollback is a config flip.

Model versioning means never depending on a moving alias — pin to specific snapshots like `gpt-4o-2024-08-06` or hashed checkpoints for self-hosted weights. A model gateway abstracts the choice so swapping versions is a configuration change, not a code deploy. Maintain warm capacity for the previous version and run shadow traffic before promoting. Rollback triggers when eval scores, error rate, or cost cross predefined thresholds.

### How do you implement rate limiting and throttling for LLM APIs?

**TL;DR:** Token-bucket per user/tenant on requests and tokens, with backpressure and queue at the gateway.

Rate limits enforce per-user, per-tenant, and per-model caps on requests-per-minute and tokens-per-minute using token-bucket or leaky-bucket algorithms in a gateway like Kong, Envoy, or a custom proxy. Throttling returns 429s with `Retry-After` headers and queues low-priority traffic to smooth bursts. Distributed counters in Redis keep limits consistent across replicas. Tier-based quotas and per-endpoint limits protect the platform from abusive or runaway clients.

### How do you handle model updates and migrations without downtime?

**TL;DR:** Blue-green or canary deploy with shadow traffic and eval gates; keep old version warm until rollout completes.

Migrations run the new model alongside the old one behind a router, sending a small canary slice (1–5%) and growing traffic as eval and live metrics confirm parity. Shadow mode mirrors requests to the new model without serving its responses to compare quality and latency safely. Stateful contexts (conversation memory) need schema-compatible serialization across versions. Automated rollback on quality, latency, or cost regression keeps the migration zero-downtime.

### What is the role of feature flags in AI deployments?

**TL;DR:** Decouple release from deploy — toggle prompts, models, and features per user/segment without redeploying.

Feature flags (LaunchDarkly, Unleash, Statsig) gate prompt versions, model choices, retrieval configs, and entire AI features behind runtime toggles. They enable progressive rollout, instant kill switches, per-tenant overrides, and clean A/B experiments. For LLM systems they are essential because behavior is non-deterministic and quality regressions need fast disablement. Flag values should be logged with each request for traceability.

### How do you implement logging and tracing for LLM applications?

**TL;DR:** OpenTelemetry traces with spans for each LLM/tool/retrieval call, capturing prompts, outputs, tokens, latency, and cost.

Logging captures structured records of prompts, responses, model versions, latencies, and errors, while tracing builds a span tree across the request lifecycle. OpenTelemetry with semantic conventions for GenAI (or vendor SDKs like LangSmith) standardizes this. Trace IDs propagate from client through gateway, retrieval, model, and tools so any failure can be reconstructed. Sensitive fields are redacted or hashed before storage to meet compliance.

### How do you handle PII and sensitive data in LLM inputs and outputs?

**TL;DR:** Detect and redact PII pre-call, restrict logging, use private endpoints, and filter outputs for leakage.

A PII pipeline (Presidio, regex, NER models) scans inputs before they reach the model and redacts or tokenizes sensitive fields. Use private/enterprise model endpoints with zero data retention, and route via VPC endpoints to avoid public network exposure. Output scanning catches accidental memorization or leakage from retrieved context. Logs store hashed identifiers and redacted payloads; access is audited and role-restricted to meet GDPR/HIPAA requirements.

### What is a gateway pattern for LLM API management?

**TL;DR:** A single proxy in front of all LLM providers handling auth, routing, retries, caching, logging, and cost control.

The LLM gateway (LiteLLM, Portkey, Kong AI Gateway) centralizes cross-cutting concerns: provider abstraction, fallbacks, rate limits, caching, observability, key rotation, and cost attribution. Applications call one normalized API and the gateway handles model routing, retries, and budget enforcement. It enables instant provider swaps, multi-provider fallback, and consistent telemetry across all model calls. Operationally it becomes the control plane for governance and policy.

### How do you implement streaming responses for real-time AI applications?

**TL;DR:** Stream tokens via SSE or WebSockets as they generate; render incrementally in the client.

Streaming uses Server-Sent Events or WebSockets so the server forwards each token (or chunk) from the model as soon as it arrives. The client appends incrementally, which dramatically improves perceived latency since TTFT replaces full-response wait. Implementations must handle backpressure, partial JSON for structured output, retries on disconnect, and accurate token counting at stream end. Gateways and CDNs in the path must support chunked transfer or HTTP/2.

### What are the key SLAs and metrics for production AI systems (latency, throughput, availability)?

**TL;DR:** TTFT, ITL, P95 end-to-end latency, tokens/sec, availability %, error rate, cost/request, and quality scores.

Latency is measured as time-to-first-token (TTFT), inter-token latency (ITL), and P50/P95/P99 end-to-end. Throughput is tokens-per-second per replica and concurrent requests per node. Availability targets (e.g., 99.9%) cover both gateway and provider, with multi-provider fallback to meet uptime. Quality SLAs on eval pass rate, hallucination rate, and user feedback complete the picture alongside cost-per-request.

### Cloud vs on-device Model Deployment for AI applications.

**TL;DR:** Cloud for large models and central updates; on-device for privacy, offline, and low-latency UX.

Cloud deployment scales to large frontier models, centralizes monitoring, and simplifies updates but adds network latency, recurring cost, and data-egress concerns. On-device runs quantized small models (Llama, Phi, Gemma Nano) on phones or laptops giving zero-latency, offline, and private inference. The tradeoff is constrained capability, hardware fragmentation, and harder telemetry. Hybrid patterns use on-device for fast/sensitive paths and cloud for heavy reasoning. Reference: [Cloud vs On-Device Model Deployment](https://x.com/outcome_school/status/1965643330076991621).

### How do you implement fallback strategies when the primary model is unavailable or rate-limited?

**TL;DR:** Gateway retries with exponential backoff, then falls back to alternate provider/model with same prompt schema.

A resilient client wraps each call in retries with jitter, then escalates to a secondary provider on persistent 429/5xx or timeout. The gateway maintains a prioritized chain (e.g., GPT-4o → Claude Sonnet → Llama-on-Bedrock) with normalized prompts and response schemas. Cached responses serve as a last resort for repeat queries. Circuit breakers stop hammering a degraded provider, and metrics track fallback rate to detect upstream issues early.

### How do you implement structured output from LLMs reliably in production?

**TL;DR:** Use provider JSON/schema mode or function calling; validate with Pydantic and retry on failure.

Reliable structured output uses provider features like OpenAI structured outputs, Anthropic tool use, or constrained decoding (Outlines, Instructor) that guarantee schema-conformant JSON. Outputs are parsed and validated with Pydantic or JSON Schema; on validation failure the system retries with the error appended to the prompt. For self-hosted models, grammar-constrained decoding via vLLM/llama.cpp enforces schemas at the token level. Logging schema-violation rate surfaces prompt or model regressions.

### How do you handle long contexts efficiently in production (context compression, prefix caching)?

**TL;DR:** Cache static prefixes, compress/summarize history, and retrieve only relevant chunks instead of stuffing.

Prefix caching (KV-cache reuse for shared system prompts and few-shots) cuts both latency and cost for repeated context, supported by Anthropic, OpenAI, vLLM, and SGLang. Conversation history is compressed via rolling summaries, sliding windows, or hierarchical memory. RAG and reranking limit retrieved context to top-k relevant chunks rather than naive stuffing. Token budgets and truncation policies prevent runaway prompts in long-running agents.

### What is semantic routing, and how do you implement it in a multi-model system?

**TL;DR:** Classify intent (cheap classifier or embeddings) and route to the best model/prompt for that intent.

Semantic routing analyzes incoming queries with an embedding-based classifier or small LLM and dispatches them to specialized models, prompts, or chains — e.g., code questions to a code model, simple FAQs to a small model, complex reasoning to a frontier model. Implementations use libraries like semantic-router or custom k-NN over prototype examples. It improves cost and quality by matching workload to the right tool. Confidence thresholds and fallback to a default model handle ambiguous routes.

### How do you manage secrets and API keys securely in LLM applications?

**TL;DR:** Store in a secrets manager (Vault, AWS Secrets Manager), inject at runtime, rotate regularly, never log.

API keys live in a centralized secrets manager with least-privilege IAM, never in code, env files in repos, or client bundles. Applications fetch secrets at startup or via short-lived tokens (workload identity, IRSA). Keys are scoped per environment and tenant, rotated on schedule, and revoked on compromise. Logging and tracing must redact authorization headers, and a gateway pattern lets you rotate provider keys without touching application code.

### Your LLM API has latency spikes during peak hours. How do you stabilize it?

**TL;DR:** Add caching, autoscale replicas, enable batching, and route overflow to a secondary provider.

Spikes typically come from saturated GPUs, provider throttling, or noisy long-context requests. Stabilize by enabling prompt and response caching, increasing replicas/quota ahead of peaks via autoscaling, and turning on continuous batching for self-hosted models. Add a queue with priority lanes and offload overflow to a fallback provider through the gateway. Set per-request timeouts and shed low-priority traffic before tail latency cascades.

### Your LLM costs are too high in production. How do you reduce costs without degrading quality?

**TL;DR:** Cache, route easy queries to smaller models, shorten prompts, and self-host high-volume workloads.

Audit token usage to find expensive endpoints, then apply prompt caching for shared prefixes, semantic cache for repeat queries, and model routing so cheap models handle simple intents. Trim system prompts, few-shots, and retrieved context to what evals prove necessary. Self-host quantized open models for high-volume, latency-tolerant traffic. Track cost-per-successful-task and gate every change with eval comparisons to prevent silent quality drops.

### Your application is hitting LLM provider rate limits during peak hours. How do you handle it?

**TL;DR:** Request quota increase, add multi-provider fallback, queue with backoff, and cache aggressively.

Short term, implement client-side token-bucket throttling and exponential backoff to stay under limits, and queue non-urgent traffic. Medium term, request quota increases, distribute load across multiple keys/regions, and add fallback providers via the gateway. Long term, cache more aggressively, route easy queries to smaller models with separate quotas, and self-host part of the workload. Monitor per-minute token and request usage so you can pre-warn before saturation.

### Your application depends on one LLM provider. How do you switch providers without downtime?

**TL;DR:** Abstract via a gateway with normalized prompts/schemas, run shadow traffic, then shift via feature flag.

Introduce an LLM gateway (LiteLLM, Portkey) so all calls flow through one normalized interface with provider-agnostic prompts and response schemas. Run the new provider in shadow mode to compare quality, latency, and cost on real traffic. Use feature flags to canary a small percentage and grow as evals pass. Keep the old provider warm as fallback until you are confident, then flip the default.

### Your AI system handles 100 requests/sec but crashes at 5000. How do you scale for concurrent requests?

**TL;DR:** Horizontal autoscaling, async I/O, connection pooling, batching, and a queue to absorb bursts.

Profile to find the bottleneck — usually GPU saturation, sync blocking calls, or provider rate limits. Move to async frameworks, pool HTTP connections, and add continuous batching for self-hosted models. Horizontally scale replicas behind a load balancer with autoscaling on queue depth or token throughput. Add a message queue (SQS, Kafka) to decouple ingestion from inference and enable graceful backpressure.

### A traffic spike brings down your AI system. How do you handle peak traffic?

**TL;DR:** Autoscale, queue, cache, shed low-priority traffic, and use multi-provider fallback during the spike.

Predictable peaks warrant pre-scaling and warm pools; unpredictable ones need fast horizontal autoscaling triggered by queue depth or latency. Front everything with a CDN/cache for deterministic responses and a queue for write paths. Apply load shedding — drop or delay low-priority requests, return cached or degraded responses — before the tail collapses. Spread load across providers and regions via the gateway so no single quota becomes the bottleneck.

### One LLM provider outage took down your entire system. How do you eliminate single points of failure?

**TL;DR:** Multi-provider fallback through a gateway, multi-region deployment, and circuit breakers with cached degraded modes.

Eliminate SPoFs by integrating at least two providers (e.g., OpenAI + Anthropic + Bedrock) behind a gateway with automatic failover on errors, latency, or circuit-breaker trips. Deploy across regions and clouds so a regional outage doesn't take you down. Cache common responses and design degraded modes (templated answers, smaller local model) for when all providers fail. Run monthly game-days simulating provider outages to validate the failover path.

### Your multi-LLM pipeline fails when one model in the chain breaks. How do you handle orchestration failure?

**TL;DR:** Per-step retries with fallbacks, circuit breakers, idempotent steps, and checkpoint resume.

Treat each step as an isolated unit with its own retry, timeout, and fallback model. Use a workflow engine (Temporal, LangGraph, Step Functions) that checkpoints intermediate state so a failed step can resume rather than restart. Circuit breakers stop cascading failures, and dead-letter queues capture irrecoverable inputs for review. Make each step idempotent so retries don't duplicate side effects.

### Your AI pipeline has zero visibility into which step is failing. How do you add observability?

**TL;DR:** Add distributed tracing (OpenTelemetry/LangSmith) with a span per step, structured logs, and per-stage metrics.

Wrap each pipeline step — retrieval, prompt, model call, tool, post-processor — in a trace span carrying inputs, outputs, tokens, latency, and errors. Use OpenTelemetry GenAI conventions or platforms like LangSmith, Langfuse, or Arize for trace trees and dashboards. Emit per-step metrics (success, latency, cost) and alert on regressions. Sample failing traces into an eval set to drive fixes systematically.

### You quantized your LLM, but accuracy dropped significantly. How do you minimize quantization loss?

**TL;DR:** Use better methods (AWQ/GPTQ), calibrate on representative data, keep sensitive layers in higher precision, or do QAT.

First profile which tasks degraded — outliers in activations or attention often cause disproportionate loss. Switch from naive PTQ to calibration-aware methods like GPTQ, AWQ, or SmoothQuant using representative data. Keep sensitive layers (embeddings, lm_head, attention projections) in FP16 via mixed precision. For persistent gaps, run quantization-aware training or fall back to a higher bit-width (INT8 instead of INT4).

### One failing AI component can take down your entire platform. How do you design graceful degradation?

**TL;DR:** Bulkhead components, circuit breakers, fallback responses, and feature flags to disable broken features instantly.

Isolate components with bulkheads (separate thread pools, queues, deployments) so one failure doesn't starve others. Circuit breakers trip on error/latency thresholds and serve cached, templated, or smaller-model responses while the dependency recovers. Feature flags allow instant disablement of broken AI features without redeploying. Design the UX to show partial results or fallback messaging so user-facing impact stays minimal during incidents.

---

## Frontier (2025)

> _Provider caching APIs and pricing referenced below are accurate as of 2026-05._

#### Cost & cache engineering

### How do you engineer for high prompt-cache hit rates in production, and what should you measure?

**TL;DR:** Put stable content first, mark cache breakpoints explicitly, keep prefixes byte-identical, and measure hit rate plus cached-token ratio.

Anthropic's prompt caching and OpenAI's automatic prefix caching both key on an exact prefix match, so anything dynamic — timestamps, user IDs, retrieved docs — must live after the cached prefix, not before it. Structure prompts as `[stable system + tools + few-shots] → [cache breakpoint] → [dynamic user turn]`, and reuse the same tokenization (no whitespace drift, no reordered JSON keys) across requests. With Anthropic, place explicit `cache_control` breakpoints on the largest stable blocks and respect the 5-minute (or 1-hour beta) TTL; with OpenAI, hits are automatic above ~1024 tokens but evict on idle. Track cache hit rate, cached vs uncached input tokens, and effective cost/request — a healthy production system on long system prompts typically sees 70–90% cached input tokens, cutting input cost ~90% on Anthropic reads and ~50% on OpenAI hits. See Anthropic's [prompt caching docs](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching) and OpenAI's [prompt caching guide](https://platform.openai.com/docs/guides/prompt-caching) for canonical rules.

### How do you observe and alert on prompt-cache hit rate, and what threshold matters?

**TL;DR:** Emit `cache_read_input_tokens` / `cache_creation_input_tokens` per call, alert when cached-token ratio drops below your baseline, and segment by route.

Both Anthropic and OpenAI return cache token counts in the usage block of every response (`cache_read_input_tokens`, `cache_creation_input_tokens` for Anthropic; `prompt_tokens_details.cached_tokens` for OpenAI). Pipe these into your observability stack (OpenTelemetry GenAI conventions, Langfuse, LangSmith, Datadog) and compute hit rate as `cached_input_tokens / total_input_tokens` per route, not globally — a chat route and a tool-use route have different baselines. Alert on relative drops (e.g., 7-day rolling baseline minus 20 points) rather than absolute thresholds, because a sudden collapse usually signals a prompt-template change, a non-deterministic field leaking into the prefix, or TTL eviction from a traffic dip. The threshold that matters is your own baseline: a 30-point drop translates almost linearly into input-cost regression and should page on-call before the bill arrives.

### What is semantic cache invalidation, and how does it differ from TTL-based invalidation?

**TL;DR:** Semantic invalidation expires entries when underlying meaning or source data changes; TTL expires them on a fixed clock regardless of correctness.

TTL invalidation — used by Anthropic's 5-minute/1-hour prompt cache and most response caches (Redis, GPTCache) — is simple and bounds staleness, but it evicts still-valid entries and serves stale ones until the timer fires. Semantic invalidation, used in response/embedding caches like GPTCache or Redis Vector with custom hooks, ties cache keys to source artifacts: when a knowledge-base document, prompt template version, or model snapshot changes, you invalidate every cached response derived from it (via tags, source-hash keys, or pub/sub bust events). The two are complementary — TTL caps worst-case staleness for prompt-prefix caches you don't control, while semantic invalidation keeps response caches correct against your RAG corpus and prompt registry. Production systems pair both: short TTL on the provider prefix cache, source-tagged semantic invalidation on the application-layer response cache.
