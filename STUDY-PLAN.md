---
title: "Study Plan"
nav_order: 3
---

# Study Plan

Pick a path based on time available. Each path is sequenced; later items assume earlier ones.

[← Back to index](./README.md) · [Master Cheat Sheet](./MASTER-CHEATSHEET.md) · [Glossary](./GLOSSARY.md)

---

## 1-hour cram (night before, you've worked with LLMs already)

**Goal:** refresh terminology and decision rules. No depth.

| Order | Item | Time |
|---|---|---|
| 1 | [Master Cheat Sheet](./MASTER-CHEATSHEET.md) | 10 min |
| 2 | [LLM Fundamentals cheat sheet](./topics/llm-fundamentals/cheatsheet.md) | 8 min |
| 3 | [RAG cheat sheet](./topics/rag/cheatsheet.md) | 8 min |
| 4 | [Agents cheat sheet](./topics/agents/cheatsheet.md) | 8 min |
| 5 | [LLMOps cheat sheet](./topics/llmops/cheatsheet.md) | 6 min |
| 6 | [Safety & Ethics cheat sheet](./topics/safety-ethics/cheatsheet.md) | 6 min |
| 7 | Skim [Glossary](./GLOSSARY.md) for unfamiliar terms | 10 min |
| 8 | Re-read TL;DRs of any flagged terms in topic Q&As | 4 min |

**Self-check:** can you state, in one sentence each: KV cache, RAG vs fine-tune, ReAct, prompt injection defenses, prompt caching, LoRA, hybrid search, eval harness?

---

## 1-day prep (8 hours, role-specific deep refresh)

**Goal:** all 14 cheat sheets + the 5 highest-leverage Q&A files. Suitable for a senior+ AI engineer interview tomorrow.

**Morning (4h):**

| Order | Item | Time |
|---|---|---|
| 1 | [Master Cheat Sheet](./MASTER-CHEATSHEET.md) | 15 min |
| 2 | All 14 cheat sheets (see [README](./README.md)), ~10 min each | 2h 20m |
| 3 | [LLM Fundamentals Q&A](./topics/llm-fundamentals/questions.md) | 1h |
| 4 | [RAG Q&A](./topics/rag/questions.md) | 25 min |

**Afternoon (4h):**

| Order | Item | Time |
|---|---|---|
| 5 | [Agents Q&A](./topics/agents/questions.md) | 45 min |
| 6 | [LLMOps Q&A](./topics/llmops/questions.md) | 45 min |
| 7 | [Safety & Ethics Q&A](./topics/safety-ethics/questions.md) | 45 min |
| 8 | [Behavioral Q&A](./topics/behavioral/questions.md) | 30 min |
| 9 | Practice answering 10 random questions out loud | 1h 15m |

**Self-check:** explain Transformer attention end-to-end; design a RAG system on a whiteboard; design a coding agent with tools + sandbox; name 3 prompt-injection mitigations; name 3 LLM eval metrics and when to use each.

---

## 1-week deep (5 days × 2h, ~10h total)

**Goal:** read every Q&A. Suitable for changing roles into AI engineering or first AI-eng interview.

**Day 1 — Foundations (2h):**
- [LLM Fundamentals](./topics/llm-fundamentals/questions.md) + [cheat sheet](./topics/llm-fundamentals/cheatsheet.md) — 1h 15m
- [Prompt Engineering](./topics/prompt-engineering/questions.md) + [cheat sheet](./topics/prompt-engineering/cheatsheet.md) — 45 min

**Day 2 — Retrieval (2h):**
- [Vector DBs & Embeddings](./topics/vector-databases-embeddings/questions.md) + [cheat sheet](./topics/vector-databases-embeddings/cheatsheet.md) — 45 min
- [RAG](./topics/rag/questions.md) + [cheat sheet](./topics/rag/cheatsheet.md) — 1h 15m

**Day 3 — Adaptation & Agents (2h):**
- [Fine-Tuning](./topics/fine-tuning/questions.md) + [cheat sheet](./topics/fine-tuning/cheatsheet.md) — 50 min
- [Agents](./topics/agents/questions.md) + [cheat sheet](./topics/agents/cheatsheet.md) — 1h 10m

**Day 4 — Production (2h):**
- [LLMOps](./topics/llmops/questions.md) + [cheat sheet](./topics/llmops/cheatsheet.md) — 50 min
- [Infrastructure & Scalability](./topics/infrastructure-scalability/questions.md) + [cheat sheet](./topics/infrastructure-scalability/cheatsheet.md) — 35 min
- [System Design Q&A](./topics/system-design/questions.md) — pick 5 designs, write your own answer first, then read — 35 min

