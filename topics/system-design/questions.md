# AI System Design

[← Back to index](../../README.md) · [Cheat sheet](./cheatsheet.md)

> End-to-end AI system design: architecture, latency/cost tradeoffs, scaling, multi-tenancy, and reliability patterns.

### Design an AI-powered customer support chatbot.

**TL;DR:** RAG over a knowledge base with intent routing, tool use for account actions, guardrails, and human handoff on low confidence.

The system fronts users with a streaming chat UI backed by an orchestrator that classifies intent, retrieves relevant KB articles via hybrid search, and calls an LLM with tools for account lookups, ticket creation, and order status. Conversations persist in a session store with summarized memory; PII is redacted before logging. Key tradeoff is latency vs answer quality — aggressive caching of common queries and a smaller router model keep p95 low while a larger model handles complex turns. Reliability concerns: provider outages (need fallback model + cached canned responses) and hallucinated policy claims (mitigate with citations and refusal on missing context).

### Design a document Q&A system for enterprise use.

**TL;DR:** Parse → chunk → embed → vector store → hybrid retrieval → rerank → grounded answer with citations and ACL filtering.

Ingestion parses heterogeneous formats (PDF, DOCX, HTML), chunks with structural awareness, embeds, and indexes alongside metadata for ACL enforcement at query time. Retrieval combines BM25 and dense vectors, reranks the top-k with a cross-encoder, and feeds the LLM a constrained prompt that requires citations. The main tradeoff is recall vs precision: larger k improves recall but inflates cost and dilutes the prompt. Reliability concerns include stale documents (need incremental re-indexing) and permission leakage (enforce ACLs at retrieval, never just at the UI).

### Design a code generation and review system.

**TL;DR:** Repo-aware retrieval + code LLM with static-analysis tools, sandboxed execution, and human approval before merge.

Developers query through an IDE plugin or PR bot; the system retrieves relevant files via embeddings + AST/symbol indexes, generates patches with a code-tuned LLM, then runs linters, type checkers, and unit tests in a sandbox. A reviewer agent critiques diffs against repo conventions before surfacing suggestions. Tradeoff is autonomy vs safety — fully autonomous merges risk regressions, so default to suggestions with required human approval. Reliability concerns: prompt injection from repo content and supply-chain risk from generated dependencies (pin and scan).

### Design a content moderation system using AI.

**TL;DR:** Cheap classifier ensemble for fast filtering, LLM for borderline cases, human review queue, and audit log.

Content enters a streaming pipeline where lightweight classifiers (toxicity, NSFW, spam) score in parallel; high-confidence violations are blocked, clear passes are published, and ambiguous items route to an LLM for nuanced judgment with policy context. Borderline LLM verdicts go to human moderators whose labels feed back into model retraining. Tradeoff is latency vs accuracy — batched LLM calls reduce cost but block UX, so use async with optimistic publish + retract for low-risk surfaces. Reliability concerns include adversarial evasion (regular eval on red-team sets) and reviewer bias (calibration audits).

### Design a real-time AI recommendation system.

**TL;DR:** Two-stage retrieval (candidate generation → ranking) with feature store, online ranker, and embedding-based recall.

A candidate generator (ANN over user/item embeddings + heuristics) returns hundreds of items; a ranker model scores using real-time features from a low-latency feature store. Results are diversified and cached per session. The tradeoff is freshness vs latency — streaming feature updates improve relevance but raise infra cost; precompute embeddings offline and update rankers hourly. Reliability concerns: feature store staleness (monitor lag) and cold-start users (fall back to popularity + contextual signals).

### Design a multi-modal search system (text, image, video).

**TL;DR:** Unified embedding space (CLIP-style) with modality-specific encoders, ANN index, and cross-modal reranking.

Each asset is encoded by its modality-specific model into a shared embedding space; queries (text, image, or video frame) are encoded similarly and matched via ANN. A reranker uses richer cross-attention features for the top candidates, and metadata filters (date, license) refine results. Tradeoff is index size vs recall — quantization shrinks RAM but loses fidelity; tier hot vs cold shards. Reliability concerns: video ingestion backlog (sample frames, async embed) and embedding model drift (versioned indexes with shadow rollout).

