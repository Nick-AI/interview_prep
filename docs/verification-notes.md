---
title: "Verification Notes"
nav_order: 99
---

# Verification Notes

Spot-checks performed on numeric and factual claims in the topic cheatsheets, on 2026-05-06.

Methodology: 2-3 claims sampled per topic, checked against papers, official docs, or vendor defaults. Claims marked "standard" are verified from training knowledge of widely cited sources.

[← Back to index](../README.md)

---

## llm-fundamentals
- ✓ standard "Attention = softmax(QKᵀ/√d_k)V" — *Attention Is All You Need* (Vaswani et al. 2017), eq. 1.
- ✓ standard "Sampling defaults: temperature 0.7, top-p 0.9, top-k 50" — HuggingFace `GenerationConfig` defaults / common practice.
- ⚠ "FFN width: typically 4× hidden dim" — true for original Transformer, GPT-2/3, BERT; modern SwiGLU LLaMA-family uses ~8/3 × hidden to keep param count comparable. Statement is OK as written but slightly dated.

## prompt-engineering
- ✓ standard "ReAct interleaves Thought/Action/Observation" — Yao et al., 2022 (*ReAct: Synergizing Reasoning and Acting*).
- ✓ "Anthropic prompt cache: ~10% read cost; OpenAI 50%" — matches Anthropic docs (cache reads at 0.1× base) and OpenAI prompt caching pricing (50% discount on cached input tokens).
- ✓ "Anthropic cache TTL 5 min default, 1h extended" — matches Anthropic prompt caching docs.
- ✓ "OpenAI caches automatically above 1024 tokens" — matches OpenAI prompt caching documentation.

## rag
- ✓ "HNSW M 16-48, efConstruction 100-400" — matches HNSW paper (Malkov & Yashunin 2018) recommended ranges; Qdrant default M=16, pgvector default m=16, ef_construction=64 (lower bound). Range cited is realistic.
- ✓ standard "RRF: score = Σ 1/(k+rank), k≈60" — Cormack et al. 2009; k=60 is the canonical default.
- ⚠ "Faithfulness target >0.9 on RAGAS" — heuristic, not from RAGAS docs. Reasonable production target but flagged as opinion, not specification.
- ✓ "Chunk size 256-1024, overlap 10-20%" — standard practice across LangChain/LlamaIndex tutorials.

## vector-databases-embeddings
- ✓ "Scalar quantization int8: 4× smaller, ~1% recall loss" — matches Qdrant/Faiss SQ8 benchmarks (typical 1-3% recall drop at 4× compression).
- ✓ "PQ: 8-32x compression" — matches Faiss PQ documentation (compression ratio depends on subvector count m and centroid bits).
- ✓ "text-embedding-3-large dim 3072" — matches OpenAI embeddings docs.
- ✓ "BERT-base dim 768" — standard.

## fine-tuning
- ✓ "LoRA rank r typical 4-128" — LoRA paper (Hu et al. 2021) used r=1-64; PEFT defaults r=8; community consensus 4-64 typical, higher for harder tasks.
- ✓ "LoRA alpha typically 2×r, scale = alpha/r" — matches HuggingFace PEFT docs and original LoRA implementation convention.
- ✓ "QLoRA fits 65B on 48GB" — matches QLoRA paper (Dettmers et al. 2023) abstract claim.
- ✓ "RLHF KL β ≈ 0.01-0.1" — InstructGPT/Anthropic HH papers report β in this range.

## evaluation-testing
- ✓ standard "BLEU = geometric mean n-gram precisions × BP, BP=min(1, exp(1-r/c))" — Papineni et al. 2002.
- ✓ "Cohen's kappa >0.6 substantial, >0.8 strong" — Landis & Koch 1977 conventions.
- ⚠ "Sample size ~600 paired for 5% lift at 80% power, base 50%" — order-of-magnitude correct (formula gives ~620 for two-proportion z-test). Reasonable.

## infrastructure-scalability
- ✓ "7B FP16 ≈ 14 GB" — 7×10⁹ × 2 bytes = 14 GB. Correct.
- ✓ "Speculative decoding ~2-3x speedup at acceptance >0.7" — matches Leviathan et al. 2023 / Chen et al. 2023 reported speedups.
- ⚠ "NVLink H100 600-900 GB/s" — H100 NVLink 4.0 is 900 GB/s bidirectional (450 GB/s per direction). Range covers it but lower bound is more typical of A100 (600 GB/s). Acceptable but loose.
- ✓ "Llama-2-70B KV ~320 KB/token FP16" — 2 × 80 layers × 8 KV heads × 128 head_dim × 2 bytes = 327,680 B/token ≈ 320 KB. Correct.

