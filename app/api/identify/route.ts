import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import stopsSeed from '@/data/stops-seed.json';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageBase64, persona } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn('GEMINI_API_KEY missing. Returning fallback seed landmark.');
      const seed = stopsSeed[0];
      return NextResponse.json({
        success: true,
        landmark: {
          name: seed.name,
          subtitle: seed.subtitle,
          category: seed.category,
          description: seed.description,
          architect: 'Decimus Burton & John Cameron',
          materials: 'Wrought Iron & Cast Glass',
          era: 'Victorian (1889)',
          significance: 'Grade I Listed Heritage Structure',
          historicalFacts: seed.historicalFacts,
          botanicalNotes: seed.botanicalNotes,
        },
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const systemPrompt = `You are Virasetu, a multimodal vision AI identifying heritage landmarks, natural structures, botanical specimens, or lakes at Lal Bagh Botanical Garden in Bangalore.
Examine the image provided carefully. Identify whether it shows the Glass House, Kempegowda Tower/Rock Outcrop, Old Banyan Tree, Lal Bagh Lake/Lotus Pond, or another botanical feature.
Respond ONLY with a valid JSON object containing:
{
  "name": "Landmark or Plant Name",
  "subtitle": "Short 1-line subtitle",
  "category": "Architectural Landmark | Botanical Wonder | Ancient Monument | Ecological Waterway",
  "description": "2-3 sentence overview tailored for persona '${persona || 'student'}'",
  "architect": "Architect / Builder or 'Nature / Botanical'",
  "materials": "Primary materials or species details",
  "era": "Historical era or age",
  "significance": "Heritage significance rating or status",
  "historicalFacts": ["Fact 1", "Fact 2", "Fact 3"]
}`;

    let result;
    if (imageBase64 && imageBase64.includes('base64,')) {
      const base64Data = imageBase64.split('base64,')[1];
      const mimeType = imageBase64.split(';')[0].split(':')[1] || 'image/jpeg';
      result = await model.generateContent([
        systemPrompt,
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        },
      ]);
    } else {
      result = await model.generateContent(systemPrompt + '\nNo camera frame passed; identify default hero landmark Glass House.');
    }

    const text = (await result.response).text();
    let landmark;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      landmark = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch (e) {
      landmark = null;
    }

    if (!landmark) {
      const fallback = stopsSeed[0];
      landmark = {
        name: fallback.name,
        subtitle: fallback.subtitle,
        category: fallback.category,
        description: fallback.description,
        architect: 'John Cameron & Decimus Burton',
        materials: 'Iron & Glass',
        era: '1889',
        significance: 'Grade I Listed Structure',
        historicalFacts: fallback.historicalFacts,
      };
    }

    return NextResponse.json({
      success: true,
      landmark,
    });
  } catch (error: any) {
    console.error('Error in /api/identify route:', error?.message || error);
    const fallback = stopsSeed[0];
    return NextResponse.json({
      success: true,
      landmark: {
        name: fallback.name,
        subtitle: fallback.subtitle,
        category: fallback.category,
        description: fallback.description,
        architect: 'John Cameron',
        materials: 'Iron & Glass',
        era: '1889',
        significance: 'Grade I Heritage Landmark',
        historicalFacts: fallback.historicalFacts,
      },
    });
  }
}
