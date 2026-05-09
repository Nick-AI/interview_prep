---
title: "Cheatsheet"
parent: "Fine-Tuning and Model Adaptation"
nav_order: 1
---

# Fine-Tuning and Model Adaptation — Cheat Sheet

[← Back to index](../../README.md) · [Full Q&A](./questions.md)

## Core concepts
- **SFT (Supervised Fine-Tuning)**: cross-entropy training on (prompt, target) pairs.
- **Instruction tuning**: SFT on diverse (instruction, response) data so model follows commands.
- **PEFT**: parameter-efficient fine-tuning; trains <1% of parameters with frozen base.
- **LoRA**: low-rank decomposition ΔW = BA injected into attention/MLP weights.
- **QLoRA**: 4-bit NF4 base + LoRA adapters in bf16; fits 65B on 48GB GPU.
- **Adapter tuning**: bottleneck modules inserted between transformer layers.
- **Prefix/Prompt tuning**: trains soft tokens prepended to input or per-layer KV.
- **RLHF**: SFT → reward model on human preference pairs → PPO with KL penalty.
- **DPO**: direct preference optimization; skips reward model, optimizes on pairs directly.
- **RLAIF**: RLHF with AI judge replacing human preference annotators.
- **Catastrophic forgetting**: loss of general capabilities after narrow-domain FT.
- **Continual pre-training**: unsupervised LM training on new corpus to absorb domain.
- **Knowledge distillation**: smaller student trained to match teacher's outputs/logits.
- **Synthetic data**: LLM-generated training examples (Self-Instruct, Evol-Instruct).
- **Adapter merging**: TIES, DARE, linear combination of multiple LoRA deltas.
- **DPO / IPO / KTO**: reference-model preference losses; DPO on pairs, IPO squared-margin (stable on deterministic prefs), KTO on per-example binary feedback.
- **ORPO**: single-stage SFT + odds-ratio preference penalty; no reference model.
- **GRPO**: PPO variant with group-relative advantages, no critic; powers DeepSeek-R1-style reasoning RL.
- **Model merging**: weight-space combination of fine-tunes — soups (average), slerp (spherical), TIES (sign-vote + trim), DARE (drop+rescale deltas).
- **Synthetic data 2025**: Self-Instruct, Evol-Instruct, Magpie (template-prefix sampling), agent-trajectory distillation; quality via dedup, diversity filters, verifiers, rejection sampling.

## Decision rules
- **Prompt → RAG → fine-tune**: try in that order; cost/complexity rises each step.
- **RAG vs FT**: RAG for changing facts/citations; FT for stable behavior, format, style.
- **LoRA vs full FT**: default LoRA; full FT only for large domain shifts or new tokenizer.
- **SFT vs RLHF**: SFT for capability, RLHF/DPO for preference shaping (tone, safety).
- **DPO vs PPO**: DPO simpler, cheaper, no reward model, great default for offline pairwise data; PPO/GRPO when you have an online reward signal (verifiers, judges) or need complex reward shaping.
- **DPO vs IPO vs KTO vs ORPO**: DPO default on clean pairs; IPO when DPO overfits deterministic preferences; KTO when feedback is binary/unpaired; ORPO to fold alignment into a single SFT run with no reference model.
- **Merging vs multi-task FT**: merge when specialist checkpoints already exist, tasks are loosely related, and zero training cost matters; multi-task FT (or mixture-of-LoRAs) when you control data and need predictable, top-tier quality on each task.
- **QLoRA**: pick when single GPU memory is the bottleneck; accept ~10% slower training.

## Key formulas / parameters
- **LoRA rank r**: 4–8 (style), 16–32 (general SFT), 64–128 (hard domains).
- **LoRA alpha**: typically 2×r; effective scale = alpha/r.
- **LoRA target modules**: q_proj, v_proj minimum; add k_proj, o_proj, MLP for capacity.
- **Learning rate**: full FT 1e-5 to 5e-5; LoRA 1e-4 to 3e-4; QLoRA 2e-4.
- **Epochs**: 1–3; >3 usually overfits on small datasets.
- **Effective batch size**: 32–128 via gradient accumulation.
- **Warmup**: 3–10% of steps; cosine or linear decay schedule.
- **KL penalty (RLHF)**: β ≈ 0.01–0.1 against SFT reference.
- **Weight decay**: 0.0–0.1; LoRA dropout 0.05–0.1 for regularization.

## Common pitfalls
- Training without applying the model's chat template — format mismatch tanks quality.
- Train/eval contamination causing inflated metrics and hidden memorization.
- Using too many epochs on small data → memorization and forgetting.
- Skipping general-capability eval → catastrophic forgetting goes unnoticed.
- Distilling from closed APIs in violation of ToS (OpenAI, Anthropic, Google).
- Treating fine-tuning as a fix for factual knowledge that should live in RAG.
- LoRA on too few modules (only q_proj) — undertrains for hard tasks.
- RLHF preference data with low annotator agreement → noisy reward model.
- No baseline comparison against the base model on the same eval set.