### Design an AI-powered email assistant.

**TL;DR:** Inbox triage classifier + LLM drafter with calendar/contacts tools, user-style memory, and explicit send confirmation.

Incoming mail is classified (priority, category, action-needed) and summarized; for replies, the LLM drafts using thread context, user style profile, and tools (calendar, CRM). Drafts surface in the UI for edit/approve before sending. Tradeoff is automation vs trust — auto-send is risky, so default to draft mode with quick-accept. Reliability concerns: hallucinated commitments in replies (constrain to thread context + tools) and OAuth token leakage (per-user encryption, scoped tokens).

### Design a medical diagnosis assistant using AI.

**TL;DR:** Retrieval over medical literature + structured patient data, multi-model ensemble, mandatory clinician sign-off, full audit trail.

Patient data (EHR, labs, imaging) is normalized into a structured input; the system retrieves relevant guidelines and similar cases, runs specialist models (e.g., imaging classifiers) and an LLM for differential reasoning, and presents ranked hypotheses with evidence. Clinicians review and decide. Tradeoff is sensitivity vs specificity — high recall avoids missed diagnoses but floods clinicians; tune per use case. Reliability concerns: regulatory compliance (HIPAA, FDA SaMD) and silent model degradation (continuous performance monitoring on holdout sets).

### Design a fraud detection system powered by LLMs.

**TL;DR:** Real-time ML scorer for high-volume decisions, LLM for narrative case review and explanation generation on flagged events.

Transactions hit a streaming feature pipeline feeding a gradient-boosted scorer for sub-50ms decisions; flagged cases enrich with related entities and flow to an LLM that synthesizes a case narrative for analysts and proposes investigative steps. The tradeoff is latency vs context — LLMs cannot sit on the hot path, so reserve them for offline/async enrichment. Reliability concerns: concept drift as fraudsters adapt (frequent retraining + champion/challenger) and false positives harming UX (calibrated thresholds per segment).

### Design an AI-powered data extraction pipeline from unstructured documents.

**TL;DR:** OCR/parser → layout-aware chunking → schema-constrained LLM extraction → validation → human-in-loop for low confidence.

Documents enter a queue; a parser extracts text and layout, then an LLM (or fine-tuned VLM) extracts fields against a JSON schema with per-field confidence. Validators check types, cross-field consistency, and reference data; failures route to reviewers whose corrections feed retraining. Tradeoff is accuracy vs throughput — multi-pass extraction improves quality but doubles cost; use single-pass for high-confidence templates. Reliability concerns: schema drift across document versions and PII handling (encrypt at rest, redact in logs).

### Design a personalized learning assistant.

**TL;DR:** Learner model + content graph drives adaptive sequencing; LLM tutors with Socratic prompts and tool-based exercises.

The system maintains a per-learner skill state updated from quiz results and interaction signals; a recommender selects next content/exercises from a knowledge graph, and an LLM delivers explanations, hints, and feedback. Tradeoff is engagement vs rigor — too much hand-holding stalls learning; calibrate hint policies. Reliability concerns: hallucinated facts in tutoring (ground in vetted curriculum) and child-safety filtering for K-12 contexts.

### Design an AI system for automated code migration.

**TL;DR:** AST-based deterministic transforms first, LLM for residual cases, comprehensive test harness gating every change.

A planner inventories the codebase, applies rule-based codemods for mechanical changes (imports, API renames), then routes complex semantics-preserving rewrites to an LLM with retrieved examples. Each change is verified by running existing tests in CI; failures trigger retry with diagnostics. Tradeoff is automation breadth vs correctness — pure-LLM migrations break subtly; combine with deterministic tools. Reliability concerns: insufficient test coverage hiding regressions (require baseline coverage before migration) and large-PR review fatigue (batch by module).

### Design an AI-powered legal document review system.

**TL;DR:** Clause segmentation + classification + RAG over precedents, with risk-flagging UI and attorney sign-off.