**Day 5 — Quality & Frontier (2h):**
- [Evaluation & Testing](./topics/evaluation-testing/questions.md) — 30 min
- [Safety & Ethics](./topics/safety-ethics/questions.md) — 30 min
- [Multi-Modal](./topics/multi-modal/questions.md) — 25 min
- [Behavioral](./topics/behavioral/questions.md) — 15 min
- [Coding & Practical](./topics/coding-practical/questions.md) — implement 3 of the 22 tasks for real — 20 min skim

**Self-check:** complete a 45-minute mock interview using questions sampled from across topics; grade yourself against the TL;DRs.

---

## 1-month mastery (~30h, theory + practice)

**Goal:** depth + hands-on. Suitable for new AI-eng grads or career switchers.

**Week 1 — Theory (15h):**
- Execute the entire 1-week-deep plan above — 10h
- Read the canonical papers cited in `Reference:` links across the Q&As: *Attention Is All You Need*, *RAG (Lewis 2020)*, *LoRA*, *QLoRA*, *ReAct*, *DPO*, *Constitutional AI*, *Chinchilla* — 5h

**Week 2 — Coding (12h):**
- Implement every task in [Coding & Practical](./topics/coding-practical/questions.md) — 8h
- Build a working RAG system with hybrid search (BM25 + dense), a cross-encoder re-ranker, and an eval harness — 4h

**Week 3 — Systems (8h):**
- Implement an agent with tool use, a sandbox, reflection, and trace logging — 4h
- Add observability (traces + cost), prompt caching, and a fallback chain to one of the above builds — 4h

**Week 4 — Drill (6h):**
- Mock interviews on all 14 topics with a partner or LLM-as-interviewer — 5h
- Re-read the [Master Cheat Sheet](./MASTER-CHEATSHEET.md) — 30 min
- Review verification-notes (any `verification-notes.md` in topic folders) for caveats and updates — 30 min

**Self-check:** publish or share one of your week-2/3 builds (GitHub README + demo); explain its design tradeoffs to a non-technical stakeholder in 5 minutes.

---

## Per-role recommended emphasis

| Role | Top 5 topics |
|---|---|
| AI Engineer / Applied AI | [LLM Fundamentals](./topics/llm-fundamentals/), [RAG](./topics/rag/), [Agents](./topics/agents/), [LLMOps](./topics/llmops/), [System Design](./topics/system-design/) |
| LLM / Foundation Model Engineer | [LLM Fundamentals](./topics/llm-fundamentals/), [Fine-Tuning](./topics/fine-tuning/), [Infrastructure](./topics/infrastructure-scalability/), [Evaluation](./topics/evaluation-testing/), [Safety](./topics/safety-ethics/) |
| Agentic AI / AI Agent Engineer | [Agents](./topics/agents/), [Prompt Engineering](./topics/prompt-engineering/), [RAG](./topics/rag/), [LLMOps](./topics/llmops/), [Coding & Practical](./topics/coding-practical/) |
| AI Platform / LLMOps | [LLMOps](./topics/llmops/), [Infrastructure](./topics/infrastructure-scalability/), [System Design](./topics/system-design/), [Evaluation](./topics/evaluation-testing/), [Safety](./topics/safety-ethics/) |
| MLOps moving to LLMOps | [LLMOps](./topics/llmops/), [Infrastructure](./topics/infrastructure-scalability/), [RAG](./topics/rag/), [LLM Fundamentals](./topics/llm-fundamentals/), [Evaluation](./topics/evaluation-testing/) |
| Researcher → Eng | [LLM Fundamentals](./topics/llm-fundamentals/), [Fine-Tuning](./topics/fine-tuning/), [Evaluation](./topics/evaluation-testing/), [Coding & Practical](./topics/coding-practical/), [System Design](./topics/system-design/) |

---

## How to do mock interviews

Pick a question at random from a topic Q&A, then close the file. Answer out loud (record it) or write into a blank doc. Don't peek. When done, open the file and compare your answer against the TL;DR plus the expanded paragraph — note what you missed, what you got wrong, and what you hedged on. Missed items go on a re-review list for the next session.

Time yourself. Two minutes per question is realistic for senior-level depth; if you're spending 5+ minutes you probably don't actually know it and are reasoning from first principles, which is fine in real life but a red flag in interviews. For system-design prompts, target 20–30 minutes with a whiteboard or scratchpad — practice the structure (requirements → high-level → component deep-dive → tradeoffs → scale) more than the content.

Behavioral interviews need separate prep. Use STAR (Situation, Task, Action, Result). Rehearse 3–5 stories that each map to multiple common prompts (conflict, ambiguity, failure, leadership, ethical call). For technical mocks, pair with a friend or use an LLM as interviewer with the prompt: "You are a senior interviewer at <company>. Ask me one question at a time, push back on weak answers, and ask follow-ups." Let them dig until you're uncomfortable — that's where the learning is.
