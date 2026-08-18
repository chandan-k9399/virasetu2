# PHASES.md — Virasetu

Mapped to the actual INHack schedule (8 AM – 8 PM). Three people — assume rough roles: **Person A** (AI/backend — Gemini integration, API routes), **Person B** (frontend — screens, camera UI, state flow), **Person C** (content + pitch — stop scripts, consent/mode copy, demo script, deck). Roles blend at the edges; adjust freely, but someone should own content/pitch from hour 1, not just at the end.

---

## Phase 0 — Setup (8:00 – 9:00 AM)
*Check-in, Adidvara demo, challenge briefing overlap this window — use spare minutes here.*

- Repo created, Next.js + Vercel project scaffolded and deployed once (even a blank page) to confirm the pipeline works end-to-end early.
- Gemini API key obtained, tested with a single curl/script call outside the app.
- Firebase project created, Firestore initialized.
- Confirm final stop list (aim for 4–6 Lal Bagh stops) — lock this now, not later.

**Exit condition:** empty app deployed on Vercel, Gemini key confirmed working, stop list locked.

---

## Phase 1 — Core Loop (9:00 AM – 12:00 PM)
*"Work on the first prototype" per the schedule.*

- Person A: build `/api/explain` route — accepts image + mode + stopId, calls Gemini, returns explanation text. Test with a hardcoded stop first.
- Person B: build camera view (`getUserMedia`, back camera only, single-camera default), wire it to call the API route and display the raw response as text.
- Person C: write full content (voice-mode + screen-mode + kid + researcher versions) for at least 2 stops — the ones you'll demo first.

**Exit condition:** point the camera at something, get a real Gemini-generated explanation back on screen, for at least one stop. This is your riskiest technical piece — do not move on until this works.

---

## Phase 2 — Persona & Consent Flow (12:00 – 2:30 PM)
*Lunch is working/optional — plan to keep moving through it.*

- Person B: build consent screen, mode-selection screen (Kid/Student/Researcher/Audio/Visual), stop-picker screen. Wire the full flow: consent → mode → stop → camera.
- Person A: extend `/api/explain` to actually vary explanation style by mode (prompt engineering — this is where "kid" vs "researcher" tone differences get built).
- Person C: finish content for remaining stops (target all 4–6 done by end of this phase). Write the demo script (who plays the volunteer, what gets shown, in what order).

**Exit condition:** full flow works end-to-end for at least 2 stops, in both audio and visual mode.

---

## Phase 3 — Polish & Reliability (2:30 – 4:00 PM)
*Before first-stage judging at 4:30.*

- Fix error states: failed API calls, camera permission denial, Firestore fallback to seed JSON.
- Visual polish pass — consistent styling (Tailwind), make sure it doesn't look like a wireframe.
- Test on the actual device(s) you'll demo with — not just localhost on a laptop.
- Person C: rehearse the pitch once, out loud, with the actual app.

**Exit condition:** app is demo-stable — no crashes, no undefined states, works on the real demo device.

---

## Phase 4 — First-Stage Presentation (4:30 – 5:30 PM)

- Present what's built. Be explicit about scope: what's fully working (2 disability modes + kid/researcher, one location, 4–6 stops) vs. roadmap (more disability modes, more locations, headphone hardware).
- Note feedback from judges — anything they push on becomes priority for Phase 5.

---

## Phase 5 — Stretch Features (6:00 – 7:00 PM)
*Only after Phase 3's exit condition is genuinely met. Do not start stretch work with an unstable core.*

Priority order if time allows:
1. Confusion-detection nudge (front camera, "simplify?" only — never identity inference)
2. Nicer TTS (ElevenLabs) for one hero stop, with fallback intact
3. Simultaneous dual-camera, tested specifically on the demo device
4. GPS-based auto stop-detection

**Rule:** each stretch feature must not break the Phase 3 exit condition. If a stretch feature makes the core loop less reliable, cut it before final judging, not during.

---

## Phase 6 — Final Presentation Prep (7:00 – 8:00 PM)

- Final rehearsal of the live demo — camera loop, both modes, consent flow.
- Confirm the "what's next" roadmap slide (other disability modes, other locations, headphones) is ready — this is where Scalability & Sustainability (15%) gets scored.
- Confirm at least one teammate can answer "how does the AI pipeline work" and "how did you use AI to build this" without hesitation.