Documents are segmented into clauses, classified by type, and compared against playbooks and precedent corpora. An LLM flags deviations, summarizes risks, and proposes redlines with citations. Attorneys review in a side-by-side UI. Tradeoff is depth vs speed — exhaustive analysis is costly, so tier by document risk. Reliability concerns: hallucinated case citations (verify against authoritative sources) and confidentiality (single-tenant deployment or strict isolation).

### Design a conversational AI system with memory across sessions.

**TL;DR:** Short-term window + summarized long-term memory + vector-retrieved episodic memory, with explicit user controls.

Each turn is processed with the recent message window plus retrieved relevant past memories (vector search over prior summaries) and a rolling profile of stable user facts. Background jobs summarize and compress older sessions. Tradeoff is recall vs prompt bloat — too much memory dilutes attention and raises cost; rank and trim. Reliability concerns: memory poisoning (validate before persisting) and privacy (user-visible memory store with delete).

### How do you design for latency vs quality trade-offs in AI systems?

**TL;DR:** Tier models by query complexity, stream tokens, cache aggressively, set explicit latency budgets per stage.

Establish a p95 budget and decompose it across retrieval, model, and post-processing stages; route simple queries to small/fast models and escalate only when needed (cascade or router). Stream output to mask perceived latency, and cache exact + semantic hits. The tradeoff is sharp: bigger models win on quality but blow the budget, so invest in evals that quantify quality loss from cheaper paths. Reliability concerns: cascade misrouting (monitor escalation rates) and cache staleness (TTL + invalidation hooks).

### How do you implement caching strategies for LLM applications?

**TL;DR:** Layer exact-match, semantic, and prompt-prefix caches; key by inputs + model version; invalidate on context changes.

Exact-match cache catches duplicate prompts cheaply; semantic cache (embedding similarity over prior queries) captures paraphrases with a similarity threshold; prefix caching (provider-side or self-hosted) reuses KV state for shared system prompts. Cache keys must include model ID, temperature, and tool schema to avoid stale hits. Tradeoff is hit rate vs correctness — loose semantic thresholds return wrong answers. Reliability concerns: cache stampedes (single-flight) and PII in cache entries (per-user namespaces, encryption).

### How do you design rate limiting and cost management for AI APIs?

**TL;DR:** Per-tenant token + request quotas at an AI gateway, priority queues, budget alerts, and provider failover.

Front all LLM calls with a gateway that enforces per-key/tenant quotas (RPM, TPM, $/day), tags spend for chargeback, and queues low-priority traffic during contention. Token estimation pre-call prevents budget overrun. Tradeoff is fairness vs throughput — strict per-tenant caps idle capacity; allow burst with backpressure. Reliability concerns: noisy-neighbor exhausting shared provider quota (separate API keys per tier) and runaway agent loops (max-steps + cost circuit breaker).

### How do you handle failover and fallback strategies for AI systems?

**TL;DR:** Multi-provider routing with health checks, fallback chain (primary → secondary → cached → static), idempotent retries.

Health-check each provider continuously; on errors or latency spikes, the gateway retries on a secondary model/provider, then a cached response, then a graceful static reply. Use circuit breakers to stop hammering failing endpoints. Tradeoff is consistency vs availability — different providers produce different outputs, complicating evals; lock down via prompts and post-validation. Reliability concerns: silent quality degradation on fallback (track which path served each request) and retry storms (jittered backoff).

### How do you design an AI system for high availability and fault tolerance?

**TL;DR:** Multi-region active-active, stateless services, replicated vector/state stores, multi-provider LLM routing, chaos-tested.

Run stateless inference and orchestration tiers behind global load balancers across at least two regions; replicate vector stores and session state with conflict resolution. Use multiple LLM providers behind a gateway. Tradeoff is consistency vs availability — strongly consistent replication adds latency; eventual consistency works for most read-heavy AI workloads. Reliability concerns: dependency on single embedding model version (versioned indexes) and untested failovers (regular game days).

### How do you design an AI system that gracefully degrades when the model is unavailable?

**TL;DR:** Tiered fallbacks: smaller model → cached answer → rule-based response → clear user-facing degraded message.

