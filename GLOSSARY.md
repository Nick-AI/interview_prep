---
title: "Glossary"
nav_order: 4
---

# Glossary

Alphabetical index of terms used throughout this repo. Definitions are intentionally short — see the linked topic for depth.

[A](#a) · [B](#b) · [C](#c) · [D](#d) · [E](#e) · [F](#f) · [G](#g) · [H](#h) · [I](#i) · [J](#j) · [K](#k) · [L](#l) · [M](#m) · [N](#n) · [O](#o) · [P](#p) · [Q](#q) · [R](#r) · [S](#s) · [T](#t) · [U](#u) · [V](#v) · [W](#w)

[← Back to index](./README.md)

---

## A

**A/B testing** — online comparison of variants on live traffic with random assignment and pre-registered metrics. *See: [evaluation-testing](./topics/evaluation-testing/), [llmops](./topics/llmops/).*

**Adapter** — small trainable bottleneck module inserted between frozen transformer layers; enables PEFT without modifying base weights. *See: [fine-tuning](./topics/fine-tuning/).*

**Admission control** — reject or queue requests when SLO budget, queue depth, or KV-cache headroom would be breached. *See: [infrastructure-scalability](./topics/infrastructure-scalability/).*

**Agent** — LLM that plans, calls tools, and acts in a loop until a goal, max-step cap, or budget is hit. *See: [agents](./topics/agents/).*

**Agent loop** — think → act → observe cycle repeated until done, max steps, or budget exhausted. *See: [agents](./topics/agents/).*

**Agentic RAG** — RAG pattern where an LLM agent dynamically issues retrieval tool calls instead of a fixed pipeline. *See: [rag](./topics/rag/).*

**AI gateway** — central proxy enforcing auth, quotas, routing, caching, redaction, and logging across LLM calls. *See: [system-design](./topics/system-design/), [llmops](./topics/llmops/).*

**Alignment** — training a model to pursue intended human goals via RLHF, RLAIF, Constitutional AI, or instruction tuning. *See: [safety-ethics](./topics/safety-ethics/).*

**ANN (Approximate Nearest Neighbor)** — sublinear vector search trading exactness for speed (HNSW, IVF, DiskANN). *See: [vector-databases-embeddings](./topics/vector-databases-embeddings/).*

**Attention** — scaled dot-product `softmax(QKᵀ/√d_k)V`; core mechanism of transformers. *See: [llm-fundamentals](./topics/llm-fundamentals/).*

**AWQ** — Activation-aware Weight Quantization; preserves salient weights for INT4 inference. *See: [llmops](./topics/llmops/), [infrastructure-scalability](./topics/infrastructure-scalability/).*

## B

**BERTScore** — embedding-similarity metric for generated text vs reference; tolerates paraphrase. *See: [evaluation-testing](./topics/evaluation-testing/).*

**Bi-encoder** — dual-tower encoder producing independent query/document vectors for fast retrieval. *See: [vector-databases-embeddings](./topics/vector-databases-embeddings/), [rag](./topics/rag/).*

**Binary quantization** — 1 bit per dimension; Hamming-distance search; very fast, large recall hit. *See: [vector-databases-embeddings](./topics/vector-databases-embeddings/).*

**BLEU** — n-gram precision metric with brevity penalty; standard for machine translation. *See: [evaluation-testing](./topics/evaluation-testing/).*

**BM25** — sparse lexical ranking function based on TF-IDF with length normalization. *See: [rag](./topics/rag/), [vector-databases-embeddings](./topics/vector-databases-embeddings/).*

**BPE (Byte Pair Encoding)** — subword tokenizer that greedily merges frequent character pairs. *See: [llm-fundamentals](./topics/llm-fundamentals/).*

## C

**Cache breakpoint** — Anthropic `cache_control` marker (max 4) defining which prefix segments to cache. *See: [prompt-engineering](./topics/prompt-engineering/).*

**Catastrophic forgetting** — loss of general capabilities after narrow-domain fine-tuning. *See: [fine-tuning](./topics/fine-tuning/).*

**Causal mask** — attention mask preventing tokens from attending to future positions in decoders. *See: [llm-fundamentals](./topics/llm-fundamentals/).*

**CCPA** — California Consumer Privacy Act; data subject rights for California residents. *See: [safety-ethics](./topics/safety-ethics/).*

**CFG (Classifier-Free Guidance)** — diffusion technique trading diversity for prompt adherence; scale 4–7 typical. *See: [multi-modal](./topics/multi-modal/).*

**Chain-of-Thought (CoT)** — prompting model to emit intermediate reasoning steps before the answer. *See: [prompt-engineering](./topics/prompt-engineering/), [llm-fundamentals](./topics/llm-fundamentals/).*

**Chunking** — splitting documents into retrievable pieces (fixed, recursive, semantic, structural, parent-child). *See: [rag](./topics/rag/).*

**CLIP** — contrastive image-text dual encoder producing aligned multimodal embeddings. *See: [multi-modal](./topics/multi-modal/), [vector-databases-embeddings](./topics/vector-databases-embeddings/).*

**Coding agent** — LLM agent that reads, edits, and tests code in a repo loop (Claude Code, Cursor, Aider, Devin). *See: [agents](./topics/agents/).*

**ColBERT** — late-interaction retriever using per-token vectors scored via MaxSim; strong on rare terms. *See: [rag](./topics/rag/), [vector-databases-embeddings](./topics/vector-databases-embeddings/).*

**Constitutional AI (CAI)** — model critiques and revises outputs against a written constitution; basis for RLAIF. *See: [safety-ethics](./topics/safety-ethics/), [fine-tuning](./topics/fine-tuning/).*

**Context window** — maximum tokens a model accepts in one forward pass. *See: [llm-fundamentals](./topics/llm-fundamentals/).*

**Continuous batching** — token-level scheduling where finished sequences leave and new ones join mid-batch. *See: [infrastructure-scalability](./topics/infrastructure-scalability/), [llmops](./topics/llmops/).*

**ControlNet** — auxiliary network adding structural conditioning (pose, depth, edge) to diffusion models. *See: [multi-modal](./topics/multi-modal/).*

**Cosine similarity** — dot product of L2-normalized vectors; measures angle between embeddings. *See: [vector-databases-embeddings](./topics/vector-databases-embeddings/).*

**Cross-encoder** — joint encoder scoring (query, doc) pairs with full attention; high precision, slow. *See: [rag](./topics/rag/), [vector-databases-embeddings](./topics/vector-databases-embeddings/).*

**Cross-entropy loss** — standard LM objective `-log p(target_token)`; perplexity = exp(loss). *See: [llm-fundamentals](./topics/llm-fundamentals/).*

## D

**DDIM** — Denoising Diffusion Implicit Models; deterministic, faster sampler than DDPM. *See: [multi-modal](./topics/multi-modal/).*

**DDPM** — Denoising Diffusion Probabilistic Models; stochastic iterative denoising of Gaussian noise. *See: [multi-modal](./topics/multi-modal/).*

**Deliberative alignment** — train reasoning model to read safety spec inside CoT before responding. *See: [safety-ethics](./topics/safety-ethics/), [llm-fundamentals](./topics/llm-fundamentals/).*

**Differential Privacy (DP)** — bounds per-record influence with ε (smaller = more private), δ failure probability. *See: [safety-ethics](./topics/safety-ethics/).*

**Diffusion Transformer (DiT)** — transformer-based denoiser replacing U-Net; used by Sora, SD3, Flux. *See: [multi-modal](./topics/multi-modal/).*

**DPO (Direct Preference Optimization)** — preference loss optimized directly on pairs; skips the reward model. *See: [fine-tuning](./topics/fine-tuning/).*

## E

**E2B** — managed Firecracker microVM sandbox service for agent code execution. *See: [agents](./topics/agents/).*

**Early fusion** — combine raw multimodal features for joint reasoning (vs late fusion of independent predictions). *See: [multi-modal](./topics/multi-modal/).*

**Embedding** — dense vector representation encoding semantic meaning; similarity via distance. *See: [vector-databases-embeddings](./topics/vector-databases-embeddings/), [llm-fundamentals](./topics/llm-fundamentals/).*

**EnCodec** — neural audio codec producing discrete tokens; vocabulary for voice LLMs. *See: [multi-modal](./topics/multi-modal/).*

**End-to-end voice model** — single multimodal model ingesting/emitting audio tokens directly (GPT-4o realtime, Moshi). *See: [multi-modal](./topics/multi-modal/).*

**EU AI Act** — EU regulation tiering AI systems as unacceptable, high-risk, limited-risk, minimal. *See: [safety-ethics](./topics/safety-ethics/).*

## F

**Faithfulness** — claim-level entailment of generated answer from retrieved context (NLI or LLM judge). *See: [evaluation-testing](./topics/evaluation-testing/), [rag](./topics/rag/).*

**Fallback chain** — prioritized provider list with retries, circuit breakers, and cached/degraded responses. *See: [system-design](./topics/system-design/), [llmops](./topics/llmops/).*

**Federated learning** — train on decentralized data with robust aggregation (Krum, median) and DP. *See: [safety-ethics](./topics/safety-ethics/).*

**Few-shot** — N input/output demonstrations in the prompt to teach task pattern in-context. *See: [prompt-engineering](./topics/prompt-engineering/).*

**Firecracker** — AWS microVM hypervisor; ~125ms cold start; standard for agent sandboxing. *See: [agents](./topics/agents/).*

**FlashAttention** — IO-aware tiled attention kernel; same math, faster, less HBM traffic. *See: [llm-fundamentals](./topics/llm-fundamentals/), [infrastructure-scalability](./topics/infrastructure-scalability/).*

**FSDP (Fully Sharded Data Parallel)** — shards params, grads, and optimizer states across data-parallel ranks. *See: [infrastructure-scalability](./topics/infrastructure-scalability/).*

**Function calling** — typed schema the model fills in to invoke external code; aka tool use. *See: [agents](./topics/agents/), [llmops](./topics/llmops/).*

## G

**G-Eval** — LLM-as-judge with chain-of-thought rubric and probability-weighted scoring. *See: [evaluation-testing](./topics/evaluation-testing/).*

**GDPR** — EU regulation: lawful basis, minimization, purpose limitation, subject rights, automated-decision rights. *See: [safety-ethics](./topics/safety-ethics/).*

**GGUF** — quantized model file format used by llama.cpp for CPU/edge inference. *See: [infrastructure-scalability](./topics/infrastructure-scalability/).*

**Golden dataset** — versioned, curated ground-truth examples anchoring evals and regression tests. *See: [evaluation-testing](./topics/evaluation-testing/).*

**GPTQ** — post-training quantization method optimizing weights layer-wise for INT4. *See: [llmops](./topics/llmops/), [infrastructure-scalability](./topics/infrastructure-scalability/).*

**GQA (Grouped-Query Attention)** — query heads share K,V groups; smaller KV cache than full multi-head. *See: [llm-fundamentals](./topics/llm-fundamentals/).*

**GraphRAG** — RAG over an entity graph plus community summaries; strong for global multi-hop queries. *See: [rag](./topics/rag/).*

**GRPO** — Group Relative Policy Optimization; PPO variant with group-relative advantages, no critic. *See: [fine-tuning](./topics/fine-tuning/).*

**GSM8K** — grade-school math word problem benchmark for reasoning. *See: [evaluation-testing](./topics/evaluation-testing/).*

**Guardrails** — input/output validators for safety, schema, PII, jailbreaks (NeMo, Guardrails AI, Llama Guard). *See: [agents](./topics/agents/), [safety-ethics](./topics/safety-ethics/), [llmops](./topics/llmops/).*

**gVisor** — userspace kernel sandbox; container-level isolation when microVM unavailable. *See: [agents](./topics/agents/).*

## H

**Hallucination** — confident, plausible, factually wrong output; mitigate via RAG, citations, verifiers. *See: [safety-ethics](./topics/safety-ethics/), [rag](./topics/rag/).*

**HarmBench** — 510-behavior standardized harmful-prompt benchmark with automated judges. *See: [safety-ethics](./topics/safety-ethics/).*

**Harness** — scaffolding around the model: prompts, tools, loops, memory, observability. *See: [agents](./topics/agents/).*

**HITL (Human-in-the-loop)** — approval checkpoints for irreversible or high-risk actions. *See: [agents](./topics/agents/), [system-design](./topics/system-design/).*

**HNSW** — Hierarchical Navigable Small World; graph-based ANN with layered skip-list traversal. *See: [vector-databases-embeddings](./topics/vector-databases-embeddings/), [rag](./topics/rag/).*

**HumanEval** — Python code-completion benchmark scored by unit tests. *See: [evaluation-testing](./topics/evaluation-testing/).*

**Hybrid search** — fuses BM25 (lexical) + dense vectors via RRF or weighted scores. *See: [rag](./topics/rag/), [vector-databases-embeddings](./topics/vector-databases-embeddings/).*

**HyDE** — Hypothetical Document Embeddings; LLM drafts a hypothetical answer used as the retrieval query. *See: [rag](./topics/rag/).*

## I

**Inspect AI** — code-driven eval pipeline framework with datasets, solvers, scorers, and log viewer. *See: [evaluation-testing](./topics/evaluation-testing/).*

**Instruction tuning** — SFT on diverse (instruction, response) pairs so model follows commands. *See: [fine-tuning](./topics/fine-tuning/).*

**IP-Adapter** — image-prompt conditioning module for diffusion models. *See: [multi-modal](./topics/multi-modal/).*

**IPO** — preference loss with squared margin; stable when DPO overfits deterministic preferences. *See: [fine-tuning](./topics/fine-tuning/).*

**ITL (Inter-Token Latency)** — average latency between successive decoded tokens; aka TPOT. *See: [llmops](./topics/llmops/), [infrastructure-scalability](./topics/infrastructure-scalability/).*

**IVF** — Inverted File index; partitions vector space into Voronoi cells, probes nprobe per query. *See: [vector-databases-embeddings](./topics/vector-databases-embeddings/).*

## J

**Jailbreak** — prompt that bypasses safety alignment via persona, encoding, role-play, or adversarial suffix. *See: [safety-ethics](./topics/safety-ethics/), [prompt-engineering](./topics/prompt-engineering/).*

**JailbreakBench** — 100-prompt curated jailbreak benchmark with leaderboard and automated judges. *See: [safety-ethics](./topics/safety-ethics/).*

**JSON mode** — provider-side constrained decoding that guarantees parseable JSON output. *See: [llmops](./topics/llmops/), [prompt-engineering](./topics/prompt-engineering/).*

## K

**Knowledge distillation** — train a smaller student model to match a teacher's outputs or logits. *See: [fine-tuning](./topics/fine-tuning/).*

**KTO** — Kahneman-Tversky preference loss using per-example binary feedback (no pairs needed). *See: [fine-tuning](./topics/fine-tuning/).*

**KV cache** — stored K,V tensors per token; avoids recomputation during autoregressive decoding. *See: [llm-fundamentals](./topics/llm-fundamentals/), [infrastructure-scalability](./topics/infrastructure-scalability/).*

## L

**Latent diffusion** — diffusion in VAE-compressed latent space (8x downsample); used by Stable Diffusion. *See: [multi-modal](./topics/multi-modal/).*

**Late interaction** — token-level scoring (e.g., ColBERT MaxSim) preserving fine-grained matches. *See: [rag](./topics/rag/), [vector-databases-embeddings](./topics/vector-databases-embeddings/).*

**LCM (Latent Consistency Model)** — distilled diffusion for 4–8 step sampling. *See: [multi-modal](./topics/multi-modal/).*

**LLM-as-judge** — prompt strong model with rubric for scoring or pairwise preference; scalable but biased. *See: [evaluation-testing](./topics/evaluation-testing/).*

**LLMOps** — MLOps for LLMs: prompt versioning, token economics, third-party API ops, non-deterministic eval. *See: [llmops](./topics/llmops/).*

**Logits** — pre-softmax scores per vocabulary token. *See: [llm-fundamentals](./topics/llm-fundamentals/).*

**LoRA** — Low-Rank Adaptation; injects ΔW = BA into attention/MLP weights for PEFT. *See: [fine-tuning](./topics/fine-tuning/).*

**Lost-in-the-middle** — LLMs underweight content in the middle of long contexts vs start/end. *See: [prompt-engineering](./topics/prompt-engineering/), [rag](./topics/rag/).*

## M

**Matryoshka embedding** — nested representations; truncate to smaller dim with graceful quality loss. *See: [vector-databases-embeddings](./topics/vector-databases-embeddings/).*

**MCP (Model Context Protocol)** — open protocol decoupling agent hosts from tool/data servers. *See: [agents](./topics/agents/).*

**Memory tiers** — short-term (context), long-term (vector/KV store), episodic (past trajectories). *See: [agents](./topics/agents/).*

**Meta-prompt** — prompt that instructs an LLM to generate or refine other prompts (APE, OPRO, DSPy). *See: [prompt-engineering](./topics/prompt-engineering/).*

**MMLU** — Massive Multitask Language Understanding; 57-subject knowledge benchmark. *See: [evaluation-testing](./topics/evaluation-testing/).*

**MoE (Mixture of Experts)** — N expert FFNs + router; only top-k experts active per token. *See: [llm-fundamentals](./topics/llm-fundamentals/).*

**Model card** — document covering intended use, training data, disaggregated metrics, biases, ethics. *See: [safety-ethics](./topics/safety-ethics/).*

**Model merging** — weight-space combination of fine-tunes (soup, SLERP, TIES, DARE). *See: [fine-tuning](./topics/fine-tuning/).*

**MQA (Multi-Query Attention)** — all query heads share a single K,V; smallest KV cache. *See: [llm-fundamentals](./topics/llm-fundamentals/).*

**Multi-head attention** — parallel attention heads with different projections, concatenated and projected. *See: [llm-fundamentals](./topics/llm-fundamentals/).*

## N

**Neural audio codec** — learned RVQ codec (EnCodec, SoundStream, Mimi, DAC) compressing audio to discrete tokens. *See: [multi-modal](./topics/multi-modal/).*

**NIST AI RMF** — NIST AI Risk Management Framework: Govern, Map, Measure, Manage. *See: [safety-ethics](./topics/safety-ethics/).*

## O

**Observability** — traces, spans, structured logs, token + cost attribution per request. *See: [llmops](./topics/llmops/).*

**ORPO** — single-stage SFT + odds-ratio preference penalty; no reference model required. *See: [fine-tuning](./topics/fine-tuning/).*

**Output parser** — extracts and validates structured data (JSON, Pydantic) from raw LLM text with retries. *See: [prompt-engineering](./topics/prompt-engineering/), [coding-practical](./topics/coding-practical/).*

## P

**P95 / P99** — 95th/99th percentile latency; tail-latency SLO targets. *See: [llmops](./topics/llmops/), [system-design](./topics/system-design/).*

**Paged attention** — block-based KV allocation (vLLM); eliminates fragmentation, enables prefix sharing. *See: [infrastructure-scalability](./topics/infrastructure-scalability/).*

**PEFT (Parameter-Efficient Fine-Tuning)** — fine-tunes <1% of parameters with frozen base (LoRA, adapters, prefix). *See: [fine-tuning](./topics/fine-tuning/).*

**Phoenix** — open-source LLM tracing and eval tool by Arize. *See: [evaluation-testing](./topics/evaluation-testing/), [coding-practical](./topics/coding-practical/).*

**PII (Personally Identifiable Information)** — regulated personal data; detect (Presidio, NER), redact, never log raw. *See: [safety-ethics](./topics/safety-ethics/), [llmops](./topics/llmops/).*

**Pipeline parallelism (PP)** — split model layers into stages across GPUs; cross-node-friendly. *See: [infrastructure-scalability](./topics/infrastructure-scalability/).*

**Plan-and-Execute** — planner builds steps upfront, executor runs them; cheaper, less adaptive than ReAct. *See: [agents](./topics/agents/).*

**Positional encoding** — sinusoidal/learned/RoPE encoding that gives the model token-order information. *See: [llm-fundamentals](./topics/llm-fundamentals/).*

**PQ (Product Quantization)** — splits vector into subvectors, replaces each with centroid ID; 8–32x compression. *See: [vector-databases-embeddings](./topics/vector-databases-embeddings/).*

**Prefix caching** — inference-engine KV-cache reuse for shared prompt prefixes (vLLM, SGLang). *See: [prompt-engineering](./topics/prompt-engineering/), [llmops](./topics/llmops/).*

**Prompt caching** — provider-exposed reuse of processed prompt prefixes across requests. *See: [prompt-engineering](./topics/prompt-engineering/), [llmops](./topics/llmops/).*

**Prompt chaining** — decomposing a task into sequential LLM calls with typed contracts between steps. *See: [prompt-engineering](./topics/prompt-engineering/).*

**Prompt injection** — untrusted input contains instructions hijacking the model (direct or indirect via RAG/tool output). *See: [safety-ethics](./topics/safety-ethics/), [prompt-engineering](./topics/prompt-engineering/).*

**Prompt template** — parameterized prompt with typed variables, versioned like code. *See: [prompt-engineering](./topics/prompt-engineering/).*

**Promptfoo** — config-driven eval pipeline with assertions and CI integration. *See: [evaluation-testing](./topics/evaluation-testing/).*

## Q

**QLoRA** — 4-bit NF4 quantized base + LoRA adapters in bf16; fits 65B on a 48GB GPU. *See: [fine-tuning](./topics/fine-tuning/).*

**Quantization** — reduce weight precision (FP16/BF16/INT8/INT4) for memory and throughput gains. *See: [llmops](./topics/llmops/), [infrastructure-scalability](./topics/infrastructure-scalability/).*

## R

**RadixAttention** — SGLang's global prefix cache via radix tree; wins on agentic, multi-turn workloads. *See: [infrastructure-scalability](./topics/infrastructure-scalability/), [prompt-engineering](./topics/prompt-engineering/).*

**RAG (Retrieval-Augmented Generation)** — retrieve relevant context and ground generation in it. *See: [rag](./topics/rag/).*

**RAGAS** — RAG eval framework scoring context precision/recall, faithfulness, answer relevance. *See: [evaluation-testing](./topics/evaluation-testing/), [rag](./topics/rag/).*

**ReAct** — interleaved Thought / Action / Observation loop; foundation for agents. *See: [agents](./topics/agents/), [prompt-engineering](./topics/prompt-engineering/).*

**Reasoning model** — LLM RL-tuned to emit long hidden chain-of-thought before answering (o-series, Claude extended thinking, R1). *See: [llm-fundamentals](./topics/llm-fundamentals/).*

**Red teaming** — structured adversarial probing for safety, security, bias, privacy. *See: [safety-ethics](./topics/safety-ethics/), [evaluation-testing](./topics/evaluation-testing/).*

**Reflection** — agent self-critique step that catches errors at extra token cost. *See: [agents](./topics/agents/).*

**Reranker** — cross-encoder rescoring top-k for higher precision than bi-encoder dot product. *See: [rag](./topics/rag/), [vector-databases-embeddings](./topics/vector-databases-embeddings/).*

**RLAIF** — Reinforcement Learning from AI Feedback; AI judge replaces human preference annotators. *See: [fine-tuning](./topics/fine-tuning/), [safety-ethics](./topics/safety-ethics/).*

**RLHF** — Reinforcement Learning from Human Feedback; SFT → reward model → PPO with KL penalty. *See: [fine-tuning](./topics/fine-tuning/).*

**RMSNorm** — Root Mean Square LayerNorm; no mean subtraction, simpler/faster. *See: [llm-fundamentals](./topics/llm-fundamentals/).*

**Role prompting** — assign a persona ("you are an expert X") to bias style and depth. *See: [prompt-engineering](./topics/prompt-engineering/).*

**RoPE (Rotary Position Embedding)** — relative position via complex rotation in attention. *See: [llm-fundamentals](./topics/llm-fundamentals/).*

**ROUGE** — n-gram/LCS recall vs reference summaries; standard for summarization. *See: [evaluation-testing](./topics/evaluation-testing/).*

**RRF (Reciprocal Rank Fusion)** — fuses ranked lists via `Σ 1/(k + rank_i)`, k≈60. *See: [rag](./topics/rag/), [vector-databases-embeddings](./topics/vector-databases-embeddings/).*

## S

**Sandboxing** — isolated containers/microVMs (Docker, gVisor, Firecracker, E2B) for code execution. *See: [agents](./topics/agents/).*

**Self-consistency** — sample N CoT paths at temperature > 0, majority-vote the answers. *See: [prompt-engineering](./topics/prompt-engineering/).*

**Self-RAG** — RAG with reflection tokens for retrieve/grade/critique decisions. *See: [rag](./topics/rag/).*

**Semantic cache** — embedding-similarity cache that catches paraphrased queries. *See: [system-design](./topics/system-design/), [llmops](./topics/llmops/).*

**SFT (Supervised Fine-Tuning)** — cross-entropy training on (prompt, target) pairs. *See: [fine-tuning](./topics/fine-tuning/).*

**SGLang** — inference engine with RadixAttention global prefix cache; strong on agentic workloads. *See: [infrastructure-scalability](./topics/infrastructure-scalability/).*

**Skip connection** — residual stream enabling gradient flow and identity baseline. *See: [llm-fundamentals](./topics/llm-fundamentals/).*

**SLA / SLO** — Service Level Agreement / Objective; latency, availability, error-rate targets. *See: [llmops](./topics/llmops/), [system-design](./topics/system-design/).*

**Speculative decoding** — small draft model proposes K tokens; large model verifies in parallel. *See: [infrastructure-scalability](./topics/infrastructure-scalability/).*

**STAR** — Situation, Task, Action, Result; standard framing for behavioral interview questions. *See: [behavioral](./topics/behavioral/).*

**STT (Speech-to-Text) / ASR** — transcribe audio to text (Whisper, Deepgram). *See: [multi-modal](./topics/multi-modal/).*

**SWE-Bench** — real GitHub issue → patch → hidden tests benchmark; Verified is 500 curated tasks. *See: [agents](./topics/agents/), [evaluation-testing](./topics/evaluation-testing/).*

**Synthetic data** — LLM-generated training examples (Self-Instruct, Evol-Instruct, Magpie). *See: [fine-tuning](./topics/fine-tuning/).*

**System prompt** — high-priority persistent instruction block setting role, rules, format. *See: [prompt-engineering](./topics/prompt-engineering/).*

## T

**Temperature** — sampling control; 0 deterministic, higher = more creative. *See: [llm-fundamentals](./topics/llm-fundamentals/), [prompt-engineering](./topics/prompt-engineering/).*

**TensorRT-LLM** — NVIDIA compiled inference backend with FP8/INT4 and in-flight batching. *See: [infrastructure-scalability](./topics/infrastructure-scalability/).*

**Tensor parallelism (TP)** — shard weight matrices across GPUs intra-node over NVLink. *See: [infrastructure-scalability](./topics/infrastructure-scalability/).*

**Test-time compute scaling** — spend more inference compute (CoT, best-of-N, self-consistency, search) for accuracy. *See: [llm-fundamentals](./topics/llm-fundamentals/).*

**Thinking budget** — cap on hidden reasoning tokens (Anthropic `budget_tokens`, OpenAI `reasoning.effort`). *See: [llm-fundamentals](./topics/llm-fundamentals/).*

**Token** — subword unit; LLM inputs/outputs are sequences of token IDs. *See: [llm-fundamentals](./topics/llm-fundamentals/).*

**Tokenizer** — text ↔ token IDs (BPE, WordPiece, SentencePiece). *See: [llm-fundamentals](./topics/llm-fundamentals/).*

**Tool use** — typed schema the model fills in to invoke external code; aka function calling. *See: [agents](./topics/agents/).*

**Top-k / Top-p** — sampling truncations; top-k keeps K candidates, top-p keeps minimal mass ≥ p. *See: [llm-fundamentals](./topics/llm-fundamentals/).*

**ToT (Tree-of-Thought)** — branching search over thoughts with LLM as generator + evaluator (BFS/DFS). *See: [prompt-engineering](./topics/prompt-engineering/).*

**TruLens** — RAG eval framework with feedback functions for context relevance, groundedness, answer relevance. *See: [evaluation-testing](./topics/evaluation-testing/), [rag](./topics/rag/).*

**TTFT (Time-To-First-Token)** — latency from request to first generated token; prefill cost. *See: [llmops](./topics/llmops/), [infrastructure-scalability](./topics/infrastructure-scalability/).*

**TTS (Text-to-Speech)** — text → mel-spectrogram → vocoder, or end-to-end neural codec. *See: [multi-modal](./topics/multi-modal/).*

**Turn-taking** — logic deciding when user has finished speaking and when agent should yield on interruption. *See: [multi-modal](./topics/multi-modal/).*

## V

**VAD (Voice Activity Detection)** — frame-level speech vs non-speech classifier (WebRTC, Silero); gates listen/respond loop. *See: [multi-modal](./topics/multi-modal/), [system-design](./topics/system-design/).*

**VAE (Variational Autoencoder)** — encoder/decoder used for latent compression in latent diffusion. *See: [multi-modal](./topics/multi-modal/).*

**Vector database** — store + ANN index for embedding retrieval (Pinecone, Weaviate, Qdrant, Milvus, pgvector). *See: [vector-databases-embeddings](./topics/vector-databases-embeddings/), [rag](./topics/rag/).*

**ViT (Vision Transformer)** — splits image into patches, embeds each as a token, applies transformer. *See: [multi-modal](./topics/multi-modal/).*

**VLM (Vision-Language Model)** — LLM extended with a vision encoder + projector (LLaVA, GPT-4V, Claude, Gemini). *See: [multi-modal](./topics/multi-modal/).*

**vLLM** — open-source GPU inference server with PagedAttention and continuous batching. *See: [infrastructure-scalability](./topics/infrastructure-scalability/), [llmops](./topics/llmops/).*

**VQA (Visual Question Answering)** — answer text questions about images (VQAv2, GQA, TextVQA, MMMU). *See: [multi-modal](./topics/multi-modal/).*

## W

**Watermarking** — embed signal in generated content for provenance (SynthID, Stable Signature, C2PA). *See: [safety-ethics](./topics/safety-ethics/).*

**Whisper** — encoder-decoder ASR transformer with mel-spectrogram input; multilingual, multi-task. *See: [multi-modal](./topics/multi-modal/).*

## Z

**Zero-shot** — no examples in the prompt; rely on the model's pretrained generalization. *See: [prompt-engineering](./topics/prompt-engineering/).*

**ZeRO** — DeepSpeed memory optimizer; stages 1 (optim), 2 (+grads), 3 (+params); Infinity offloads to CPU/NVMe. *See: [infrastructure-scalability](./topics/infrastructure-scalability/).*
