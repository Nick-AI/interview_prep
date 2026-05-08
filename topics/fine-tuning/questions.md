# Fine-Tuning and Model Adaptation

[← Back to index](../../README.md) · [Cheat sheet](./cheatsheet.md)

> Adapting pre-trained LLMs to new domains or tasks — full fine-tuning, PEFT (LoRA/QLoRA), RLHF, and dataset preparation.

### What is fine-tuning, and when should you fine-tune an LLM?

**TL;DR:** Fine-tuning continues training a pre-trained LLM on task-specific data to specialize behavior, style, or domain knowledge.

Fine-tuning updates model weights using supervised examples so the LLM learns patterns that prompting alone cannot reliably elicit. Use it when you need consistent output format, domain-specific vocabulary, lower latency than long prompts, or behavior that few-shot prompting fails to produce. Avoid it when knowledge changes frequently (prefer RAG) or when prompt engineering already works. Fine-tuning is also justified to compress a long system prompt into model weights for cost savings at scale. Reference: [AI Engineering Explained: LLM, RAG, MCP, Agent, Fine-Tuning, Quantization](https://www.youtube.com/watch?v=lnfWvX66FUk).

### Explain the difference between full fine-tuning and parameter-efficient fine-tuning (PEFT).

**TL;DR:** Full fine-tuning updates every weight; PEFT updates a small fraction, cutting compute, memory, and storage drastically.

Full fine-tuning recomputes gradients for billions of parameters and produces a complete model copy per task, making it expensive and storage-heavy. PEFT methods (LoRA, adapters, prefix tuning) freeze base weights and train small added modules, often <1% of parameters, with quality close to full FT for most downstream tasks. PEFT enables multi-tenant serving since the small deltas can be hot-swapped on a shared base model. Full FT remains useful when you need deep behavioral changes or large domain shifts that PEFT cannot capture. Reference: [AI Engineering Explained: LLM, RAG, MCP, Agent, Fine-Tuning, Quantization](https://www.youtube.com/watch?v=lnfWvX66FUk).

### What is LoRA (Low-Rank Adaptation), and how does it work?

**TL;DR:** LoRA injects trainable low-rank matrices A and B into frozen weight layers, learning W + BA instead of updating W.

LoRA assumes weight updates during fine-tuning have low intrinsic rank, so it factorizes ΔW into two small matrices of rank r (typically 4–64). Only A and B are trained, reducing trainable parameters by orders of magnitude while keeping the base model frozen. At inference, BA can be merged into W for zero added latency, or kept separate for adapter swapping. LoRA is typically applied to attention projection matrices (q_proj, v_proj) and sometimes MLP layers. Reference: [AI Engineering Explained: LLM, RAG, MCP, Agent, Fine-Tuning, Quantization](https://www.youtube.com/watch?v=lnfWvX66FUk). Reference: [LoRA: Low-Rank Adaptation of Large Language Models (Hu et al., 2021)](https://arxiv.org/abs/2106.09685).

### What is QLoRA, and how does it enable fine-tuning on consumer hardware?

**TL;DR:** QLoRA loads the base model in 4-bit NF4 quantization while training LoRA adapters in higher precision, slashing GPU memory.

QLoRA combines 4-bit NormalFloat quantization, double quantization of the quantization constants, and paged optimizers to handle gradient spikes. The frozen base sits in 4-bit, dequantized on the fly for forward/backward, while LoRA adapters train in bf16. This lets a 65B model fine-tune on a single 48GB GPU and 7B models on a 16GB consumer card with quality nearly matching 16-bit LoRA. Trade-off: slightly slower training due to dequantization overhead. Reference: [AI Engineering Explained: LLM, RAG, MCP, Agent, Fine-Tuning, Quantization](https://www.youtube.com/watch?v=lnfWvX66FUk). Reference: [QLoRA: Efficient Finetuning of Quantized LLMs (Dettmers et al., 2023)](https://arxiv.org/abs/2305.14314).

### Explain Prefix Tuning and Prompt Tuning. How are they different from LoRA?

**TL;DR:** Prefix/prompt tuning prepend learnable virtual tokens to inputs; LoRA modifies internal weight matrices via low-rank decomposition.

Prompt tuning learns soft embeddings prepended to the input embedding layer only. Prefix tuning extends this by injecting learnable key-value vectors into every transformer layer's attention. Both keep the model fully frozen and tune only the prepended vectors, giving extreme parameter efficiency but typically lower quality than LoRA, especially on smaller base models. LoRA modifies the weight matrices themselves, providing more capacity to learn task-specific transformations and generally outperforming prompt-based methods on complex tasks.

### What is adapter-based fine-tuning?

**TL;DR:** Adapter tuning inserts small trainable bottleneck modules between frozen transformer layers and trains only those modules.

Adapters add a down-projection, nonlinearity, and up-projection inside each transformer block, with the rest of the model frozen. This lets you maintain one base model and many task-specific adapters, swapping them per request. Adapters predate LoRA and add slight inference latency since they cannot be merged into base weights. They are still useful for multi-task serving and continual learning where keeping module separation is desirable. Reference: [AI Engineering Explained: LLM, RAG, MCP, Agent, Fine-Tuning, Quantization](https://www.youtube.com/watch?v=lnfWvX66FUk).

### What is RLHF (Reinforcement Learning from Human Feedback), and how is it used to align LLMs?

**TL;DR:** RLHF aligns LLMs by training a reward model on human preferences, then optimizing the LLM via PPO against that reward.

The pipeline has three stages: supervised fine-tuning on demonstrations, reward model training on pairwise human preference data (chosen vs rejected), and policy optimization (typically PPO) where the LLM generates outputs scored by the reward model. A KL penalty against the SFT model prevents the policy from drifting too far and producing reward-hacked gibberish. RLHF turned base GPT-3 into ChatGPT-style assistants by aligning helpfulness, harmlessness, and honesty. DPO is a simpler alternative that skips the reward model and optimizes directly on preference pairs. Reference: [Training Language Models to Follow Instructions / InstructGPT (Ouyang et al., 2022)](https://arxiv.org/abs/2203.02155).

### What is instruction tuning, and why is it important for chat models?

**TL;DR:** Instruction tuning fine-tunes an LLM on (instruction, response) pairs so it follows natural-language commands instead of just continuing text.

Base LLMs are next-token predictors; without instruction tuning they continue prompts rather than answering them. Datasets like FLAN, Alpaca, and ShareGPT teach the model the conversational format and the convention that user turns are requests requiring helpful responses. Instruction tuning is the foundation for chat models and typically precedes RLHF/DPO alignment. Diversity of tasks and prompt phrasings matters more than dataset size for generalization.

### How do you prepare a dataset for fine-tuning an LLM?

**TL;DR:** Curate task-representative examples in the target chat template, deduplicate, filter for quality, and split train/val/test cleanly.

Start by defining the exact input/output schema and collecting examples that mirror production traffic distribution. Apply the model's chat template (e.g., ChatML) so training format matches inference. Deduplicate near-duplicates to prevent memorization, filter out low-quality or unsafe samples, balance class/intent distribution, and reserve a held-out eval set with no leakage from training. For small datasets, augment with synthetic data validated by stronger models, but watch for distribution drift.

### What is catastrophic forgetting, and how do you prevent it during fine-tuning?

**TL;DR:** Catastrophic forgetting is the loss of pre-trained capabilities when fine-tuning shifts weights too far from the base distribution.

It happens when narrow domain data overwrites general-purpose representations, leaving the model fluent in the new task but worse at everything else. Prevention strategies include using PEFT (LoRA freezes base weights), mixing replay data from general instruction sets, lowering learning rate, fewer epochs, and KL-regularization toward the base model. Elastic Weight Consolidation and adapter-based methods explicitly preserve important parameters. Always evaluate on broad benchmarks (MMLU, general chat) alongside the target task to detect regression early.

### When should you choose fine-tuning over RAG over prompt engineering?

**TL;DR:** Prompt-engineer first, RAG for dynamic knowledge, fine-tune for persistent style/format/behavior the model cannot learn from prompts.

Prompt engineering is cheapest and fastest; exhaust it before anything else. RAG suits frequently changing knowledge, large corpora, citation requirements, and access control because content stays external. Fine-tuning suits stable patterns: tone, output schema, narrow domain reasoning, or compressing long system prompts into weights for latency/cost wins. Often the best system combines all three — fine-tuned base for behavior, RAG for facts, careful prompts for control.

### How do you evaluate a fine-tuned model's performance?

**TL;DR:** Use task-specific metrics on held-out data, plus general-capability benchmarks and qualitative human/LLM-judge review.

Define quantitative metrics tied to the use case: exact match, ROUGE/BLEU for generation, F1 for classification, pass@k for code. Add LLM-as-judge or human eval for open-ended tasks where reference-based metrics fail. Always run the base model on the same eval set as a baseline and monitor general benchmarks (MMLU, HellaSwag) to catch catastrophic forgetting. Production validation requires A/B testing against the prior model on real traffic for win-rate and downstream business metrics.

### What is synthetic data generation, and how do you use it for fine-tuning?

**TL;DR:** Synthetic data generation uses a stronger LLM (or self-distillation) to create training examples when human-labeled data is scarce.

Techniques include Self-Instruct (model generates instructions and answers), Evol-Instruct (iteratively complicates prompts), and distillation from a teacher model. You then filter outputs by quality (heuristics, judge models, execution checks for code) before training. Synthetic data scales cheaply but risks amplifying teacher biases and hallucinations, and often violates ToS when distilling from commercial APIs. Mix with real data and aggressive quality filtering to keep the distribution honest.

### What are the key hyperparameters for fine-tuning (learning rate, epochs, batch size, LoRA rank)?

**TL;DR:** LR 1e-5 to 2e-4, 1–3 epochs, effective batch 32–128, LoRA rank 8–64 with alpha = 2×rank are common starting points.

Full FT uses small LRs around 1e-5 to 5e-5; LoRA tolerates higher LRs, often 1e-4 to 3e-4. One to three epochs is typical — more usually overfits, especially on small datasets. Effective batch size is achieved via gradient accumulation when GPU memory limits per-step batch. LoRA rank trades capacity for parameters: r=8 suffices for style transfer, r=32–64 for harder domain tasks; alpha scaling controls update magnitude. Always sweep LR first since it dominates outcomes. Reference: [LoRA - Low-Rank Adaptation of LLMs](https://outcomeschool.com/blog/lora-low-rank-adaptation-of-llms).

### How do you fine-tune a model for a specific domain (legal, medical, finance)?

**TL;DR:** Combine domain continual pre-training on raw corpus with supervised fine-tuning on task-formatted examples, then evaluate on domain benchmarks.

Stage 1 is optional continual pre-training on unstructured domain text (case law, clinical notes, filings) to inject vocabulary and concepts. Stage 2 is SFT on instruction-formatted (input, expert-response) pairs reflecting target tasks. Use domain experts for labeling and evaluation rubrics; off-the-shelf metrics miss nuance. Watch regulatory constraints (HIPAA, GDPR, PII) when assembling training data, and validate against expert review and domain benchmarks like MedQA or LegalBench before deployment.

### What is continual pre-training, and when would you use it?

**TL;DR:** Continual pre-training extends the base model's next-token training on a new corpus to absorb new domains, languages, or recent knowledge.

Unlike SFT, it uses unsupervised language modeling on raw text without instruction format. Use it when your domain has specialized vocabulary or concepts the base model barely saw (e.g., niche programming languages, biomedical literature, low-resource languages). Risks include catastrophic forgetting and high compute cost; mitigate with replay of original pre-training data and conservative learning rates. Typically followed by instruction tuning to restore chat ability.

### How do you merge multiple LoRA adapters?

**TL;DR:** Merge LoRA weights into the base via W + BA, or combine multiple adapters with weighted sum, concatenation, or routing.

For a single adapter, merging means computing W' = W + (alpha/r) × BA and replacing the base weight, eliminating inference overhead. For multiple adapters, you can linearly combine ΔW_i with task-specific weights, use TIES-merging or DARE to resolve sign conflicts, or keep adapters separate and route per-request via Mixture-of-LoRAs. Naive averaging often degrades each task's performance, so techniques that prune redundant or conflicting deltas work better. Reference: [LoRA - Low-Rank Adaptation of LLMs](https://outcomeschool.com/blog/lora-low-rank-adaptation-of-llms).

### What is the difference between SFT (Supervised Fine-Tuning) and alignment training?

**TL;DR:** SFT teaches the model to imitate desired outputs; alignment training shapes preferences toward helpful, harmless, honest behavior.

SFT minimizes cross-entropy loss on (prompt, target) pairs and gives the model task-following ability. Alignment (RLHF, DPO, RLAIF) optimizes against preference signals — which of two responses is better — rather than imitating fixed targets. SFT cannot easily express "avoid this" or "prefer terser", while preference optimization can. The standard pipeline is SFT first to bootstrap quality, then alignment to refine style, safety, and tone.

### What is RLAIF (RL from AI Feedback), and how does it differ from RLHF?

**TL;DR:** RLAIF replaces human preference annotators with an AI judge model, scaling alignment data cheaply at the cost of judge biases.

The pipeline mirrors RLHF — generate response pairs, label preferences, train reward model, optimize policy — but a strong LLM (often Constitutional-AI-prompted) provides the labels. RLAIF reaches RLHF-comparable quality on many benchmarks at far lower annotation cost and faster iteration. Risks: the judge's biases and blind spots transfer to the policy, and it can homogenize behavior toward the judge's style. Often used as a hybrid with smaller human-labeled gold sets for calibration.

### What is knowledge distillation for fine-tuning, and what are the legal considerations?

**TL;DR:** Distillation trains a smaller student to match a larger teacher's outputs; using closed-API outputs may violate ToS that prohibit training competing models.

Technically, student matches teacher logits (soft targets) or generated outputs (hard distillation), achieving most of teacher quality at a fraction of the size and cost. Works exceptionally well when teacher is significantly stronger and student has enough capacity. Legally, OpenAI, Anthropic, and Google ToS forbid using their model outputs to train competing models; violation risks account termination, lawsuits, and license issues for downstream users. Open-weight teachers (Llama, Mistral) under permissive licenses avoid this entirely.

### Your fine-tuned LLM produces factually wrong outputs due to training data quality issues. How do you fix it?

**TL;DR:** Audit and clean the dataset, remove or correct erroneous examples, then retrain — and add RAG for facts that change.

Causes: noisy labels, hallucinated synthetic data, contradictions across examples, outdated facts baked into training, or domain experts providing inconsistent answers. Remediation starts with eval-driven triage — identify failure modes, trace each to specific training examples via influence functions or simple search, and remove or relabel them. Add deduplication, schema validation, and a stronger judge model to filter synthetic data. For volatile factual knowledge, move it out of weights into a RAG index where it can be updated without retraining, and use the fine-tuned model only for behavior and reasoning.

### You must choose between LoRA and full fine-tuning for a domain-specific assistant. How do you decide?

**TL;DR:** Default to LoRA; choose full FT only if LoRA underperforms, you have abundant compute, and the domain shift is large.

LoRA wins on cost, storage, multi-tenancy, and lower forgetting risk, and matches full FT on most assistant-style tasks. Pick full FT when the domain language differs drastically from pre-training (e.g., new language, dense specialized notation), when LoRA at high rank still plateaus below requirements, or when you need to retrain the tokenizer and embeddings. Run a controlled bake-off: train LoRA at r=16, 32, 64, compare to full FT on the eval set, and check inference latency, GPU memory, and total cost-of-ownership before committing. Reference: [LoRA - Low-Rank Adaptation of LLMs](https://outcomeschool.com/blog/lora-low-rank-adaptation-of-llms).

### Your fine-tuned model memorized training data verbatim instead of learning patterns. How do you fix overfitting?

**TL;DR:** Reduce epochs, lower LR, add dropout/weight decay, increase data diversity, and use early stopping on a held-out validation loss.

Causes: too many epochs, too-high learning rate, small or repetitive dataset, leaky train/val splits, or excessive LoRA capacity. Remediation: cut to 1–2 epochs, lower LR by 2–5×, deduplicate and augment training data, add held-out validation with early stopping, and reduce LoRA rank or apply LoRA dropout. Verify by prompting with held-out inputs and checking for paraphrase rather than verbatim recall, and run a contamination check between train and eval sets. Memorization can also indicate privacy risks if training data contained PII.

### Your fine-tuned LLM forgot its general capabilities after domain-specific fine-tuning. How do you fix catastrophic forgetting?

**TL;DR:** Switch to PEFT, mix in general-purpose replay data, lower learning rate, and KL-regularize toward the base model.

Causes: full FT with high LR on narrow data overwrites broad representations; too many epochs amplify drift. Remediation: prefer LoRA so base weights stay frozen; if full FT is required, blend 10–30% general instruction data (FLAN, Alpaca) into each batch as replay, drop LR, and reduce epochs. Add a KL penalty against the base model's outputs during training to bound the policy shift. Continuously evaluate on broad benchmarks (MMLU, MT-Bench) alongside the domain task, and stop training when general-capability regression exceeds tolerance.

### Your RLHF preference data has low annotator agreement. How do you ensure data quality?

**TL;DR:** Sharpen the rubric, train annotators, aggregate multiple labels per pair, filter low-agreement items, and add gold-standard calibration.

Low agreement signals ambiguous criteria, undertrained annotators, or genuinely close preference pairs. Tighten the rubric with concrete examples for each axis (helpful, harmless, honest), run calibration sessions, and measure inter-annotator agreement (Cohen's kappa, Fleiss). Collect 3–5 labels per pair and use majority vote or item-response models; drop pairs with no consensus rather than feeding noise into the reward model. Inject gold-labeled items to score annotators, retire unreliable ones, and consider RLAIF or constitutional AI labeling as a consistent secondary signal.

---

## Frontier (2025)

> _Methods and benchmarks below are accurate as of 2026-05._

#### Preference optimization

### What is DPO (Direct Preference Optimization), and how does it differ from RLHF?

**TL;DR:** DPO optimizes a closed-form preference loss directly on (chosen, rejected) pairs, skipping the reward model and PPO entirely.

DPO (Rafailov 2023) reparameterizes the RLHF objective to show that the optimal policy under a KL-constrained reward is itself a closed-form function of the reward, so preference learning reduces to a simple classification-style loss on pairs. Compared to RLHF, you drop the separate reward model, the on-policy rollouts, and the PPO machinery, which removes a major source of instability and compute. DPO trains by raising the log-probability margin between chosen and rejected responses relative to a frozen reference model, with a β hyperparameter playing the role of the KL coefficient. It typically matches or beats PPO-RLHF on alignment benchmarks at a fraction of the cost, though it can be more sensitive to noisy preference data because there is no reward-model smoothing.

### What is IPO (Identity Preference Optimization), and what problem does it solve compared to DPO?

**TL;DR:** IPO replaces DPO's logistic loss with a squared-error objective on log-likelihood ratios to prevent overfitting on deterministic preferences.

Azar et al. (2023) showed that DPO's Bradley-Terry-based loss assumes preferences are stochastic; when annotators are nearly always consistent, DPO can drive the implicit reward arbitrarily large and the KL term collapses, causing the policy to overfit and forget the reference model. IPO instead minimizes the squared distance between the log-probability ratio and a target margin, which keeps the KL regularization meaningful even under deterministic labels. The practical effect is a more stable optimum and less degradation on out-of-distribution prompts, especially with small or clean preference datasets. IPO is now a common drop-in replacement when DPO trains too aggressively or shows reference-model drift.

### What is KTO (Kahneman-Tversky Optimization), and why does it use binary feedback?

**TL;DR:** KTO trains on per-example binary "good/bad" labels using a prospect-theoretic loss, removing the need for paired preferences.

KTO (Ethayarajh 2024) draws on Kahneman and Tversky's prospect theory to model human utility as gain-loss asymmetric around a reference point, so it only needs a thumbs-up or thumbs-down on each individual completion rather than a (chosen, rejected) pair. This is operationally valuable because real-world feedback streams (chat reactions, deployment logs, rule-based filters) are usually unpaired and class-imbalanced. The loss rewards desirable outputs and penalizes undesirable ones relative to the reference policy, weighted to handle imbalance, and matches or exceeds DPO on standard alignment benchmarks despite the weaker supervision. KTO is preferred when you have abundant binary signals but few clean preference pairs.

### What is ORPO, and how does it combine SFT and preference optimization?

**TL;DR:** ORPO adds an odds-ratio preference penalty directly to the SFT loss, doing alignment in a single stage with no reference model.

ORPO (Hong 2024) augments standard supervised fine-tuning with an odds-ratio term that pushes up the likelihood of chosen responses while pushing down rejected ones, all from a single base checkpoint. Unlike DPO/IPO/KTO it does not require a frozen reference model, which halves memory and removes the SFT-then-DPO two-stage pipeline. The result is competitive alignment quality with shorter training, simpler infrastructure, and a single hyperparameter (λ) controlling the preference weight. ORPO is attractive for teams that want one training run from a raw base model to an aligned chat model.

### What is GRPO, and how is it used in DeepSeek-R1-style training?

**TL;DR:** GRPO is a PPO variant that estimates advantages from group-relative rewards, eliminating the value network and enabling cheap RL on reasoning.

Group Relative Policy Optimization, introduced in DeepSeekMath and used at scale in DeepSeek-R1, samples a group of K completions per prompt and computes each completion's advantage by normalizing its reward against the group mean and standard deviation, instead of learning a value baseline. Removing the critic halves the memory footprint and avoids value-function bias, which makes long-horizon reasoning RL tractable. In DeepSeek-R1, GRPO is paired with rule-based rewards (correctness on math/code, formatting checks) so the model bootstraps chain-of-thought purely from verifiable signals, with no human preference data in the RL stage. GRPO has become the default RL algorithm for open-source reasoning models because it is simple, stable, and cheap relative to PPO.

#### Model merging

### What is model merging, and how do TIES, DARE, slerp, and model soups differ?

**TL;DR:** Model merging combines weights of multiple fine-tuned checkpoints into one model with no extra training, using different conflict-resolution rules.

Model soups average weights of multiple fine-tunes of the same base, working when checkpoints sit in a shared loss basin. Slerp (spherical linear interpolation) interpolates along the unit sphere between two models, preserving norm and often outperforming naive linear averaging for distant checkpoints. TIES-Merging (Yadav 2023) trims small task-vector entries, resolves sign conflicts across tasks by majority vote, and then averages only the agreeing parameters, which prevents destructive interference when merging many task-specific deltas. DARE (Yu 2023) randomly drops a large fraction of delta-weight entries and rescales the rest, exploiting redundancy in fine-tuning updates so multiple models can be stacked with minimal performance loss; it is often composed with TIES (DARE-TIES). The right choice depends on how many models, how related their tasks are, and whether the deltas conflict in sign.

### When is model merging preferred over multi-task fine-tuning, and what are its limits?

**TL;DR:** Merging is preferred when you already have specialist checkpoints and want a single multi-skill model without rerunning training.

Multi-task fine-tuning requires a unified dataset, careful loss balancing, and a long training run; merging instead reuses existing single-task checkpoints and produces a combined model in seconds at zero GPU cost, which is invaluable for community ecosystems where many LoRA or full fine-tunes already exist. Merging works best when the constituent models share a base, were trained with similar hyperparameters, and have non-conflicting task vectors that TIES/DARE can disentangle. Limits: merging cannot create capabilities absent from all parents, quality degrades as the number and divergence of merged models grows, and there is no principled way to predict the merged model's behavior without evaluation. For a small number of closely related skills, multi-task SFT or a mixture-of-LoRAs router usually still wins on quality.

#### Synthetic data

### What are modern synthetic-data generation techniques (self-instruct, Magpie, agent-trajectory distillation), and how do you ensure quality?

**TL;DR:** Strong models generate instructions, responses, or trajectories; quality comes from seeding, filtering, deduplication, and verifier-based rejection sampling.

Self-Instruct (Wang 2022) bootstraps an instruction-tuning corpus by prompting a strong model with a small seed pool to generate new instructions and responses, then filters for diversity and validity; Evol-Instruct extends this by iteratively rewriting prompts to be harder. Magpie (Xu 2024) exploits the observation that aligned chat models, when given only the chat template's user-turn prefix and no content, will sample plausible user instructions on their own, yielding millions of high-quality, diverse instructions essentially for free, with responses produced by a second forward pass. Agent-trajectory distillation runs a strong agent (tool-using, reasoning) on tasks and records full traces — thoughts, tool calls, observations, final answers — to train smaller models to imitate the trajectory, which is how most open-source reasoning and agent models are built today. Quality controls span all approaches: embedding-based deduplication, n-gram and semantic diversity filters, automatic verifiers (unit tests for code, exact match for math, LLM-as-judge for open-ended), and rejection sampling that keeps only outputs passing a quality threshold; without these, synthetic data degrades quickly into mode collapse and stylistic monoculture.
