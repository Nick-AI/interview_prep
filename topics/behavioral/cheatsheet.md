---
title: "Cheatsheet"
parent: "Behavioral and Scenario-Based Questions"
nav_order: 1
---

# Behavioral and Scenario-Based Questions — Cheat Sheet

[← Back to index](../../README.md) · [Full Q&A](./questions.md)

## Core concepts
- **STAR**: Situation, Task, Action, Result — standard framing for experience questions
- **AI vs ML engineering**: AI eng composes foundation models; ML eng trains custom models
- **Eval-first**: every prompt or model change gated by a regression-tested eval set
- **Hallucination mitigations**: retrieval grounding, citations, schema-constrained outputs, verifier passes
- **RAG debug ladder**: inspect failures → measure retrieval (recall@k, MRR) → fix retrieval before generation
- **Cost levers**: prompt caching, response caching, smaller models, shorter context, batching, distillation
- **Latency strategy**: stream early tokens, route by difficulty, use small model with optional escalation
- **Drift detection**: golden evals, output distribution metrics, user feedback signals
- **Hybrid deployment**: API for long-tail/complex, self-hosted small models for high-volume hot paths
- **Limited data playbook**: zero/few-shot LLM → synthetic data → weak supervision → active learning
- **Risk communication**: quantify blast radius, propose mitigations, force explicit shared decision
- **Shadow mode / canary**: validate new model or prompt on real traffic before full rollout
- **Reversibility**: pinned versions, prompt registry, fast rollback, simplest system that meets bar

## Decision rules
- **AI vs traditional code**: rules enumerable → code; unstructured input or fuzzy generalization → AI
- **API vs self-host**: API for v1 and frontier quality; self-host at scale, for privacy, latency, or fine-tuning
- **RAG vs fine-tuning**: RAG for fresh/changing knowledge; fine-tuning for style, format, or narrow tasks
- **Accuracy vs latency**: bound by user-experience SLO; quantify both with evals before choosing
- **Complex vs simple system**: ship simplest that meets bar; benchmark gains rarely survive production
- **Build vs buy**: buy unless the capability is core differentiation and you have the team to maintain it

## Common pitfalls
- Promising 100 percent accuracy or hiding failure modes from stakeholders
- Telling a personal story without metrics, tradeoffs, or a counterfactual
- Generic answers to "why this role" — interviewers screen hard for real research
- Defending a benchmark gain without validating on production data
- Optimizing cost or latency without re-running the eval suite
- Blaming the model for issues caused by retrieval, prompt, or product scoping
- Treating evals as a one-time setup rather than continuous infrastructure
- Overengineering with agents when a deterministic pipeline or simple RAG suffices
