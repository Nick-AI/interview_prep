# LLM Fundamentals — Cheat Sheet

[← Back to index](../../README.md) · [Full Q&A](./questions.md)

## Core concepts
- **Token**: subword unit; inputs/outputs are sequences of token IDs
- **Embedding**: dense vector representation of a token or item; semantic similarity via distance
- **Attention (Q,K,V)**: scaled dot-product, softmax(QKᵀ/√d_k)V
- **Self-attention**: each token attends to all others (or causal-masked subset)
- **Multi-head**: parallel attention heads with different projections, concat & project
- **Positional encoding**: sinusoidal / learned / RoPE — gives order info
- **RoPE**: rotary position embedding — relative position via complex rotation
- **Causal mask**: prevents attending to future tokens (decoder)
- **Tokenizer**: BPE / WordPiece / SentencePiece — text ↔ token IDs
- **KV cache**: stores past K,V to avoid recomputation during autoregressive decoding
- **GQA / MQA**: groups of query heads share K,V → smaller cache
- **Flash Attention**: I/O-aware attention kernel; same math, faster + less memory
- **MoE**: N expert FFNs + router; only top-k active per token (sparse)
- **RMSNorm**: simpler LayerNorm variant; no mean subtraction
- **Skip connections**: residual stream; gradient flow + identity baseline
- **Logits**: pre-softmax scores per vocab token
- **Temperature, top-k, top-p**: sampling controls (deterministic ↔ creative)
- **Cross-entropy loss**: -log p(target_token); standard LM objective
- **Reasoning model**: LLM RL-tuned to emit long hidden chain-of-thought before answering (o1/o3, Claude extended thinking, DeepSeek-R1, Gemini thinking)
- **Test-time compute scaling**: spend more inference compute (longer CoT, best-of-N, self-consistency, search) → predictable accuracy gains without retraining
- **Deliberative alignment**: train model to reason over written safety spec inside its CoT before responding (OpenAI, 2024)
- **Trained reasoning vs CoT prompting**: CoT prompting elicits steps from a base LLM via "think step by step"; trained reasoning bakes the behavior into weights via RL on verifiable rewards — more robust, no prompt trick needed
- **Thinking budget**: cap on hidden reasoning tokens (Anthropic `budget_tokens`, OpenAI `reasoning.effort`) — main cost/latency dial for reasoning models

## Decision rules
- Encoder-only (BERT) for classification/embeddings; decoder-only (GPT) for generation; encoder-decoder (T5) for seq2seq.
- Open-source when you need control, fine-tuning, on-prem, or cost predictability; closed-source for SOTA quality with no infra.
- Lower temp (0–0.3) for factual/code, higher (0.7–1.0) for creative.
- Use top-p ≈ 0.9 + temp 0.7 as sane default; top-k as alternative.
- Long doc → RAG/chunking first, long-context model second.
- Need structured output → use JSON mode / tool calling / constrained decoding, not prompting alone.
- Use reasoning model when error cost ≫ inference cost (math, code, multi-step planning, agents); standard LLM for chat, classification, summarization, lookup.
- Route cheap-LLM-first, escalate hard/ambiguous cases to reasoning model with capped thinking budget.

## Key formulas / parameters
- **Attention**: softmax(QKᵀ/√d_k)V — scaling stops softmax saturation
- **KV cache size** ≈ 2 × n_layers × n_heads × d_head × seq_len × batch × precision_bytes
- **Sampling defaults**: temperature 0.7, top-p 0.9, top-k 50
- **Context window**: model-defined (e.g., 8K → 1M+ for modern frontier)
- **FFN width**: 4× hidden dim for original Transformer / GELU FFNs; modern SwiGLU variants (LLaMA, Mistral) use ~8/3× to keep param count comparable.
- **Cross-entropy**: −log p(target); perplexity = exp(loss)

## Common pitfalls
- Quadratic attention → OOM on long contexts; use sliding window / Flash / paged attention
- Long context → "lost in the middle"; place key info at start/end
- Quantization (FP16→INT4) saves memory but degrades reasoning if too aggressive
- KV cache grows linearly with seq length and batch — dominant memory cost in inference
- Tokenizer mismatch between train/inference produces silent quality loss
- Repetitive output → use frequency/presence penalties, no_repeat_ngram, or higher top-p
- Hallucination → ground in RAG, lower temperature, add faithfulness verifier
- RLHF alignment tax → mix capability data, KL-regularize to base model
