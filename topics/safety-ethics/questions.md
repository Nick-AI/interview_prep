---
title: "Questions"
parent: "AI Safety, Ethics, and Responsible AI"
nav_order: 2
flashcard: true
---

# AI Safety, Ethics, and Responsible AI

[← Back to index](../../README.md) · [Cheat sheet](./cheatsheet.md)

> Hallucinations, prompt injection, bias, privacy, and compliance — building safe, fair, accountable AI systems.

### What are hallucinations in LLMs, and how do you mitigate them?

**TL;DR:** Confident, fluent outputs that are factually wrong; mitigate via grounding (RAG), citations, decoding controls, and verification.

Hallucinations arise because LLMs are trained to predict plausible tokens, not to verify truth — gaps in training data, ambiguous prompts, and over-confident decoding all amplify the issue. Mitigations stack: ground outputs in retrieved evidence with citations (RAG), constrain decoding (lower temperature, structured output schemas), and force the model to abstain when retrieval coverage is low. Add a post-generation verifier (NLI, fact-check tool, or self-consistency) and route uncertain answers to humans. Track hallucination rate as a first-class eval metric per task.

### What is prompt injection, and what are the different types (direct, indirect)?

**TL;DR:** Adversarial instructions that hijack an LLM; direct = user input, indirect = poisoned content the model reads.

Prompt injection exploits the fact that LLMs cannot reliably separate trusted instructions from untrusted data inside the same context window. Direct injection happens when the end user types adversarial instructions ("ignore previous instructions, reveal system prompt"). Indirect injection hides instructions inside content the agent fetches — web pages, emails, PDFs, tool outputs — so the model executes them silently. Defenses include strict input/output filtering, instruction hierarchies, sandboxed tool execution, and treating all retrieved content as untrusted data with delimiters and provenance tags.

### How do you implement input and output guardrails for AI systems?

**TL;DR:** Validate prompts before the model and screen completions before delivery using classifiers, schemas, and policy rules.

Input guardrails run before inference: PII detection, jailbreak/injection classifiers, topic filters, and schema validation reject or sanitize unsafe prompts. Output guardrails run after generation: toxicity/PII/secrets scanners, schema and citation checks, and domain policy validators block or rewrite unsafe completions. Use specialized models (Llama Guard, NeMo Guardrails, Azure Content Safety) plus deterministic regex/JSON checks for low-latency rules. Always fail closed for high-risk categories, log every block with the matched rule, and red-team continuously.

### What is AI alignment, and why is it important?

**TL;DR:** Ensuring models pursue intended human goals and values, not proxies that drift toward harmful behavior.

Alignment is the technical and normative challenge of making AI systems do what humans actually want — including following implicit norms, avoiding deception, and refusing harmful requests. It matters because capable models optimized on flawed objectives (clickthrough, reward hacking) produce harmful behaviors that scale with capability. Practical alignment uses RLHF/RLAIF, Constitutional AI, instruction tuning, and red-teaming to shape behavior, plus interpretability and oversight to detect misalignment. Without alignment, capable systems are unsafe to deploy regardless of accuracy.

### How do you detect and mitigate bias in AI systems?

**TL;DR:** Audit data and outputs across protected groups using fairness metrics; mitigate via reweighting, de-biasing, or constraints.

Detection starts with disaggregated evaluation: compute accuracy, false-positive/negative rates, and selection rates across protected groups, then test fairness criteria (demographic parity, equalized odds, calibration). Trace disparities back to data (under-representation, label noise) or model (objective, features). Mitigations include rebalancing/reweighting training data, removing or transforming biased features, adversarial debiasing, post-hoc threshold adjustment, and constrained optimization. Bias work is continuous — re-audit on every retrain and monitor production drift.

### What are the key data privacy considerations (GDPR, CCPA) when building AI applications?

**TL;DR:** Lawful basis, data minimization, purpose limitation, user rights (access, deletion, portability), and DPIAs for high-risk processing.

