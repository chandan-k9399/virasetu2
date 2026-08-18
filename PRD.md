# PRD — Virasetu
**AI Heritage Guide | INHack 2026 (Media Meet, Christ University)**
**Track alignment:** Problem Statement 6 — "If the next generation never asks about their roots, who will?"

---

## 1. Problem

Heritage sites like Lal Bagh carry deep, specific history — botanical, architectural, cultural — that most visitors never access, because the only ways to get it today are a paid human guide, a static signboard, or nothing. This gap is worse for visitors with disabilities (no audio for blind visitors, no visual/text alternative for deaf visitors) and worse still for younger visitors, for whom "read the plaque" doesn't compete with a phone.

Community-rooted knowledge — the kind that normally lives in a guide's memory or a specialist's head — has no digital, on-demand, adaptive form. Virasetu is that form.

## 2. Solution (one line)

A web app that looks at what a visitor is looking at (via phone camera) and explains it to them — in the format and depth that suits *them* — kid, student, researcher, audio-first, or text/visual-first.

## 3. Target Users (for this build)

Primary, built and demoed:
- **Blind / low-vision visitor** — needs audio-first explanation, no reliance on reading a screen.
- **Deaf / hard-of-hearing visitor** — needs text/visual-first explanation, no reliance on audio.
- **Kid** — needs simple, story-driven explanation.
- **Researcher / adult general visitor** — needs deeper, factual explanation.

Explicitly out of scope for this build (roadmap only — do not claim these work live):
- Mobility disability, cognitive/learning disability, speech disability, deaf-blind, and multi-disability combinations. These stay in the pitch deck as "what this scales to," not the demo.

## 4. Core User Flow

1. Visitor arrives at a Virasetu stop (physically, at Lal Bagh — or a marked demo stop at the hackathon venue).
2. A "volunteer" (teammate, in the demo) offers: headphones (audio) or just the screen (visual/text) — headphones flagged as "coming soon," not a live feature.
3. Visitor opens the web app on their phone (or the demo laptop).
4. **Consent screen**: explicit permission before camera/mic activates. No footage stored — state this and mean it.
5. **Mode selection screen** (explicit, tap-based): Kid / Student / Researcher / Audio guidance / Visual-text guidance. This is Option A — the user tells the system who they are. The system never infers this from the camera.
6. Visitor points the back camera at an artifact/plant/structure at a known stop.
7. App sends the frame + the stop's curated content + selected mode to the Gemini API.
8. Gemini returns an explanation tailored to the mode — spoken aloud (audio mode) or shown as text/cards (visual mode).
9. *(Stretch only)* If the front camera detects sustained confusion, the app offers "want me to explain that more simply?" — never changes what it thinks the user's identity is, only offers to re-explain.

## 5. MVP Feature Scope (build this, in priority order)

1. Back camera → Gemini vision call → tailored explanation (voice or text) — **this is the core, build first**
2. Explicit mode-selection screen (Kid/Student/Researcher/Audio/Visual)
3. 4–6 curated Lal Bagh stops with real written content (voice-mode script + screen-mode text per stop)
4. Consent screen before camera/mic activation
5. Basic stop identification (manual stop-picker is an acceptable fallback if GPS/auto-detect proves unreliable)

## 6. Stretch Features (only after MVP is solid and demo-stable)

- Front-camera confusion detection → "simplify?" nudge (not identity detection)
- Simultaneous front + back camera (single-camera-with-toggle is the reliable default; treat dual-cam as bonus)
- Nicer TTS voice (ElevenLabs) for one hero stop, with Gemini/browser TTS as guaranteed fallback everywhere else
- GPS-based auto stop-detection

## 7. Explicitly Not Building (state as roadmap, not gaps)

- Custom sensor/camera headphone hardware
- Any inference of disability, age, or identity from camera/face data
- Multi-location live volunteer network (single Lal Bagh location only, demoed with one teammate playing the volunteer role)
- RAG / vector database (curated content is pasted directly into prompts instead)

## 8. Success Criteria (mapped to judging weights)

| Judging criterion | Weight | How Virasetu addresses it |
|---|---|---|
| Problem Understanding | 10% | Clear, narrow user set (2 disability personas + kid/researcher), explicit roadmap for the rest |
| Innovation & Creativity | 20% | Camera-grounded, persona-adaptive explanation — not a generic chatbot |
| Accessibility & Inclusivity | 20% | Audio-first and visual-first modes both fully functional; explicit consent; no identity inference |
| Technical Execution & Feasibility | 20% | Working camera→AI→output loop, live-demoable, no fragile/fake hardware claims |
| Scalability & Sustainability | 15% | Roadmap slide: more stops, more locations, more disability modes, headphone hardware |
| Presentation & Pitch | 10% | Live demo with real content at a real, locally-relevant site (Lal Bagh, Bangalore) |
| Team/AI Use (bonus) | 5% | Team can explain how the AI-assisted build works, not just that it works |

## 9. Content Requirements (do this early, not last)

For each of 4–6 Lal Bagh stops, write:
- A short **voice-mode script** (warm, spoken, story-driven — for audio-first mode)
- A short **screen-mode version** (concise text/caption cards — for visual-first mode)
- A **kid version** (simple, narrative)
- A **researcher version** (factual, deeper detail)

Recommended stops: Glass House, Kempegowda Tower/rock formation, a notable old tree, the lake, one Tipu-era horticultural feature (framed factually/botanically, not politically).
