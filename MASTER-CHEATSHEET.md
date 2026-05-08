# Master Cheat Sheet

The 5-minute synthesis across all 14 topics. For depth, follow links to per-topic cheatsheets and Q&A.

[← Back to index](./README.md) · [Glossary](./GLOSSARY.md) · [Study plan](./STUDY-PLAN.md)

> _Frontier-2025 specifics will rot; treat numeric ranges as guides, not absolutes._

---

## The 30 most-tested concepts

- **Attention (Q,K,V)** — softmax(QKᵀ/√d_k)V; each token weights all others; scaling stops softmax saturation.
- **KV cache** — stored past keys/values to skip recomputation during autoregressive decode; dominant inference memory.
- **Transformer block** — multi-head attention + FFN + residual + RMSNorm/LayerNorm; stacked N times.
- **MoE** — N expert FFNs + router; only top-k experts active per token; sparse compute, dense memory.
- **RoPE** — rotary positional embedding; relative position via complex rotation; supports extrapolation.
- **GQA / MQA** — query heads share K/V across groups → smaller cache, similar quality vs MHA.
- **Flash Attention** — I/O-aware tiled attention kernel; identical math, less HBM traffic, big speedup.
- **BPE / tokenizer** — subword merges; train/inference mismatch silently degrades quality.
- **Embeddings** — dense semantic vectors; bi-encoder for fast retrieval, cross-encoder for precision rerank.
- **RAG** — retrieve external context, stuff into prompt, generate with citations; for facts/freshness.
- **Hybrid search** — BM25 lexical + dense semantic fused via RRF; required for jargon, code, names.
- **Re-ranker** — cross-encoder re-scores top-20–100; biggest precision lift after hybrid retrieval.
- **HyDE** — generate hypothetical answer then embed it for retrieval; helps abstract queries.
- **GraphRAG** — entity graph + community summaries; for global multi-hop relational queries.
- **ColBERT** — late-interaction per-token vectors with MaxSim; recall on rare terms vs bi-encoder.
- **Agent loop** — think → act (tool) → observe → repeat until done, max-steps, or budget hit.
- **ReAct** — interleaved Thought/Action/Observation; flexible, token-heavy, drift-prone for long horizons.
- **Plan-and-Execute** — planner builds steps upfront, executor runs them; cheaper, less adaptive.
- **MCP** — Model Context Protocol; open spec decoupling agent hosts from tool/data servers.
- **LoRA / QLoRA** — low-rank adapter ΔW=BA on frozen base; QLoRA adds 4-bit NF4 base for single-GPU.
- **RLHF** — SFT → reward model from preferences → PPO with KL penalty to base.
- **DPO** — direct preference optimization on pairs, no reward model; default offline alignment loss.
- **GRPO** — PPO variant, group-relative advantages, no critic; powers DeepSeek-R1 reasoning RL.
- **Reasoning model** — RL-tuned to emit long hidden chain-of-thought before answer (o-series, R1, extended-thinking).
- **Prompt caching** — provider-exposed prefix reuse; ~10% input cost on Anthropic, ~50% on OpenAI; cuts TTFT.
- **Quantization** — FP16 → INT8 → INT4 (AWQ/GPTQ); ~2× memory savings per step, quality drop accelerates at INT4.
- **Paged attention** — block-based KV allocation (vLLM); kills fragmentation, enables prefix sharing.
- **Continuous batching** — token-level scheduling so finished sequences leave and new ones join mid-decode.
- **Speculative decoding** — small draft model proposes K tokens, large verifies in parallel; ~2–3× speedup.
- **Prompt injection / jailbreak** — direct or indirect (RAG/tool output) instructions hijack model; treat retrieved data as untrusted.
- **Constitutional AI / RLAIF** — model critiques and revises against written constitution; AI labels replace most human harmlessness data.
- **LLM-as-judge** — strong model with rubric scores or pairwise-prefers outputs; cheap but biased on position/length.
- **RAGAS** — context precision/recall (retrieval), faithfulness + answer relevance (generation); standard RAG eval gate.

---

## The 10 highest-leverage decision rules