GDPR requires a lawful basis (consent, contract, legitimate interest), data minimization, purpose limitation, and storage limits — plus user rights to access, rectify, delete, and port their data. CCPA adds disclosure, opt-out of sale, and non-discrimination. For AI, this means tracking provenance of training data, supporting deletion requests (which may force retraining), running Data Protection Impact Assessments for high-risk uses, and disclosing automated decision-making. Cross-border transfers need SCCs or adequacy decisions; vendors need DPAs.

### How do you handle PII in LLM inputs and outputs?

**TL;DR:** Detect and redact PII before sending to the model and re-scan completions; never log raw PII.

Run a PII detector (Presidio, AWS Comprehend, regex+NER) on every input to redact or tokenize names, emails, SSNs, and IDs before they reach the model or third-party API. For workflows that need real values, use reversible tokenization with a vault and re-insert after generation. Scan outputs for PII leakage (memorized training data, echoed inputs) and block or mask. Disable provider training on your data, encrypt logs at rest, apply retention limits, and document PII flow in your DPIA.

### What is explainability in AI, and why does it matter?

**TL;DR:** Producing human-understandable reasons for model outputs; matters for trust, debugging, compliance, and recourse.

Explainability gives stakeholders a justification for a specific decision — feature attributions (SHAP, LIME), counterfactuals, attention/saliency, or natural-language rationales. It matters because regulators (GDPR Art. 22, EU AI Act), users, and auditors need to understand and contest automated decisions, and engineers need it to debug failures. For LLMs, explainability includes citing sources, surfacing chain-of-thought summaries, and exposing tool calls. Without it, you cannot defend the system in court, in reviews, or to affected users.

### What is the difference between interpretability and explainability?

**TL;DR:** Interpretability = understanding model internals; explainability = justifying individual outputs to humans.

Interpretability is a property of the model itself — how transparently its mechanisms can be inspected (linear models, decision trees, mechanistic interpretability of neural circuits). Explainability is the practice of producing post-hoc, human-readable reasons for a specific prediction, often using approximation methods (SHAP, LIME) on opaque models. An interpretable model is inherently explainable; a deep network is explainable only via external tools. Regulators usually demand explainability; safety researchers pursue interpretability.

### How do you build trust with users in AI-powered applications?

**TL;DR:** Be transparent about AI use, calibrate confidence, cite sources, allow user control, and fail gracefully.

Trust comes from honesty and predictability: clearly disclose when AI is in use, what data it accesses, and its known limitations. Show confidence levels, cite sources, and surface uncertainty rather than projecting false authority. Give users control — undo, edit, opt out, escalate to a human — and design fallbacks for failure modes. Track satisfaction, complaints, and override rates as trust signals. Trust collapses faster than it builds; every confident hallucination costs disproportionately.

### What are adversarial attacks on AI systems, and how do you defend against them?

**TL;DR:** Crafted inputs that fool models; defend via adversarial training, input sanitization, detection, and ensembling.

Attacks include evasion (perturbing inputs to flip predictions), poisoning (corrupting training data), model extraction (stealing via queries), and membership inference (revealing training data). Defenses combine adversarial training (FGSM/PGD examples in training), input preprocessing (denoising, randomization), out-of-distribution detection, ensembling, and rate limiting. For LLMs, add jailbreak classifiers and instruction-hierarchy training. No defense is perfect — assume some attacks succeed and add monitoring, anomaly detection, and incident response.

### What is data poisoning, and how can it affect AI models?

**TL;DR:** Injecting malicious training data to install backdoors or degrade behavior; especially dangerous for crawled or crowdsourced data.

Poisoning attacks insert crafted samples into training data so the resulting model misbehaves on attacker-chosen triggers (backdoor) or generally degrades (availability attack). Web-scraped corpora, public datasets, and federated learning are highest risk. Detection uses data provenance, anomaly detection on training samples, activation clustering, and trigger reverse-engineering. Mitigations include data sanitization, robust aggregation (federated), trusted data sources, and periodic backdoor scans (e.g., Neural Cleanse) on production models.

### How do you implement content safety filters for AI-generated content?

**TL;DR:** Layer classifier-based filters (hate, violence, sexual, self-harm) on inputs and outputs with category-specific thresholds.

