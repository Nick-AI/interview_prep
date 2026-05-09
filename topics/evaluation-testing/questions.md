---
title: "Questions"
parent: "Evaluation and Testing"
nav_order: 2
flashcard: true
---

# Evaluation and Testing

[← Back to index](../../README.md) · [Cheat sheet](./cheatsheet.md)

> Measuring LLM and AI-system quality with offline metrics, LLM-as-judge, red teaming, and continuous evaluation.

### What is evaluation-driven development for AI applications?

**TL;DR:** Build and iterate AI systems by defining evals first, then changing prompts, models, or retrieval until metrics improve.

Evaluation-driven development (EDD) treats evals like unit tests for non-deterministic systems. You start by curating a representative dataset of inputs and expected behaviors, define automated and human-judged metrics, and run the suite on every prompt or model change. This produces objective evidence that a change is an improvement rather than relying on vibes from a few demos. Mature teams gate deployments on eval thresholds and track regressions per release, similar to CI for traditional software.

### How do you evaluate LLM outputs? What metrics do you use?

**TL;DR:** Combine reference-based metrics, model-based judges, task-specific checks, and human review depending on the output type.

For tasks with ground-truth references (translation, summarization), use BLEU, ROUGE, BERTScore, or exact match. For open-ended generation, use LLM-as-judge with rubrics covering correctness, helpfulness, and style. Add task-specific signals such as code execution pass rates, JSON schema validity, citation accuracy, or toxicity classifiers. Layer human review on a sampled slice to calibrate the automated stack and catch failure modes the metrics miss.

### Explain BLEU, ROUGE, and BERTScore. When would you use each?

**TL;DR:** BLEU for translation precision, ROUGE for summarization recall, BERTScore for semantic similarity beyond surface n-grams.

BLEU computes n-gram precision against references with a brevity penalty and is the canonical machine-translation metric. ROUGE measures n-gram or longest-common-subsequence overlap with reference summaries, emphasizing recall, which matters when the goal is covering key content. BERTScore embeds tokens with a contextual model and aligns them by cosine similarity, capturing paraphrases that BLEU and ROUGE penalize. Use BLEU/ROUGE when references are tight and lexical, BERTScore when paraphrasing is acceptable.