- **RAG vs fine-tuning** — RAG for facts/freshness/citations; fine-tune for stable behavior/style/format. Combine when both gaps exist.
- **Open vs closed LLM** — open for control, on-prem, cost predictability at scale; closed for SOTA quality with no infra.
- **Prompt → RAG → fine-tune** — try in that order; cost and complexity rise each step. Don't fine-tune for facts.
- **Reasoning model vs standard** — reasoning when error cost ≫ inference cost (math, code, multi-step planning, agents); standard for chat, classification, summarization, lookup. Route cheap-first, escalate hard cases with capped thinking budget.
- **ReAct vs Plan-and-Execute** — ReAct for exploratory/uncertain tasks; Plan-Execute for predictable decomposable workflows under cost pressure.
- **Single vs multi-agent** — default single; go multi only when one agent provably can't handle role diversity or parallelism (1.5–3× token overhead).
- **DPO vs PPO/GRPO** — DPO on clean offline pairs (default); PPO/GRPO when online verifier reward exists or reward shaping needed.
- **LoRA vs full FT** — default LoRA; full FT only for large domain shifts or new tokenizer.
- **Self-host vs API** — self-host when sustained GPU util > 30–50%, custom models, data residency, or scale × per-token cost beats GPU TCO; API for speed-to-market and bursty traffic.
- **Streaming vs batch** — streaming for human chat/UX; batch async for offline jobs, evals, embeddings, non-interactive workloads.

---

## The 15 numeric anchors you should know

- **Attention scaling**: divide by √d_k.
- **KV cache size** ≈ 2 × n_layers × n_kv_heads × d_head × seq_len × batch × bytes/elem (often dwarfs weights at long context).
- **Model memory**: params × bytes_per_param (FP16=2B, INT8=1B, INT4=0.5B); 7B FP16 ≈ 14 GB.
- **Sampling defaults**: temperature 0.7, top-p 0.9, top-k 50; temp 0–0.3 factual/code; 0.7–1.0 creative.
- **Chunking**: 256–1024 tokens (start 512), 10–20% overlap, retrieve top-k 20–100, rerank to 3–10.
- **Embedding dims**: 384 small, 768–1024 mid, 1536–4096 large; storage = N × dim × 4 B (or 1 B int8).
- **HNSW**: M = 16–48, efConstruction 100–400, efSearch 50–200; IVF nlist ≈ √N.
- **LoRA**: rank 4–32 (up to 128 hard), alpha = 2×r, lr 1e-4–3e-4 (QLoRA 2e-4); 1–3 epochs; targets q,v minimum.
- **RLHF KL β** ≈ 0.01–0.1 against SFT reference; self-consistency N = 5–40 (plateau ~10–20).
- **CFG scale**: 4–7 balanced; >10 oversaturates. Diffusion steps: DDIM 20–50, LCM 4–8, Turbo 1–4.
- **Image token cost**: ~1000+ tokens per HD image; 765 per 512×512 GPT-4V tile.
- **Voice latency**: end-to-end < 800 ms target, < 300 ms feels human; chat TTFT < 500 ms, P95 < 5 s.
- **Cache hit rate**: 30–70% semantic; 50–90% prompt-prefix on stable system prompts.
- **DP epsilon**: ε < 1 strong, 1–10 typical, > 10 weak; report (ε, δ) with accuracy.
- **Cost per request**: $0.001–$0.05 Q&A; $0.05–$0.50 agentic tasks. Speculative decode ~2–3× when accept > 0.7.

---

## The 12 common pitfalls

- **Lost in the middle** — long context underweights middle; place key info at start/end and rerank to small top-k.
- **Quadratic attention OOM** — long sequences blow memory; use sliding window, Flash Attention, paged attention.
- **No re-ranker** — bi-encoder scores alone leave precision on the table; cross-encoder rerank biggest single lift.
- **Tool hallucination** — vague schemas/names; tighten descriptions, use enums, add types/regex, feed validation errors back.
- **No max-iteration cap** — agents loop forever; always hard-cap steps and per-task token/$ budget.
- **Aggressive INT4 without calibration** — reasoning collapses; use AWQ/GPTQ with calibration set and per-task evals.
- **Prompt cache miss** — dynamic prefix (timestamps, IDs, reordered JSON) breaks cache; static-first, dynamic-last, byte-identical prefixes.
- **No eval set / golden data** — tuning blind, regressions invisible; build versioned regression suite early, grow with every prod failure.
- **Single-provider lock-in** — outage = full downtime; use gateway abstraction (LiteLLM/Portkey) with fallback chain.
- **Untrusted retrieved content** — indirect prompt injection via RAG/tool output; treat all external content as data, not instructions.
- **PII re-identification** — quasi-identifiers (ZIP+DOB+gender) re-id naive removals; use k-anonymity / l-diversity / DP.
- **Stale embeddings / model drift** — upgrading embedding model requires full re-embed; pinning moving aliases breaks reproducibility.