Use managed services (Azure Content Safety, OpenAI Moderation, Perspective API) or open models (Llama Guard, ShieldGemma) to score content across harm categories. Apply on both prompts and completions, with stricter thresholds for high-risk surfaces (minors, medical). Combine with deterministic blocklists for slurs, secrets, and known exploits. Log every action with category and score, support appeals, and re-tune thresholds against precision/recall on a labeled eval set. Localize categories for regional norms.

### What is responsible AI, and what frameworks exist for implementing it?

**TL;DR:** Designing AI to be fair, accountable, transparent, safe, and privacy-preserving; frameworks include NIST AI RMF, ISO 42001, OECD principles.

Responsible AI is an umbrella for principles (fairness, accountability, transparency, safety, privacy, human oversight) and the processes that operationalize them across the lifecycle. Key frameworks: NIST AI RMF (govern/map/measure/manage), ISO/IEC 42001 (AI management system), OECD AI Principles, Microsoft Responsible AI Standard, Google's AI Principles. Implementation requires governance bodies, risk assessments, model cards, evaluation gates, and post-deployment monitoring. Treat it as an engineering discipline with checklists, owners, and audits — not a slogan.

### How do you handle copyright and intellectual property concerns with AI-generated content?

**TL;DR:** License training data, filter verbatim outputs, watermark generations, indemnify users, and track provenance.

Risks span training (using copyrighted works without license), output (regurgitating copyrighted text/images), and user IP (provider training on customer prompts). Mitigations: license or use opt-in datasets, deduplicate and filter training data, add output similarity checks against known corpora to block near-verbatim copies, watermark generations, and offer customer indemnification. Disable provider training on customer data and document chain of custody. Monitor evolving case law (NYT v. OpenAI, Andersen v. Stability) and update policies accordingly.

### What is the EU AI Act, and how does it affect AI engineering?

**TL;DR:** EU regulation tiering AI by risk (unacceptable/high/limited/minimal) with conformity assessments, documentation, and oversight for high-risk.

The EU AI Act bans certain uses (social scoring, real-time biometric ID with exceptions), classifies many systems as high-risk (employment, credit, education, critical infrastructure, law enforcement) requiring risk management, data governance, technical documentation, logging, human oversight, accuracy/robustness, and post-market monitoring. General-purpose AI models have transparency and (for systemic-risk models) safety obligations. Engineering impact: build conformity-ready documentation (model cards, DPIAs), eval pipelines, audit logs, and human-in-the-loop controls from day one.

### How do you implement audit trails and logging for AI decisions?

**TL;DR:** Log inputs, model version, prompts, retrieved context, outputs, and decisions with immutable storage and retention policies.

Capture every decision-relevant artifact: request ID, user/session, timestamp, model and prompt version, input (hashed if PII), retrieved documents, tool calls, raw output, post-processing, and final decision plus confidence. Store in append-only/immutable storage (WORM, signed logs) with retention aligned to regulation (often 6 months to several years). Enable structured search for individual subjects (GDPR access requests), reproducibility, and forensic review. Mask PII per role; encrypt at rest and in transit.

### What is model card documentation, and why is it important?

**TL;DR:** Standardized doc describing a model's purpose, performance, limitations, training data, and ethical considerations.

Model cards (Mitchell et al., 2019) document intended use, out-of-scope use, training and evaluation data, disaggregated performance metrics, known biases, ethical considerations, and version history. They matter for transparency, regulatory compliance (EU AI Act, NIST AI RMF), procurement, and downstream developers who need to assess fit. Pair with datasheets for datasets and system cards for deployed applications. Treat them as living documents updated on every retrain or significant change.

### How do you handle misuse and abuse of AI systems in production?

**TL;DR:** Detect via monitoring and rate limits, respond with throttling/bans, and design abuse-resistant features upfront.

Define misuse categories (jailbreaks, scraping, generating disallowed content, automation/spam) and instrument detection: anomaly scores on usage patterns, content classifier hits, abuse reports, and honeypots. Respond with tiered enforcement: warn, throttle, require additional auth, suspend, ban — plus content takedown and law-enforcement referral when warranted. Engineer abuse resistance: rate limits, CAPTCHAs, account verification, watermarking, and feature constraints. Maintain an abuse playbook, on-call rotation, and post-incident reviews.