Reference: [BLEU (Papineni et al., 2002)](https://aclanthology.org/P02-1040/), [ROUGE (Lin, 2004)](https://aclanthology.org/W04-1013/), [BERTScore (Zhang et al., 2019)](https://arxiv.org/abs/1904.09675).

### What is G-Eval, and how does it use LLMs for evaluation?

**TL;DR:** G-Eval prompts an LLM with chain-of-thought rubrics and uses token probabilities to score outputs on dimensions like coherence.

G-Eval is a framework where an evaluator LLM is given a task description, evaluation criteria, and a chain-of-thought of evaluation steps, then asked to score the candidate output. It improves over naive LLM-as-judge by computing a probability-weighted score across the discrete rating tokens, reducing bias toward round numbers. The technique correlates better with human judgment than BLEU or ROUGE on summarization and dialogue. It still inherits LLM biases such as preference for verbose or self-generated text.

Reference: [G-Eval: NLG Evaluation using GPT-4 (Liu et al., 2023)](https://arxiv.org/abs/2303.16634).

### What is LLM-as-a-judge evaluation, and what are its limitations?

**TL;DR:** Use a strong LLM to score or compare outputs by rubric; cheap and scalable but biased toward length, position, and self-style.

LLM-as-judge prompts a model (often GPT-4 class) with the task, candidate output, and a rubric, asking for a numeric score or pairwise preference. It scales human-style evaluation cheaply across thousands of samples and works for open-ended tasks where references are impractical. Known limitations include positional bias (preferring the first option), verbosity bias, self-preference (favoring outputs from the same model family), and poor calibration on absolute scales. Mitigations include randomizing order, using pairwise comparison, ensembling judges, and validating against a human-labeled subset.

### How do you conduct human evaluation for AI systems?

**TL;DR:** Define rubrics, recruit qualified annotators, use double labeling with adjudication, and measure inter-annotator agreement.

Start with a precise task definition and rubric covering the dimensions you care about (correctness, helpfulness, safety) with anchored examples for each rating level. Recruit annotators with appropriate domain expertise, train them on the rubric, and pilot a small batch to refine instructions. Have multiple annotators rate each item, compute inter-annotator agreement (Cohen's kappa, Krippendorff's alpha), and adjudicate disagreements. Use stratified sampling to cover important slices and rotate annotators to detect bias.

### What is red teaming, and how do you red team an LLM application?

**TL;DR:** Adversarially probe the system for harmful, biased, or policy-violating outputs using structured attack categories and creative attackers.

Red teaming systematically attacks an AI system to find safety, security, and policy failures before users do. Build a taxonomy of harms (violence, CSAM, self-harm, bias, jailbreaks, prompt injection, PII leakage), then craft both templated and creative attacks for each. Mix expert humans, crowd workers, and automated attackers (other LLMs generating adversarial prompts). Track attack success rates, severity, and reproducibility, then feed findings into mitigations and regression tests.

### How do you detect and measure hallucinations in LLM outputs?

**TL;DR:** Check claims against trusted sources via NLI, retrieval grounding, citation verification, or factuality classifiers like FActScore.

Hallucination detection compares generated claims to a source of truth. For RAG, score whether each output sentence is entailed by retrieved context using an NLI model or LLM judge (faithfulness). For open-domain answers, decompose into atomic claims and verify each against a knowledge base or web search (FActScore, SAFE). Track metrics such as faithfulness rate, citation precision/recall, and contradiction rate, and alert when they drop on production traffic.

### What is adversarial testing for AI systems?

**TL;DR:** Stress-test models with perturbed, malicious, or out-of-distribution inputs to expose brittleness beyond average-case accuracy.

Adversarial testing crafts inputs designed to break the model: typos, synonym swaps, paraphrases, prompt injections, jailbreak templates, encoded payloads, and adversarial suffixes. The goal is to surface failure modes that uniform random sampling misses, such as bias triggered by demographic substitutions or safety bypasses via roleplay. Tools like TextAttack, PromptBench, and Garak automate generation. Results inform robustness training, input sanitization, and policy refinements.

### How do you build a regression test suite for AI applications?

**TL;DR:** Curate a versioned dataset of historical bugs and key behaviors, run on every change, and gate releases on threshold scores.

Each time a real failure or important behavior is identified, add a test case with the input, expected behavior or property, and severity. Store the dataset in version control with clear schemas, and execute it via an eval harness on every prompt, model, or retrieval change. Use exact-match where possible, otherwise LLM-judge with rubrics or property-based assertions (no PII, valid JSON, cites a source). Block merges or deployments when scores drop on critical slices and track per-test history to spot creeping regressions.

### What are benchmark suites (MMLU, HumanEval, GSM8K), and how do you interpret them?

**TL;DR:** Standard public benchmarks for knowledge, code, and math; useful for model comparison but prone to contamination and weak transfer.

MMLU tests multi-domain knowledge across 57 subjects via multiple choice, HumanEval measures Python function synthesis with unit tests, and GSM8K covers grade-school math word problems. Together they give a quick capability snapshot when comparing base models. Interpret with caution: training-data contamination inflates scores, multiple-choice format rewards guessing strategies, and high benchmark scores do not guarantee performance on your specific task. Always supplement with task-relevant evals you control.

### How do you evaluate a RAG system end-to-end?

**TL;DR:** Score retrieval (recall, precision, MRR), generation (faithfulness, answer relevance), and end-to-end task success separately.

Decompose the pipeline so you can isolate failures. Retrieval metrics include recall@k, precision@k, MRR, and nDCG against a labeled query-document set. Generation metrics include faithfulness (is the answer entailed by retrieved context), answer relevance (does it address the question), and context precision (are retrieved chunks actually used). Frameworks like RAGAS, TruLens, and ARES automate this. Add end-to-end task metrics (correct answer rate, citation accuracy) and human review on a sampled slice.

### How do you evaluate the quality of AI agents?

**TL;DR:** Measure task completion rate, trajectory efficiency, tool-use correctness, and cost/latency on benchmark tasks.

Agent eval is multi-dimensional: did it complete the task (success rate), did it use the right tools in a sensible order (trajectory quality), how many steps and tokens did it consume (efficiency), and did it recover from errors (robustness). Use task suites like AgentBench, WebArena, SWE-bench, or custom domain tasks with verifiable outcomes. Log full traces and score trajectories with LLM judges or rule-based checks. Track per-step tool-call validity and final-answer correctness independently.

### What is the difference between offline and online evaluation for AI systems?

**TL;DR:** Offline uses fixed datasets pre-deploy; online measures live user behavior and outcomes in production.

Offline evaluation runs the model on a curated dataset with known answers or rubrics, giving fast, reproducible signals during development. Online evaluation observes real users via A/B tests, click-through rates, thumbs up/down, task completion, and downstream business metrics. Offline misses distribution shift and user behavior nuances; online is slow, noisy, and risky. Mature setups use offline gates for go/no-go decisions and online experiments to validate impact on real outcomes.

### How do you measure factual consistency in LLM outputs?

**TL;DR:** Use NLI entailment, QA-based consistency (QAGS, FEQA), or LLM judges to verify each claim against the source.

For grounded tasks, decompose the output into claims and check whether each is entailed, contradicted, or unsupported by the source using an NLI model. QA-based methods generate questions from the output, answer them against both source and output, and compare answers. LLM-judge approaches prompt a model to score faithfulness with a rubric. Aggregate to a faithfulness rate per response and track contradiction rate as a separate signal because unsupported claims and contradictions have different remediation paths.

### How do you evaluate multi-turn conversation quality?

**TL;DR:** Score turn-level correctness plus dialogue-level metrics like coherence, context retention, goal completion, and user satisfaction.

Multi-turn eval needs both fine-grained and holistic views. At the turn level, judge each response for correctness, helpfulness, and safety given prior context. At the conversation level, measure goal completion (did the user accomplish their task), context retention (does the bot remember earlier turns), coherence, and turn count to resolution. Use simulated users (LLM playing a persona with a goal) for scalable trajectory generation, and validate with human-rated real conversations.

### What is the role of golden datasets in AI evaluation?

**TL;DR:** Curated, high-quality labeled examples that anchor evals, regression tests, and benchmark comparisons across model versions.

Golden datasets are the ground-truth backbone of evaluation. They cover representative inputs, edge cases, and known failure modes with carefully reviewed labels or expected behaviors. Versioning matters: changes to the dataset must be tracked so score deltas are attributable to model changes, not label drift. Good golden sets are stratified across user segments, locales, difficulty levels, and risk categories, and are protected from leaking into training data.

### How do you implement continuous evaluation for production AI systems?

**TL;DR:** Sample live traffic, score with auto metrics and LLM judges, dashboard slices, and alert on regressions.

Instrument the application to log inputs, outputs, retrieved context, and metadata for every request (with privacy controls). Sample a fraction for scoring with automated metrics (faithfulness, toxicity, schema validity) and LLM-judge rubrics, plus human review on a smaller slice. Build dashboards that slice by user segment, intent, model version, and prompt variant, and set alerts when key metrics drop. Close the loop by feeding flagged failures into the regression suite and prompt iteration backlog.

### How do you evaluate bias in AI model outputs?

**TL;DR:** Test for disparate performance across demographic slices using counterfactual prompts and standard fairness metrics.

Construct paired prompts that vary only on protected attributes (name, gender, ethnicity, age) and measure whether outputs differ in sentiment, recommendation, or refusal rate. Use benchmark suites such as BBQ, BOLD, StereoSet, and CrowS-Pairs for known stereotype patterns. Compute disparity metrics (demographic parity, equalized odds) on classification-style tasks and qualitative judgments on open generation. Combine with red teaming for intersectional cases and validate with affected-community reviewers.

### How do you compare two models or prompts in a statistically rigorous way?

**TL;DR:** Run both on the same eval set, use paired tests (bootstrap, McNemar, t-test), and report effect size with confidence intervals.

Always evaluate both variants on identical inputs to enable paired comparison, which has higher statistical power than independent samples. For binary outcomes use McNemar's test; for continuous scores use a paired bootstrap or paired t-test. Report effect size (mean difference, win rate) with 95% confidence intervals, not just p-values. Pre-register the eval set, sample size, and decision threshold to avoid p-hacking, and account for multiple comparisons when testing many slices.

### How do you evaluate the robustness of an LLM application across input variations?

**TL;DR:** Apply systematic perturbations (paraphrase, typos, formatting, demographic swaps) and measure output stability and accuracy.

Robustness eval generates input variants that preserve meaning and checks whether outputs remain consistent and correct. Perturbation classes include surface (typos, casing, punctuation), syntactic (paraphrase, voice swap), semantic-preserving (synonym substitution), and adversarial (jailbreak templates, injected instructions). Measure accuracy delta and output consistency (e.g., embedding similarity or label agreement) across variants. Tools like CheckList, PromptBench, and TextAttack automate generation; flag prompts with high variance for hardening.

### What are the key differences between evaluating traditional ML vs LLM applications?

**TL;DR:** ML uses fixed labels and metrics like accuracy; LLM eval is open-ended, multi-dimensional, and often needs LLM-judge or human review.

Traditional ML predicts a label or value with clear ground truth, so accuracy, F1, AUC, RMSE suffice and are reproducible. LLM outputs are free-form text where many answers can be correct, references rarely exist, and quality spans correctness, style, safety, and helpfulness simultaneously. Determinism is gone (sampling), so repeat measurements matter. Eval pipelines must combine reference metrics where applicable, LLM-as-judge for open-ended dimensions, behavioral tests, and human review, with explicit handling of bias and calibration.

### How do you set up an evaluation framework from scratch for a new LLM application?

**TL;DR:** Define use cases and risks, build a golden dataset, pick metrics per dimension, automate the harness, then iterate.

Start by enumerating user journeys, success criteria, and failure modes including safety risks. Curate 50-200 representative examples covering common cases, edge cases, and adversarial inputs, with expected behaviors or rubrics. Choose metrics per dimension: correctness (exact match or LLM-judge), faithfulness (NLI on retrieved context), safety (toxicity classifier, refusal-correctness), and task-specific signals. Wire evals into CI so every prompt or model change reports scores, and grow the dataset as new failures appear in production.

### Your model passes one fairness metric but fails another. How do you handle conflicting audit results?

**TL;DR:** Document the tradeoff, choose the metric aligned with the harm model and stakeholders, and disclose limitations.

Different fairness metrics (demographic parity, equalized odds, calibration) are mathematically incompatible except in trivial cases, so failing one while passing another is expected. Map each metric to a concrete harm scenario relevant to your users and pick the one that matches the deployment context (e.g., equalized odds for opportunity allocation, calibration for risk scoring). Engage stakeholders and affected groups in the choice, document the rationale and the metrics not satisfied, and monitor both. Be transparent in model cards so downstream users understand the tradeoff.

### Your model was fair at deployment, but became biased 6 months later. How do you monitor continuously?

**TL;DR:** Continuously sample production outputs, recompute fairness metrics on demographic slices, and alert on drift beyond thresholds.

Deploy logging that captures inputs, outputs, and demographic proxies (with consent and privacy controls). Schedule recurring fairness evaluations (daily or weekly) that compute disparity metrics across protected slices on both held-out golden data and recent production samples. Track input distribution drift (feature and prompt drift) since shifts in user mix often drive fairness regressions. Set alert thresholds tied to acceptable disparity bounds, trigger investigation playbooks on breach, and retrain or adjust prompts as part of the response.

### An external auditor cannot reproduce your model's results. How do you ensure audit reproducibility?

**TL;DR:** Pin model version, prompt, decoding params, seed, dataset hash, and code; ship a runnable eval bundle with environment lock.

Reproducibility requires capturing every source of variance: model identifier and version, prompt template, temperature, top_p, seed, max tokens, system fingerprint where available, retrieval index hash, and dataset commit. Package the eval as a runnable bundle (containerized harness or notebook) with pinned dependencies, the exact dataset, scoring code, and expected results. Use fixed seeds for sampling-based judges and report variance across runs since LLM determinism is imperfect. Provide auditors API access or a snapshot model and document any hosted-model nondeterminism.

### How do you structure red teaming for an LLM chatbot before launch?

**TL;DR:** Define harm taxonomy, recruit diverse red teamers, run timed attack sprints with structured logging, then triage and mitigate.

Begin with a harm taxonomy covering safety (violence, self-harm, CSAM), security (prompt injection, jailbreaks, data exfiltration), bias, privacy, and brand risk, scoped to the chatbot's domain. Recruit a mix of internal experts, external specialists, and crowd attackers with diverse demographics and threat-model expertise. Run focused sprints with clear targets, attack templates, and a logging schema (prompt, response, severity, category, reproducibility). Triage findings by severity and frequency, ship mitigations (guardrails, fine-tuning, prompt updates, refusal logic), and add successful attacks to a regression suite that runs on every release.

### How do you red team a multimodal model where text-only safety tests miss cross-modal attacks?

**TL;DR:** Add image, audio, and video attack vectors including typographic injection, steganography, and cross-modal jailbreaks.

Multimodal models can be attacked through any input channel and combinations across them. Cover image-based vectors: typographic prompt injection (instructions written in an image), adversarial perturbations, OCR-bypass jailbreaks, and unsafe content hidden in benign-looking images. Test audio for spoken jailbreaks, hidden ultrasonic instructions, and accent or dialect bias. Critically, exercise cross-modal attacks where benign text plus an adversarial image bypasses guardrails the text-only filter approves. Build a multimodal red-team taxonomy, generate attacks via specialized tools (e.g., visual prompt injection libraries), and evaluate refusal rate and response safety per modality combination.

---

## Frontier (2025)

> _Frameworks and benchmarks referenced below are accurate as of 2026-05._

#### Modern eval pipelines

### How do you build an LLM eval pipeline using Inspect AI or Promptfoo?

**TL;DR:** Define datasets, solvers, and scorers in code, run them as versioned tasks in CI, and persist logs for diff and regression review.

Inspect AI (the UK AI Safety Institute's framework) structures evals as `Task` objects composed of a `Dataset`, a `Solver` chain (prompting, tool use, multi-turn agents), and one or more `Scorer` functions (exact match, model-graded, custom); runs produce structured `.eval` logs viewable in the Inspect log viewer. Promptfoo takes a config-driven approach with a YAML file declaring providers, prompts, test cases, and assertions (regex, JSON schema, LLM-rubric, custom JS), and ships a CLI plus web UI for side-by-side diffs across model or prompt variants. Wire either into CI on every prompt or model change so regressions block merges, and version both the eval definition and the dataset alongside the code so historical runs remain reproducible. Pair them with a golden set plus a continuously growing regression suite of past production failures, and gate releases on score deltas with confidence intervals rather than single-run scores.

### When should you use pairwise judging vs Likert-scale judging, and what are their tradeoffs?

**TL;DR:** Pairwise for ranking models or prompts where relative preference is enough; Likert when you need absolute quality on a fixed rubric.

Pairwise judging asks the rater (human or LLM) which of two outputs is better for the same input, the format used by Chatbot Arena (LMSYS) to compute Elo or Bradley-Terry rankings; it has high inter-rater agreement, is robust to scale-calibration drift, and requires `O(N log N)` comparisons but yields only relative scores. Likert judging asks for an absolute score (e.g., 1-5) per output against a rubric, which is `O(N)` and produces interpretable per-axis scores (helpfulness, faithfulness, safety) but suffers from anchoring, scale compression, and judge drift across batches. Use pairwise when comparing candidates (model selection, prompt A/B, RLHF preference data) and when absolute thresholds do not matter; use Likert when reporting quality against a fixed bar, tracking longitudinal trends, or scoring multiple independent dimensions. In practice, teams often combine both: pairwise for headline win-rate, Likert for diagnostic axes, and always randomize order plus calibrate the judge against human labels to bound bias.

### How do you evaluate an agent's full trajectory (steps, tool calls, intermediate outputs), not just its final answer?

**TL;DR:** Score the trajectory itself: tool selection, argument validity, step efficiency, recovery from errors, and faithfulness of intermediate reasoning, alongside outcome.

Final-answer-only evaluation hides agents that get lucky, take wasteful paths, or call dangerous tools on the way to a correct output. Capture the full trace (system prompt, each tool call with arguments, tool responses, model reasoning between steps) and score it on multiple axes: outcome correctness, tool-selection accuracy against a reference trajectory, argument validity, step count vs an oracle minimum, error-recovery behavior, and safety violations at any step. Frameworks like Inspect AI, LangSmith, and Braintrust expose trajectory logs; benchmarks such as SWE-bench, WebArena, and tau-bench grade both task success and process metrics like tool-call success rate and steps to completion. Use LLM-judge rubrics for subjective axes (was this tool call necessary? did the plan adapt to errors?) and exact checks for verifiable axes (did it call `delete_user` on the wrong id?), and treat partial-credit trajectory scores as the primary signal during development since they localize failures far better than end-to-end success alone.