---

## Frontier 2025 anchors (Phase A)

- **Reasoning models (o-series, Claude extended thinking, DeepSeek-R1, Gemini thinking)** — RL on verifiable rewards (GRPO) bakes long-CoT behavior into weights; main dial is thinking budget (`budget_tokens`, `reasoning.effort`); test-time compute scaling gives predictable accuracy gains without retraining.
- **Prompt caching (provider) + prefix caching (engine)** — Anthropic explicit `cache_control` (≤4 breakpoints, 5 min default / 1 h extended), OpenAI auto > 1024 tokens; vLLM RadixAttention / SGLang radix tree underneath. Worth designing for when static prefix > 1k tokens reused ≥ 3× per TTL.
- **DPO and family (IPO, KTO, ORPO)** — preference optimization without reward models; DPO default on pair data, KTO when feedback is binary/unpaired, ORPO folds alignment into single SFT run, IPO when DPO overfits deterministic prefs.
- **Agent frameworks** — LangGraph (durable stateful graphs), CrewAI (role-based prototypes), AutoGen (conversational multi-agent), Agents SDK / smolagents (minimal primitives, CodeAct emits Python in sandbox). MCP standardizes tool/data server interface across hosts.
- **Realtime voice** — end-to-end voice models (GPT-4o realtime, Gemini Live, Moshi) emit audio tokens via neural codec (~75 tok/s, EnCodec/Mimi); chained STT→LLM→TTS only when swappability/text-control matters. Sub-300 ms target with streaming partials, speculative LLM, barge-in via VAD.

---

## Architecture quick map (by stage)

- **Ingest**: load → parse (Unstructured/LlamaParse/Docling for PDFs, preserve tables) → chunk (recursive/semantic/parent-child) → embed → upsert (with metadata + ACLs) → CDC for streaming freshness (p95 < 60 s).
- **Retrieval**: query transform (HyDE / decomposition / multi-query) → hybrid (BM25 + dense, RRF k=60) → metadata pre-filter → top-20–100 → cross-encoder rerank to 3–10.
- **Generation**: cache-aware prompt (static-first, dynamic-last) → structured output (JSON mode / tool calling / Outlines/Instructor) → stream tokens → verify citations span exists.
- **Agent layer**: typed tool schemas → ReAct or Plan-Execute → reflection on critical outputs → guardrails (input filter, output validator, tool allowlist) → sandbox (E2B/Firecracker microVM) → HITL on irreversible actions.
- **Serving**: vLLM (general GPU) / SGLang (prefix-heavy) / TensorRT-LLM (max NVIDIA throughput) / llama.cpp (CPU/edge) → paged attention + continuous batching + LoRA stacking (S-LoRA).
- **Gateway**: LiteLLM/Portkey for auth, routing, retries, fallback, semantic + prefix cache, redaction, telemetry, per-tenant rate limits.
- **Observability**: traces + spans + token/cost attribution (LangSmith/Langfuse/Phoenix) → eval gates in CI (Promptfoo/Inspect AI) → online A/B + shadow.
- **Safety**: input filter (jailbreak/PII/topic) → instruction hierarchy → tool allowlist + sandbox → output filter (toxicity/PII/schema/citation) → fail closed for high-risk.

---

## Eval and metrics quick map

