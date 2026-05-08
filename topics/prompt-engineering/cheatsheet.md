# Prompt Engineering — Cheat Sheet

[← Back to index](../../README.md) · [Full Q&A](./questions.md)

## Core concepts
- **Zero/one/few-shot**: 0, 1, or N input/output demonstrations in the prompt to teach task pattern in-context.
- **Chain-of-Thought (CoT)**: Prompt model to emit intermediate reasoning steps before the answer; helps multi-hop tasks.
- **Self-consistency**: Sample N CoT paths at temperature > 0, majority-vote the answers.
- **Tree-of-Thought (ToT)**: Branching search over thoughts with LLM as generator + evaluator; BFS/DFS through partial solutions.
- **ReAct**: Interleave Thought → Action (tool call) → Observation loops; foundation for agents.
- **System prompt**: High-priority persistent instruction block setting role, rules, and format.
- **Role prompting**: Assign persona ("You are an expert X") to bias style and depth.
- **Prompt chaining**: Decompose task into sequential LLM calls with typed contracts between steps.
- **Prompt template**: Parameterized prompt with typed variables, versioned like code.
- **Output parser**: Extracts and validates structured data (JSON, Pydantic) from raw LLM text with retries.
- **Prompt injection**: Untrusted input contains instructions that hijack the model (direct or indirect via tool/RAG output).
- **Jailbreak**: Bypassing safety alignment via persona, encoding, role-play, or adversarial suffixes.
- **Lost-in-the-middle**: LLMs underweight content in the middle of long contexts vs start/end.
- **Meta-prompt**: Prompt that instructs an LLM to generate or refine other prompts (APE, OPRO, DSPy).
- **Prompt tuning**: Learned soft-prompt embedding vectors prepended to input; gradient-based, not text.
- **Prompt caching**: Provider-exposed reuse of processed prompt prefixes across requests; ~10% input cost on Anthropic, 50% on OpenAI, large TTFT win.
- **Prefix caching**: Inference-engine KV-cache reuse (vLLM RadixAttention, SGLang) underlying prompt caching; same static-prefix design wins both.
- **Cache breakpoints**: Anthropic's explicit `cache_control` markers (max 4) defining which prefix segments to cache; OpenAI caches automatically above 1024 tokens.
- **Cache TTL**: Anthropic 5min default or 1h extended (higher write cost); OpenAI ~5-10min best-effort, no guarantee.

## Decision rules
- Use CoT when task needs multi-step reasoning; skip for simple lookup/classification (latency cost).
- Use self-consistency when answer is short/aggregable and accuracy matters more than cost.
- Use few-shot when format matters or the task is narrow; zero-shot for general capability tasks.
- Chain prompts when a single mega-prompt fails reliability; keep one responsibility per step.
- Use structured-output / tool-calling APIs whenever you need JSON — do not rely on prose instructions alone.
- Move secrets and proprietary logic out of the system prompt — treat it as effectively public.
- For non-English: prompt in target language and use in-language few-shot; translation-pivot only for low-resource.
- Invest in cache-aware prompt design when a static prefix (system + tools + RAG/few-shot) exceeds ~1k tokens and is reused across ≥3 calls per TTL window — order static-to-dynamic and place breakpoints at stable boundaries.

## Key formulas / parameters
- Temperature: 0 for deterministic/classification; 0.7-1.0 for creative or self-consistency sampling.
- Top-p: 0.9-1.0 typical; lower with higher temperature to keep coherence.
- Few-shot example count: 3-10 typical; diminishing returns beyond, watch context cost.
- Self-consistency N: 5-40 samples depending on budget; gain plateaus around 10-20.

## Common pitfalls
- Inconsistent outputs → temperature too high, biased example order, or no output schema.
- Format drift → use constrained decoding / tool calling, not just "respond in JSON" instructions.
- System prompt leak → it will leak; redesign so it does not contain secrets.
- CoT hurts accuracy → model too small, or task does not need reasoning; check chain quality.
- Refusals on benign queries → over-aligned model; reframe task or switch model, do not bypass safety.
- Long-context retrieval misses → reorder so key info is at start/end (lost-in-the-middle).
- Few-shot dominates output style → examples are too uniform; diversify or reduce count.
- Works in English, fails elsewhere → English-only few-shot/prompt; localize and add per-language evals.
