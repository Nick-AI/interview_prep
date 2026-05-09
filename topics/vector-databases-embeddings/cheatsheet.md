---
title: "Cheatsheet"
parent: "Vector Databases and Embeddings"
nav_order: 1
---

# Vector Databases and Embeddings — Cheat Sheet

[← Back to index](../../README.md) · [Full Q&A](./questions.md)

## Core concepts
- **Embedding**: dense vector encoding semantic meaning of an input.
- **Dense vs sparse**: dense = low-dim continuous (semantic); sparse = vocab-sized mostly-zero (lexical, BM25/SPLADE).
- **Cosine similarity**: dot product of L2-normalized vectors; measures angle.
- **Dot product**: magnitude-aware alignment; required when norms carry signal.
- **Euclidean (L2) distance**: spatial separation; equivalent ranking to cosine when normalized.
- **ANN (approximate nearest neighbor)**: sublinear search trading exactness for speed.
- **HNSW**: graph-based ANN with layered skip-list traversal; high recall, RAM-heavy.
- **IVF**: partitions space into Voronoi cells; probes nprobe cells per query; disk-friendly.
- **PQ (product quantization)**: splits vector into subvectors, replaces each with centroid ID; 8-32x compression.
- **Scalar quantization (SQ)**: float32 → int8; 4x smaller, ~1% recall loss.
- **Binary quantization**: 1 bit per dim; Hamming search; very fast.
- **Hybrid search**: fuses BM25 + vector results via RRF or weighted sum.
- **Multi-modal embedding**: shared vector space across text/image/audio (CLIP, SigLIP).
- **Matryoshka embedding**: nested representations; truncate to smaller dim with graceful loss.
- **Reranker**: cross-encoder rescoring top-k for higher precision than bi-encoder dot product.

## Decision rules
- Use **cosine** if model card says normalized; **dot product** if magnitudes are meaningful.
- Use **hybrid** for technical/enterprise content with rare terms; **dense-only** for paraphrase-heavy semantic tasks.
- Pick **HNSW** for in-memory low-latency; **IVF-PQ or DiskANN** for billion-scale on disk.
- Apply **scalar quantization** by default; escalate to **PQ** only when memory still exceeds budget.
- Always **reindex from scratch** when changing embedding model; never mix vector spaces.
- Add a **cross-encoder reranker** when high-similarity but irrelevant results appear.

## Key formulas / parameters
- Cosine: `cos(a,b) = (a·b) / (||a|| ||b||)`.
- Memory per vector: `dim × bytes_per_value` (float32=4, int8=1, bit=0.125).
- Typical dims: 384 (small/E5-small), 768 (BERT-base), 1024–1536 (E5-large, OpenAI), 3072 (text-embedding-3-large).
- HNSW knobs: `M` (graph degree, 16–64), `efConstruction` (build quality), `efSearch` (recall vs latency).
- IVF knobs: `nlist` (≈√N), `nprobe` (cells visited per query).

## Common pitfalls
- Mixing vectors from different models or versions in one index.
- Using cosine on unnormalized embeddings or dot product on normalized ones contrary to model card.
- Brute-force scan at million-scale because flat index was never swapped for ANN.
- Aggressive metadata filters that degrade ANN to brute force when engine lacks filterable HNSW.
- Forgetting to re-embed the corpus after upgrading the embedding model.
- Chunk size mismatch with model context window, truncating meaning mid-thought.
- Treating MTEB leaderboard winners as best for your domain without running an in-domain eval.
- Ignoring query-document asymmetry: using STS-tuned models for short-query retrieval tasks.
