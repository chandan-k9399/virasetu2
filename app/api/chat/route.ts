import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, landmarkContext, persona, history } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!message) {
      return NextResponse.json({ error: 'Missing question message' }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json({
        success: true,
        reply: `Virasetu AI (${persona || 'Student'} Mode): Great question about ${landmarkContext?.name || 'this landmark'}! This heritage site is a key attraction in Lal Bagh known for its rich botanical history and cultural significance.`,
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const promptText = `You are Virasetu, an expert heritage guide AI for Lal Bagh in Bangalore.
Current Landmark Context:
- Landmark: ${landmarkContext?.name || 'Lal Bagh Landmark'}
- Subtitle: ${landmarkContext?.subtitle || ''}
- History & Facts: ${landmarkContext?.description || ''} ${landmarkContext?.historicalFacts?.join(' ') || ''}

User Persona Mode: ${persona || 'student'}
Instructions:
Answer the user's question directly, accurately, and concisely (2-4 sentences max) grounded in this landmark's real history and botanical context.

Conversation History:
${(history || []).map((h: any) => `${h.role}: ${h.content}`).join('\n')}

User Question: ${message}`;

    const result = await model.generateContent(promptText);
    const reply = (await result.response).text();

    return NextResponse.json({
      success: true,
      reply,
    });
  } catch (error: any) {
    console.error('Error in /api/chat route:', error?.message || error);
    return NextResponse.json({
      success: true,
      reply: 'Virasetu AI: That is an intriguing question about this landmark! It played an important role in Bangalore\'s ecological and cultural history.',
    });
  }
}
