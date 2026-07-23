---
title: "Cheatsheet"
parent: "Interview 2026-07-22 — LLM/GenAI"
nav_order: 1
---

# LLM & GenAI — Interview Cheat Sheet (2026-07-22)

[← Back to index](../README.md) · [Full Q&A](./questions.md)

**The one-liner to keep saying:** for every design choice, name (1) an offline metric, (2) an online/business metric, and (3) how you'd compare two versions with statistical rigor. This round weights *measurement and success criteria* heavily.

## Generative AI foundations
- **LLM = autoregressive generative model**: `p(seq) = Π p(tokenₜ | token₁..ₜ₋₁)`. Every task = conditional generation.
- **Decoder-only + causal mask** won because it unifies all tasks as next-token prediction and scales cleanly. Encoder-decoder for fixed source→target (MT); encoder-only (BERT) for embeddings/classification.
- **Self-attention**: `softmax(QKᵀ/√d)·V`, **O(n²)** in sequence length → FlashAttention, sparse/sliding-window, KV cache.
- **Decoding**: greedy/beam (deterministic, MT), temperature (sharpen/flatten), top-k, top-p/nucleus (adaptive pool). Low temp + top-p default; temp→0 for extraction.
- **Training stages**: pretraining (knowledge) → SFT/instruction-tuning (format/behavior) → alignment RLHF/DPO (preferences) → reasoning-RL (verifiable rewards). *Match the stage to the failure.*
- **Scaling / Chinchilla**: compute-optimal ≈ **20 tokens/param**; most old models were undertrained; data quality often the binding constraint.
- **Context**: nominal ≠ effective — RoPE + interpolation/YaRN extend it; "lost in the middle" + **Context Rot** (2025) degrade well before the advertised window.
- **Reasoning models** (o1/o3, DeepSeek-R1): trained (RLVR) to spend test-time compute on long CoT → accuracy scales with thinking tokens; new metric = **cost/latency per solved problem**.

## RAG core
- **Pipeline**: load → chunk → embed → index → (query) retrieve top-k → hybrid → re-rank → prompt+cite → generate.
- **Chunking**: fixed / recursive (default) / semantic / structural / parent-child (small-to-big). Start recursive ~512 tok, 10–20% overlap; **always benchmark on your corpus**.
- **Embeddings**: transformer encoders, contrastive (InfoNCE) + hard negatives; cosine on normalized vectors; query/doc asymmetry. *Changing the model = re-embed everything.*
- **ANN**: HNSW (graph; `M`, `efConstruction`, `efSearch`) vs IVF-PQ (cluster + compress) vs DiskANN. Knob = recall vs latency/memory.
- **Hybrid search** = BM25 (exact/rare tokens) + dense (paraphrase), fused via RRF. Beats either alone.
- **Re-ranking** = cross-encoder scores (query, passage) jointly on top 20–100 → biggest single quality lift after hybrid.
- **Failure decomposition**: retrieval (wrong/missing chunk) vs generation (hallucinate/ignore context) → tells you which half to fix.

## RAG fusion & advanced retrieval
- **RAG-Fusion**: LLM generates N query variants → retrieve each → **RRF** fuse → generate. Adds recall + robustness to phrasing; costs extra LLM/retrieval calls, can inject noise.
- **RRF**: `score(d) = Σ 1/(k + rankᵢ)`, **k≈60** (empirical, Cormack 2009; k∈[40,80] ≈ equivalent). Rank-based → fuses heterogeneous retrievers without score normalization.
- **Multi-query vs RAG-Fusion vs hybrid**: variants+union vs variants+RRF vs different-retrievers-same-query. Composable, RRF is the glue.
- **HyDE**: embed an LLM-drafted hypothetical answer (not the raw query) to bridge query↔doc vocabulary gap.
- **Multi-hop**: query decomposition, iterative retrieve-read-re-query, agentic RAG, graph traversal. Evaluate on multi-hop sets (HotpotQA/MuSiQue).
- **Contextual Retrieval** (Anthropic 2024): prepend LLM-generated chunk context before embed + BM25 → top-20 failure ↓~35% (embeddings), ~49% (+ctx BM25), ~67% (+rerank).
- **Self-RAG** (reflection tokens: retrieve? relevant? supported?) / **CRAG** (grade docs → correct/ambiguous/incorrect → web fallback). Adaptive, quality-control *inside* the loop.
- **Long-context vs RAG**: not either/or — retrieve then pack smaller high-signal context; RAG wins on scale/freshness/ACL/citations/cost.

## Knowledge Graphs & GraphRAG
- **KG** = (entity, relation, entity) triples; explicit, queryable, auditable, multi-hop-traversable. Pairs with LLM for relational/connect-the-dots questions.
- **KG construction**: LLM extract entities → **entity resolution** (hardest step) → typed relations (constrain to ontology) → canonicalize → load, with provenance.
- **GraphRAG** (Microsoft 2024): extract KG → **Leiden** community detection (hierarchical) → LLM **community summaries** (offline).
  - **Local search** = entity neighborhood traversal (specific-entity Qs).
  - **Global search** = map-reduce over community summaries (whole-corpus "what are the themes" sensemaking).
