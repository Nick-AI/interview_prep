---
title: "AI Infrastructure and Scalability"
has_children: true
nav_order: 22
---

# AI Infrastructure and Scalability

Hardware and serving infrastructure for LLMs — GPUs, parallelism, quantization, batching, and inference optimization.

- **Estimated study time:** ~55 minutes
- **Question count:** 27
- **Recommended order:** [cheatsheet](./cheatsheet.md) → [questions](./questions.md).
- **Prerequisites:** [LLM Fundamentals](../llm-fundamentals/) (KV cache, attention).

## Sub-areas covered
- GPU selection, model/data/tensor/pipeline parallel, FSDP, ZeRO
- Inference optimizations: continuous batching, speculative decoding, paged attention, KV cache
- Quantization (INT8, INT4, FP16, BF16, GGUF formats)
- Auto-scaling, request queuing, cold starts
- Frontier: vLLM, SGLang, TensorRT-LLM, llama.cpp internals; admission control

## Files
- [questions.md](./questions.md)
- [cheatsheet.md](./cheatsheet.md)