- **Generation w/ reference, lexical**: BLEU (MT, n-gram precision + BP), ROUGE (summarization, recall over n-grams/LCS), exact match.
- **Generation w/ reference, paraphrase OK**: BERTScore (contextual cosine), LLM-judge with rubric.
- **Generation w/o reference**: LLM-as-judge (Likert for thresholds, pairwise/Elo for selection); validate vs human sample; randomize order; penalize length.
- **RAG**: context precision/recall (retrieval), faithfulness + answer relevance (generation) via RAGAS / TruLens triad / ARES; debug retrieval before generation.
- **Hallucination**: faithfulness rate, FActScore, SAFE, citation precision/recall, contradiction rate.
- **Agents**: trajectory eval — tool selection, argument validity, step efficiency, error recovery, intermediate safety; SWE-Bench Verified for coding agents.
- **Capability**: MMLU (knowledge), HumanEval (code), GSM8K (math); watch contamination — trust private evals.
- **Safety**: HarmBench (510 behaviors) / JailbreakBench (100 + leaderboard) ASR; pair with WMDP, XSTest/OR-Bench (over-refusal), red-teaming.
- **Production SLAs**: TTFT, ITL/TPOT, P50/P95/P99 e2e, tokens/s/replica, queue depth, cost/successful-task, cache hit rate, fallback rate, eval pass rate, drift score.
- **Stats**: paired bootstrap ≥1000 resamples, 95% CI; ~600 paired samples for 5% lift at 80% power; Cohen's κ > 0.6 substantial.

---

## Compliance / responsible AI quick map

- **EU AI Act tiers**: unacceptable (banned) / high-risk (Annex III: employment, credit, biometrics, critical infra → conformity assessment) / limited (transparency) / minimal. GPAI has transparency + systemic-risk obligations.
- **GDPR/CCPA**: lawful basis, minimization, purpose limitation, subject rights (access/erasure/portability), DPIA, Art. 22 automated-decision rights.
- **Frameworks**: NIST AI RMF (Govern/Map/Measure/Manage + GenAI profile), ISO/IEC 42001 management system.
- **Privacy tech**: differential privacy (DP-SGD = clip + noise + accountant; ε < 1 strong), federated learning + secure aggregation, k-anonymity / l-diversity for releases.
- **Provenance**: SynthID, Stable Signature watermarks; C2PA content credentials; target > 99% TPR at < 1% FPR.
- **Fairness**: demographic parity, equalized odds, calibration, equal opportunity — mutually incompatible; pick per context, evaluate intersectional slices (Gender Shades), document tradeoffs in model card.
- **Bias mitigation order**: data fixes (rebalance/relabel) → model fixes (constraints, adversarial debias) → post-hoc (threshold tuning).
- **Audit**: immutable logs from day 1; retention 6 mo–7 yr per jurisdiction; show uncertainty to humans, audit overrides to fight automation bias.

---

## Quick links by topic

| Topic | Cheat sheet | Full Q&A |
|---|---|---|
| LLM Fundamentals | [↗](./topics/llm-fundamentals/cheatsheet.md) | [↗](./topics/llm-fundamentals/questions.md) |
| Prompt Engineering | [↗](./topics/prompt-engineering/cheatsheet.md) | [↗](./topics/prompt-engineering/questions.md) |
| RAG | [↗](./topics/rag/cheatsheet.md) | [↗](./topics/rag/questions.md) |
| Agents | [↗](./topics/agents/cheatsheet.md) | [↗](./topics/agents/questions.md) |
| Fine-Tuning | [↗](./topics/fine-tuning/cheatsheet.md) | [↗](./topics/fine-tuning/questions.md) |
| Vector DBs & Embeddings | [↗](./topics/vector-databases-embeddings/cheatsheet.md) | [↗](./topics/vector-databases-embeddings/questions.md) |
| System Design | [↗](./topics/system-design/cheatsheet.md) | [↗](./topics/system-design/questions.md) |
| LLMOps | [↗](./topics/llmops/cheatsheet.md) | [↗](./topics/llmops/questions.md) |
| Evaluation & Testing | [↗](./topics/evaluation-testing/cheatsheet.md) | [↗](./topics/evaluation-testing/questions.md) |
| Safety, Ethics | [↗](./topics/safety-ethics/cheatsheet.md) | [↗](./topics/safety-ethics/questions.md) |
| Multi-Modal | [↗](./topics/multi-modal/cheatsheet.md) | [↗](./topics/multi-modal/questions.md) |
| Infrastructure | [↗](./topics/infrastructure-scalability/cheatsheet.md) | [↗](./topics/infrastructure-scalability/questions.md) |
| Coding & Practical | [↗](./topics/coding-practical/cheatsheet.md) | [↗](./topics/coding-practical/questions.md) |
| Behavioral | [↗](./topics/behavioral/cheatsheet.md) | [↗](./topics/behavioral/questions.md) |
