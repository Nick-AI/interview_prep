---
title: "Home"
nav_order: 1
---

# AI Engineering Interview Questions and Answers

> Cheat sheet for AI Engineering interviews. Useful for AI Engineer, Gen AI Engineer, LLM Engineer, Agentic AI Engineer, AI Solutions Architect, AI Platform Engineer, Applied AI Engineer, MLOps Engineer, and LLMOps Engineer roles.

This repo is organized into per-topic folders, first-pass high-level answers (TL;DR + short paragraph) for every question, includes per-topic cheat sheets, has coverage of frontier-2025 topics (reasoning models, prompt caching, coding agents, DPO/KTO, voice AI, agent frameworks, modern inference engines), and adds master synthesis docs.

## Quick links

- **[Master Cheat Sheet](./MASTER-CHEATSHEET.md)** — 5-minute synthesis across all 14 topics. The night-before-interview cram doc.
- **[Study Plan](./STUDY-PLAN.md)** — 1-hour, 1-day, 1-week, and 1-month preparation paths, plus per-role emphasis.
- **[Glossary](./GLOSSARY.md)** — alphabetical index of ~180 terms with links into the topics.
- **[Verification Notes](./docs/verification-notes.md)** — spot-checks on numeric/factual claims, with caveats and known approximations.

---

## Must Know

The non-negotiable foundations:

- **LLM** — Large Language Model
- **RAG** — Retrieval-Augmented Generation
- **MCP** — Model Context Protocol
- **Agent** — LLM that plans and uses tools
- **Fine-tuning** — adapting a pre-trained model
- **Quantization** — lower-precision weights for faster/cheaper inference

Crash-course video covering all six: [AI Engineering Explained: LLM, RAG, MCP, Agent, Fine-Tuning, Quantization](https://www.youtube.com/watch?v=lnfWvX66FUk).

---

## Topics

| # | Topic | Q&A | Cheat sheet | Questions |
|---|---|---|---|---|
| # | Topic | Overview | Q&A | Cheat sheet | Q's |
|---|---|---|---|---|---|
| 1 | LLM Fundamentals | [README](./topics/llm-fundamentals/README.md) | [questions](./topics/llm-fundamentals/questions.md) | [cheat sheet](./topics/llm-fundamentals/cheatsheet.md) | 56 |
| 2 | Prompt Engineering | [README](./topics/prompt-engineering/README.md) | [questions](./topics/prompt-engineering/questions.md) | [cheat sheet](./topics/prompt-engineering/cheatsheet.md) | 34 |
| 3 | Retrieval-Augmented Generation (RAG) | [README](./topics/rag/README.md) | [questions](./topics/rag/questions.md) | [cheat sheet](./topics/rag/cheatsheet.md) | 42 |
| 4 | AI Agents and Agentic Systems | [README](./topics/agents/README.md) | [questions](./topics/agents/questions.md) | [cheat sheet](./topics/agents/cheatsheet.md) | 46 |
| 5 | Fine-Tuning and Model Adaptation | [README](./topics/fine-tuning/README.md) | [questions](./topics/fine-tuning/questions.md) | [cheat sheet](./topics/fine-tuning/cheatsheet.md) | 33 |
| 6 | Vector Databases and Embeddings | [README](./topics/vector-databases-embeddings/README.md) | [questions](./topics/vector-databases-embeddings/questions.md) | [cheat sheet](./topics/vector-databases-embeddings/cheatsheet.md) | 22 |
| 7 | AI System Design | [README](./topics/system-design/README.md) | [questions](./topics/system-design/questions.md) | [cheat sheet](./topics/system-design/cheatsheet.md) | 38 |
| 8 | LLMOps and Production AI | [README](./topics/llmops/README.md) | [questions](./topics/llmops/questions.md) | [cheat sheet](./topics/llmops/cheatsheet.md) | 42 |
| 9 | Evaluation and Testing | [README](./topics/evaluation-testing/README.md) | [questions](./topics/evaluation-testing/questions.md) | [cheat sheet](./topics/evaluation-testing/cheatsheet.md) | 31 |
| 10 | AI Safety, Ethics, and Responsible AI | [README](./topics/safety-ethics/README.md) | [questions](./topics/safety-ethics/questions.md) | [cheat sheet](./topics/safety-ethics/cheatsheet.md) | 47 |
| 11 | Multi-Modal AI | [README](./topics/multi-modal/README.md) | [questions](./topics/multi-modal/questions.md) | [cheat sheet](./topics/multi-modal/cheatsheet.md) | 32 |
| 12 | AI Infrastructure and Scalability | [README](./topics/infrastructure-scalability/README.md) | [questions](./topics/infrastructure-scalability/questions.md) | [cheat sheet](./topics/infrastructure-scalability/cheatsheet.md) | 27 |
| 13 | Coding and Practical Implementation | [README](./topics/coding-practical/README.md) | [questions](./topics/coding-practical/questions.md) | [cheat sheet](./topics/coding-practical/cheatsheet.md) | 22 |
| 14 | Behavioral and Scenario-Based Questions | [README](./topics/behavioral/README.md) | [questions](./topics/behavioral/questions.md) | [cheat sheet](./topics/behavioral/cheatsheet.md) | 22 |
| 🎯 | Interview 2026-07-22 — LLM/GenAI (mixed: RAG, RAG fusion, KGs, fine-tuning, metrics) | [README](./07222026/README.md) | [questions](./07222026/questions.md) | [cheat sheet](./07222026/cheatsheet.md) | 73 |

**Total: 494 questions across 14 topics**, plus a dated interview-prep set (2026-07-22, 73 Q), a master cheat sheet, study plan, and glossary at the repo root. Each `Frontier (2025)` section in the topic Q&As covers 2025-era frontier topics (reasoning models, prompt caching, DPO family, coding agents, voice AI, modern inference engines).

Each `questions.md` follows the same shape: question heading → one-sentence TL;DR → short paragraph elaboration. Each `cheatsheet.md` is a ≤2-minute read condensing the most-tested concepts, decision rules, and common pitfalls for that topic.

---

## How to use this repo

- **Tight on time?** Open the [Master Cheat Sheet](./MASTER-CHEATSHEET.md) (5 min) or follow the [Study Plan](./STUDY-PLAN.md) for a path matched to your timeline (1 hour, 1 day, 1 week, 1 month).
- **Studying a topic?** Each topic folder has a `README.md` (scope), a `cheatsheet.md` (terms + decision rules + numerics), and a `questions.md` (full TL;DR + paragraph answers). Cheat sheet first usually sets the right mental model.
- **Mock interviews**: search for the question by exact wording — original phrasings are preserved.
- **Looking up a term?** [GLOSSARY.md](./GLOSSARY.md) indexes ~180 terms with cross-links to topics.
- **Verifying numbers?** [verification-notes.md](./docs/verification-notes.md) documents which numeric claims have been spot-checked and known approximations.

---

## License

```
   Copyright (C) 2026 Yannik Glaser

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
```
