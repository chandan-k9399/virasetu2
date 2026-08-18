export interface PexelsPhoto {
  id: number;
  url: string;
  src: {
    medium: string;
    large: string;
    original: string;
  };
  alt: string;
}

export async function searchLandmarkPhotos(query: string): Promise<string[]> {
  const apiKey = process.env.PEXELS_API_KEY;

  if (!apiKey) {
    console.warn('PEXELS_API_KEY missing. Returning fallback reference images.');
    return [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
    ];
  }

  try {
    const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=4`, {
      headers: {
        Authorization: apiKey,
      },
    });

    if (!res.ok) {
      throw new Error(`Pexels API error status ${res.status}`);
    }

    const data = await res.json();
    if (data.photos && data.photos.length > 0) {
      return data.photos.map((p: PexelsPhoto) => p.src.medium || p.src.large);
    }
  } catch (err: any) {
    console.error('Error fetching Pexels photos:', err?.message || err);
  }

  // Fallback defaults
  return [
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
  ];
}
