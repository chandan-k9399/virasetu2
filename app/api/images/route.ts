import { NextRequest, NextResponse } from 'next/server';
import { searchLandmarkPhotos } from '@/lib/pexels';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body;

    const images = await searchLandmarkPhotos(query || 'Lal Bagh Botanical Garden');

    return NextResponse.json({
      success: true,
      images,
    });
  } catch (error: any) {
    console.error('Error in /api/images route:', error?.message || error);
    return NextResponse.json({
      success: true,
      images: [
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
      ],
    });
  }
}
