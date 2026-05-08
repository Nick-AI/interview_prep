# Coding and Practical Implementation

[← Back to index](../../README.md) · [Cheat sheet](./cheatsheet.md)

> Hands-on coding tasks for AI engineering interviews. Each entry sketches the approach, libraries, and gotchas — not runnable code.

### Implement a basic RAG pipeline using an embedding model and a vector database.

**TL;DR:** Chunk documents, embed, upsert into vector DB, retrieve top-k at query time, stuff into LLM prompt.

**Approach:**
- **Inputs/outputs:** Input = corpus of documents + user query. Output = grounded answer with citations.
- **Libraries:** `sentence-transformers` or `openai` (embeddings), `chromadb`/`faiss` (vector store), `anthropic`/`openai` (generation).
- **Steps:**
  1. Load and chunk source docs (e.g., 500 tokens, 50-token overlap).
  2. Embed each chunk; persist `(id, vector, text, metadata)` in vector DB.
  3. At query time, embed the query and run top-k similarity search.
  4. Format retrieved chunks into a prompt with explicit instructions to cite.
  5. Call LLM and return answer + sources.
- **Gotchas:** Embedding model mismatch between index and query; chunk size too large/small for context; missing metadata filters; ignoring retrieval recall in eval.

### Build a simple AI agent with tool use (e.g., calculator, web search).

**TL;DR:** Define tool schemas, let LLM emit tool calls, dispatch in a loop until final answer.

**Approach:**
- **Inputs/outputs:** Input = user task. Output = final answer after zero or more tool invocations.
- **Libraries:** `anthropic` or `openai` (tool/function calling), `requests` or `tavily-python` (web search), `numexpr` (safe math).
- **Steps:**
  1. Declare tool schemas (name, description, JSON-schema args).
  2. Send system prompt + tools + user message to LLM.
  3. If response contains `tool_use`, run handler, append tool result.
  4. Loop until LLM returns plain text or hits max-iteration cap.
- **Gotchas:** Forgetting to feed tool results back; infinite tool-call loops; unvalidated arguments (`eval` on math input); no max-iteration / max-token guard.

### Implement semantic search using embeddings and cosine similarity.

**TL;DR:** Embed corpus once, embed query, rank by cosine similarity.

**Approach:**
- **Inputs/outputs:** Input = doc list + query string. Output = top-k docs ranked by score.
- **Libraries:** `sentence-transformers`, `numpy`, optionally `scikit-learn` for utilities.
- **Steps:**
  1. Embed all documents into an `(N, D)` matrix; L2-normalize.
  2. Embed query; L2-normalize.
  3. Score = matrix · query vector (dot equals cosine after normalization).
  4. Argsort descending and return top-k with scores.
- **Gotchas:** Forgetting normalization; recomputing doc embeddings per query; not batching encode calls; mixing models between index and query.

### Write code for different text chunking strategies (fixed-size, recursive, semantic).

**TL;DR:** Three strategies — token windows, hierarchical splitter, embedding-based boundaries.

**Approach:**
- **Inputs/outputs:** Input = raw text. Output = list of chunks (with offsets/metadata).
- **Libraries:** `tiktoken` (token counts), `langchain-text-splitters` (recursive), `sentence-transformers` (semantic).
- **Steps:**
  1. **Fixed:** slide a token window of size N with overlap O.
  2. **Recursive:** split on hierarchy of separators (`\n\n`, `\n`, `.`, ` `) until under size limit.
  3. **Semantic:** sentence-segment, embed each, merge adjacent sentences while cosine similarity stays above threshold; cut on drops.
  4. Attach `{doc_id, start, end}` metadata to each chunk.
- **Gotchas:** Splitting mid-token or mid-code-block; no overlap → context loss at boundaries; semantic chunker is expensive — cache embeddings.

### Implement a prompt template system with variable substitution.

**TL;DR:** Named templates with typed variables, validated against schema before render.

**Approach:**
- **Inputs/outputs:** Input = template name + variable dict. Output = rendered prompt string.
- **Libraries:** `jinja2` or `string.Template`, `pydantic` for variable schemas.
- **Steps:**
  1. Store templates as files keyed by name + version.
  2. Define a Pydantic model per template listing required variables.
  3. Validate inputs against schema; raise on missing/extra.
  4. Render via Jinja2 with autoescape off (LLM input, not HTML).
- **Gotchas:** Silent missing variables producing empty strings; injection via untrusted variable values; no version pinning makes A/B testing impossible.

### Build an evaluation pipeline for LLM outputs using LLM-as-a-judge.

**TL;DR:** Generate outputs, score each with a judge LLM against rubric, aggregate metrics.