### What is differential privacy, and how can it be applied during model training?

**TL;DR:** Mathematical guarantee that individual records can't be inferred from outputs by adding calibrated noise; applied via DP-SGD.

Differential privacy bounds the influence of any single training record on the model with parameter ε (smaller = more private). DP-SGD adds the technique to training: clip per-example gradients to a norm bound, add Gaussian noise, and account total privacy budget across steps using moments accountant or RDP. Trade-off: tighter ε means lower utility, especially on small datasets and rare classes. Use libraries (Opacus, TensorFlow Privacy) and report ε, δ, and accuracy in model cards.

### How would you design an AI incident response plan?

**TL;DR:** Define severity tiers, on-call roles, detection signals, containment steps, comms plan, and blameless post-mortems.

Adapt SRE incident response to AI-specific failures (hallucination at scale, harmful output, bias regression, data leak, model compromise). Define severity levels with paging criteria, named roles (incident commander, comms, model owner), detection signals (eval drift, abuse spikes, user reports), and containment playbooks (kill switch, rollback to safer model, disable feature, throttle). Pre-draft external/regulator/user comms templates. Run blameless post-mortems with action items and tabletop exercises quarterly.

### What is the NIST AI Risk Management Framework (AI RMF)?

**TL;DR:** Voluntary US framework with four functions — Govern, Map, Measure, Manage — to manage AI risks across the lifecycle.

NIST AI RMF 1.0 (2023) is a sociotechnical framework structured around four functions: Govern (policies, accountability, culture), Map (context, use cases, risks), Measure (test, evaluate, monitor for valid, reliable, safe, fair, explainable, privacy-enhanced behavior), and Manage (prioritize, treat, communicate, document risks). Companion playbooks and the Generative AI profile add LLM-specific guidance. Use it as a checklist to build internal AI governance, complementing ISO 42001 and the EU AI Act.

### Your healthcare chatbot gives medical diagnoses it should not make. How do you add safety guardrails?

**TL;DR:** Restrict scope via system prompt and classifiers, refuse diagnostic claims, escalate to clinicians, and add disclaimers and legal review.

Root cause is unbounded scope and weak refusal training. Define a scope policy (information, not diagnosis), enforce with a domain classifier on inputs and a medical-claim detector on outputs, and use a system prompt with refusal templates that redirect to qualified care and emergency services for crisis keywords. Add a clinician-reviewed knowledge base with citations, log every conversation for audit, and route ambiguous cases to humans. Engage regulatory and legal counsel — in many jurisdictions diagnostic AI is a regulated medical device (FDA SaMD, EU MDR).

### Your AI system is reproducing copyrighted material verbatim. How do you prevent this?

**TL;DR:** Deduplicate training data, add output similarity filters against copyrighted corpora, raise temperature/penalties, and license content.

Verbatim regurgitation usually means duplicated training data and high-confidence decoding. Deduplicate the training corpus (MinHash/SimHash), filter outputs at generation against a copyrighted-text index using n-gram or embedding similarity, and block or paraphrase matches above threshold. Tune decoding (temperature, repetition penalty, top-p) to reduce memorization replay. Long-term, license content, prefer permissively licensed corpora, and consider unlearning techniques. Document provenance and provide takedown channels for rights holders.

### Your resume screening AI rejects more female candidates for engineering roles. How do you fix gender bias?

**TL;DR:** Audit features and labels for proxy bias, rebalance/reweight training data, apply fairness constraints, and add human review.

Likely causes: historical training labels reflect biased hiring, gendered keywords (sports, pronouns) act as proxies, and class imbalance. Run disaggregated metrics (selection rate, false-negative rate) by gender to confirm. Remove or transform proxy features, rebalance training data, apply adversarial debiasing or fairness constraints (equal opportunity, demographic parity), and recalibrate thresholds. Add human review for borderline cases, monitor production drift, document in a model card, and consider whether resume screening is the right tool at all (Amazon scrapped theirs).

