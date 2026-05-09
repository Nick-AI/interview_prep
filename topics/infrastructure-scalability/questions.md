---
title: "Questions"
parent: "AI Infrastructure and Scalability"
nav_order: 2
---

# AI Infrastructure and Scalability

[← Back to index](../../README.md) · [Cheat sheet](./cheatsheet.md)

> Hardware and serving infrastructure for LLMs — GPUs, parallelism, quantization, batching, and inference optimization.

> _Specific GPU SKUs (A100, H100, L40S, B200) and inference engine versions evolve rapidly; specifics are accurate as of 2026-05._

### LLM optimization techniques

**TL;DR:** Combine quantization, batching, KV cache reuse, speculative decoding, and parallelism to cut latency, memory, and cost.

LLM optimization spans model-level techniques (quantization, distillation, pruning, LoRA), runtime techniques (continuous batching, paged attention, KV cache reuse, speculative decoding), and system-level techniques (tensor/pipeline parallelism, FlashAttention kernels). Each addresses a different bottleneck: model size (memory), throughput (batching), or latency (decoding speed). Production stacks like vLLM and TensorRT-LLM bundle several together. Choose based on workload — chat needs low TTFT, batch jobs need high throughput. Reference: [LLM optimization techniques](https://www.linkedin.com/posts/pallavi-shekhar_5-llm-optimization-techniques-lets-understand-activity-7442067281532325888-4aOS). Reference: [FlashAttention (Dao et al., 2022)](https://arxiv.org/abs/2205.14135).

### How do you select GPUs for LLM inference?

**TL;DR:** Match VRAM to model + KV cache size, prefer high memory bandwidth, and pick interconnect (NVLink) for multi-GPU.

GPU selection depends on model size, batch size, and latency targets. Key factors: VRAM capacity (must hold weights + KV cache + activations), memory bandwidth (HBM speed dominates token generation), compute (FLOPs for prefill), and interconnect (NVLink/InfiniBand for tensor parallelism). H100/H200 lead for large models; A100 remains cost-effective; L40S/L4 suit smaller models or batch workloads; consumer cards (RTX 4090) work for dev. Quantization shifts the calculus by reducing VRAM needs.

### What is model parallelism vs data parallelism in distributed training?

**TL;DR:** Data parallelism replicates the model across GPUs on different data; model parallelism splits the model itself across GPUs.

Data parallelism gives each GPU a full model copy and a different mini-batch shard, then averages gradients (all-reduce). It scales easily but requires the model to fit on one GPU. Model parallelism splits the model — by layer (pipeline) or by tensor dimension (tensor parallel) — when the model is too large for a single GPU. Modern training combines both (3D parallelism) plus FSDP/ZeRO to shard optimizer states.

### What is tensor parallelism, and how does it help serve large models?

**TL;DR:** Splits individual weight matrices across GPUs so a single layer's compute runs in parallel with all-reduce sync.

Tensor parallelism (Megatron-style) shards weight matrices column-wise or row-wise across GPUs, letting each device compute a partial result that gets combined via all-reduce. It enables serving models larger than one GPU's VRAM while keeping per-token latency low. Communication is heavy, so it requires fast intra-node interconnect (NVLink). Typically used within a node (TP=2/4/8); pipeline parallelism handles cross-node scaling. Reference: [Megatron-LM: Training Multi-Billion Parameter LMs Using Model Parallelism (Shoeybi et al., 2019)](https://arxiv.org/abs/1909.08053).

### What is pipeline parallelism?

**TL;DR:** Splits the model by layers across GPUs, passing activations forward like an assembly line.

Pipeline parallelism assigns contiguous layer groups (stages) to different GPUs. A micro-batch flows through stages, and multiple micro-batches are in flight to keep all stages busy (GPipe, 1F1B schedules). It has lower communication than tensor parallelism but introduces bubble overhead (idle time at start/end). Best for cross-node scaling where bandwidth is limited and the model is very deep.

### How does continuous batching improve LLM inference throughput?

**TL;DR:** Adds and evicts requests at each decoding step instead of waiting for whole batches, keeping GPUs saturated.

Static batching forces all requests in a batch to wait for the slowest one to finish, wasting GPU cycles. Continuous (in-flight) batching, used by vLLM and TGI, schedules at the token level — finished sequences leave, new ones join immediately. This dramatically improves throughput (often 2–10x) under variable-length workloads with minimal latency impact. It pairs naturally with paged attention to manage variable-length KV caches.

### What is speculative decoding, and how does it speed up inference?

**TL;DR:** A small draft model proposes multiple tokens; the large model verifies them in parallel, accepting matches.

Speculative decoding uses a cheap draft model to generate K candidate tokens, then runs the target model once on all K to verify. Accepted tokens are kept; on the first rejection, the target's distribution is sampled. Output is provably identical to standard decoding. Speedups of 2–3x are common when draft and target agree often. Variants include Medusa (multiple decoding heads) and EAGLE. Reference: [Speculative Decoding](https://outcomeschool.com/blog/speculative-decoding). Reference: [Fast Inference from Transformers via Speculative Decoding (Leviathan et al., 2022)](https://arxiv.org/abs/2211.17192).

### What is KV cache, and how do you manage memory for it?

**TL;DR:** Cached key/value tensors from prior tokens reused at each decode step; manage via paged attention, eviction, and quantization.

During autoregressive decoding, attention recomputes K and V for all prior tokens unless cached. The KV cache size = 2 × layers × heads × head_dim × seq_len × bytes_per_element per request, growing linearly with context. Management techniques: paged attention (block-level allocation, prevents fragmentation), KV cache quantization (INT8/FP8), eviction policies (H2O, sliding window), and prefix sharing across requests. For long contexts, KV cache often exceeds model weights in memory. Reference: [What is KV Cache in LLMs?](https://outcomeschool.com/blog/kv-cache-in-llms).

### What is Paged Attention?

**TL;DR:** Allocates KV cache in fixed-size blocks (like OS virtual memory) to eliminate fragmentation and enable sharing.

Paged attention, introduced by vLLM, breaks the KV cache into fixed-size blocks indexed via a page table per sequence. This eliminates internal fragmentation (vs contiguous allocation) and allows copy-on-write sharing of prefixes (system prompts, beam search siblings). The result is 2–4x higher throughput due to better memory utilization, enabling larger batch sizes on the same hardware. Reference: [Paged Attention in LLMs](https://outcomeschool.com/blog/paged-attention-in-llms).

### How do you optimize inference for edge and mobile deployment?

**TL;DR:** Aggressive quantization (INT4/INT8), distillation to smaller models, hardware-specific runtimes (CoreML, TFLite, ONNX), and KV cache trimming.

Edge deployment is constrained by RAM, compute, power, and thermals. Strategies: quantize to INT8/INT4 (or even 2-bit), distill to smaller architectures (Phi, Gemma 2B), use efficient attention (sliding window, grouped-query), and target hardware-specific runtimes (CoreML for iOS, NNAPI/TFLite for Android, ONNX Runtime, llama.cpp/MLX). Trim context length and use prompt caching aggressively. Frameworks like MLC-LLM and ExecuTorch streamline mobile deployment.

### What is model quantization (INT8, INT4, FP16, BF16), and how does it affect quality?

**TL;DR:** Reduces precision of weights/activations to shrink memory and speed inference, with quality loss growing as bits decrease.

Quantization maps high-precision values (FP32) to lower precision: BF16/FP16 (2 bytes, near-lossless), INT8 (1 byte, ~1% quality drop), INT4 (0.5 byte, noticeable degradation without care). Methods: post-training quantization (GPTQ, AWQ), quantization-aware training, and weight-only vs activation quantization. BF16 has wider exponent range than FP16, preferred for training stability. INT4 with techniques like AWQ retains most quality. Reference: [AI Engineering Explained: LLM, RAG, MCP, Agent, Fine-Tuning, Quantization](https://www.youtube.com/watch?v=lnfWvX66FUk).

### How do you implement auto-scaling for AI workloads?

**TL;DR:** Scale on GPU utilization, queue depth, and TTFT — not just CPU — with warm pools to absorb cold starts.

AI auto-scaling differs from web services: GPUs are expensive, model loading takes minutes, and CPU metrics are misleading. Use signals like GPU utilization, request queue depth, batch fill rate, and TTFT SLO violations. Maintain warm replica pools to handle bursts, scale predictively where traffic patterns are known, and use Kubernetes with KEDA, Karpenter, or platform-specific autoscalers (SageMaker, Vertex). Consider scale-to-zero only for low-traffic models due to cold start cost.

### What is the role of load balancing in AI serving infrastructure?

**TL;DR:** Routes requests across replicas considering KV cache locality, model variant, and current load — not just round-robin.

LLM load balancing is more nuanced than HTTP. Effective strategies: least-loaded (by active sequences), session affinity (route follow-up requests to the replica holding KV cache for the prefix), prefix-aware routing (vLLM's prefix cache hits), and model-aware routing in multi-model setups. Tools like Envoy, NGINX, and specialized routers (LiteLLM, Portkey, vLLM router) provide policies. Bad balancing causes hot replicas and underutilized GPUs.

### How do you manage GPU memory for serving multiple models?

**TL;DR:** Multiplex via model swapping, MIG partitioning, LoRA adapter stacking, or dedicated replicas per model.

Options: (1) co-locate small models on one GPU with memory partitioning; (2) use NVIDIA MIG to slice an A100/H100 into isolated instances; (3) swap models in/out from CPU/disk for low-traffic models (with cold start cost); (4) stack LoRA adapters over a shared base model (S-LoRA, Punica) — many fine-tunes, one base in VRAM; (5) dedicated replicas per model when traffic justifies. Choice depends on traffic patterns and isolation requirements.

### What is model sharding, and when would you use it?

**TL;DR:** Splits model weights across devices when the model exceeds single-device memory; use for large training and inference.

Model sharding partitions weights, gradients, and/or optimizer states across GPUs. For inference, tensor and pipeline parallelism are sharding strategies. For training, FSDP and DeepSpeed ZeRO shard parameters/gradients/optimizer states across data-parallel ranks, gathering on demand. Use sharding when (a) the model doesn't fit on one device, or (b) you need to fit larger batch sizes / longer contexts. Costs include communication overhead and engineering complexity.

### How do you implement request queuing and priority scheduling for AI services?

**TL;DR:** Use priority queues with SLO-aware scheduling, separate queues per tier, and admission control to shed load.

Implement multi-tier queues (e.g., interactive > batch > free tier) with priority-based pulling. Add admission control to reject when queue depth exceeds SLO budget. For long-running generation, use preemption or token-budget limits. Tools: Redis/RabbitMQ for queueing, Kubernetes priority classes, custom schedulers in inference servers. Continuous batching schedulers (vLLM) implement fairness across in-flight requests. Track wait time vs decode time separately for SLOs.

### What are the cost trade-offs between self-hosted and API-based AI inference?

**TL;DR:** APIs win at low/spiky volume; self-hosting wins at sustained high volume, custom models, or strict data requirements.

API pricing (per-token) is convenient but expensive at scale — break-even is roughly when sustained GPU utilization exceeds 30–50%. Self-hosting adds engineering cost (ops, autoscaling, model updates), capital/cloud GPU rental, and underutilization risk, but offers lower marginal cost, custom fine-tunes, data residency, and lower latency. Hybrid approaches (route cheap queries to small self-hosted models, hard queries to APIs) are common. Factor in dev velocity, not just dollars.

### How do you handle cold start latency for serverless AI deployments?

**TL;DR:** Pre-warm replicas, lazy-load weights from fast storage, use snapshotting, and keep min replicas > 0 for hot models.

Cold starts dominate serverless AI: container pull (10s–min) + model load from disk/S3 (10s–min for large models) + CUDA init. Mitigations: keep min instances > 0 (warm pool), use snapshotting (Modal, Cloud Run with checkpoint restore), load weights from local NVMe or cached layers, use smaller models, and pre-load via init containers. For truly bursty traffic, accept cold start and queue requests; for latency-critical, pay for warm capacity.

### How do you implement model caching to reduce redundant computations?

**TL;DR:** Cache by prompt hash for full responses, by prefix for KV cache, and by embedding similarity for semantic matches.

Layers of caching: (1) exact-match response cache (Redis keyed on prompt + params) for repeated queries; (2) prefix KV cache (vLLM, SGLang) avoids recomputing shared prompt prefixes; (3) semantic cache (GPTCache) returns cached responses for embedding-similar prompts; (4) tool/retrieval result cache. Each has tradeoffs in hit rate vs correctness. Invalidate on model version change. For agent workflows, cache intermediate steps where deterministic.

### What is the difference between synchronous and asynchronous inference, and when do you use each?

**TL;DR:** Sync blocks the caller for low-latency interactive use; async returns a job ID for long-running or batch workloads.

Synchronous inference (HTTP request/response or streaming) suits chat, autocomplete, and any user-facing interactive use where TTFT matters. Asynchronous inference (submit job, poll/webhook for result) fits batch processing, document analysis, video generation, and anything taking seconds-to-minutes. Async enables better throughput optimization (large batches, off-peak scheduling) and decouples client timeouts from compute. AWS SageMaker, Bedrock, and OpenAI all expose batch APIs at lower cost.

### What is FSDP (Fully Sharded Data Parallel), and how does it differ from DeepSpeed ZeRO?

**TL;DR:** Both shard parameters/gradients/optimizer states across data-parallel ranks; FSDP is PyTorch-native, ZeRO is DeepSpeed's older implementation.

FSDP and DeepSpeed ZeRO solve the same problem: data parallelism where each rank holds only a shard of the model state, gathering full parameters just-in-time for forward/backward. ZeRO has stages 1 (optimizer states), 2 (+ gradients), 3 (+ parameters). FSDP corresponds roughly to ZeRO-3 and integrates natively with PyTorch (better composability with `torch.compile`, activation checkpointing). DeepSpeed offers more features (ZeRO-Infinity offload to CPU/NVMe, 1-bit optimizers). Choice often comes down to ecosystem preference. Reference: [ZeRO: Memory Optimizations Toward Training Trillion Parameter Models (Rajbhandari et al., 2019)](https://arxiv.org/abs/1910.02054).

### How do you monitor and profile LLM inference in production (TTFT, inter-token latency, GPU utilization)?

**TL;DR:** Track TTFT, ITL, throughput (tok/s), queue depth, GPU util/memory, and per-request token counts via Prometheus + tracing.

Key metrics: TTFT (time to first token, prefill latency), ITL/TPOT (inter-token latency, decode speed), end-to-end latency, throughput (req/s, tokens/s), queue wait time, GPU utilization, GPU memory, KV cache occupancy. Instrument with Prometheus + Grafana, OpenTelemetry traces per request, and inference-server-native metrics (vLLM, TGI export them). Profile with Nsight, PyTorch profiler, or `nvidia-smi dmon`. Alert on SLO breaches (e.g., p95 TTFT) and cost anomalies (tokens/$).

### What is model routing at the infrastructure level, and how do you route requests based on complexity and cost?

**TL;DR:** Classify requests by difficulty, then route easy ones to small/cheap models and hard ones to large/expensive models.

Infrastructure-level model routing uses a classifier (small model, heuristic, or learned router like RouteLLM) to predict whether a query needs the strongest model. Easy queries (simple Q&A, classification) go to a small model or cached response; hard queries (complex reasoning, code) go to GPT-4-class models. Cost savings of 30–80% are typical with minimal quality loss. Tools: LiteLLM, Portkey, Martian, OpenRouter. Add fallback routing for failures and provider outages.

---

## Frontier (2025)

> _Inference engine versions referenced are accurate as of 2026-05._

#### Inference engines

### Compare vLLM, SGLang, TensorRT-LLM, and llama.cpp. When would you use each in production?

**TL;DR:** vLLM for general-purpose GPU serving, SGLang for structured/agentic workloads, TensorRT-LLM for max NVIDIA throughput, llama.cpp for CPU/edge.

vLLM (Kwon et al., 2023, "Efficient Memory Management for Large Language Model Serving with PagedAttention") is the default open-source GPU serving engine, offering PagedAttention, continuous batching, prefix caching, and broad model support — pick it for typical OpenAI-compatible endpoints on A100/H100/H200. SGLang (Zheng et al., 2023, "SGLang: Efficient Execution of Structured Language Model Programs") adds RadixAttention, a frontend DSL, and superior performance on agentic, multi-turn, and constrained-decoding workloads where prefix reuse dominates. TensorRT-LLM is NVIDIA's compiled backend with hand-tuned CUDA kernels, FP8/INT4 quantization, and in-flight batching — choose it when you need maximum tokens/s/GPU on NVIDIA hardware and can tolerate longer build times and a narrower model zoo. llama.cpp targets CPU, Apple Silicon, and consumer GPUs via GGUF and aggressive quantization (Q4_K_M, Q5_K_M); use it for on-device, edge, or laptop deployment where vLLM's CUDA dependency is unworkable.

### How does vLLM's PagedAttention work internally, and why is it faster than naive batching?

**TL;DR:** Allocates KV cache in fixed-size blocks via a page table, eliminating fragmentation and enabling prefix sharing for 2–4x throughput.

Naive serving allocates a contiguous KV cache buffer per sequence sized to `max_seq_len`, wasting 60–80% of memory to internal and external fragmentation. PagedAttention (Kwon et al., 2023) borrows from OS virtual memory: the KV cache is split into fixed-size blocks (typically 16 tokens), and each sequence holds a block table mapping logical positions to physical blocks, allocated on demand as decoding proceeds. The custom attention kernel reads K and V through the indirection table instead of from contiguous memory, with negligible kernel overhead. Because blocks are uniform, identical prefixes (system prompts, few-shot examples, beam-search siblings) share physical blocks via copy-on-write, cutting both memory and prefill compute. Combined with continuous batching, this lets vLLM pack 2–4x more concurrent sequences on the same GPU compared to naive contiguous allocation.

### How does SGLang's RadixAttention reduce redundant computation across requests?

**TL;DR:** Stores KV cache blocks in a radix tree keyed by token prefix, automatically reusing matched prefixes across all in-flight and historical requests.

RadixAttention (Zheng et al., 2023) generalizes vLLM-style prefix caching from per-session to a global, content-addressed cache. Every KV block is inserted into a radix tree indexed by its token sequence; on a new request, SGLang walks the tree to find the longest matching prefix and reuses those KV blocks directly, skipping prefill for the matched portion. An LRU eviction policy on tree leaves keeps the cache bounded, and a cache-aware scheduler reorders requests to maximize hit rate before eviction pressure forces drops. This is decisive for agentic loops, few-shot prompting, multi-turn chat, and tree-search workloads where many requests share long prefixes — reported speedups range from 2x to 6x over vLLM on these workloads, with no quality change because reused KV is mathematically identical to recomputed KV.

### How do production inference servers handle request scheduling, admission control, and priority?

**TL;DR:** Token-level continuous batching schedulers pick the next batch each step under KV-cache and SLO constraints, with admission control shedding load when budgets are exceeded.

Production servers (vLLM, SGLang, TensorRT-LLM, TGI) run a scheduler at every decode step that selects which waiting and running sequences to include in the next forward pass, bounded by GPU memory for the KV cache and a target latency budget. Common policies are FCFS within a priority class, with preemption (recompute or swap-to-CPU) when memory pressure is high; vLLM exposes `--scheduling-policy` (fcfs/priority) and SGLang uses cache-aware ordering to maximize RadixAttention hits. Admission control sits in front of the scheduler: requests are rejected or queued when estimated TTFT/decode latency would breach the SLO, queue depth exceeds a watermark, or the projected KV cache for the new request would evict too many running sequences. Priority is typically implemented as multiple queues (interactive > batch > free) with weighted pulling, deadline-aware scheduling for latency SLOs, and per-tenant token-rate limits to prevent noisy-neighbor effects. Reference: vLLM scheduler source (`vllm/core/scheduler.py`), SGLang paper, TensorRT-LLM in-flight batching docs.