**Approach:**
- **Inputs/outputs:** Input = eval dataset (prompt, optional reference). Output = per-sample scores + aggregate report.
- **Libraries:** `openai`/`anthropic` (judge), `pandas` (results), `ragas` or `phoenix` for prebuilt judges.
- **Steps:**
  1. Define rubric (e.g., correctness, faithfulness, helpfulness on 1–5).
  2. Generate candidate outputs with the system under test.
  3. Send `(prompt, output, [reference])` to judge with structured-output schema.
  4. Aggregate scores; compute pass rate; flag low-confidence judgments for human review.
- **Gotchas:** Judge bias (position, verbosity, self-preference); using same model as judge and generator; non-deterministic scores — set `temperature=0` and average over runs.

### Implement streaming responses for an LLM API.

**TL;DR:** Use SDK streaming mode, forward tokens via SSE or chunked HTTP.

**Approach:**
- **Inputs/outputs:** Input = prompt + HTTP request. Output = server-sent events streaming tokens.
- **Libraries:** `openai`/`anthropic` (`stream=True`), `fastapi` with `StreamingResponse`, `sse-starlette`.
- **Steps:**
  1. Open SDK stream; iterate over event chunks.
  2. For each delta, yield `data: {token}\n\n` to the client.
  3. Send terminal event (`data: [DONE]`) on completion.
  4. Handle client disconnect by cancelling the upstream stream.
- **Gotchas:** Buffering proxies (set `X-Accel-Buffering: no`); not flushing per chunk; ignoring upstream cancellation → wasted tokens; missing error frames in stream.

### Build a simple vector similarity search from scratch.

**TL;DR:** NumPy matrix of embeddings + brute-force cosine ranking; no external DB.

**Approach:**
- **Inputs/outputs:** Input = list of `(id, vector)` + query vector. Output = top-k ids with scores.
- **Libraries:** `numpy` only; optionally `pickle` for persistence.
- **Steps:**
  1. Stack vectors into an `(N, D)` matrix; L2-normalize rows.
  2. Compute scores = matrix @ query.
  3. Use `np.argpartition` for top-k (faster than full sort).
  4. Return `[(id, score), ...]` sorted descending.
- **Gotchas:** O(N·D) per query — fine for thousands, not millions; float32 precision; not handling empty index; no metadata filtering.

### Implement a conversation memory system for a chatbot (sliding window, summary, buffer).

**TL;DR:** Three strategies — keep last N turns, summarize old turns, or both.

**Approach:**
- **Inputs/outputs:** Input = full message history. Output = trimmed context fitting token budget.
- **Libraries:** `tiktoken` (token counting), `openai`/`anthropic` (summarization).
- **Steps:**
  1. **Buffer:** keep all messages until token budget exceeded.
  2. **Sliding window:** keep last N messages, drop older.
  3. **Summary:** when budget exceeded, summarize oldest turns into a system note, drop originals.
  4. **Hybrid:** persistent summary + sliding window of recent turns.
- **Gotchas:** Summarization loses entity references; dropping system message by accident; token-counting drift across models; no eviction → unbounded cost.

### Write code to detect and handle hallucinations in LLM outputs.

**TL;DR:** Cross-check claims against retrieved sources or via a second-model verifier.

**Approach:**
- **Inputs/outputs:** Input = LLM output (+ optional source docs). Output = flagged spans + confidence.
- **Libraries:** `sentence-transformers` (NLI cross-encoder), `ragas` (faithfulness metric), `openai`/`anthropic` (verifier).
- **Steps:**
  1. Extract atomic claims from the output (LLM call with structured output).
  2. For each claim, retrieve supporting passages from source.
  3. Run NLI (entailment / contradiction / neutral) of passage → claim.
  4. Mark unsupported claims; either redact, regenerate, or surface a warning.
- **Gotchas:** No source docs = no ground truth (closed-book is harder); claim extraction itself can hallucinate; NLI models miss numeric / temporal errors.

### Implement a retry mechanism with exponential backoff for LLM API calls.

**TL;DR:** Wrap API call, retry on transient errors with exponential delay + jitter.

**Approach:**
- **Inputs/outputs:** Input = callable + retry policy. Output = result or final exception.
- **Libraries:** `tenacity` or `backoff`; `httpx` for native timeouts.
- **Steps:**
  1. Define retry-eligible exceptions (rate-limit, 5xx, connection reset).
  2. Compute delay = `min(base * 2**attempt, cap) + uniform(0, jitter)`.
  3. Honor `Retry-After` header when present.
  4. Cap attempts (e.g., 5); raise after exhaustion.