### Your AI model passes bias checks by gender and race separately, but fails for intersectional groups. How do you handle it?

**TL;DR:** Evaluate across intersectional subgroups, oversample rare cells, and use intersectional fairness constraints during training.

Marginal fairness can mask intersectional harm (Buolamwini & Gebru's Gender Shades). Build evaluation slices for every relevant attribute combination (race × gender × age) with adequate sample sizes — collect more data for rare cells if needed. Use intersectional metrics (worst-group accuracy, multicalibration) and group-DRO or distributionally robust optimization to optimize the worst subgroup. Report intersectional results in model cards and gate releases on minimum subgroup performance, not just averages.

### Your AI denied a loan, and the customer demands a GDPR explanation. How do you provide one?

**TL;DR:** Provide meaningful info about the logic, key factors driving the decision, and the right to human review and contest.

GDPR Articles 13-15 and 22 grant data subjects the right to meaningful information about automated decision logic and the right to human review of solely automated decisions with legal effects. Generate a per-decision explanation with top contributing features (SHAP, LIME, or model-native attributions), counterfactuals ("if income were £X higher, decision would change"), the data sources used, and clear next steps for human review and appeal. Avoid raw model internals; deliver in plain language. Log the explanation alongside the decision for audit.

### A user invokes the right to be forgotten, but their data is in your model weights. How do you comply?

**TL;DR:** Delete from training data and downstream stores, then use machine unlearning, retraining, or influence-function methods to scrub model weights.

GDPR Article 17 requires erasure where feasible. Delete the user's data from raw datasets, feature stores, logs, and backups within retention windows. For model weights, options include exact retraining without the data (expensive), approximate machine unlearning (SISA, certified unlearning), influence-function-based removal, or fine-tuning on a curated corpus to suppress memorization. Document the residual risk, update DPIAs, and consider designing future systems with deletion in mind (per-user adapters, differential privacy, federated learning).

### The EU AI Act may classify your AI system as high-risk. How do you comply?

**TL;DR:** Establish risk management, data governance, technical docs, logging, human oversight, accuracy/robustness testing, and post-market monitoring; complete a conformity assessment.

High-risk systems (Annex III: employment, credit, education, biometrics, critical infra, law enforcement, etc.) require Article 9-15 obligations: risk management system, data and data governance (representative, error-checked), technical documentation (Annex IV), automatic logging, transparency to users, human oversight controls, and accuracy/robustness/cybersecurity testing. Register in the EU database, complete conformity assessment (self or notified body), affix CE marking, and run post-market monitoring with incident reporting. Engage a notified body early; non-compliance fines reach €35M or 7% of global turnover.

### Your differentially private model lost significant accuracy. How do you balance privacy and utility?

**TL;DR:** Tune ε and clipping, use larger batches, pre-train on public data, leverage privacy amplification, and shift sensitive computation to fewer steps.

DP-SGD's noise hurts utility most on small datasets, rare classes, and long training runs. Increase ε if your threat model permits, raise batch size (privacy amplification by sampling), pre-train on public/non-private data and fine-tune privately, and tune clipping norm carefully. Use newer accountants (RDP, PRV) for tighter budgets, consider DP-FTRL or DP-Adam, and shorten training. For hopeless trade-offs, switch techniques (federated learning with secure aggregation, synthetic data) or limit DP to sensitive layers.

### One malicious participant is poisoning your federated learning model. How do you defend against it?

**TL;DR:** Use robust aggregation (Krum, median, trimmed mean), anomaly detection on updates, client reputation, and secure aggregation with audits.

Naive FedAvg is vulnerable to a single bad client. Replace with robust aggregators — coordinate-wise median, trimmed mean, Krum, Multi-Krum, or Bulyan — that bound an attacker's influence. Layer anomaly detection on update norms and directions, maintain client reputation scores, and require attestation/auth to limit Sybil clients. Combine with differential privacy to limit per-client impact and secure aggregation to prevent inspection of honest clients. Periodically scan the global model for backdoors (Neural Cleanse, STRIP).

### Your AI hiring model uses proxy features for protected attributes. How do you eliminate proxy discrimination?

**TL;DR:** Identify proxies via correlation/mutual information with protected attrs, drop or transform them, and apply fairness constraints.

Removing race or gender doesn't help if ZIP code, school, or name encode them. Audit each feature for correlation and predictive power for protected attributes (mutual information, AUC). Drop strong proxies, transform weak ones (geographic generalization, name normalization), or use adversarial debiasing where a discriminator tries to predict the protected attribute from representations and the model learns to defeat it. Validate with disaggregated outcome metrics post-mitigation, and continuously monitor — proxies re-emerge with data drift.

### Your predictive model creates a feedback loop of biased outcomes. How do you break it?

**TL;DR:** Detect via outcome monitoring across groups, intervene with counterfactual data, randomization, holdouts, and exploration; retrain on de-biased samples.

Feedback loops happen when model outputs influence the data used to retrain (predictive policing sends more cops, generating more arrests). Break the loop by separating logging from labeling (use random or human-curated holdouts for ground truth), injecting exploration (epsilon-greedy decisions), reweighting training samples by inverse propensity, and applying counterfactual augmentation. Monitor outcome disparities longitudinally, not just at launch, and consider whether the use case should exist if loops are unavoidable.

### Your AI generates fake news images. How do you implement watermarking for AI-generated content?

**TL;DR:** Embed invisible robust watermarks at generation time and provenance metadata via C2PA; verify with detector models.

Use generation-time watermarking that survives compression and crops — frequency-domain perturbations (Stable Signature, Tree-Rings for diffusion, SynthID for images/audio). Pair with content credentials via the C2PA standard, signing provenance metadata (model, timestamp, edits) into the file. Provide public detector APIs and integrate with platform moderation. Acknowledge limits: watermarks can be stripped by determined adversaries, so combine with detection classifiers, hash registries of known generations, and policy/legal deterrents.

### Your AI denies a service, and the user has no way to challenge it. How do you design an appeals process?

**TL;DR:** Provide explanation, easy-to-use appeal channel, human reviewer with authority to overturn, SLAs, and feedback into model improvement.

Appeals are required by GDPR Art. 22, EU AI Act, and many platform laws — and they build trust. At denial, surface the reason, the data used, and a clear "appeal" link. Route appeals to trained human reviewers (not the same model) with authority to overturn, with response SLAs and status updates. Capture appeal outcomes as labeled data to retrain the model and surface systemic biases. Track overturn rate by group as a fairness signal; high rates flag broken thresholds or biased features.

### An auditor asks why your AI rejected a request 6 months ago, and you have no logs. How do you build audit trails?

**TL;DR:** Implement immutable, structured logs of inputs, model version, features, outputs, and explanations with regulator-aligned retention now.

Without logs, you can only apologize and remediate. Going forward: log per-decision request ID, user/session, timestamp, model + prompt version, input features (hashed for PII), retrieved context, raw output, post-processing, decision, confidence, and explanation. Store in append-only/immutable storage (WORM bucket, signed logs) with retention matching regulation (often 5+ years for credit, employment). Enable subject-access search and reproducibility (pin model artifacts). Backfill what you can from related systems and document the gap honestly.

### You removed PII, but users were re-identified from anonymized data. How do you prevent re-identification?

**TL;DR:** Use k-anonymity/l-diversity/t-closeness or differential privacy; suppress quasi-identifiers and restrict linkage attacks via aggregation.

Naive PII removal fails because quasi-identifiers (ZIP + birthdate + gender uniquely identify ~87% of US population — Sweeney). Apply formal models: k-anonymity (each record indistinguishable from k-1 others on quasi-identifiers), l-diversity (sensitive values vary), t-closeness (distribution match). Better, use differential privacy for releases and queries. Suppress or generalize high-cardinality quasi-identifiers, limit query rates, and audit for linkage with external datasets. For high-stakes data, prefer aggregated statistics or synthetic data with privacy guarantees.

### A pre-trained model from an open-source repo may contain a hidden backdoor. How do you detect it?

**TL;DR:** Run backdoor scanners (Neural Cleanse, STRIP, ABS), test on held-out triggers, fine-tune with clean data, and verify provenance.

Backdoors trigger malicious behavior on attacker-chosen inputs. Run reverse-engineering scanners (Neural Cleanse, ABS, TABOR) to search for unusual triggers, perturbation analyses (STRIP), and activation clustering on training/eval data. Evaluate on diverse adversarial test sets and watch for anomalous confidence on edge cases. Mitigate with fine-tuning or distillation on trusted clean data, pruning suspicious neurons, and requiring signed provenance (Sigstore, model cards, SBOM). Treat third-party weights like third-party code — review, scan, sandbox.

### Your LLM's training data was deliberately poisoned by an adversary. How do you respond?

**TL;DR:** Trigger incident response, identify and quarantine poisoned data, retrain or fine-tune on clean data, scan for backdoors, and harden ingestion.

Activate the incident response plan: assess scope (which datasets, which model versions, which users affected), preserve forensic evidence, and notify stakeholders/regulators. Identify poisoned samples via anomaly detection, activation clustering, and provenance audits, then quarantine them. Roll back to a clean model snapshot or retrain/fine-tune on sanitized data; run backdoor detection (Neural Cleanse) on the retrained model. Harden data ingestion: provenance verification, automated outlier filters, signed sources, and reduced reliance on untrusted scrapes.

### Your AI mental health chatbot gave harmful advice to a user in crisis. How do you mitigate harm?

**TL;DR:** Reach the user with crisis resources, kill or restrict the feature, run RCA, add crisis classifiers and human escalation, and report.

Immediate harm reduction first: contact the affected user with crisis hotlines and a human counselor where possible, and disable or heavily constrain the feature. Run a blameless RCA with clinical, safety, and legal stakeholders. Add a crisis-detection classifier (suicide, self-harm, abuse keywords + intent) that overrides normal flow with vetted crisis resources and live human handoff. Train and red-team specifically for crisis scenarios, log all crisis interactions for clinician review, and report per regulatory and ethical obligations. Reassess whether a chatbot is appropriate for this surface.

### Your AI system caused incorrect critical decisions. How do you run a blameless post-mortem?

**TL;DR:** Focus on systems and processes, not individuals; reconstruct timeline, identify root causes, define action items with owners.

Schedule promptly while context is fresh. Reconstruct the timeline from logs, monitoring, and interviews; describe what happened, impact (users affected, harm caused), and contributing factors using techniques like 5 Whys or causal trees. Explicitly avoid blaming individuals — focus on missing guardrails, weak signals, ambiguous procedures, and incentives. Produce concrete action items with owners and deadlines covering prevention, detection, response, and customer remediation. Share the document widely, track action completion, and feed lessons into training and tabletop exercises.

### Radiologists agree with AI 98% of the time, even when it is wrong. How do you prevent human over-reliance on AI?

**TL;DR:** Show calibrated uncertainty, hide AI on subset for skill maintenance, randomize order, audit disagreements, and design for complementarity.

Automation bias erodes expert judgment. Display calibrated confidence and uncertainty (not single labels), highlight cases where the model is unsure or out-of-distribution, and present AI only after the human's initial read on a sampled subset. Periodically run blinded shifts where AI output is hidden to maintain skill and detect drift. Audit AI-human disagreements both ways and reward justified overrides. Design tasks for complementarity (AI does triage, human decides) and train staff on AI failure modes.

### Your content moderation flags normal cultural expressions as offensive in other markets. How do you adapt cross-culturally?

**TL;DR:** Localize policies, train on regional data with local annotators, use locale-aware classifiers, and add appeal channels per market.

Global classifiers trained on English/US data misfire on dialects, languages, and cultural norms. Localize: write per-market policies with local legal and cultural experts, collect labeled data from local annotators (with diverse backgrounds, fair pay, and mental health support), and train or fine-tune locale-specific classifiers. Route content through locale-aware pipelines (language detection + regional model), provide appeals in local languages, and monitor false-positive rates by market. Engage civil society and publish transparency reports per region.

### Your AI training produces massive carbon emissions. How do you reduce environmental impact?

**TL;DR:** Train in low-carbon regions, use efficient architectures and hardware, distill/reuse models, and report energy and emissions.

Choose data centers powered by low-carbon energy (track via Cloud Carbon Footprint, ML CO2 Impact) and schedule training when grids are clean. Use efficient architectures (Mixture-of-Experts, sparse attention, quantization), efficient hardware (newer accelerators per FLOP/W), and distillation/transfer learning to avoid training from scratch. Right-size models to the task, prune, and cache inference. Report energy, emissions, and PUE in model cards (Patterson et al. methodology), and offset where reduction isn't feasible — but prioritize reduction over offsets.

---

## Frontier (2025)

> _Methods and benchmarks below are accurate as of 2026-05._

#### Modern alignment & safety

### What is Constitutional AI, and how does it differ from RLHF for alignment?

**TL;DR:** Constitutional AI replaces human preference labels with a written "constitution" that the model uses to critique and revise its own outputs (RLAIF).

Constitutional AI (Bai et al. 2022, Anthropic) trains models in two phases: a supervised stage where the model generates a response, critiques it against a list of natural-language principles (the constitution), and rewrites it; then an RL stage where a preference model trained on AI-generated comparisons supplies the reward signal — Reinforcement Learning from AI Feedback (RLAIF). Compared with vanilla RLHF, which depends on large pools of human preference labels for harmlessness, CAI shifts most of that labor onto the model itself, making the value system explicit, auditable, and easy to amend by editing the constitution. It scales harmlessness data cheaply and reduces evasive refusals, but inherits any biases or blind spots in the underlying model and the principles authors chose. In practice CAI and RLHF are complementary: human feedback still drives helpfulness, while AI feedback handles harmlessness at scale.

### What is deliberative alignment, and how is it used in reasoning models?

**TL;DR:** Deliberative alignment teaches a reasoning model to read and reason over the safety spec in its chain-of-thought before answering.

Deliberative alignment (Guan et al. 2024, OpenAI o-series) is a training method that supplies the model with the actual text of safety policies and trains it, via supervised fine-tuning and RL, to explicitly cite and reason about those policies inside its chain-of-thought before producing an answer. Unlike RLHF or Constitutional AI, which bake values into weights through preferences, deliberative alignment uses test-time reasoning to apply rules — letting the model handle novel jailbreaks, ambiguous edge cases, and policy updates by re-deriving the right behavior rather than recalling a memorized response. Reported results on o1 show large gains on jailbreak robustness (StrongREJECT, JailbreakBench) and reduced over-refusal compared with non-reasoning baselines. Limitations: it requires a capable reasoner, exposes the policy to prompt-injection unless the spec is privileged, and chain-of-thought monitoring is needed to catch deceptive reasoning.

### How do safety benchmarks like HarmBench and JailbreakBench work, and how should you use them?

**TL;DR:** Standardized harmful-behavior prompt sets plus automated judges that measure attack success rate (ASR) and refusal quality across attacks and defenses.

HarmBench (Mazeika et al. 2024) provides 510 harmful behaviors across categories (cybercrime, bioweapons, harassment, misinformation), a suite of red-team attacks (GCG, PAIR, AutoDAN, human jailbreaks), and a fine-tuned classifier that judges whether a response actually fulfills the harmful request — yielding a comparable ASR per (attacker, defender) pair. JailbreakBench (Chao et al. 2024) is a smaller curated set (100 behaviors aligned to the OpenAI usage policy) with a leaderboard, reproducible attack artifacts, and an LLM-as-judge protocol, designed for tracking jailbreak robustness over time. Use them as one signal in a layered evaluation: run them pre-release alongside refusal-quality and over-refusal benchmarks (XSTest, OR-Bench), but do not treat low ASR as proof of safety — they cover a fixed taxonomy, judges have known false-negative rates, and adaptive attackers can overfit to the published prompts. Pair with internal red-teaming, capability evals (WMDP, bio/cyber uplift), and post-deployment monitoring.
