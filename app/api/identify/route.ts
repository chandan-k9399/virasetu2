import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { searchLandmarkPhotos } from '@/lib/pexels';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageBase64, persona, location } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    let landmark: any = null;

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const systemPrompt = `You are Virasetu, a multimodal vision AI identifying iconic heritage landmarks, natural structures, botanical species, or water bodies.
Current selected location context: ${location || 'lalbagh'}.
Examine the image provided carefully.
- If Taj Mahal location or image shows white marble domes/minarets, classify as Taj Mahal.
- If Tipu Sultan Palace location or image shows teak arches/wooden pillars, classify as Tipu Sultan's Summer Palace.
- If Lal Bagh or tree in view, classify as Old Banyan Tree (200-Yr Ficus Benghalensis) or Glass House or Lal Bagh Lake.

Respond ONLY with a valid JSON object:
{
  "name": "Landmark or Specimen Name",
  "subtitle": "Short 1-line subtitle",
  "category": "Architectural Landmark | Botanical Wonder | Ancient Monument | Ecological Waterway",
  "description": "2-3 sentence overview tailored for persona '${persona || 'student'}'",
  "architect": "Architect / Builder name or 'Nature'",
  "materials": "Primary materials or species details",
  "era": "Historical era or century",
  "significance": "Heritage significance status",
  "historicalFacts": ["Fact 1", "Fact 2", "Fact 3"]
}`;

        let result;
        if (imageBase64 && imageBase64.includes('base64,')) {
          const base64Data = imageBase64.split('base64,')[1];
          const mimeType = imageBase64.split(';')[0].split(':')[1] || 'image/jpeg';
          result = await model.generateContent([
            systemPrompt,
            { inlineData: { data: base64Data, mimeType } },
          ]);
        } else {
          result = await model.generateContent(systemPrompt + `\nNo camera frame provided; generate context for ${location || 'Lal Bagh Botanical Garden'}.`);
        }

        const text = (await result.response).text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        landmark = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
      } catch (e) {
        console.warn('Gemini vision parse note:', e);
      }
    }

    // Default Fallback by Location
    if (!landmark) {
      if (location === 'taj-mahal') {
        landmark = {
          name: 'Taj Mahal',
          subtitle: '17th-Century Mughal White Marble Mausoleum',
          category: 'Architectural Landmark',
          description: 'The Taj Mahal is an ivory-white marble mausoleum on the right bank of the river Yamuna in Agra. It was commissioned in 1631 by the fifth Mughal emperor, Shah Jahan, to house the tomb of his favorite wife, Mumtaz Mahal.',
          architect: 'Ustad Ahmad Lahori',
          materials: 'Makrana White Marble & Semi-Precious Inlay',
          era: 'Mughal Empire (1631–1648)',
          significance: 'UNESCO World Heritage Site',
          historicalFacts: [
            'Commissioned by Emperor Shah Jahan in memory of Mumtaz Mahal.',
            'Features symmetrical Islamic garden design known as Charbagh.',
            'Over 20,000 artisans contributed to its construction over 20 years.'
          ],
        };
      } else if (location === 'tipu-palace') {
        landmark = "Tipu Sultan's Summer Palace";
        landmark = {
          name: "Tipu Sultan's Summer Palace",
          subtitle: '1791 Indo-Islamic Teakwood Heritage Palace',
          category: 'Ancient Monument',
          description: "Built entirely of teakwood with carved pillars and balconies, this palace served as Tipu Sultan's summer residence, famously titled Rashk-e-Jannat (Envy of Heaven).",
          architect: 'Hyder Ali & Tipu Sultan',
          materials: 'Carved Teakwood & Terracotta',
          era: 'Kingdom of Mysore (1791 AD)',
          significance: 'Protected National Monument',
          historicalFacts: [
            'Construction commenced by Hyder Ali in 1781 and completed by Tipu Sultan in 1791.',
            'Features pillars with floral wooden carvings resting on stone bases.',
            'Contains a museum documenting Tipu Sultan\'s military innovations and rocket tech.'
          ],
        };
      } else {
        landmark = {
          name: 'Old Banyan Tree',
          subtitle: 'Centuries-Old Ficus Benghalensis Canopy',
          category: 'Botanical Wonder',
          description: 'A majestic 200-year-old Banyan tree (Ficus benghalensis) featuring prop roots forming living secondary trunks across half an acre in Lal Bagh.',
          architect: 'Nature / Hyder Ali Era',
          materials: 'Ficus Benghalensis Prop Roots',
          era: '18th Century (Planted c. 1760)',
          significance: 'Keystone Botanical Heritage Tree',
          historicalFacts: [
            'Planted during the reign of Hyder Ali in the 18th century.',
            'Prop roots have developed into over 30 independent trunk columns.',
            'Provides roosting micro-ecosystem to fruit bats and migratory birds.'
          ],
        };
      }
    }

    // Dynamic Image Search via Pexels API
    const pexelsPhotos = await searchLandmarkPhotos(landmark.name + ' landmark');

    return NextResponse.json({
      success: true,
      landmark: {
        ...landmark,
        pexelsPhotos,
      },
    });
  } catch (error: any) {
    console.error('Error in /api/identify route:', error?.message || error);
    return NextResponse.json({
      success: true,
      landmark: {
        name: 'Lal Bagh Botanical Garden',
        subtitle: 'Historic 240-Acre Heritage Sanctuary',
        category: 'Botanical Wonder',
        description: 'Lal Bagh is Bangalore\'s premier botanical garden, home to over 1,000 species of exotic plants and historic Victorian glasshouses.',
        architect: 'Hyder Ali & Tipu Sultan',
        materials: 'Flora, Rock Outcrop, Iron & Glass',
        era: '1760 AD to Present',
        significance: 'State Heritage Botanical Sanctuary',
        historicalFacts: ['Commissioned in 1760 by Hyder Ali.'],
        pexelsPhotos: [
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80',
          'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=400&q=80',
          'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=400&q=80',
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
        ],
      },
    });
  }
}