- **Gotchas:** Retrying non-idempotent calls (e.g., billable generations); thundering herd without jitter; retrying on 4xx (client error → permanent); no overall deadline.

### Write a function calling (tool use) handler for an LLM API.

**TL;DR:** Map tool name to handler, validate args against schema, return result back to LLM.

**Approach:**
- **Inputs/outputs:** Input = LLM tool-call message. Output = tool result message appended to history.
- **Libraries:** `openai` / `anthropic` SDK, `pydantic` for arg schemas.
- **Steps:**
  1. Maintain registry: `{name: (pydantic_model, callable)}`.
  2. On tool-call, look up handler; validate args via Pydantic.
  3. Execute (with timeout + try/except); serialize result to JSON string.
  4. Append `tool_result` message with same `tool_use_id` and continue conversation.
- **Gotchas:** Unhandled exceptions crashing the loop instead of returning error to LLM; oversized tool results blowing context; missing `tool_use_id`; running untrusted-code tools without sandboxing.

### Implement a simple re-ranker for search results.

**TL;DR:** Take top-N from first-stage retriever, re-score with cross-encoder, keep top-k.

**Approach:**
- **Inputs/outputs:** Input = query + N candidate docs. Output = re-ordered top-k.
- **Libraries:** `sentence-transformers` (`CrossEncoder`, e.g., `ms-marco-MiniLM`), or `cohere` rerank API.
- **Steps:**
  1. Retrieve top-N (e.g., 50) from vector search.
  2. Form `[query, doc]` pairs.
  3. Score with cross-encoder (joint encoding, not bi-encoder).
  4. Sort by score; return top-k (e.g., 5).
- **Gotchas:** Cross-encoders are slow — keep N small; truncating long docs loses signal; not normalizing scores across queries; reranker latency dominating end-to-end.

### Build a basic document parser that extracts text from PDFs and splits it into chunks.

**TL;DR:** Extract per-page text from PDF, normalize, then chunk with overlap.

**Approach:**
- **Inputs/outputs:** Input = PDF path. Output = list of `{text, page, chunk_id}`.
- **Libraries:** `pypdf` or `pdfplumber` (text extraction), `unstructured` (richer parsing), `tiktoken` (token-aware chunking).
- **Steps:**
  1. Open PDF; iterate pages; extract text per page.
  2. Clean: collapse whitespace, fix hyphenation across line breaks.
  3. Concatenate (or keep page boundaries) and run recursive splitter.
  4. Attach metadata `{source, page, chunk_index}` to each chunk.
- **Gotchas:** Scanned PDFs need OCR (`pytesseract` / `unstructured` + Tesseract); multi-column layouts get jumbled; tables lose structure — consider `camelot`; encoding artifacts (ligatures).

### Implement cosine similarity, dot product, and Euclidean distance functions from scratch.

**TL;DR:** NumPy one-liners; verify with hand-computed example.

**Approach:**
- **Inputs/outputs:** Input = two vectors (or batches). Output = scalar (or vector) of similarity/distance.
- **Libraries:** `numpy`; tests with `pytest`.
- **Steps:**
  1. **Dot:** `np.sum(a * b, axis=-1)`.
  2. **Cosine:** `dot(a, b) / (norm(a) * norm(b))`, guard div-by-zero.
  3. **Euclidean:** `np.sqrt(np.sum((a - b) ** 2, axis=-1))`.
  4. Add batched versions for `(N, D)` vs `(D,)` queries.
- **Gotchas:** Zero vectors → NaN cosine; integer overflow on int dtypes; not vectorizing (Python loops); confusing distance vs similarity (smaller vs larger = better).

### Write code to implement token counting and context window management.

**TL;DR:** Count tokens with model-specific tokenizer; trim history to fit a budget.

**Approach:**
- **Inputs/outputs:** Input = messages + model name. Output = trimmed messages within token budget.
- **Libraries:** `tiktoken` (OpenAI), `anthropic` (token counting endpoint), `transformers.AutoTokenizer` (open models).
- **Steps:**
  1. Resolve tokenizer from model name.
  2. Count tokens per message including role overhead.
  3. Reserve budget for response (`max_tokens`).
  4. Drop or summarize oldest turns until `sum + reserved <= context_window`.
- **Gotchas:** Tokenizer mismatch across model versions; ignoring per-message overhead; not reserving for tool definitions; surprises from images / multimodal token counts.

### Build a simple prompt versioning system.

**TL;DR:** Store templates with semver IDs, log which version produced which output.