## llmops
- ✓ "Cache hit rate = cached_input_tokens / total_input_tokens" — matches Anthropic/OpenAI usage telemetry definitions.
- ✓ standard "Pin model snapshots like gpt-4o-2024-08-06" — matches OpenAI snapshot ID format.
- ✓ "Quantization methods: GPTQ, AWQ, SmoothQuant" — all real, widely cited methods (Frantar 2022, Lin 2023, Xiao 2022).

## multi-modal
- ✓ "DDIM 20-50 steps, DDPM 1000, LCM 4-8, Turbo 1-4" — matches diffusers docs and respective papers (Song 2020 DDIM, Luo 2023 LCM, SDXL-Turbo paper).
- ✓ "CFG: eps_uncond + s*(eps_cond - eps_uncond), s=4-7 typical" — matches Ho & Salimans 2022 classifier-free guidance and Stable Diffusion defaults (s=7.5).
- ⚠ "GPT-4V high-res tile ~765 tokens per 512×512" — actual: 170 tokens per 512×512 tile + 85 base = 255 for 1 tile, 765 for ~3 tiles. The "765 per tile" phrasing is misleading; 765 is an aggregate for ~1024 px image, not per tile. SHOULD FIX.
- ✓ "Whisper: 30s audio → 80-mel → 1500 encoder tokens" — matches Whisper paper (Radford 2022): 30s × 50 frames/s = 1500 tokens.

## safety-ethics
- ✓ standard "DP ε ≤ 1 strong, ≤10 moderate, >10 weak" — common interpretation in DP literature (Dwork & Roth textbook).
- ✓ "HarmBench 510 behaviors" — matches HarmBench paper (Mazeika et al. 2024).
- ✓ "JailbreakBench 100 behaviors + leaderboard" — matches JailbreakBench paper (Chao et al. 2024).
- ✓ "EU AI Act tiers: minimal/limited/high/unacceptable" — matches the regulation's risk-based framework.

## system-design
- ✓ "Voice e2e <800ms target, <300ms feels human" — matches widely cited human conversational turn-taking research (Stivers et al. 2009, ~200ms gap) and OpenAI realtime / Gemini Live published targets.
- ⚠ "Cache hit 30-70% semantic, 50-90% prefix" — heuristic, not vendor-published. Reasonable production target ranges.
- ⚠ "TTFT <500ms ideal, <1.5s acceptable" — heuristic, no canonical source. Aligned with common UX guidance.

## agents
- ✓ "Firecracker microVM cold ~125ms" — matches Firecracker paper (Agache et al. 2020) reporting ~125ms boot.
- ✓ "SWE-Bench Verified = 500 curated tasks" — matches OpenAI's SWE-Bench Verified release announcement (2024).
- ⚠ "Reflection cost ~2× tokens" — heuristic; depends heavily on critique length. Order-of-magnitude OK.
- ✓ "Tool catalog ≤10-20" — matches Anthropic and OpenAI tool-use guidance for reliable selection.

## behavioral
- ✓ standard "STAR = Situation, Task, Action, Result" — standard interview framework.
- ✓ "RAG debug ladder: retrieval recall@k, MRR before generation" — matches RAGAS / TruLens / industry guidance to measure retrieval independently first.

## coding-practical
- ✓ "Exponential backoff with jitter; honor Retry-After" — standard pattern (AWS Architecture Blog, Google SRE book); `tenacity` and `backoff` libs implement this.
- ✓ "Cache key = hash(model, prompt, params)" — standard practice across `gptcache`, LiteLLM caching, LangChain LLMCache.
- ✓ "Cross-encoder reranker on too-large N dominates latency" — reflects actual cost: e.g., BGE-reranker-large at ~50ms/pair, so reranking 100 candidates ≈ 5s. Correct caution.

---

## Recommended corrections

1. **multi-modal/cheatsheet.md, line 39**: "high-res tile mode (GPT-4V) ≈ 765 tokens per 512×512 tile" — the 765 figure is an aggregate for a multi-tile high-res image, not per-tile. Per-tile is 170 + 85 base. Reword as "~85 base + 170 per 512×512 tile; ~765 tokens for a typical 1024×1024 high-res image".
2. **infrastructure-scalability/cheatsheet.md, line 44**: "NVLink bandwidth ~600-900 GB/s (H100)" — H100 NVLink 4.0 is specifically 900 GB/s; the 600 GB/s lower bound is A100. Tighten to "H100 NVLink 4.0: 900 GB/s; A100 NVLink 3.0: 600 GB/s".
3. **rag/cheatsheet.md, line 42**: "Faithfulness target >0.9 on RAGAS" — flag as a heuristic production target, not a RAGAS-specified threshold. Optional: append "(team-set heuristic, not RAGAS spec)".
4. **llm-fundamentals/cheatsheet.md, line 45**: "FFN width: typically 4× hidden dim (SwiGLU/GELU)" — slightly misleading: SwiGLU LLaMA family uses ~8/3 × hidden to match param count. Either drop "SwiGLU" or note the variant convention.
