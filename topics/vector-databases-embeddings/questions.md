# Vector Databases and Embeddings

[← Back to index](../../README.md) · [Cheat sheet](./cheatsheet.md)

> Embedding models, vector representations, and similarity search infrastructure for semantic retrieval.

### What are embeddings in the context of AI engineering?

**TL;DR:** Embeddings are dense numeric vectors that encode the semantic meaning of text, images, or other data into a fixed-dimensional space.

An embedding maps an input (token, sentence, image, audio clip) to a point in R^d such that semantically similar inputs land near each other under a chosen distance metric. They are produced by neural networks trained with objectives like contrastive loss, masked language modeling, or supervised similarity, and the resulting geometry enables semantic search, clustering, classification, and retrieval-augmented generation. In AI engineering, embeddings are the substrate that lets unstructured data flow through vector indexes, recommender systems, and RAG pipelines. Quality depends on the model, the training domain, the dimensionality, and how text is chunked before encoding. Reference: [Embeddings in Machine Learning](https://www.youtube.com/watch?v=LedXW6xl21s).

### How do embedding models convert text to vectors?

**TL;DR:** Text is tokenized, passed through a transformer encoder, and pooled into a single fixed-length vector representing the input.

The pipeline starts with tokenization (BPE, WordPiece, SentencePiece) which splits the string into subword IDs. Those IDs index into a learned embedding matrix and flow through transformer layers that contextualize each token via self-attention. A pooling step (CLS token, mean pooling, or last-token pooling for decoder-only models) collapses the per-token hidden states into one vector. Many production models then L2-normalize the output so cosine similarity reduces to a dot product. The model itself is typically trained with contrastive objectives on positive and hard-negative pairs to shape the geometry of the resulting space.

### What is the difference between sparse and dense embeddings?

**TL;DR:** Dense embeddings are low-dimensional continuous vectors capturing semantics, while sparse embeddings are high-dimensional vectors with mostly zero entries that capture lexical signal.

Dense embeddings (e.g., from BERT, E5, OpenAI text-embedding-3) usually have 384 to 4096 dimensions where every value is a learned float; they generalize well to paraphrases and cross-lingual queries. Sparse embeddings such as BM25 weights or learned sparse models like SPLADE have vocabulary-sized dimensions where only the active terms carry weight; they excel at exact keyword and rare-token matches. Dense vectors require ANN indexes like HNSW; sparse vectors use inverted indexes. Hybrid search combines both because each compensates for the other's failure modes. Choosing one over the other depends on whether the workload is more about meaning or exact term matches.

### Explain cosine similarity, dot product, and Euclidean distance for vector search.

**TL;DR:** Cosine measures angle, dot product measures magnitude-weighted alignment, and Euclidean measures straight-line distance between vectors.

Cosine similarity is the dot product divided by the product of norms, so it ignores vector length and only cares about direction; it is the default for most text embeddings. Plain dot product (inner product) preserves magnitude information, which matters when the model encodes confidence or salience in the norm and is required for models like OpenAI ada when used unnormalized. Euclidean (L2) distance measures spatial separation and is monotonically related to cosine when vectors are L2-normalized, so they rank identically in that case. The right choice is dictated by how the embedding model was trained—using the wrong metric silently degrades recall. Always check the model card for the recommended metric.

### What is a vector database, and how does it differ from a traditional database?

**TL;DR:** A vector database is a storage and query system optimized for approximate nearest-neighbor search over high-dimensional embeddings, not exact key or row lookups.

Traditional relational and document databases index data with B-trees, hash maps, or inverted indexes for exact matches and range queries. Vector databases (Pinecone, Weaviate, Qdrant, Milvus, pgvector) build ANN indexes such as HNSW, IVF, or ScaNN that trade exact recall for sublinear search time over millions or billions of vectors. They typically support metadata filtering, hybrid sparse-dense search, multi-tenancy, and per-vector payloads. They are not replacements for OLTP systems but companions to them, holding the embedded representation of unstructured content. Many traditional databases now offer vector extensions (pgvector, Elasticsearch kNN), blurring the line.

### How do you choose the right embedding model for your use case?

**TL;DR:** Match the model to your domain, language, latency budget, dimensionality cost, and benchmark it on your own labeled retrieval set.

Start by filtering MTEB or BEIR leaderboards for tasks similar to yours (retrieval, clustering, reranking) and the languages you need. Consider dimensionality, since higher dims raise storage and query cost linearly while accuracy gains taper off. Evaluate whether the model is open-weights (control, cost) or API-only (quality, no GPU ops), and check context window length against your chunk sizes. Then run your own evaluation: build a small set of query-document pairs from your data and measure recall@k and nDCG. The leaderboard winner is rarely the best for a niche domain, so empirical testing on representative data is mandatory.

### What is embedding dimensionality, and how does it affect performance and cost?

**TL;DR:** Dimensionality is the vector length, and higher dimensions improve representational power but increase memory, index size, and search latency linearly.

A 1536-dim float32 vector takes 6 KB; a billion of them take 6 TB before any index overhead. Higher dims improve discrimination in dense embedding spaces up to a point, after which gains plateau due to the curse of dimensionality. Index structures like HNSW and IVF scale roughly linearly with dim during distance computations, so doubling dims roughly doubles query latency. Modern Matryoshka-trained models (e.g., text-embedding-3) let you truncate to a smaller prefix with graceful quality loss, giving a tunable cost lever. Pick the smallest dim that meets your recall target on your eval set.

### How do you handle embedding drift when the embedding model is updated?

**TL;DR:** Re-embed all corpus vectors with the new model in a shadow index, then atomically switch query traffic; never mix vector spaces.

Vectors from different models live in incompatible coordinate systems, so similarity scores across versions are meaningless. Plan for a full backfill: compute new embeddings for the entire corpus into a parallel index, validate quality with offline eval and shadow traffic, then cut over. For very large corpora, use rolling reindexing with version metadata on each vector to route queries to the matching index until backfill completes. Maintain the old index until the new one is verified, since rollback is much cheaper than corruption. Track model version explicitly in vector metadata to prevent silent mixing.

### What are multi-modal embeddings, and how are they generated?

**TL;DR:** Multi-modal embeddings encode different modalities (text, image, audio, video) into a shared vector space so cross-modal similarity is meaningful.

Models like CLIP, SigLIP, and ImageBind train two or more encoders jointly with contrastive loss on paired data (e.g., image-caption pairs), pulling matched pairs together and pushing mismatched pairs apart. The result is a unified space where a text query embedding can directly retrieve image vectors via standard ANN search. Newer models extend this to audio, video, depth, and IMU data using one modality (often text or image) as an anchor. Production use cases include image search by caption, video retrieval, and grounding LLMs in visual context. The same vector database infrastructure is reused; only the embedding step changes per modality. Reference: [Learning Transferable Visual Models From Natural Language Supervision / CLIP (Radford et al., 2021)](https://arxiv.org/abs/2103.00020).

### How do you index and query multi-tenant data in a vector database?

**TL;DR:** Use tenant ID as a metadata filter or as a separate namespace/collection per tenant, depending on isolation and scale requirements.

For low to moderate tenant counts, store all vectors in one index with a tenant_id metadata field and apply a pre-filter at query time; managed services like Pinecone namespaces and Qdrant payload filtering handle this efficiently. For strong isolation, large tenants, or per-tenant lifecycle (deletion, GDPR), provision a dedicated collection or index per tenant, which simplifies access control and bulk operations. Hybrid approaches use namespaces for large tenants and shared indexes for the long tail. Watch out for filtered ANN performance: aggressive filters can force fallback to brute-force search, so verify your engine supports filterable HNSW or pre-filter integration. Always test query latency under realistic filter selectivity.

### What is quantization of embeddings, and how does it reduce storage costs?

**TL;DR:** Quantization compresses float32 vectors into lower-precision representations (int8, binary, product codes), shrinking storage and speeding distance computation with small accuracy loss.

Scalar quantization (SQ) maps each float32 component to int8, cutting storage 4x with typically less than 1% recall loss. Product quantization (PQ) splits the vector into subvectors, k-means clusters each, and stores only the centroid IDs, achieving 32x or more compression at higher accuracy cost. Binary quantization reduces each dimension to one bit, enabling Hamming-distance search that is extremely fast on modern CPUs and works well for high-dim normalized vectors. Most engines offer rerank-with-original-vectors as a final stage to recover accuracy. Choose the technique based on your recall budget and memory constraints.

### How do you benchmark and evaluate embedding model quality?

**TL;DR:** Evaluate on standardized benchmarks like MTEB or BEIR for breadth, then on a labeled retrieval set from your own domain for ground truth.

Public benchmarks measure retrieval (nDCG@10, recall@k), clustering (V-measure), reranking, classification, and STS across many tasks; they give a comparative baseline but rarely match your domain distribution. Build a domain eval by collecting real queries and labeling top-k passages as relevant or not, or by mining query-document pairs from logs. Compute recall@k, MRR, and nDCG against this set for every candidate model and quantization setting. Track latency and cost alongside quality so the decision is multi-objective. Re-run the eval whenever you change chunking, the model, or any preprocessing step.

### What is the role of metadata in vector databases?

**TL;DR:** Metadata is structured per-vector data used for filtering, faceting, access control, and routing alongside semantic similarity search.

Each vector is typically stored with a payload of fields like document_id, source, timestamp, tenant_id, language, and tags. At query time, filters such as "tenant_id = X AND timestamp > 2024" narrow the search space before or during ANN traversal. Metadata also drives result presentation, deduplication, citation, and lifecycle operations like deleting all vectors from a removed source. Filterable HNSW or pre-filter strategies determine whether tight filters degrade performance, so design metadata schemas with selectivity in mind. Treat metadata as a first-class part of the schema, not an afterthought.

### How do you handle large-scale vector search with billions of vectors?

**TL;DR:** Combine sharding, ANN indexes (IVF, HNSW), aggressive quantization, and a coarse-to-fine retrieval pipeline to keep memory and latency manageable.

At billion-scale, holding raw float32 vectors in RAM is infeasible, so apply product quantization or binary quantization and offload payloads to disk. Use IVF or DiskANN-style indexes that partition the space into cells and search only relevant cells per query. Shard horizontally by hash or by tenant, and run queries in parallel across shards with a top-k merge. Add a reranking stage with the original vectors or a cross-encoder on the top few hundred candidates to recover accuracy lost to compression. Budget for offline index build time, which can take hours, and design rolling rebuilds for updates. Reference: [Efficient and Robust Approximate Nearest Neighbor Search using HNSW (Malkov & Yashunin, 2016)](https://arxiv.org/abs/1603.09320).

### What is hybrid search (combining keyword search with vector search)?

**TL;DR:** Hybrid search runs sparse keyword (BM25) and dense vector queries in parallel and fuses the results to capture both lexical and semantic matches.

Pure dense search misses exact terms (product codes, names, rare jargon); pure sparse search misses paraphrases and synonyms. Hybrid systems issue both queries, then combine via reciprocal rank fusion (RRF), weighted score sum, or a learned reranker. Engines like Weaviate, Qdrant, Elasticsearch, and OpenSearch support this natively. Tune the fusion weight per workload, since query distributions vary. Hybrid usually beats either method alone on real-world retrieval benchmarks, especially for technical documentation, e-commerce, and enterprise search.

### How do you fine-tune an embedding model for a specific domain?

**TL;DR:** Collect query-document pairs from your domain, mine hard negatives, and train with contrastive loss (InfoNCE, MultipleNegativesRanking) using sentence-transformers or similar.

Start from a strong base model (E5, BGE, GTE) and assemble training pairs—real query logs with click data, synthetic pairs generated by an LLM, or curated examples. Hard negatives matter most: mine them by retrieving top-k from the base model and labeling near-misses, since random negatives are too easy. Train with a contrastive objective for a small number of epochs with a low learning rate to avoid catastrophic forgetting. Evaluate on a held-out domain set and ensure general retrieval quality has not regressed. Typical gains are 5-20% nDCG on the domain at the cost of degraded out-of-domain performance.

### Your vector database for RAG is consuming too much memory. How do you reduce it?

**TL;DR:** Quantize vectors, reduce dimensionality, offload to disk-based ANN, and prune redundant or stale vectors from the index.

Memory pressure in vector stores comes from three sources: vector floats, the ANN graph, and metadata. First apply scalar (int8) or product quantization to cut vector storage 4-32x with minimal recall loss. If the model supports Matryoshka representations, truncate to a smaller dim. Switch to a disk-based index like DiskANN or set HNSW parameters (lower M, ef_construction) to shrink the graph. Audit chunking strategy—too-small chunks inflate vector counts—and deduplicate near-identical embeddings. Finally, apply TTLs or relevance-based pruning to evict stale content.

### Your vector database cannot scale to millions of embeddings. How do you fix the bottleneck?

**TL;DR:** Move from brute-force or flat index to ANN (HNSW or IVF), shard horizontally, quantize vectors, and consider a managed vector database.

The first failure at scale is usually using a flat index that does O(N) scans per query; switch to HNSW, IVF-PQ, or ScaNN for sublinear search. If a single node is saturated, shard by hash, tenant, or content type and fan out queries with a top-k merge layer. Apply quantization to fit more vectors per node and reduce distance compute time. Tune ANN parameters (efSearch, nprobe) to trade recall for latency at a measured operating point. If self-hosting becomes operationally heavy, migrate to Pinecone, Qdrant Cloud, or Vespa which handle sharding, replication, and rebuilds.

### Your new embedding model has different dimensions from the existing vectors in production. How do you handle the mismatch?

**TL;DR:** Vectors of different dims are not comparable—create a parallel index with the new model, backfill the corpus, then atomically switch traffic.

You cannot project across dim sizes meaningfully, and even same-dim models from different families occupy different spaces. Provision a second collection with the new dim and embedding model, embed the entire corpus in batch, and validate quality with offline eval and shadow queries. Maintain both indexes during the transition and route queries by model version stored in request context. Cut over once recall metrics on your domain eval match or exceed the old system. Keep the old index for rollback until the new one is proven stable in production.

### Your vector search returns irrelevant results despite high similarity scores. How do you fix it?

**TL;DR:** High similarity with low relevance usually means embedding model mismatch, bad chunking, missing filters, or no reranking—fix the weakest link first.

Diagnose by inspecting failing queries: are the retrieved chunks topically related but answering a different question? That suggests the embedding model is too generic for the domain—try fine-tuning or a stronger model. Are chunks truncated mid-thought? Adjust chunk size and overlap. Are obviously off-topic results creeping in? Add metadata pre-filters (date, source, language). Add a cross-encoder reranker on the top 50-100 candidates to apply richer query-document interaction beyond dot product. Also consider hybrid search to catch exact-term matches that dense embeddings miss.

### You deployed a new embedding model, and search quality crashed overnight. How do you handle embedding drift?

**TL;DR:** Roll back to the old model immediately, then plan a controlled reindex with offline eval and shadow traffic before re-deploying.

The crash almost certainly means query vectors from the new model were searched against an index of old-model vectors, which live in an incompatible space. Restore the previous embedding service or route queries to the old model first to stop the bleeding. Then build a new index from scratch with the new model, validate with a labeled retrieval eval, and run shadow queries comparing old and new ranking on real traffic. Only cut over when offline metrics meet or beat the baseline. Going forward, attach model version to every vector and to every query, and refuse to serve mismatched pairs.

### Your semantic search fails for short queries. How do you improve it?

**TL;DR:** Short queries lack context for dense embeddings—add hybrid sparse search, query expansion, HyDE, or a query-rewriting LLM step.

Two- or three-word queries produce embeddings dominated by a few token vectors and often miss the user's intent. Add BM25 in a hybrid setup so exact keyword matches surface even when semantic signal is weak. Use query expansion (synonyms, related terms) or HyDE, where an LLM generates a hypothetical answer document and you embed that instead. A query-rewriting step with an LLM can disambiguate or enrich short inputs into full sentences before embedding. Also evaluate embedding models specifically trained for asymmetric search (query-passage), like E5 or BGE, which handle short queries better than symmetric STS models.
