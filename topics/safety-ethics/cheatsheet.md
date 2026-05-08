# AI Safety, Ethics, and Responsible AI — Cheat Sheet

[← Back to index](../../README.md) · [Full Q&A](./questions.md)

## Core concepts
- **Hallucination**: confident, plausible, factually wrong output. Mitigate with RAG, citations, low temperature, verifier models, abstention.
- **Prompt injection**: direct (user types adversarial instructions) vs indirect (poisoned content via tools/RAG/email). Defend with input/output filters, instruction hierarchy, untrusted-data tagging.
- **Jailbreak**: prompts bypassing safety training (DAN, role-play, encoding tricks). Defend with classifiers (Llama Guard), refusal training, system-prompt hardening.
- **Alignment**: model pursues intended human goals. Tools: RLHF, RLAIF, Constitutional AI, instruction tuning, red-teaming.
- **Guardrails**: input (PII, jailbreak, topic) before model; output (toxicity, PII, schema, citation) after. Fail closed for high-risk.
- **PII handling**: detect (Presidio, NER, regex), redact or tokenize, never log raw, disable provider training.
- **GDPR / CCPA**: lawful basis, minimization, purpose limitation, subject rights (access/erasure/portability), DPIA, automated-decision rights (Art. 22).
- **EU AI Act tiers**: unacceptable (banned), high-risk (Annex III: employment, credit, biometrics, critical infra), limited-risk (transparency), minimal. GPAI models have transparency + systemic-risk obligations.
- **NIST AI RMF**: Govern, Map, Measure, Manage. Companion GenAI profile.
- **ISO/IEC 42001**: AI management system standard.
- **Model cards**: intended use, training data, disaggregated metrics, known biases, ethical considerations.
- **Differential privacy**: bound per-record influence with ε (smaller = more private), δ failure prob; DP-SGD = clip + noise + accountant.
- **Federated learning**: train on decentralized data; defend with robust aggregation (Krum, median), secure aggregation, DP.
- **Data poisoning / backdoors**: malicious training samples; detect with Neural Cleanse, STRIP, ABS, activation clustering.
- **Watermarking / provenance**: SynthID, Stable Signature for generation; C2PA content credentials for metadata signing.
- **Fairness vs bias**: bias = systematic skew; fairness = formal criterion (demographic parity, equalized odds, calibration, equal opportunity). Criteria are mutually incompatible — pick per context.
- **Interpretability vs explainability**: interpretability = transparent internals; explainability = post-hoc human-readable reasons (SHAP, LIME, counterfactuals).
- **Constitutional AI (CAI / RLAIF)**: model critiques and revises its own outputs against a written constitution; preference model trained on AI-labeled comparisons replaces most human harmlessness labels (Bai 2022).
- **Deliberative alignment**: reasoning models trained to read the safety spec and reason over it in chain-of-thought before answering; improves jailbreak robustness and reduces over-refusal (Guan 2024, o-series).
- **HarmBench / JailbreakBench**: standardized harmful-behavior prompt sets + automated judges reporting attack success rate (ASR) across attacks (GCG, PAIR, AutoDAN) and defenses; HarmBench = 510 behaviors broad taxonomy, JailbreakBench = 100 curated + leaderboard.

## Decision rules
- Input vs output guardrails: filter inputs to block obvious abuse early; always re-screen outputs (model can fail even with clean input).
- Refusal vs safe-completion: hard refusal for hard limits (CSAM, weapons-of-mass-destruction); safe completion (warn, redirect, partial answer) for ambiguous policy areas.
- DP budget: ε ≤ 1 strong, ε ≤ 10 moderate, ε > 10 weak guarantee. Report (ε, δ) and accuracy together.
- Bias mitigation order: data fixes (rebalance, relabel) → model fixes (constraints, adversarial debias) → post-hoc (threshold tuning). Avoid post-hoc only.
- High-risk under EU AI Act: assume yes if employment, credit, education, critical infra, biometrics, or law enforcement; engage notified body early.
- Human oversight depth: scale with stakes — automate low-stakes, human-in-loop for medium, human-on-the-loop with override for high, human-only for life-safety.

## Key parameters
- **Differential privacy ε**: < 1 strong; 1–10 typical; > 10 weak. Smaller = more privacy, less utility.
- **PII detection F1**: target ≥ 0.95 recall on regulated entities (SSN, CC, name+address).
- **Bias gap thresholds**: < 5% disparity across protected groups for many regulators.
- **Watermark detection**: target > 99% true-positive at < 1% false-positive on AI-gen content.
- **EU AI Act risk tiers**: minimal / limited / high / unacceptable — high-risk requires conformity assessment.
- **Audit log retention**: 6 months–7 years depending on jurisdiction (GDPR, HIPAA, SOX).
- **Red-team coverage target**: ≥ 80% of OWASP LLM Top 10 categories before launch.

## Common pitfalls
- PII re-identification from quasi-identifiers (ZIP+DOB+gender). Use k-anonymity/l-diversity/DP, not naive removal.
- Proxy discrimination: dropping race/gender doesn't help if name, ZIP, school encode them. Audit feature-attribute correlations.
- Marginal-only fairness checks pass but intersectional groups fail (Gender Shades). Always evaluate by intersectional slices.
- Logging gaps: discovering 6 months later you can't explain a decision. Build immutable logs from day one.
- Automation bias / over-reliance: experts rubber-stamp AI output. Show uncertainty, randomize blinded reviews, audit overrides.
- Feedback loops: model output influences future training data (predictive policing). Inject random holdouts, exploration, counterfactuals.
- Prompt-injection blindness on indirect channels (RAG documents, tool outputs, emails). Treat all retrieved content as untrusted.
- Memorization / verbatim copyright regurgitation from duplicated training data. Dedupe corpus, add output similarity filters.
- Treating low HarmBench/JailbreakBench ASR as proof of safety. Benchmarks have fixed taxonomies, judge false negatives, and leak to attackers — pair with internal red-teaming, capability evals (WMDP), over-refusal checks (XSTest, OR-Bench), and post-deployment monitoring.