- **When graph > vector**: multi-hop, relational, global/sensemaking, stable corpus. **When not**: single-hop lookup, fast-changing data, tight budget (indexing is expensive), *"unanswerable" queries* (graph hallucinates more).
- **Text-to-Cypher/SPARQL**: LLM + schema → formal query → execute → verbalize. Precise/auditable; risk = hallucinated schema, invalid queries.
- **Lighter/newer variants**: **LightRAG** (dual-level, incremental), **HippoRAG/HippoRAG 2** (Personalized PageRank, single-step multi-hop), **LazyGraphRAG** (defer LLM to query time, ~vector-RAG index cost), **DRIFT**, **PathRAG**.
- **Hybrid KG+vector**: vectors for "semantically similar," graph for "explicitly connected" — route or RRF-fuse; expand vector hits via graph neighbors for multi-hop.

## Fine-tuning & alignment
- **When**: prompt (behavior, cheap/first) → RAG (knowledge/freshness/citations) → fine-tune (format/style/skill, compress long prompt). *Don't fine-tune to inject volatile facts.*
- **Stages**: pretrain vs continued-pretrain (domain distribution) vs SFT (demonstrations) vs alignment (preferences).
- **PEFT vs full FT**: PEFT freezes base, trains tiny params → ~99% cheaper, swappable adapters, minimal forgetting, slight quality ceiling.
- **LoRA**: ΔW = B·A, rank r≪d (8–64), scale α/r; mergeable → zero inference latency. **QLoRA**: 4-bit **NF4** base + double-quant + paged optimizers → single-GPU 30–70B. **DoRA**: split magnitude/direction, LoRA on direction → closes gap to full FT.
- **RLHF**: reward model (Bradley-Terry on prefs) + **PPO**, objective `reward − β·KL(policy‖ref)`. KL penalty prevents reward hacking/degeneration. Heavy (4 models).
- **DPO**: closed-form removes RM + RL loop → supervised classification loss raising log-prob margin of chosen vs rejected (β = implicit KL). Simpler/stable; needs good pref data.
- **Preference zoo**: **IPO** (fix DPO overfit, bounded margin), **KTO** (unpaired binary good/bad — thumbs data!), **ORPO** (single-stage SFT+align, no reference), **SimPO** (reference-free, length-normalized reward → fixes length bias).
- **GRPO** (DeepSeek): drop critic; advantage = (r − group mean)/group std over G sampled outputs. + **RLVR** (verifiable rewards: unit tests / answer match) = reasoning-model engine. Successors: **DAPO**, **GSPO** (2025).
- **Risks**: catastrophic forgetting + alignment tax → mitigate with PEFT, low LR, replay data, KL, and **regression-test general benchmarks**.
- **Data**: quality/diversity > quantity; **decontaminate** vs eval sets; synthetic (self-instruct, distillation, Magpie) with filtering (judge/reward/verification) to avoid model collapse.

## Optimization & inference
- **Quantization**: PTQ (**GPTQ** Hessian-based, **AWQ** protect salient channels, **GGUF** llama.cpp format) vs QAT (best accuracy, costly). **FP8** on modern HW. Measure task degradation, not just perplexity.
- **Precision by tensor**: weights → int4 fine (decode is weight-bandwidth-bound); activations → int8 (outliers, SmoothQuant); **KV cache** → int8/int4 (grows linearly, can exceed weights at long context).
- **Distillation**: student mimics teacher soft labels / generated outputs (incl. reasoning traces) → smaller/cheaper. Watch licensing + error inheritance.
- **KV cache**: store past K,V → per-token cost ~linear; size = 2·layers·heads·head_dim·seq·batch. **PagedAttention (vLLM)** = paged KV, no fragmentation, sharing.
- **Speculative decoding**: small drafter proposes k tokens → target verifies in one pass → accept correct prefix. **Lossless**; 2–3×+ (EAGLE-2/3, Medusa). Gain ∝ acceptance rate.
- **Continuous (in-flight) batching**: admit/evict at token level → GPU saturated → big throughput gains under variable-length traffic.
- **Prefix/prompt caching**: reuse KV of shared prefix (system+tools+context) → ↓TTFT, ↓cost. Design prompts prefix-stable (invariant first, query last).
- **Serving metrics**: **TTFT** (prefill/responsiveness), **TPOT/ITL** (decode/stream speed), end-to-end = TTFT + TPOT·len, **throughput**, **goodput**. Report **p95/p99**, size to an SLO. Batching ↑throughput but can ↑tail latency.

