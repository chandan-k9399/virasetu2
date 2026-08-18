# RULES.md — Virasetu

Rules for what to use, what to avoid, and hard boundaries for AI-assisted (vibe-coded) development. Read this before prompting Cursor for anything outside a file you're already working in.

## 1. Hard Boundaries — Never Build These

These aren't "avoid if possible" — they are **do not implement, even if an AI tool suggests it or it seems like a quick win**:

- **Never infer disability, age, or identity from camera/face data.** Mode selection is always explicit (user taps Kid/Student/Researcher/Audio/Visual). No exceptions, no "just for the demo" shortcuts. If you catch a prompt or a generated feature doing this, cut it immediately.
- **Never expose the Gemini API key client-side.** All AI calls go through the `/api/explain` Vercel route. If Cursor generates a `fetch()` call to the Gemini API directly from a component, reject it and route it through the API layer instead.
- **Never store camera footage or captured frames.** Frames are sent to the API for a single explanation call and discarded — not written to disk, not logged, not cached beyond the request lifecycle. This matches the consent promise in the app and in the pitch.
- **Never claim working hardware (headphones with sensors/cameras) in the demo.** It's a "coming soon" line in the pitch only. If any UI copy or feature implies headphones do more than play audio, fix it.
- **Never claim all 9 disability categories work.** Two are fully built (blind/low-vision, deaf/hard-of-hearing) plus kid/researcher modes. Everything else is a roadmap slide. Don't let generated pitch copy or UI text overstate this.

## 2. Libraries / Tools — Use These

- **Next.js** (App Router) — frontend + API routes in one framework
- **Vercel** — hosting + serverless functions (also your Gemini API proxy layer)
- **Firebase Firestore** (client SDK for reads, admin SDK for the API route if needed) — stop content only
- **`@google/generative-ai`** (or current official Gemini SDK) — server-side only, inside API routes
- **Browser-native `getUserMedia`, `Web Speech API`, `SpeechSynthesis`** — no extra STT/TTS vendor needed for the reliable baseline
- **Tailwind CSS** — fast styling, works well with AI-generated components, keeps consistency across screens built by different teammates

## 3. Libraries / Tools — Avoid

- **Any face/emotion-detection library used for identity/disability/age inference.** If used at all (confusion-nudge stretch feature only), scope the prompt to Cursor tightly: "detect general disengagement/confusion signal only, do not classify demographic or disability attributes." Review the generated code — some libraries return demographic guesses by default; strip that output entirely if present.
- **RAG / vector database libraries** (Pinecone, Weaviate, LangChain retrieval chains, etc.) — not needed at this content scale, adds setup time for no benefit.
- **A second STT/TTS vendor as your default path** (e.g., Whisper API, ElevenLabs) — fine as a stretch/bonus layered on top, never as the only path. Browser-native must always work as fallback.
- **Any GitHub/Jules-style async coding agent as your primary build tool.** Use synchronous tools (Cursor) for the live build; async agents don't fit a 12-hour room-based sprint with constant scope changes.

## 4. Error Handling Rules

- **Every Gemini API call needs a visible failure state**, not a silent hang. If the call fails or times out, show a clear message and offer a retry — don't leave the camera view frozen with no feedback. This matters live: venue wifi will not be perfectly reliable.
- **Camera permission denial must be handled gracefully**, with a clear explanation of why the camera is needed, not a raw browser error.
- **Firestore read failures fall back to `data/stops-seed.json`.** Build this fallback in from the start, not as a last-hour patch.
- **Dual-camera failure must fall back to single-camera silently**, if that stretch feature is attempted — never show a broken UI state, just default to back-camera-only.

## 5. AI-Assistance Rules (for using Cursor itself)

- **Prompt Cursor in small, scoped chunks** — one component or one API route at a time, not "build the whole app." Large single-shot prompts are harder to debug when something breaks at hour 8.
- **At least one teammate must be able to explain any AI-generated code they own**, in plain language, before judging. This is both a scoring factor (Team/AI Use, 5%) and a real risk if judges ask a follow-up question about how something works.
- **Review generated code for the boundaries in Section 1 before merging/using it** — AI tools will happily generate a face-based classifier or a client-side API key if asked casually; catching this is a human review step, not something to assume the tool won't do.
- **Keep a running log of what was AI-generated vs. hand-modified** in `MEMORY.md`, updated as you go — useful for the pitch and for debugging when something behaves unexpectedly.

## 6. Content Rules

- Frame all site history factually, especially anything touching Tipu Sultan-era features at Lal Bagh — botanical/historical facts only, no interpretive or political framing.
- Keep each stop's content short (a few hundred words per mode) — it gets pasted directly into the prompt, so bloated content slows every request and costs more tokens for no benefit.
