# LLMOps and Production AI — Cheat Sheet

[← Back to index](../../README.md) · [Full Q&A](./questions.md)

## Core concepts
- LLMOps vs MLOps: LLMOps adds prompt versioning, token economics, third-party API dependence, and non-deterministic eval.
- Observability: traces (request lifecycle), spans (per LLM/tool/retrieval call), structured logs, token + cost attribution.
- Prompt versioning: Git or registry (LangSmith, Langfuse, PromptLayer); pin versions per deployment.
- Model versioning: pin exact snapshot IDs (`gpt-4o-2024-08-06`) or checkpoint hashes; never rely on moving aliases.
- Gateway pattern: single proxy (LiteLLM, Portkey, Kong AI) for auth, routing, retries, caching, fallback, telemetry.
- Semantic routing: classify intent via embeddings/small LLM and dispatch to the right model/prompt.
- Guardrails: input/output validators (NeMo Guardrails, Guardrails AI, Llama Guard) for safety, schema, PII.
- Content filtering: moderation classifiers on inputs and outputs; block/redact/regenerate.
- Structured output: provider JSON mode, function calling, Instructor/Outlines, grammar-constrained decoding.
- Streaming: SSE or WebSockets; ship tokens as generated to slash perceived latency.
- Prefix / prompt caching: KV-cache reuse for shared system prompts and few-shots; major cost/latency win.
- A/B testing & feature flags: LaunchDarkly, Statsig, Unleash gate prompts, models, and features per segment.
- Fallback chains: prioritized provider list with retries, circuit breakers, cached/degraded responses.
- PII handling: Presidio/regex/NER redaction, zero-retention endpoints, VPC routing, log scrubbing.
- Quantization: PTQ, GPTQ, AWQ, SmoothQuant, QAT — INT8/INT4/FP8 for memory and throughput gains.
- Continuous batching & paged attention: vLLM/TGI/TensorRT-LLM features that maximize GPU utilization.
- Cache hit rate: `cached_input_tokens / total_input_tokens`; track per route, alert on drops vs rolling baseline.
- Semantic cache invalidation: bust entries when source docs, prompt templates, or model snapshots change — tag-keyed, not time-keyed.
- Cache-aware prompt design: stable content first (system, tools, few-shots), dynamic content last, byte-identical prefixes across calls.

## Decision rules
- API vs self-host: API for low volume, frontier quality, fast iteration; self-host for high volume, privacy, cost control at scale.
- Cache vs not: cache when prompts/responses repeat (system prompts, FAQs, deterministic queries); skip for highly personalized output.
- Streaming vs batch: streaming for chat/UX with humans; batch for offline jobs, evals, embeddings.
- One provider vs multi: multi when uptime SLA > 99.9%, regulatory diversity, or quality/cost arbitrage matters.
- Small model + routing vs single big model: route when query mix is heterogeneous and cost dominates.
- Quantize vs not: quantize when memory/latency-bound and eval drop is acceptable; otherwise stay FP16.

## Key SLAs / metrics
- TTFT (time-to-first-token), ITL (inter-token latency), P50/P95/P99 end-to-end latency.
- Tokens/sec per replica, concurrent requests, queue depth.
- Cost/request, cost-per-successful-task, cache hit rate, fallback rate.
- Availability (e.g., 99.9%), error rate, 429 rate, timeout rate.
- Quality: eval pass rate, hallucination rate, refusal rate, user thumbs/CSAT, drift score.
- Safety: jailbreak attempts blocked, PII leakage incidents, content-filter trigger rate.

## Common pitfalls
- Depending on a moving model alias — pin exact snapshot IDs.
- Logging raw prompts/responses with PII or secrets — redact before storage.
- Optimizing cost per token instead of cost per successful task.
- No eval gates in CI/CD — silent quality regressions slip to prod.
- Single-provider lock-in with no gateway — outages cascade.
- Naive context stuffing instead of retrieval + compression — cost and latency explode.
- Quantizing without calibration data and per-task evals — accuracy collapses.
- Missing per-step traces in multi-step pipelines — debugging becomes guesswork.
- Not measuring cache hit rate; cache miss because of dynamic prefix (timestamps, user IDs, reordered JSON) silently inflates input-token cost.