Define a degradation ladder per feature: if the primary model fails, try a cheaper model; if that fails, serve a semantically-cached prior answer; if that fails, serve deterministic rule-based output; finally, communicate degraded mode honestly. Tradeoff is UX honesty vs perceived reliability — silent degradation hides quality drops, so log and surface metrics. Reliability concerns: cache poisoning during outages (validate before serving) and feature flags to disable risky paths under load.

### What are the key considerations for multi-region deployment of AI systems?

**TL;DR:** Data residency, model/index replication, latency-based routing, cross-region failover, consistent evals per region.

Pick regions to meet residency (GDPR, HIPAA) and user-latency goals; replicate vector indexes and feature stores asynchronously, route via geo-DNS or anycast, and ensure each region can serve independently during partition. Tradeoff is cost vs availability — active-active doubles infra; active-passive saves money but risks cold-failover latency. Reliability concerns: provider availability differing per region (multi-provider) and embedding-version skew across regions during rollout.

### Design an AI-powered search engine for an e-commerce platform.

**TL;DR:** Hybrid lexical + semantic retrieval, learned ranker with personalization, query understanding LLM, ANN over product embeddings.

Queries pass through an LLM-based normalizer that extracts intent, attributes, and constraints; retrieval blends BM25 and dense embeddings over a product index, then a learning-to-rank model personalizes. Faceted filters and category boosts apply post-retrieval. Tradeoff is personalization vs serendipity — over-personalized results hurt discovery. Reliability concerns: real-time inventory sync (filter out OOS at serve time) and click-model bias contaminating ranker training (use counterfactual evaluation).

### Design an AI gateway/proxy for managing LLM access across an organization.

**TL;DR:** Central proxy enforcing auth, quotas, routing, caching, logging, PII redaction, and provider failover for all LLM calls.

All applications call a single gateway that authenticates tenants, applies per-team quotas and budgets, routes to chosen models (with A/B and shadow modes), caches responses, redacts PII before egress, and emits structured logs for audit and cost attribution. Tradeoff is control vs latency — extra hops add ms but centralize governance. Reliability concerns: gateway becoming SPOF (deploy multi-region, stateless) and prompt/response logging leaking secrets (encrypt, scoped access).

### How do you design a RAG system that handles conflicting information across sources?

**TL;DR:** Source-attributed retrieval, freshness/authority weighting, conflict-aware prompting that surfaces disagreement with citations.

Each retrieved chunk carries source, timestamp, and trust score; the prompt instructs the model to detect conflicts and present both sides with citations rather than picking arbitrarily. Reranking can prefer authoritative or recent sources depending on query type. Tradeoff is decisiveness vs honesty — users dislike "it depends" answers, so calibrate when to prefer top-source vs surface conflict. Reliability concerns: outdated sources dominating retrieval (recency boosts, scheduled re-ingest) and source-trust manipulation.

### How do you approach capacity planning for an AI system?

**TL;DR:** Forecast QPS × tokens-per-request, headroom for peaks, model-tier mix, GPU/provider quota lead-time, load-test continuously.

Model traffic by route and time-of-day; estimate input/output tokens per call to derive provider TPM needs and self-hosted GPU sizing. Reserve 30–50% headroom for spikes and add autoscaling on queue depth. Tradeoff is cost vs latency under burst — overprovisioning is expensive but undersized systems queue or shed. Reliability concerns: provider quota lead times (request increases weeks ahead) and cold-start latency on GPU autoscale (keep warm pool).

### Design a multi-tenant AI chatbot platform where each business gets a custom chatbot.

**TL;DR:** Shared infra with per-tenant config (prompts, KB, tools, model), strict data isolation, per-tenant quotas and observability.

Tenants onboard by configuring branding, system prompts, knowledge bases (isolated namespaces in vector store), tools, and model tier. The runtime resolves tenant context per request and enforces ACLs end-to-end. Tradeoff is shared efficiency vs isolation — full single-tenant deploys cost more but simplify compliance; shared with strong logical isolation suits most. Reliability concerns: noisy-neighbor consuming shared LLM quota (per-tenant rate limits) and cross-tenant data leakage (namespace enforcement at every layer + tested).

### Design an AI meeting summarizer system for thousands of meetings daily.