## Metrics, evaluation & monitoring  *(the emphasis)*
- **Structure**: component (retrieval + generation) → offline task metrics on versioned golden set (CI gate) → online A/B on business KPI → production monitoring (drift). Feed failures back to golden set.
- **Retrieval metrics**: precision@k, **recall@k / context recall** (usually the binding constraint), MRR (first relevant), **nDCG** (graded, rank-discounted), hit-rate.
- **Generation metrics**: BLEU/ROUGE (n-gram overlap, need reference, weak for open-ended), BERTScore (semantic, still referenced), task metrics (EM/F1, **pass@k** for code), + faithfulness + LLM-judge. *Overlap metrics ≠ acceptance criteria.*
- **RAG eval**: **RAGAS** = context precision/recall (retrieval) + faithfulness + answer relevance (generation). **TruLens RAG triad** = context relevance + groundedness + answer relevance. Localizes retrieval vs generation failure.
- **LLM-as-judge**: scalable, ~>80% human agreement, but biases = **position, verbosity, self-preference**, formatting. Mitigate: pairwise + randomize order, rubric + CoT (**G-Eval**), jury, **calibrate vs human labels (Cohen's κ)**. *Never treat the judge score as ground truth unvalidated.*
- **Comparing models rigorously**: pairwise **win rate** (order randomized) → **Bradley-Terry** rating for a pool (LMArena; "Elo" is just the display unit). Attach **significance** (paired bootstrap / McNemar / t-test) + **CIs** — near neighbors often tied. Confirm with **online A/B** on the real KPI. Caveats: Style Control (length confound), "Leaderboard Illusion."
- **Hallucination**: grounded → **faithfulness/groundedness** (claims entailed by context, via NLI/judge). Open-domain → FActScore, **SelfCheckGPT** (self-consistency), **semantic entropy** (Nature 2024, cluster by meaning). Monitor hallucination *rate*.
- **Offline vs online**: offline = reproducible CI gate (can't measure user value); online = A/B/canary on live traffic (causal, slower, riskier). Need both.
- **Production monitoring**: quality (sampled judge faithfulness, hallucination + guardrail-trigger + refusal rates, user thumbs/edits/escalations), ops (p95 TTFT/latency, throughput, cost/token, errors, cache-hit), **drift** (input, embedding, retrieval decay, output). Ground truth is delayed → lean on proxies + sampling.
- **Guardrails**: input (jailbreak/PII/topic) + output (toxicity/PII/groundedness/schema) checks. Evaluate as classifiers: FPR (over-refusal) vs FNR (unsafe leak), jailbreak success rate, added latency. Tune the safety↔helpfulness tradeoff; red-team continuously.
- **Fine-tune eval** (broader than a prompt change): target-task metric + **general-capability regression** (forgetting) + decontamination + fair baseline (beat RAG/prompt?) + preference win rate + safety.
- **Benchmarks 2025–26**: MMLU saturated/leaked → MMLU-Pro, **GPQA-Diamond**, FrontierMath, **SWE-bench Verified** (saturating), **GAIA** (agentic), **Humanity's Last Exam**, **ARC-AGI-2**. Public benchmarks = directional + contamination-prone; **your golden set is the real test**.

## What "success" looks like (say this)
Success = **a threshold on the primary quality metric** (e.g., faithfulness ≥ 0.9 + answer-correctness target on the golden set) **+ non-regressing guardrails** (safety, p95 latency, cost/query, no catastrophic forgetting) **+ a moved business KPI** (deflection / task-completion / CSAT / escalation ↓), **validated by an online A/B vs baseline with statistical power**, plus a monitoring plan and rollback trigger. A *balanced scorecard* across quality, retrieval, ops, safety, and business — never one number.

## Decision rules
- **RAG vs fine-tune vs prompt**: knowledge→RAG; behavior/format→fine-tune; try prompt first; combine.
- **Hybrid vs pure vector**: hybrid when corpus has codes/names/jargon/rare tokens.
- **Re-rank?**: almost always, if latency budget allows — highest ROI after hybrid.
- **GraphRAG vs vector**: graph for multi-hop/relational/global sensemaking on a stable corpus; vector for lookup + frequent updates.
- **Long-context vs RAG**: long-context for bounded cohesive input; RAG for scale/freshness/ACL/citations/cost; usually combine.
- **LoRA vs full FT**: LoRA/QLoRA by default; full FT only when PEFT plateaus below requirements.
- **DPO vs RLHF vs GRPO**: DPO for simple offline preference alignment; PPO/GRPO when online RL / verifiable rewards / reasoning matter.
- **Metric choice**: MRR/hit-rate for single-answer retrieval; nDCG for graded ranking; context recall as the RAG north star.

## Common pitfalls
- Reporting means, not **p95/p99** or **confidence intervals**; calling a 51%/100 win rate a result.
- Trusting an **LLM-judge** without calibrating against humans; ignoring position/verbosity/self-preference bias.
- Using **perplexity or BLEU/ROUGE** as an acceptance metric for generative quality.
- **Data contamination**: eval/benchmark leaking into training → inflated, non-reproducible scores.
- Fine-tuning to inject facts (use RAG); skipping **general-capability regression** → shipping catastrophic forgetting.
- Cramming top-k=50 into the prompt → lost-in-the-middle; skipping re-ranking.
- Forgetting to **re-embed** after changing chunker/embedding model.
- Optimizing **containment/deflection** without resolution/CSAT → optimizing the wrong thing.
- Trusting nominal context length; no long-context validation on your task.
- No feedback loop: production failures never re-enter the golden set → eval goes stale.
- GraphRAG everywhere: paying heavy indexing cost for single-hop lookups.
