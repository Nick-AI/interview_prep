---
title: "Cheatsheet"
parent: "AI Infrastructure and Scalability"
nav_order: 1
---

# AI Infrastructure and Scalability — Cheat Sheet

[← Back to index](../../README.md) · [Full Q&A](./questions.md)

## Core concepts
- **Data parallelism**: replicate model, shard data, all-reduce gradients.
- **Tensor parallelism (TP)**: shard weight matrices across GPUs (intra-node, NVLink).
- **Pipeline parallelism (PP)**: split layers into stages across GPUs (cross-node).
- **FSDP / ZeRO-3**: shard params/grads/optimizer states across data-parallel ranks; gather just-in-time.
- **DeepSpeed ZeRO stages**: 1 (optim), 2 (+grads), 3 (+params); ZeRO-Infinity offloads to CPU/NVMe.
- **KV cache**: cached K/V tensors per token; size grows linearly with context × batch.
- **Paged attention**: block-based KV allocation (vLLM); eliminates fragmentation, enables prefix sharing.
- **Continuous batching**: token-level scheduling; finished sequences leave, new ones join (vLLM, TGI).
- **Speculative decoding**: small draft proposes K tokens, large model verifies in parallel.
- **Quantization**: BF16/FP16 (2B), FP8/INT8 (1B), INT4 (0.5B); methods GPTQ, AWQ, SmoothQuant.
- **FlashAttention**: tiled, IO-aware attention kernel; reduces HBM reads/writes.
- **Inference servers**: vLLM, TGI (HuggingFace), TensorRT-LLM (NVIDIA), SGLang, LMDeploy.
- **GPU classes**: H100/H200 (top training/inference), A100 (workhorse), L40S/L4 (inference), RTX 4090 (dev).
- **Latency metrics**: TTFT (prefill), ITL/TPOT (decode), e2e; throughput in tokens/s, req/s.
- **LoRA serving**: stack many adapters over one base model (S-LoRA, Punica).
- **vLLM / PagedAttention**: block-based KV cache + continuous batching; default open-source GPU serving engine.
- **SGLang / RadixAttention**: global prefix cache via radix tree; wins on agentic, multi-turn, few-shot workloads.
- **TensorRT-LLM**: NVIDIA compiled backend with FP8/INT4 + in-flight batching; max tokens/s/GPU on NVIDIA hardware.
- **llama.cpp / GGUF**: CPU, Apple Silicon, consumer-GPU runtime with aggressive quantization (Q4_K_M, Q5_K_M); edge/on-device.
- **Admission control**: reject or queue requests when SLO budget, queue depth, or KV-cache headroom would be breached.
- **Request priority**: multi-queue scheduling (interactive > batch > free) with weighted pulling and deadline awareness.

## Decision rules
- **TP vs PP**: TP within a node (NVLink, low latency); PP across nodes (less bandwidth needed).
- **Quantization choice**: BF16 default, INT8 for ~2x memory savings, INT4 (AWQ) when memory is binding constraint.
- **Self-host vs API**: self-host when sustained GPU util > ~30–50%, custom models, or data residency required.
- **Continuous vs static batching**: always continuous for chat; static OK for fixed-length batch jobs.
- **Sync vs async**: sync for interactive (TTFT-sensitive), async for batch / >10s jobs.
- **Routing**: cheap model first, fallback to large model on low confidence or eval gap.
- **Inference engine choice**: vLLM for general GPU serving; SGLang when prefix reuse dominates (agents, multi-turn); TensorRT-LLM for max NVIDIA throughput; llama.cpp for CPU/edge/on-device.

## Key formulas / parameters
- **Model memory (weights)**: `params × bytes_per_param` (FP16: 2B, INT8: 1B, INT4: 0.5B). 7B FP16 ≈ 14 GB.
- **KV cache per token**: `2 × num_layers × num_kv_heads × head_dim × bytes_per_elem`. Llama-2-70B FP16 ≈ ~320 KB/token.
- **KV cache total**: `per_token × seq_len × batch_size`. Often exceeds weight memory at long context.
- **Training memory (Adam, FP16)**: ~16–20 bytes/param (weights+grads+optim states); FSDP shards across N ranks.
- **Typical batch sizes (vLLM, A100 80GB, 7B model)**: 64–256 concurrent sequences depending on context length.
- **Speculative decoding speedup**: ~2–3x when acceptance rate > 0.7.
- **NVLink bandwidth**: ~600 GB/s (A100 NVLink 3); ~900 GB/s (H100 NVLink 4). InfiniBand: ~400 Gb/s. PCIe Gen5: ~64 GB/s.

## Common pitfalls
- Forgetting KV cache memory — model fits but OOMs at long context / high concurrency.
- Using static batching with variable-length requests — slowest request stalls the batch.
- Tensor parallelism across nodes — interconnect becomes bottleneck; use pipeline parallelism instead.
- Aggressive INT4 without AWQ/GPTQ calibration — large quality regression.
- Cold-starting large models on every request — load times kill p99 latency; keep warm pool.
- Round-robin load balancing — destroys prefix cache hits; use prefix-aware or session-affinity routing.
- Monitoring only request count / CPU — miss GPU under-utilization and KV cache pressure.
- Ignoring TTFT vs ITL distinction — long prompts hurt TTFT independent of decode speed.