**Approach:**
- **Inputs/outputs:** Input = template name + version. Output = template body + metadata; logged with each call.
- **Libraries:** Filesystem + `git`, or `langsmith`/`promptlayer`/`mlflow` for hosted versioning.
- **Steps:**
  1. Store as `prompts/<name>/<version>.txt` with a manifest (`changelog`, `vars`).
  2. Pin version explicitly at call site (no "latest" in prod).
  3. Log `(prompt_name, version, inputs, output, model, timestamp)` per call.
  4. Enable A/B by routing % of traffic to a new version.
- **Gotchas:** Implicit "latest" causing silent regressions; no rollback path; not versioning the model + sampling params alongside the prompt; PII in logs.

### Implement a caching layer for LLM responses.

**TL;DR:** Hash `(model, prompt, params)` → response; serve cached on hit.

**Approach:**
- **Inputs/outputs:** Input = request payload. Output = cached or fresh response.
- **Libraries:** `redis` or `diskcache`, `hashlib` for keys.
- **Steps:**
  1. Build key: `sha256(model + prompt + temperature + tools + ...)`.
  2. On request, check cache; return on hit.
  3. On miss, call LLM, store result with TTL.
  4. Bypass cache when `temperature > 0` (or include a nonce).
- **Gotchas:** Caching nondeterministic outputs misleads users; stale cache after prompt-template change; no cache invalidation on model upgrade; storing PII in shared cache.

### Implement semantic caching for LLM queries (cache responses for semantically similar queries).

**TL;DR:** Embed query, find nearest cached query within threshold, reuse its response.

**Approach:**
- **Inputs/outputs:** Input = user query. Output = cached response if cosine ≥ threshold, else fresh.
- **Libraries:** `sentence-transformers` (embeddings), `chromadb`/`faiss` (nearest neighbor), `redis` (response store).
- **Steps:**
  1. Embed incoming query.
  2. ANN search over cached query embeddings.
  3. If best similarity ≥ threshold (e.g., 0.95), return stored response.
  4. Else call LLM, store `(embedding, query, response)`.
- **Gotchas:** Threshold too low → wrong answers; threshold too high → no hits; ignoring user/session context (personalized answers); no eviction policy.

### Write code to detect prompt injection attempts in user inputs.

**TL;DR:** Combine regex / heuristic filters with a classifier model and policy on tool use.

**Approach:**
- **Inputs/outputs:** Input = user text. Output = `{is_injection: bool, score, reason}`.
- **Libraries:** `rebuff`, `lakera-guard`, `prompt-guard` (HF model `meta-llama/Prompt-Guard-86M`), `regex`.
- **Steps:**
  1. Pattern match for known phrases ("ignore previous", "system:", base64 blobs).
  2. Run a classifier model on input; threshold on injection probability.
  3. Sandbox tool execution and require explicit allowlist for sensitive actions.
  4. Log + alert on flagged inputs; optionally re-prompt the user.
- **Gotchas:** False positives blocking legit users; obfuscation (translation, leetspeak) bypasses regex; injection from retrieved documents (indirect injection); not separating trusted system instructions from untrusted content.

### Implement an LLM output guardrails system that checks for off-topic responses and PII leakage.

**TL;DR:** Post-generation classifier + PII regex/NER; redact or regenerate on violation.

**Approach:**
- **Inputs/outputs:** Input = LLM output + topic spec. Output = sanitized output or refusal.
- **Libraries:** `guardrails-ai` or `nemo-guardrails`, `presidio-analyzer` (PII), `spacy` for NER.
- **Steps:**
  1. Run topic classifier (LLM judge or zero-shot) → reject if off-topic.
  2. Run PII detector (regex for emails/SSN/phones + NER for names/orgs).
  3. Redact matches with placeholders or refuse with safe message.
  4. Log violations for monitoring; surface a generic error to user.
- **Gotchas:** PII regex misses international formats; NER misses pseudonymized data; classifier latency on every request; double-charging tokens by regenerating.

### Build a multi-agent system where agents have different roles and collaborate on a task.

**TL;DR:** Orchestrator routes subtasks to specialist agents; aggregator merges results.

**Approach:**
- **Inputs/outputs:** Input = high-level goal. Output = synthesized final answer.
- **Libraries:** `langgraph`, `crewai`, `autogen`, or hand-rolled with `anthropic`/`openai`.
- **Steps:**
  1. Define roles (e.g., planner, researcher, coder, critic) with per-role system prompts and tools.
  2. Orchestrator decomposes task into subtasks and dispatches.
  3. Agents communicate via a shared message bus or blackboard.
  4. Critic / aggregator validates and merges; loop until acceptance criteria met.
- **Gotchas:** Runaway loops between agents; cost explodes (N agents × tokens); shared state race conditions; no termination criterion. Reference: [Multi-Agent Systems](https://outcomeschool.com/blog/multi-agent-systems).