**TL;DR:** Async pipeline: ingest audio → diarize → transcribe → chunked LLM summarization → structured output + delivery.

Audio enters object storage, triggering a job that diarizes and transcribes (Whisper or similar), then chunks transcripts for map-reduce summarization producing summary, action items, and decisions. Results are delivered via email/Slack and stored for search. Tradeoff is latency vs cost — real-time summaries need streaming ASR + incremental summarization; daily digests can batch cheaply. Reliability concerns: speaker misattribution (improve diarization, allow corrections) and PII handling for recordings (encryption, retention policies).

### Design an AI notification system that prioritizes instead of broadcasting.

**TL;DR:** Per-user relevance model scores candidate events; thresholding and rate-limiting deliver only high-value notifications.

Candidate events flow through a feature-enriched scorer (interest model + urgency + recency); above-threshold items respect per-user frequency caps and quiet hours. An LLM can compose contextual summaries for grouped notifications. Tradeoff is recall vs annoyance — too many notifications cause opt-outs; aggressive thresholds miss important items. Reliability concerns: feedback loops (treat opens/dismissals as labels but debias) and stale interest models for changing users.

### Design an AI-powered anomaly detection system for cloud infrastructure.

**TL;DR:** Streaming metrics → unsupervised baselines + supervised classifier → LLM for incident summarization and runbook suggestions.

Telemetry streams into a feature pipeline; per-metric statistical baselines (e.g., MAD, Prophet) and a supervised model flag anomalies, correlated across services to reduce noise. Detected incidents trigger an LLM that synthesizes a summary with relevant logs/traces and suggests runbook steps. Tradeoff is sensitivity vs alert fatigue — tighter thresholds mean missed incidents. Reliability concerns: detector self-monitoring (the detector failing silently) and grounding LLM suggestions in actual runbooks to avoid invented commands.

### Design an AI-powered document processing pipeline for financial institutions.

**TL;DR:** Compliant ingest → OCR/parse → schema extraction with audit trail → validation rules → reviewer queue → downstream systems.

Documents arrive via secure channels; the pipeline parses, classifies, and extracts to a strict schema with per-field confidence and source spans for audit. Validation enforces business rules (e.g., totals reconcile); low-confidence items go to reviewers, with full lineage stored for regulators. Tradeoff is automation rate vs error cost — over-automating high-stakes fields creates compliance risk. Reliability concerns: audit/immutability requirements (WORM storage, signed logs) and data residency.

### Design an AI dynamic pricing engine.

**TL;DR:** Demand forecasting + competitor signals feed an optimizer that respects business constraints; LLM optional for explanations.

Features include historical demand, inventory, competitor prices, seasonality, and customer segments; an ML model forecasts demand elasticity and an optimizer sets prices subject to margin floors, fairness, and legal constraints. Changes deploy via guardrails and A/B tests. Tradeoff is responsiveness vs stability — frequent price changes erode trust; cap velocity. Reliability concerns: feedback loops where price changes alter demand signals (use causal methods) and discrimination/regulatory risk (audit by segment).

### Design an AI resume screening system that handles 100K applications per week.

**TL;DR:** Async ingest → parse → embed + structured extraction → role-specific ranker → calibrated shortlist with fairness audits.

Resumes parse asynchronously into structured fields and embeddings; per-role rankers score candidates against job criteria and rank, with explanations and fairness-aware calibration across protected groups. Recruiters review the shortlist. Tradeoff is throughput vs depth — full LLM analysis per resume is costly; reserve for top-k. Reliability concerns: bias amplification (regular disparate-impact audits and model cards) and compliance with EEOC/EU AI Act (human-in-loop, transparency).

### Design an AI voice assistant architecture.

**TL;DR:** Streaming ASR → intent/LLM with tools → streaming TTS, all under tight end-to-end latency budget with barge-in support.

Audio streams to ASR with partial transcripts; an orchestrator decides intent, calls tools or an LLM for response, and streams TTS back token-by-token. Echo cancellation and VAD enable barge-in. Tradeoff is latency vs accuracy — final ASR is more accurate but waits for end-of-utterance; use partials for early intent. Reliability concerns: network jitter under mobile conditions (adaptive bitrate, edge inference) and wake-word false positives (on-device gating).

