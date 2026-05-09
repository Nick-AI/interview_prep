---
title: "LLM Fundamentals"
has_children: true
nav_order: 11
---

# LLM Fundamentals

Core LLM concepts: Transformer architecture, attention, tokenization, sampling, and modern variants (MoE, GQA, RoPE, KV cache, reasoning models).

- **Estimated study time:** ~90 minutes (cheatsheet 5 min + Q&A ~80 min + frontier 10 min)
- **Question count:** 56
- **Recommended order:** [cheatsheet](./cheatsheet.md) first to set the mental model → [questions](./questions.md) for depth.
- **Prerequisites:** Basic deep learning (gradients, softmax, neural nets).

## Sub-areas covered
- Foundation models, Transformer architecture, encoders/decoders
- Tokenization (BPE, WordPiece, SentencePiece)
- Attention (self, multi-head, causal, GQA, Flash, scaling)
- Positional encoding (sinusoidal, learned, RoPE)
- Sampling and decoding (temperature, top-p/top-k, logits)
- Modern variants (MoE, RMSNorm, distillation, quantization)
- KV cache and inference memory
- Reasoning models (o1/o3, extended thinking, test-time compute)
- Common scenario fixes (instruction following, hallucination, context limits, alignment tax)

## Files
- [questions.md](./questions.md) — 56 questions with TL;DR + paragraph each
- [cheatsheet.md](./cheatsheet.md) — terms, decision rules, formulas, pitfalls
