import { NextRequest, NextResponse } from 'next/server';
import { generateHeritageExplanation, ExplainParams } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mode, stopId, imageBase64 } = body as ExplainParams;

    if (!mode || !stopId) {
      return NextResponse.json(
        { error: 'Missing required parameters: mode and stopId' },
        { status: 400 }
      );
    }

    const explanationText = await generateHeritageExplanation({
      mode,
      stopId,
      imageBase64,
    });

    return NextResponse.json({
      success: true,
      explanationText,
      mode,
      stopId,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error in /api/explain route:', error?.message || error);
    return NextResponse.json(
      {
        error: 'Failed to generate explanation',
        message: error?.message || 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