### Design a multi-agent workflow system where agents collaborate on complex tasks.

**TL;DR:** Orchestrator-worker or planner-executor pattern with shared memory, typed message bus, tool registry, and termination guards.

A planner decomposes the task into subtasks dispatched to specialist agents (research, code, review) via a typed message bus; a shared scratchpad/state store passes intermediate results. The orchestrator enforces step limits, cost caps, and convergence criteria. Tradeoff is autonomy vs control — emergent multi-agent behavior is powerful but unpredictable; pin roles and add deterministic checks. Reliability concerns: infinite loops (max steps + budget) and cascading hallucinations (validate intermediate outputs before downstream use). Reference: [Multi-Agent Systems](https://outcomeschool.com/blog/multi-agent-systems).

### Design a real-time AI transcription system for concurrent audio streams.

**TL;DR:** Per-stream ASR workers behind a load balancer, GPU pool with autoscaling, partial-result streaming, end-of-utterance finalization.

Each audio stream connects via WebSocket to a stateless gateway that assigns a GPU-backed ASR worker; partials stream back continuously, finals on segmentation. Workers scale on queue depth; sticky routing maintains stream affinity. Tradeoff is latency vs accuracy — smaller streaming models are faster, larger offline models more accurate; offer both modes. Reliability concerns: worker crashes mid-stream (checkpoint and resume) and GPU saturation under spikes (warm pool + graceful 503 with backoff).

### Design an AI-powered live streaming content moderation system.

**TL;DR:** Sample frames + audio in real time, run multimodal classifiers, escalate to LLM/human for borderline, enforce within seconds.

Frames are sampled at adaptive intervals and audio chunks transcribed; classifiers score for policy violations, with high-confidence hits triggering automatic action (blur, mute, cut). Borderline cases route to fast LLM review and a human queue. Tradeoff is latency vs accuracy — sub-second decisions need small models; deeper review adds delay but improves precision. Reliability concerns: adversarial content (regular red-teaming) and creator appeals (logged decisions and rapid review SLA).

---

## Frontier (2025)

> _Reference designs below assume 2026-05 SOTA models and infra._

#### Modern system designs

### Design a coding-agent platform (multi-tenant, large-scale).

**TL;DR:** Per-session firecracker/microVM sandboxes, repo embedding + symbol index, planner-executor LLM loop, streamed diffs, token-metered billing.

Tenants connect their repos, which are shallow-cloned into per-session microVM sandboxes (Firecracker/gVisor) with network egress controls; an indexer builds embeddings + tree-sitter symbol graphs cached per commit SHA. The agent loop (planner → editor → test runner) streams tool calls and partial diffs over WebSocket while a verifier runs tests in-sandbox; SWE-Bench-style evals gate model rollouts. Main tradeoff is sandbox cold-start vs isolation — pre-warmed VM pools cut p50 but raise idle GPU/CPU cost. Reliability concerns: prompt injection from repo contents (treat repo as untrusted, scoped tool perms) and runaway agent loops (step caps + per-tenant token budgets metered for usage-based billing).

### Design a realtime voice assistant for thousands of concurrent users.

**TL;DR:** Edge VAD → streaming STT → speculative LLM → streaming TTS over WebRTC, sub-300ms end-to-end with barge-in and GPU pooling.

Clients open WebRTC sessions to regional edge servers running on-device-or-edge VAD; audio frames stream to a sticky STT worker producing partials, which feed an LLM that begins generation on stable partials and streams tokens to a chunked TTS engine returning audio packets. End-to-end p95 budget ~300ms decomposes into VAD 20ms / STT partial 80ms / LLM TTFT 120ms / TTS first-chunk 60ms; barge-in cancels in-flight LLM/TTS on new speech detection. GPU pooling with per-tenant token-bucket admission and warm replicas absorbs spikes; under saturation, fall back to a non-realtime turn-based path with explicit "thinking" cue. Reliability concerns: jitter on mobile networks (adaptive bitrate, FEC) and STT/LLM provider failover with consistent voice (cached TTS voice embeddings, multi-vendor routing).
