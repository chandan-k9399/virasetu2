# ARCHITECTURE.md — Virasetu

## 1. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | Next.js (React) | Works with Cursor well, Vercel-native, single framework for UI + API routes |
| Hosting | Vercel | One deploy target, serverless API routes double as our backend proxy |
| AI (vision + explanation + TTS) | Google Gemini API | Single multimodal call handles image + text in one request; also used for TTS |
| Content storage | Firebase Firestore | Stop content editable without redeploy; simple read-only queries |
| Speech-to-text | Browser Web Speech API | Free, zero setup, no network dependency risk |
| Text-to-speech (fallback) | Browser SpeechSynthesis API | Free, zero setup, guaranteed to work with no quota risk |
| Text-to-speech (primary) | Gemini TTS | Better quality, same vendor/key as the rest of the stack |
| Camera/mic capture | Browser `getUserMedia` | Native, no SDK, works on both laptop and phone browsers |

No RAG / vector DB. Curated stop content is pasted directly into the Gemini prompt as context per request — small enough (a few hundred words per stop) that retrieval infrastructure isn't needed.

## 2. High-Level App Flow

```
[Consent screen]
      ↓
[Mode selection screen] — Kid / Student / Researcher / Audio / Visual
      ↓
[Stop selection] — manual picker (GPS auto-detect is stretch only)
      ↓
[Camera view] — back camera live feed
      ↓ (user captures frame / or auto-interval capture)
[API call] → Vercel API route → Gemini API
      input: { image_frame, selected_mode, stop_content_context }
      ↓
[Gemini response] → tailored explanation text
      ↓
   ┌─────────────┴─────────────┐
   ↓                           ↓
[Audio mode]              [Visual mode]
Gemini TTS / browser       Text/caption card
SpeechSynthesis            rendered on screen
      ↓                           ↓
   [Optional: confusion check — stretch only]
   front camera → simple engagement signal → "simplify?" prompt
```

## 3. Data Flow / API Contract

**Frontend → Vercel API route (`/api/explain`)**
```json
{
  "mode": "kid | student | researcher | audio | visual",
  "stopId": "glass-house",
  "imageBase64": "..."
}
```

**Vercel API route → Gemini API**
- Server-side only. API key never exposed to the client.
- Route fetches the stop's curated content from Firestore, builds a system prompt combining: mode instructions + stop content + the image, sends to Gemini.

**Gemini API → Vercel API route → Frontend**
```json
{
  "explanationText": "...",
  "audioUrl": "..." // if audio mode, from Gemini TTS
}
```

## 4. Folder / File Structure

```
virasetu/
├── app/
│   ├── page.tsx                  # Consent screen (entry point)
│   ├── mode-select/page.tsx      # Persona/mode selection
│   ├── stop-select/page.tsx      # Manual stop picker
│   ├── guide/page.tsx            # Camera view + live explanation UI
│   └── api/
│       └── explain/route.ts      # Server-side Gemini proxy (THE key security boundary)
├── components/
│   ├── ConsentScreen.tsx
│   ├── ModeSelector.tsx
│   ├── StopPicker.tsx
│   ├── CameraView.tsx
│   ├── ExplanationCard.tsx       # visual/text mode output
│   └── AudioPlayer.tsx           # audio mode output
├── lib/
│   ├── gemini.ts                 # Gemini API client wrapper (server-side only)
│   ├── firestore.ts              # Firestore read helpers for stop content
│   └── speech.ts                 # Web Speech API / SpeechSynthesis helpers
├── data/
│   └── stops-seed.json           # Seed content for Firestore (backup if Firestore has issues live)
├── public/
├── PRD.md
├── ARCHITECTURE.md
├── RULES.md
├── PHASES.md
└── MEMORY.md
```

## 5. Key Architectural Decisions (and why)

- **API key never touches the client.** All Gemini calls go through `/api/explain`, a Vercel serverless function. This is non-negotiable — a client-exposed key is both a security miss judges will notice and a real risk of quota abuse.
- **Single camera by default, dual-cam as bonus.** `getUserMedia` with simultaneous front+back streams is device-dependent and can silently fail. Build and demo on single camera with a front/back toggle; only add simultaneous capture if there's spare time and it's tested on the actual demo device beforehand.
- **Firestore holds content, not logic.** Keep app logic in code; keep only the editable stop scripts (voice/screen/kid/researcher versions) in Firestore, so content can be tweaked without a redeploy while you're still writing copy during the day.
- **Local JSON seed as fallback.** If Firestore has connectivity issues at the venue, `data/stops-seed.json` is a hardcoded fallback the app can read from directly — never let content be a single point of failure during judging.
- **No RAG.** Stop content is short and fixed; pasting it directly into the prompt is simpler, faster to build, and just as effective at this scale.
