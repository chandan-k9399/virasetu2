import { GoogleGenerativeAI } from '@google/generative-ai';
import stopsSeed from '@/data/stops-seed.json';

export interface ExplainParams {
  mode: 'kid' | 'student' | 'researcher' | 'audio' | 'visual';
  stopId: string;
  imageBase64?: string;
}

export async function generateHeritageExplanation(params: ExplainParams): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  // Find stop details from seed JSON
  const stop = stopsSeed.find((s) => s.id === params.stopId) || stopsSeed[0];

  const modePrompts: Record<string, string> = {
    kid: `You are Virasetu, a friendly and magical heritage guide for children visiting Lal Bagh in Bangalore.
Explain what is in the view/stop in simple, exciting, story-driven language suitable for kids aged 6-12.
Use short paragraphs, fun comparisons, and engaging wonder.`,
    student: `You are Virasetu, an educational heritage guide for students and youth visiting Lal Bagh in Bangalore.
Provide clear, structured historical facts, key timelines, and botanical insights about the stop.
Include bullet points for key facts and historical significance.`,
    researcher: `You are Virasetu, an academic heritage guide providing archival-grade depth on Lal Bagh landmarks.
Deliver detailed historical context, architectural specifics, botanical classifications, and archival references.
Maintain a precise, scholarly tone with deep factual accuracy.`,
    audio: `You are Virasetu, a spoken-audio companion guiding visitors at Lal Bagh in Bangalore.
Provide a warm, immersive, spoken-style narration script intended to be read aloud via audio.
Use natural conversational pauses, descriptive oral imagery, and clear verbal cues without bullet points or symbols.`,
    visual: `You are Virasetu, a visual-first heritage guide for visitors who prefer reading concise visual text.
Provide short, high-contrast, caption-friendly summaries formatted with clear headers and bullet points.
Focus on key visual features and immediate bullet points.`,
  };

  const selectedModePrompt = modePrompts[params.mode] || modePrompts.student;

  const promptText = `${selectedModePrompt}

Current Location / Landmark Details:
- Name: ${stop.name}
- Category: ${stop.category}
- Subtitle: ${stop.subtitle}
- Context & History: ${stop.description}
- Historical Facts: ${stop.historicalFacts.join('; ')}
- Botanical / Geological Notes: ${stop.botanicalNotes}

Instructions:
Examine the image provided (if available) alongside the landmark details above. Ground your response in what is visible in the landmark and explain its heritage significance according to the requested persona style. Return ONLY the final explanation response.`;

  if (!apiKey) {
    // Fallback mode if API key is not configured locally yet
    console.warn('GEMINI_API_KEY environment variable is not defined on server. Returning offline seed explanation.');
    return `[Virasetu ${params.mode.toUpperCase()} Mode] ${stop.name} (${stop.subtitle}): ${stop.description} Historical context: ${stop.historicalFacts.join(' ')}`;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    if (params.imageBase64 && params.imageBase64.includes('base64,')) {
      const base64Data = params.imageBase64.split('base64,')[1];
      const mimeType = params.imageBase64.split(';')[0].split(':')[1] || 'image/jpeg';

      const result = await model.generateContent([
        promptText,
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        },
      ]);
      const response = await result.response;
      return response.text();
    } else {
      const result = await model.generateContent(promptText);
      const response = await result.response;
      return response.text();
    }
  } catch (error: any) {
    console.error('Gemini API call error:', error?.message || 'Unknown error');
    // Return structured graceful fallback text instead of throwing
    return `[Virasetu Heritage Guide — ${stop.name}] ${stop.description} (${stop.subtitle}). Historical highlights: ${stop.historicalFacts[0]}`;
  }
}
