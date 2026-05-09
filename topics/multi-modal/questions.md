---
title: "Questions"
parent: "Multi-Modal AI"
nav_order: 2
---

# Multi-Modal AI

[← Back to index](../../README.md) · [Cheat sheet](./cheatsheet.md)

> AI systems that handle text, images, audio, and video — vision-language models, diffusion, CLIP, and cross-modal retrieval.

> _Generative model names (Sora, Flux, GPT-4o, Stable Diffusion) and codecs evolve rapidly; specifics below are accurate as of 2026-05._

### What are multi-modal AI models, and how do they process different types of data?

**TL;DR:** Models that ingest multiple modalities (text, image, audio, video) by encoding each into a shared representation space.

Multi-modal models use modality-specific encoders (e.g., ViT for images, BPE tokenizer for text, mel-spectrogram CNN for audio) that project inputs into aligned embedding spaces. A fusion mechanism — concatenation, cross-attention, or a unified transformer — combines these representations so the model can reason across modalities. Outputs may be text (captioning, VQA), images (generation), or actions. Training typically uses contrastive objectives (CLIP-style) or next-token prediction over interleaved tokens (Flamingo, GPT-4V style).

### How do vision-language models process images?

**TL;DR:** Patchify image, encode patches with a vision transformer, project tokens into the LLM's embedding space, then process alongside text tokens.

