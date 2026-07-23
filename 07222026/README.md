---
title: "Interview 2026-07-22 — LLM/GenAI"
has_children: true
nav_order: 2
---

# Interview 2026-07-22 — LLM & GenAI (Q&A prep)

Targeted prep for a Q&A round with a senior ML Engineer. Scope from the brief:

> LLM and GenAI: depth and breadth in generative AI, RAG, RAG fusion, Knowledge Graphs, and techniques to fine-tune and optimize LLMs.

**Emphasis from prior rounds:** metrics — what to measure, what to monitor, and what a *successful outcome* looks like (how to compare models, offline vs online, production monitoring). The focus is on the **underlying mechanics**, not specific vendors, APIs, or model names.

- **Estimated study time:** ~90 minutes
- **Question count:** 73
- **Recommended order:** [cheatsheet](./cheatsheet.md) → [questions](./questions.md).
- **Audience assumption:** strong DL/ML fundamentals (this reader's background is CV/applied ML); light on LLM/GenAI/agentic specifics. Questions start at "solid intermediate," not undergrad-trivial.

## Sub-areas covered
- **Generative AI foundations** — decoder-only transformers, attention, tokenization, decoding/sampling, training stages, scaling & emergent behavior.
- **RAG** — pipeline, chunking, embeddings, retrieval, re-ranking, failure modes.
- **RAG fusion & advanced retrieval** — RAG-Fusion, Reciprocal Rank Fusion, HyDE, hybrid search, multi-hop, contextual retrieval, long-context vs RAG.
- **Knowledge Graphs** — KG construction, entity/relation extraction, GraphRAG (local vs global), when graph beats vector.
- **Fine-tuning & adaptation** — SFT, LoRA/QLoRA, RLHF/DPO/GRPO, RLVR, reasoning-model training, when to fine-tune vs RAG vs prompt.
- **Optimization & inference** — quantization, distillation, KV cache, speculative decoding, batching, serving economics.
- **Metrics & evaluation (heaviest weight)** — generation & retrieval metrics, LLM-as-judge, rigorous model comparison, offline vs online, production monitoring/drift, defining "success."

## Files
- [cheatsheet.md](./cheatsheet.md) — night-before cram: terms, decision rules, numerics, pitfalls.
- [questions.md](./questions.md) — full Q&A (TL;DR + short paragraph), flashcard mode enabled.
