---
title: "Cheatsheet"
parent: "Evaluation and Testing"
nav_order: 1
---

# Evaluation and Testing — Cheat Sheet

[← Back to index](../../README.md) · [Full Q&A](./questions.md)

## Core concepts
- **BLEU**: n-gram precision vs reference + brevity penalty; standard for MT.
- **ROUGE**: n-gram/LCS recall vs reference summaries; standard for summarization.
- **BERTScore**: contextual-embedding cosine similarity; tolerates paraphrase.
- **G-Eval**: LLM-judge with chain-of-thought rubric and probability-weighted scores.
- **LLM-as-judge**: prompt strong model with rubric for scoring or pairwise preference; scalable but biased.
- **Faithfulness**: claim-level entailment from source/retrieved context (NLI or LLM judge).
- **RAGAS / TruLens / ARES**: RAG eval frameworks scoring retrieval + generation.
- **Golden datasets**: versioned, curated ground-truth examples anchoring evals and regressions.
- **MMLU / HumanEval / GSM8K**: knowledge / code / math benchmarks; watch for contamination.
- **AgentBench / WebArena / SWE-bench**: agent task benchmarks with verifiable outcomes.
- **Red teaming**: structured adversarial probing for safety, security, bias, privacy.
- **Adversarial testing**: typo/paraphrase/jailbreak/injection perturbations; tools like TextAttack, Garak, PromptBench.
- **A/B testing**: online comparison on live traffic with random assignment and pre-registered metrics.
- **Hallucination metrics**: faithfulness rate, FActScore, SAFE, citation precision/recall, contradiction rate.
- **Fairness metrics**: demographic parity, equalized odds, calibration; mutually incompatible in general.
- **Inspect AI / Promptfoo**: code- and config-driven eval pipelines with datasets, solvers/providers, scorers/assertions, log viewer, and CI integration.
- **Pairwise vs Likert judging**: pairwise gives relative rankings (Elo, Bradley-Terry) with high agreement; Likert gives absolute per-rubric scores but drifts and compresses.
- **Agent-trajectory eval**: score tool selection, argument validity, step efficiency, error recovery, and intermediate safety, not only final-answer correctness.

## Decision rules
- **Reference exists, lexical task** → BLEU/ROUGE/exact match.
- **Reference exists, paraphrase OK** → BERTScore or LLM-judge.
- **No reference, open-ended** → LLM-as-judge with rubric, validate vs human sample.
- **Pre-deploy go/no-go** → offline eval on golden + regression set.
- **Validate real impact** → online A/B on user outcomes, not just offline scores.
- **Critical safety/legal decisions** → human eval with multiple annotators and adjudication.
- **Comparing two prompts/models** → paired test (McNemar or paired bootstrap) with CIs, not p-values alone.
- **RAG debugging** → score retrieval and generation independently before end-to-end.
- **Pairwise vs Likert** → pairwise for model/prompt selection and preference data; Likert for absolute thresholds, longitudinal tracking, and per-axis diagnostics.

## Key formulas / parameters
- **BLEU**: geometric mean of n-gram precisions (n=1..4, equal weights) × brevity penalty `BP = min(1, exp(1 - r/c))`.
- **Cohen's kappa**: `(p_o - p_e) / (1 - p_e)`; >0.6 substantial, >0.8 strong agreement.
- **Statistical significance**: paired bootstrap with ≥1000 resamples; report 95% CI; α=0.05 with Bonferroni for k slices.
- **Sample size**: for detecting 5% absolute lift at 80% power, ~600 paired samples per arm (binary outcome, base rate ~50%).

## Common pitfalls
- Reporting averages without slicing by intent, segment, or difficulty hides regressions.
- LLM-judge positional and verbosity bias inflates scores; randomize order, penalize length.
- Benchmark contamination: public test sets leak into training data; trust private evals more.
- Treating offline wins as online wins; user behavior and distribution shift change everything.
- No version control on golden datasets → score deltas not attributable to model changes.
- Single fairness metric reported as "fair"; metrics conflict, document tradeoffs.
- Forgetting nondeterminism: sampling temperature > 0 means run multiple times and report variance.
- Regression suite never grows; add every production failure as a test case.
