# Coding and Practical Implementation — Cheat Sheet

[← Back to index](../../README.md) · [Full Q&A](./questions.md)

## Common building blocks
- **Embeddings:** `sentence-transformers`, `openai`, `voyageai`, `cohere`
- **Vector DBs:** `chromadb`, `faiss`, `qdrant-client`, `pinecone`, `weaviate-client`
- **LLM SDKs:** `openai`, `anthropic`, `google-genai`, `litellm` (multi-provider)
- **Reranking:** `cohere`, `sentence-transformers` `CrossEncoder`
- **Tokenization:** `tiktoken`, `transformers.AutoTokenizer`, `anthropic` count-tokens
- **Document parsing:** `pypdf`, `pdfplumber`, `unstructured`, `pytesseract` (OCR)
- **Agent / orchestration:** `langgraph`, `langchain`, `llama-index`, `crewai`, `autogen`
- **Tracing / eval:** `langsmith`, `phoenix` (Arize), `ragas`, `mlflow`
- **Guardrails / safety:** `guardrails-ai`, `nemo-guardrails`, `presidio-analyzer`, `lakera-guard`
- **Resilience:** `tenacity`, `backoff`, `httpx`
- **Caching:** `redis`, `diskcache`, `gptcache`
- **Serving:** `fastapi`, `sse-starlette`, `uvicorn`

## Standard patterns
- **RAG:** chunk → embed → upsert → query → top-k → rerank → stuff into prompt → call LLM → cite sources
- **Tool use loop:** define schemas → LLM emits call → validate args → dispatch handler → return result → loop until plain text or max-iter
- **Streaming:** SSE or chunked HTTP; flush per token; forward upstream cancellation
- **Retry:** exponential backoff with jitter; honor `Retry-After`; cap attempts and total deadline; only retry idempotent failures
- **Caching:** exact-match (key = `hash(model, prompt, params)`) and semantic (key = embedding nearest match within similarity threshold)
- **Memory:** sliding window for recency + rolling summary for long history; always preserve system message
- **Eval:** golden dataset → generate → LLM-as-judge with rubric → aggregate → spot-check low-confidence judgments
- **Multi-agent:** orchestrator + specialists + critic; shared blackboard; explicit termination criterion

## Common pitfalls
- Embedding model mismatch between index time and query time
- No overlap on chunk boundaries → context loss at edges
- Retrying non-idempotent or 4xx errors → wasted spend or bad UX
- Cache key omits `model` / `temperature` / tool defs → stale or wrong responses
- Tool-use loop with no max-iteration cap → infinite loops and cost blowups
- Token counts drift across model versions → silent context-window overflows
- Indirect prompt injection via retrieved documents (not just user input)
- LLM-as-judge bias: position, verbosity, self-preference — randomize and use `temperature=0`
- Logging full prompts/responses with PII into shared observability tools
- Cross-encoder reranker on too-large N dominating end-to-end latency
