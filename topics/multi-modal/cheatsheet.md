---
title: "Cheatsheet"
parent: "Multi-Modal AI"
nav_order: 1
---

# Multi-Modal AI — Cheat Sheet

[← Back to index](../../README.md) · [Full Q&A](./questions.md)

## Core concepts
- **VLM (Vision-Language Model):** LLM extended with a vision encoder + projector (LLaVA, GPT-4V, Claude, Gemini, Qwen-VL).
- **CLIP:** Contrastive image-text dual encoder; produces aligned embeddings; backbone for retrieval and as text conditioner for diffusion.
- **ViT (Vision Transformer):** Splits image into patches (14x14 or 16x16), embeds each as a token, applies transformer; standard image encoder.
- **Diffusion (DDPM/DDIM):** Iterative denoising of Gaussian noise into an image. DDPM = stochastic, DDIM = deterministic & faster.
- **Latent diffusion:** Diffuse in VAE-compressed latent space (8x downsample) instead of pixels — used by Stable Diffusion.
- **DiT (Diffusion Transformer):** Transformer-based denoiser (replaces U-Net) — Sora, SD3, Flux.
- **Cross-attention fusion:** Inject visual features into LLM via cross-attention layers (Flamingo, BLIP-2 Q-Former).
- **Early vs late fusion:** Early = combine raw features for joint reasoning; late = combine independent predictions.
- **Multi-modal embeddings:** Shared vector space across modalities (CLIP, SigLIP, ImageBind, Cohere multimodal) for cross-modal retrieval.
- **VQA (Visual Question Answering):** Answer text questions about images; benchmarks: VQAv2, GQA, TextVQA, MMMU.
- **OCR / layout:** Tesseract/PaddleOCR for text; LayoutLM, Donut, ColPali for layout-aware document understanding.
- **Whisper:** Encoder-decoder transformer for ASR, mel-spectrogram input, multilingual, multi-task (transcribe/translate/timestamp).
- **TTS:** Text → mel-spectrogram → vocoder, or end-to-end neural codec models (VITS, ElevenLabs, OpenAI tts-1).
- **CFG (Classifier-Free Guidance):** Trades diversity for prompt adherence in diffusion; scale 4-7 balanced, 10+ saturates.
- **ControlNet / IP-Adapter:** Add structural (pose, depth, edge) or image-prompt conditioning to diffusion models.
- **VAD (Voice Activity Detection):** Frame-level speech vs non-speech classifier (WebRTC VAD, Silero) used to gate the agent's listen/respond loop and trigger barge-in.
- **Turn-taking:** Logic that decides when the user has finished speaking (silence threshold + semantic VAD) and when the agent should yield on user interruption.
- **End-to-end voice model:** Single multi-modal model that ingests and emits audio tokens directly (GPT-4o realtime, Gemini Live, Moshi), bypassing the STT→LLM→TTS chain.
- **Neural audio codec:** Learned RVQ codec (EnCodec, SoundStream, Mimi, DAC) compressing audio to ~75 discrete tokens/sec — the token vocabulary for voice LLMs.
- **Latency budget (voice):** Voice-to-voice target ~500ms; <300ms feels human, >800ms feels sluggish; split across VAD, network, LLM TTFT, TTS TTFA, jitter buffer.

## Decision rules
- **Early fusion vs late fusion:** Early when joint reasoning needed (VQA, captioning); late when modalities optional or independent (multi-source classification).
- **Diffusion vs autoregressive image gen:** Diffusion for quality and diversity (SD, Flux); autoregressive for unified token-space with text (Chameleon, GPT-4o image).
- **Encoder-only vs decoder-only VLM:** Encoder-only (CLIP) for retrieval and classification; decoder-only (LLaVA, GPT-4V) for generation, VQA, instruction following.
- **Caption-and-RAG vs visual RAG:** Caption-and-index when downstream uses text LLM; embed images directly (ColPali, CLIP) when preserving visual fidelity matters.
- **Hosted API vs self-hosted VLM:** Hosted for prototypes and low volume; self-host (LLaVA, Qwen-VL via vLLM) at scale for cost and data control.
- **Few-step distilled vs full diffusion:** Distilled (Turbo, LCM, Lightning, Schnell) for real-time and batch; full sampling for max quality.
- **End-to-end vs chained voice pipeline:** End-to-end (GPT-4o realtime, Gemini Live) when sub-500ms latency, prosody preservation, or natural barge-in matter; chained STT+LLM+TTS when you need voice/model swappability, strict text control, or self-hosted deployment.

## Key formulas / parameters
- **CFG scale:** `eps = eps_uncond + s * (eps_cond - eps_uncond)`. Typical s = 4-7. s > 10 causes oversaturation.
- **Denoising steps:** DDPM 1000, DDIM 20-50, DPM++ 2M 20-30, LCM 4-8, Turbo 1-4.
- **Image token cost:** ~1 token per ~14x14 patch; HD image (1024x1024) ≈ 1000+ tokens; GPT-4V tiled mode bills ~85 base + ~170 per 512x512 tile (full HD ≈ 765 aggregate).
- **CLIPScore:** cosine similarity between CLIP image and text embeddings; reported * 2.5 for [-2.5, 2.5] range.
- **Whisper chunks:** 30s audio → 80-mel spectrogram → 1500 encoder tokens.
- **LoRA fine-tuning:** rank 8-64, lr 2e-5 (LLM) / 1e-3 (projector), 1-3 epochs.

## Common pitfalls
- Treating images as cheap input — they consume 1000+ tokens each, dominating cost and latency.
- Skipping image preprocessing — wrong resolution, aspect ratio, or normalization silently degrades VLM accuracy.
- High CFG (>10) for diversity — produces saturated, repetitive outputs; lower CFG and use stochastic samplers instead.
- Splitting layout-sensitive content (charts, tables) during chunking — destroys spatial relationships needed for understanding.
- Single-modality moderation — misses cross-modal harms (toxic text on benign image, OCR-in-meme attacks).
- Ignoring vision encoder limits — CLIP/SigLIP capped at 224-448 px; high-res needs tiling or dynamic resolution.
- Trusting VLM counting and spatial reasoning — both remain weak; verify with detection models when precision matters.
- Naive uniform frame sampling for video — misses key events; use shot detection or learned samplers for long videos.