Most VLMs (LLaVA, GPT-4V, Qwen-VL) split the image into 14x14 or 16x16 patches, embed each patch with a frozen ViT (often CLIP's vision encoder), then pass the resulting visual tokens through a projection layer (MLP or Q-Former) that maps them into the LLM's token space. The LLM then attends jointly to image tokens and text tokens. High-resolution variants use tiling or dynamic resolution to preserve detail. Training aligns the projector with image-caption pairs before instruction-tuning on VQA data.

Reference: [An Image is Worth 16x16 Words / ViT (Dosovitskiy et al., 2020)](https://arxiv.org/abs/2010.11929).

### How does CLIP work, and why is it important for multi-modal AI?

**TL;DR:** CLIP trains paired image and text encoders with contrastive loss so matched pairs have high cosine similarity in a shared embedding space.

CLIP (Contrastive Language-Image Pre-training) uses a ViT image encoder and a text transformer trained on 400M image-text pairs from the web. The InfoNCE loss pulls true (image, caption) pairs together while pushing apart mismatched pairs in a batch. The result is a joint embedding space enabling zero-shot classification (compare image to "a photo of {class}" embeddings), cross-modal retrieval, and serving as the vision backbone for VLMs and diffusion models (Stable Diffusion's text conditioning uses CLIP text embeddings).

Reference: [Learning Transferable Visual Models From Natural Language Supervision / CLIP (Radford et al., 2021)](https://arxiv.org/abs/2103.00020).

### What are the key architectures for multi-modal models?

**TL;DR:** Dual-encoder (CLIP), cross-attention fusion (Flamingo), unified transformer with projector (LLaVA), and end-to-end token-mixing (Gemini, GPT-4o).

Dual-encoder models train separate encoders aligned by contrastive loss — fast retrieval but no fine-grained reasoning. Cross-attention models (Flamingo, BLIP-2 Q-Former) inject visual features into a frozen LLM via gated cross-attention layers. Projector-based VLMs (LLaVA, Qwen-VL) map vision tokens directly into LLM input space. Natively multi-modal models (Gemini, GPT-4o) are trained end-to-end on interleaved tokens across modalities, avoiding alignment bottlenecks. Choice depends on whether you need retrieval, generation, or reasoning.

### How does image generation work with diffusion models (Stable Diffusion, DALL-E, Flux)?

**TL;DR:** Iteratively denoise random Gaussian noise into an image, conditioned on a text embedding, using a U-Net or DiT trained to predict noise.

Diffusion models learn the reverse of a noising process: at each timestep t, the network predicts the noise added to a clean image. Sampling starts from pure noise and runs the denoiser for N steps (typically 20-50 with DDIM) to produce an image. Latent diffusion (Stable Diffusion) operates in a VAE-compressed latent space for efficiency. Text conditioning is injected via cross-attention to CLIP/T5 embeddings. Classifier-free guidance (CFG) trades diversity for prompt adherence. Modern systems (Flux, SD3) use diffusion transformers (DiT) instead of U-Nets.

Reference: [Denoising Diffusion Probabilistic Models (Ho et al., 2020)](https://arxiv.org/abs/2006.11239). Reference: [High-Resolution Image Synthesis with Latent Diffusion Models (Rombach et al., 2021)](https://arxiv.org/abs/2112.10752).

### What is text-to-speech (TTS), and what models are used for it?

**TL;DR:** Convert text to natural-sounding speech audio. Modern systems use neural sequence models (Tacotron, VITS, ElevenLabs, OpenAI TTS).

TTS pipelines typically have two stages: a text-to-spectrogram model (Tacotron2, FastSpeech2) and a vocoder (HiFi-GAN, WaveNet) that converts mel-spectrograms to waveforms. End-to-end models like VITS combine both. Recent LLM-based TTS (XTTS, ElevenLabs, OpenAI tts-1) treats audio as discrete tokens via neural codecs (EnCodec, SoundStream) and generates them autoregressively, enabling voice cloning and emotional control from a few seconds of reference audio.

### How does speech-to-text (Whisper) work?

**TL;DR:** Encoder-decoder transformer trained on 680k hours of multilingual audio that maps mel-spectrograms to text tokens.

Whisper converts 30-second audio chunks into 80-channel log-mel spectrograms, encodes them with a transformer encoder, then a decoder autoregressively generates text tokens conditioned on special tokens for language, task (transcribe vs translate), and timestamps. Multi-task training on diverse weakly-labeled web audio enables robustness to accents, noise, and code-switching. Decoding uses beam search with no-speech and compression-ratio thresholds to suppress hallucinations. Faster variants (faster-whisper, distil-whisper) use CTranslate2 or distillation.

### What is multi-modal RAG, and how does it differ from text-only RAG?

**TL;DR:** RAG that retrieves and grounds on non-text content (images, tables, charts, audio) using multi-modal embeddings or captions.

Multi-modal RAG indexes documents containing images, diagrams, and tables. Two main approaches: (1) caption everything to text and use standard RAG; (2) embed images directly with CLIP/SigLIP and retrieve via cross-modal similarity. The generation step uses a VLM that accepts retrieved images as input alongside the query. Challenges include layout-aware chunking (don't split a chart from its caption), multi-vector retrieval (ColPali embeds page images directly), and evaluation that checks visual grounding, not just text overlap.

### How do you build a system that processes both images and text?

**TL;DR:** Use a VLM API (GPT-4V, Claude, Gemini) or self-host LLaVA/Qwen-VL; preprocess images, batch requests, cache embeddings.

Architecture: input layer accepts image uploads + text query, preprocessing resizes/normalizes images and may extract OCR or detect objects, the VLM endpoint receives base64 or URL images plus prompt, post-processing parses structured output. For scale, cache image embeddings, use batching, and route simple queries to cheaper models. Self-hosting requires GPU inference with vLLM or TGI. Add safety filters for both modalities and observability for token costs (images consume many tokens — ~1000+ per high-res image).

### What are multi-modal embeddings, and how are they used for cross-modal search?

**TL;DR:** Vectors in a shared space where semantically related images, text, and audio are nearby; enable searching one modality with another.

Multi-modal embeddings (CLIP, SigLIP, ImageBind, Cohere Embed v3 multimodal) project different modalities into a unified vector space via contrastive training. Cross-modal search works because a text query and a matching image have high cosine similarity. Use cases: search images by text description, find similar products by photo, retrieve video clips by spoken query. Implementation: embed all assets offline into a vector DB (Qdrant, Pinecone), embed query at runtime, ANN search. ImageBind extends this to 6 modalities including audio and depth.

### How do you evaluate multi-modal AI systems?

**TL;DR:** Use task-specific benchmarks (VQA, MMMU, MMBench), automated metrics (CLIPScore, FID), and human eval for generation quality.

Discriminative tasks use accuracy on benchmarks: VQAv2, GQA, TextVQA for VQA; MMMU and MMBench for general VLM reasoning; DocVQA for documents. Image generation uses FID (distributional similarity), CLIPScore (text-image alignment), and human preference (PartiPrompts, HPSv2). Speech uses WER for ASR and MOS for TTS. For production, build domain-specific eval sets, use LLM-as-judge for open-ended outputs, and track per-modality failure modes (e.g., text rendering, counting, spatial reasoning).

### What are the challenges of real-time multi-modal AI processing?

**TL;DR:** Latency from large image/audio tokens, GPU memory, streaming alignment across modalities, and synchronization of outputs.

Image tokens dominate context (a 1024x1024 image = 1000+ tokens), inflating prefill latency. Audio streaming requires chunked encoders (Whisper streaming, Moshi) to avoid waiting for full utterances. Video adds temporal dimension and bandwidth constraints. Solutions: token reduction (Q-Former, perceiver resampler), KV-cache reuse, speculative decoding, edge inference for low-latency capture, and modality-specific pipelines that run in parallel (ASR + VAD + LLM + TTS) with careful interruption handling.

### How do you handle video understanding with AI?

**TL;DR:** Sample frames, encode each with a vision model, and aggregate temporally via attention, pooling, or video-native transformers (VideoMAE, Video-LLaVA).

Naive approach: sample N frames uniformly (often 8-32), encode each via ViT, concatenate as tokens to a VLM. Better methods use temporal attention (TimeSformer), 3D conv (I3D), or video-pretrained transformers (VideoMAE, V-JEPA). Long-video models (LongVA, Gemini 1.5) use compression or memory tokens. Audio is processed in parallel and fused. Challenges: token budget (an hour of video at 1 fps = 3600 frames), temporal grounding ("at what time did X happen"), and event boundary detection.

### What is visual question answering (VQA)?

**TL;DR:** Task of answering natural language questions about images, requiring joint visual perception and language reasoning.

VQA combines object recognition, attribute detection, spatial reasoning, counting, OCR, and commonsense to answer questions like "What color is the car next to the man in red?". Benchmarks include VQAv2 (open-ended), GQA (compositional), TextVQA (reading text in images), and OK-VQA (external knowledge). Modern VLMs handle VQA as next-token prediction conditioned on image + question. Failure modes include hallucinated objects, miscounting, and ignoring image content when the question is leading.

### What is document understanding, and how do models parse documents with layouts?

**TL;DR:** Extract structured information from documents preserving layout (tables, forms, figures). Use layout-aware models like LayoutLM, Donut, or VLMs.

Traditional pipelines: OCR (Tesseract, PaddleOCR) → layout detection (LayoutParser) → entity extraction. Layout-aware transformers (LayoutLMv3, DocFormer) jointly embed text, position, and image patches. End-to-end OCR-free models (Donut, Pix2Struct) generate structured output directly from page images. Modern VLMs (GPT-4V, Claude, Gemini) handle most documents zero-shot but struggle with dense tables and multi-page reasoning. ColPali enables retrieval over page images without OCR. Output formats: JSON, markdown, or HTML preserving structure.

### How do you fine-tune a vision-language model?

**TL;DR:** Freeze vision encoder, train projector + LoRA on LLM, with curated image-instruction pairs; LLaVA-style two-stage training is standard.

Stage 1 (alignment): freeze vision encoder and LLM, train only the projector on image-caption pairs to align modalities. Stage 2 (instruction tuning): unfreeze LLM (or apply LoRA), train on visual instruction data (LLaVA-150k, ShareGPT4V) covering VQA, reasoning, OCR. Use LoRA (rank 8-64) on attention layers for efficiency. Hyperparameters: lr 2e-5 for LLM, 1e-3 for projector, 1-3 epochs. Critical: high-quality, diverse data beats volume; include negative examples to reduce hallucination.

### What are the latency and cost considerations for multi-modal AI in production?

**TL;DR:** Images cost many tokens (~1000+ per HD image), inflate latency 2-5x vs text, and hosted APIs charge per image tile.

Cost levers: downsample images to minimum useful resolution, cache embeddings for repeated images, use cheaper models (Haiku, Flash) for classification, reserve frontier models (Opus, GPT-4) for reasoning. Latency levers: batch requests, use streaming, prefetch image embeddings, run vision encoder on edge. Hosted pricing varies (OpenAI charges by 512x512 tiles, Anthropic by image tokens). Self-hosting amortizes cost at scale but requires GPU capacity planning. Monitor per-request token usage closely.

### How do you handle multi-modal content moderation?

**TL;DR:** Layer modality-specific classifiers (NSFW image, toxic text, audio profanity) plus a VLM for cross-modal context (memes, OCR-in-image).

Single-modality moderation misses cross-modal attacks: benign image + toxic caption, or innocuous text overlaid on harmful image. Pipeline: image classifier (NSFW, violence detectors), OCR + text moderation on extracted text, audio toxicity for speech, then a VLM final check for context-dependent harms (memes, dog whistles). Use provider safety APIs (OpenAI moderation, Google Perspective, AWS Rekognition) as baselines. Maintain human review queues, log decisions for appeals, and re-evaluate when models update.

### What is text-to-video generation, and what are the current state-of-the-art approaches?

**TL;DR:** Generate video clips from text prompts using diffusion transformers (Sora, Veo, Kling, Runway Gen-3) trained on video-caption pairs.

T2V extends diffusion to the temporal axis, denoising 4D latents (T x H x W x C). Sora-class models use diffusion transformers (DiT) on spacetime patches with text conditioning via cross-attention. Key challenges: temporal consistency (objects don't morph), physics plausibility, long durations (most models cap at 5-20s), and compute cost (a 10s clip can require minutes of GPU time). Approaches include cascaded models (low-res then upsample), latent video diffusion, and autoregressive token models (VideoPoet).

### Explain Multimodal Fusion Techniques: Early Fusion vs Late Fusion.

**TL;DR:** Early fusion combines modalities at input/feature level for joint reasoning; late fusion processes each separately and combines predictions.

Early fusion concatenates or cross-attends raw features (vision tokens + text tokens into a unified transformer like LLaVA), enabling fine-grained cross-modal reasoning but requiring aligned modalities. Late fusion runs independent models per modality and combines outputs (averaging, voting, meta-classifier) — robust to missing modalities and easier to train, but loses cross-modal interactions. Hybrid (mid-fusion) combines at intermediate layers via cross-attention (Flamingo). Choice: use early fusion for tasks needing joint reasoning (VQA), late for multi-source classification with optional modalities.

### Your vision-language model generates factually incorrect image descriptions. How do you fix it?

**TL;DR:** Increase image resolution, use grounding prompts, add object detection signals, fine-tune on hallucination-reduced data (RLHF-V, POPE).

Causes: low-res input loses detail, vision encoder weak on domain (medical, technical), LLM prior overrides visual evidence, training data biased toward common scenes. Steps: (1) verify image preprocessing — resolution, aspect ratio, normalization; (2) prompt for grounding ("only describe what you see, list uncertain elements"); (3) augment with detector outputs (bounding boxes, OCR text) injected into prompt; (4) evaluate on POPE/CHAIR benchmarks; (5) fine-tune with DPO/RLHF-V on preference data penalizing hallucinations; (6) constrain generation with retrieval over reference images.

### Your VLM answers single-image questions but fails on multi-page documents. How do you fix it?

**TL;DR:** Use document-pretrained models (Donut, ColPali), tile pages with overlap, add page indices to context, retrieve relevant pages first.

Causes: VLM trained on single images lacks multi-page reasoning, token budget overflows on many pages, no spatial/temporal indexing across pages. Steps: (1) switch to a model with long-context multi-image support (Gemini 1.5, Claude); (2) preprocess with layout-aware OCR preserving page structure; (3) use ColPali or DocVQA-tuned retriever to fetch top-k relevant pages; (4) annotate each image with "Page N of M" in the prompt; (5) use chain-of-thought asking model to cite page numbers; (6) for tables, extract to markdown first.

### Your multimodal LLM ignores the image and generates descriptions from text alone. How do you fix it?

**TL;DR:** Increase visual token weight, check projector training, use stronger image conditioning, evaluate with image-required prompts.

Causes: weak projector alignment, LLM dominates due to strong text prior, image preprocessing failed silently, vision encoder frozen at suboptimal layer. Steps: (1) verify image actually reaches the model (log token counts); (2) test with prompts that require visual info ("what number is in the image?"); (3) increase projector capacity or retrain alignment stage; (4) use guidance techniques — classifier-free guidance scaling visual conditioning; (5) fine-tune with contrastive examples where text alone is insufficient; (6) check that vision encoder is not frozen below intended layer.

### Your diffusion model ignores precise control requirements in text prompts. How do you improve controllability?

**TL;DR:** Add structural conditioning (ControlNet, T2I-Adapter), increase CFG scale, use prompt weighting, fine-tune with LoRA on style/subject.

Causes: text encoder limited (CLIP truncates at 77 tokens), diffusion model trained on noisy captions, abstract concepts hard to specify in text. Steps: (1) raise CFG scale (7-15) for stronger prompt adherence — but watch for saturation; (2) use ControlNet for pose, depth, edge, segmentation control; (3) IP-Adapter for image-prompt conditioning; (4) prompt weighting syntax ((word:1.4)) in tools that support it; (5) regional prompting for multi-subject scenes; (6) fine-tune LoRA/DreamBooth on target subject; (7) switch to models with stronger text encoders (SD3, Flux use T5).

### Your diffusion model generates sharp but repetitive images. How do you balance quality vs diversity?

**TL;DR:** Lower CFG scale, increase sampling steps, vary seeds, use diverse samplers, add prompt variation; high CFG kills diversity.

Causes: CFG > 10 collapses to mode-seeking outputs, low step count truncates exploration, deterministic sampler reuses paths, narrow training distribution. Steps: (1) reduce CFG to 4-7 to recover diversity; (2) try stochastic samplers (DPM++ SDE, ancestral) instead of deterministic (DDIM, DPM++ 2M); (3) use CFG rescale or dynamic thresholding to allow lower CFG without washed-out colors; (4) randomize seeds and slight prompt rephrasing; (5) sample from multiple checkpoints/LoRAs and ensemble; (6) for production, generate batches and rank with aesthetic scorer.

### Your diffusion model takes too long per image. How do you speed up sampling?

**TL;DR:** Use few-step samplers (DPM++ 2M, LCM), distillation (LCM-LoRA, Turbo, Lightning), latent diffusion, smaller models, or batch on GPU.

Causes: too many denoising steps (50+), large model in pixel space, no batching, suboptimal scheduler. Steps: (1) reduce steps to 20-30 with DPM++ 2M Karras; (2) use distilled models — SDXL Turbo (1-4 steps), SD3 Turbo, Flux Schnell, LCM-LoRA on existing models; (3) ensure latent diffusion (SD operates in 8x downsampled latent); (4) compile with torch.compile or TensorRT; (5) use FP16/BF16, flash attention; (6) batch multiple prompts on the same GPU; (7) cache text embeddings for repeated prompts; (8) consider single-step models (SDXS) for real-time.

---

## Frontier (2025)

> _Voice models and codecs listed below are accurate as of 2026-05._

#### Voice and realtime AI

### What are end-to-end voice models (GPT-4o realtime, Gemini Live), and how do they differ from chained TTS+STT pipelines?

**TL;DR:** Single multi-modal models that ingest audio tokens and emit audio tokens directly, avoiding the STT→LLM→TTS cascade and its latency, error, and prosody losses.

Chained pipelines run speech-to-text (Whisper) → LLM → text-to-speech (ElevenLabs, OpenAI tts-1) sequentially, accumulating ~1-2s of latency and discarding paralinguistic signal (tone, emotion, laughter, hesitation) at every text bottleneck. End-to-end voice models like GPT-4o realtime (OpenAI realtime API docs) and Gemini Live (Google docs) tokenize audio with a neural codec (EnCodec-style) and train a unified transformer over interleaved text and audio tokens, enabling sub-300ms response, native interruption handling, and preservation of prosody and non-verbal cues. They also produce more natural backchannels ("mhm", laughter) and can sing, whisper, or shift accent because audio is generated in the same pass as reasoning. Tradeoff: less controllability (harder to swap voices or enforce strict text outputs), and self-hosting is currently impractical — production usage is via hosted realtime APIs.

### What is voice activity detection (VAD), and how does it handle turn-taking and interruption?

**TL;DR:** Classifier that segments audio into speech vs non-speech frames, used to detect when the user starts and stops talking so the agent can listen, respond, and yield.

VAD models (WebRTC VAD, Silero VAD, ten-vad) run on short audio frames (10-30ms) and emit a speech-probability score; downstream logic applies hysteresis thresholds and silence-duration heuristics (e.g., 500-800ms of silence = end-of-turn). For turn-taking, the agent waits for a stable end-of-speech signal before invoking the LLM, balancing responsiveness against false cutoffs on natural pauses. For barge-in, the agent monitors VAD while it is speaking and immediately stops TTS playback (and cancels the in-flight LLM stream) the moment user speech is detected. Modern realtime APIs (GPT-4o realtime, Gemini Live) include server-side VAD with tunable thresholds and prefix-padding, plus semantic VAD that uses an LLM signal to distinguish a finished thought from a mid-sentence pause.

### What latency budget should a realtime voice assistant target end-to-end?

**TL;DR:** Aim for ~500ms voice-to-voice (user stops speaking → first audio out); >800ms feels sluggish, <300ms feels human.

Human conversational turn gaps average ~200ms, so anything under ~500ms feels natural. The budget breaks down roughly: VAD end-of-turn detection 100-300ms, network round-trip 50-150ms, LLM time-to-first-token 100-400ms, TTS time-to-first-audio 100-300ms, audio buffering/jitter 50-100ms. Chained pipelines struggle to hit 800ms; end-to-end models (GPT-4o realtime, Gemini Live) routinely hit 300-500ms because audio tokens stream out alongside reasoning. Engineering levers: streaming STT with partial transcripts, speculative LLM prefill on partials, streaming TTS that starts on first sentence chunk, server-side VAD instead of client-side, and colocating inference near the user (regional endpoints, WebRTC). Track p50 and p95 voice-to-voice latency separately — tail latency dominates perceived quality.

### How do streaming TTS and streaming STT differ from batch, and what are the engineering challenges?

**TL;DR:** Streaming emits partial outputs as audio/text arrives instead of waiting for the full input, slashing perceived latency but breaking assumptions about complete context.

Batch STT (vanilla Whisper) requires the full utterance and a 30s context window before transcribing; streaming STT (faster-whisper streaming, Deepgram, AssemblyAI) processes audio in 100-500ms chunks and emits partial hypotheses that are revised as context accumulates, requiring stable-prefix logic so the UI does not flicker. Batch TTS synthesizes the entire utterance before playback; streaming TTS (ElevenLabs streaming, OpenAI tts-1 streaming) generates audio token-by-token and pipes PCM/Opus frames over WebSocket so playback starts in 100-300ms. Engineering challenges: handling revisions in streaming ASR without confusing the LLM, chunking LLM output at sentence or clause boundaries to feed TTS without unnatural pauses, jitter buffering to absorb network variability, graceful interruption mid-stream (cancel both LLM and TTS), and end-of-turn detection on noisy partials. WebRTC is the dominant transport because it handles jitter, packet loss, and echo cancellation natively.

### What are neural audio codecs (EnCodec, SoundStream), and why are they used in modern voice models?

**TL;DR:** Learned codecs that compress 24kHz audio to ~75 discrete tokens/second using residual vector quantization, giving LLMs a tractable token vocabulary for speech.

SoundStream (Zeghidour et al., 2021) and EnCodec (Défossez et al., 2022) are convolutional encoder-decoder models trained with reconstruction + adversarial losses; the bottleneck applies residual vector quantization (RVQ) producing ~4-8 codebooks of discrete tokens per frame at bitrates of 1.5-12 kbps. This matters for voice LLMs because raw waveforms (24000 samples/sec) are infeasible to model autoregressively, while mel-spectrograms are continuous and require a separate vocoder; codec tokens give a compact discrete representation that preserves prosody, timbre, and non-speech sounds. End-to-end models (GPT-4o, AudioLM, MusicGen, Moshi) generate codec tokens autoregressively and decode them to waveform with the codec's decoder. Newer codecs (DAC, Mimi in Moshi, SNAC) push to lower bitrates and higher fidelity, and semantic-acoustic split codecs (SpeechTokenizer) separate content from voice for better controllability.

### How do you evaluate a realtime voice agent (latency, naturalness, robustness to noise/accents)?

**TL;DR:** Combine objective metrics (voice-to-voice latency, WER on diverse audio, MOS/UTMOS for TTS) with task-success rates and human pairwise preferences in realistic conditions.

Latency: measure p50/p95 voice-to-voice (user stop → first audio out) and time-to-first-token under varied network and load; track interruption recovery time. ASR robustness: WER on accented (CommonVoice, Edinburgh), noisy (CHiME), and code-switched audio; check named-entity accuracy separately since errors there break downstream tasks. TTS quality: MOS (mean opinion score, 1-5) via human rating, UTMOS or NISQA as automated proxies, plus speaker-similarity for cloned voices. Conversational quality: turn-taking precision/recall (false barge-ins, missed end-of-turn), backchannel naturalness, and pairwise human preference vs a baseline. Task success: end-to-end completion rate on scripted scenarios (booking, support) under noise injection (background music, multiple speakers). Production: log every turn with audio, transcript, latency breakdown, and barge-in events; sample and human-rate weekly to catch regressions from model or VAD tuning changes.
