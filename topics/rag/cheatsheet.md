---
title: "Cheatsheet"
parent: "Retrieval-Augmented Generation (RAG)"
nav_order: 1
---

# Retrieval-Augmented Generation (RAG) — Cheat Sheet

[← Back to index](../../README.md) · [Full Q&A](./questions.md)

## Core concepts
- **Pipeline**: load → chunk → embed → store → retrieve → re-rank → prompt → generate → cite.
- **Chunking strategies**: fixed-size, recursive (separator hierarchy), semantic (similarity merge), structural (headings), parent-child (small-to-big).
- **Embedding models**: transformer encoders (BGE, E5, Nomic, OpenAI, Voyage, Cohere); pick by domain, language, dim, max-len, license.
- **Vector DBs**: Pinecone, Weaviate, Qdrant, Milvus, Vespa, pgvector; ANN indexes HNSW, IVF-PQ, DiskANN.
- **Hybrid search**: BM25 (lexical) + dense vectors fused via Reciprocal Rank Fusion (RRF) or weighted scores.
- **Re-ranking**: cross-encoder (BGE-reranker, Cohere Rerank, Voyage rerank) re-scores top 20–100 with full attention; biggest precision win.
- **Query transformation**: HyDE (hypothetical doc), query decomposition, step-back prompting, multi-query expansion.
- **Advanced patterns**: Agentic RAG (LLM tool-use loops), GraphRAG (entity graph + community summaries), Self-RAG (reflection tokens for retrieve/grade/critique).
- **Metadata filtering**: pre-filter (accurate) vs post-filter (faster); used for ACL, tenant, recency, type.
- **Citations**: stable chunk IDs + structured output + post-verify cited spans against retrieved context.
- **Failure modes**: bad chunking, weak embeddings, lost-in-the-middle, hallucination beyond context, stale data, jargon mismatch.
- **Evaluation**: context precision/recall (retrieval), faithfulness + answer relevance (generation); RAGAS, TruLens, DeepEval, LangSmith.
- **Multimodal RAG**: caption-then-embed or native multimodal embeddings (CLIP, multimodal Cohere/Voyage).
- **PDF parsing**: layout-aware tools (Unstructured, LlamaParse, Docling, Textract); preserve tables as Markdown.
- **RAGAS metrics**: context precision/recall (retrieval), faithfulness + answer relevance (generation); offline eval gate in CI.
- **TruLens RAG triad**: context relevance, groundedness, answer relevance—feedback functions on live/replayed traffic; pair with Phoenix/LangSmith tracing.
- **ColBERT / late interaction**: per-token vectors scored via MaxSim; better recall on rare terms and long-tail entities than bi-encoders (Khattab 2020, ColBERTv2/PLAID).
- **Cache-aware RAG**: stable prefix (system + tools + retrieved pack) + query last; deterministic chunk order; route queries to shared "context packs" to maximize prompt-cache hits.
- **Streaming ingest**: CDC (Debezium/Kafka/webhooks) → stream processor → incremental embed + upsert/tombstone; freshness SLO (e.g., p95 < 60s) tracked like latency.

## Decision rules
- **RAG vs fine-tune**: RAG for facts/freshness/citations; fine-tune for behavior/style/format. Combine when both gaps exist.
- **Chunk size**: start 512 tokens, 10–20% overlap; smaller for factoids, larger for procedures; always benchmark.
- **Re-rank or not**: re-rank whenever latency budget allows—biggest single quality lift after hybrid search.
- **Hybrid vs pure vector**: use hybrid when corpus has codes, names, jargon, or rare tokens; pure vector for purely conceptual corpora.
- **Vector DB choice**: managed (Pinecone) for speed-to-prod; self-hosted (Qdrant, Weaviate) for cost/data residency; pgvector if Postgres-native is acceptable.
- **GraphRAG vs vector RAG**: GraphRAG for global, multi-hop, relational queries over a stable corpus; vector RAG for direct lookup and frequent updates.
- **Long-context vs RAG**: long context for small/cohesive corpora and reasoning needing all facts at once; RAG for scale, freshness, ACLs, citations, cost; combine via retrieve-many-then-stuff with prompt caching.
- **Bi-encoder vs late interaction**: bi-encoder + cross-encoder rerank by default; switch to ColBERT/late interaction when recall on rare terms, code, or jargon is the bottleneck and index size is acceptable.

## Key formulas / parameters
- **Chunk size**: 256–1024 tokens typical; **overlap**: 10–20%.
- **Top-k**: retrieve 20–100, re-rank to 3–10 for prompt.
- **Embedding dims**: 384 (small), 768–1024 (mid), 1536–4096 (large); storage = N × dim × 4 bytes (or 1 byte with int8 quantization).
- **HNSW params**: `M` 16–48, `efConstruction` 100–400, `efSearch` 50–200 (recall vs latency).
- **RRF fusion**: `score = Σ 1 / (k + rank_i)`, k≈60.
- **Faithfulness target**: >0.9 on RAGAS is a common heuristic, not a hard threshold; calibrate against your golden set. Context recall is typically the harder metric to lift.

## Common pitfalls
- Treating chunk size as universal—not benchmarking per corpus.
- Cramming top-k=50 into the prompt and triggering lost-in-the-middle.
- Skipping re-ranking; relying on raw bi-encoder scores.
- Letting the LLM enforce ACLs instead of pre-filtering at retrieval.
- Embedding tables/SQL rows as flat text instead of routing to structured tools.
- Naive PDF extractors that destroy reading order and tables.
- No eval set: tuning blind, regressions invisible.
- Forgetting to re-embed after changing chunker or embedding model.
- Trusting LLM-generated citations without verifying spans actually exist in context.
- Ignoring freshness: no TTL, no incremental re-ingest, stale answers in production.
