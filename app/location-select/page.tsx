'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useApp, LocationType } from '@/context/AppContext';

interface LocationCard {
  id: LocationType | 'other';
  name: string;
  city: string;
  description: string;
  image: string;
  highlights: string[];
  isComingSoon?: boolean;
}

const LOCATIONS: LocationCard[] = [
  {
    id: 'lalbagh',
    name: 'Lal Bagh Botanical Garden',
    city: 'Bengaluru, Karnataka',
    description: '240-acre heritage sanctuary with Glass House, 200-yr Banyan Tree, and scenic lake.',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
    highlights: ['Glass House', '200-yr Banyan Tree', 'Lotus Lake', 'Kempegowda Tower'],
  },
  {
    id: 'taj-mahal',
    name: 'Taj Mahal',
    city: 'Agra, Uttar Pradesh',
    description: 'UNESCO World Heritage 17th-century white marble mausoleum by Shah Jahan.',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80',
    highlights: ['Main Dome', 'Charbagh Gardens', 'Marble Inlay Art'],
  },
  {
    id: 'tipu-palace',
    name: "Tipu Sultan's Summer Palace",
    city: 'Bengaluru, Karnataka',
    description: '1791 Indo-Islamic teakwood palace titled Rashk-e-Jannat (Envy of Heaven).',
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80',
    highlights: ['Teak Pillars', 'Zenana Quarters', 'Palace Museum'],
  },
  {
    id: 'other',
    name: 'More Heritage Sites',
    city: 'India & Worldwide',
    description: 'Hampi Monuments, Mysore Palace, and Ajanta Caves — coming soon.',
    image: 'https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?auto=format&fit=crop&w=600&q=80',
    highlights: ['Hampi', 'Mysore Palace', 'Ajanta Caves'],
    isComingSoon: true,
  },
];

export default function LocationSelectPage() {
  const router = useRouter();
  const { selectedLocation, setSelectedLocation } = useApp();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FFF9F0' }}>
      <main className="max-w-xl mx-auto px-5 py-8 flex flex-col justify-between" style={{ minHeight: 'calc(100vh - 4rem)' }}>
        <div>
          {/* Header */}
          <div style={{ marginBottom: '24px' }}>
            <span style={{ color: '#c9a74d', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
              Step 3 of 3
            </span>
            <h2 style={{ fontFamily: 'Newsreader, serif', fontSize: '28px', fontWeight: 700, color: '#3d2b1a', marginBottom: '6px', lineHeight: 1.2 }}>
              Choose a Heritage Location
            </h2>
            <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', color: '#5B3A29', opacity: 0.75 }}>
              Select the site you are visiting for live AI guided experience.
            </p>
          </div>

          {/* Location Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {LOCATIONS.map((loc) => {
              const isSelected = selectedLocation === loc.id;
              return (
                <div
                  key={loc.id}
                  onClick={() => { if (!loc.isComingSoon) setSelectedLocation(loc.id as LocationType); }}
                  style={{
                    borderRadius: '20px',
                    overflow: 'hidden',
                    border: loc.isComingSoon ? '2px dashed #d6c4b0' : isSelected ? '2px solid #c9a74d' : '2px solid rgba(91,58,41,0.12)',
                    backgroundColor: loc.isComingSoon ? '#f5f0eb' : isSelected ? '#fdf7ec' : '#ffffff',
                    boxShadow: isSelected ? '0 4px 20px rgba(201,167,77,0.2)' : '0 1px 6px rgba(0,0,0,0.06)',
                    cursor: loc.isComingSoon ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    opacity: loc.isComingSoon ? 0.82 : 1,
                    transition: 'all 0.2s ease',
                  }}
                >
                  {/* Thumbnail */}
                  <div style={{ width: '120px', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
                    <img src={loc.image} alt={loc.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    {loc.isComingSoon && (
                      <div style={{ position: 'absolute', top: '8px', left: '8px', backgroundColor: '#c9a74d', color: '#503d00', fontWeight: 800, fontSize: '9px', padding: '3px 8px', borderRadius: '100px', letterSpacing: '0.08em' }}>
                        COMING SOON
                      </div>
                    )}
                    {isSelected && !loc.isComingSoon && (
                      <div style={{ position: 'absolute', top: '8px', right: '8px', width: '24px', height: '24px', backgroundColor: '#3d2b1a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#c9a74d' }}>check</span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div style={{ padding: '14px 16px', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
                      <h3 style={{ fontFamily: 'Newsreader, serif', fontWeight: 700, fontSize: '16px', color: '#3d2b1a', lineHeight: 1.2 }}>
                        {loc.name}
                      </h3>
                    </div>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, color: '#c9a74d', marginBottom: '6px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>location_on</span>
                      {loc.city}
                    </span>
                    <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11.5px', color: '#5B3A29', opacity: 0.8, lineHeight: 1.5, marginBottom: '10px' }}>
                      {loc.description}
                    </p>
                    {/* Highlight Pills */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {loc.highlights.map((h) => (
                        <span key={h} style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '6px', backgroundColor: 'rgba(91,58,41,0.07)', color: '#5B3A29', fontWeight: 600 }}>
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '28px' }}>
          <button
            onClick={() => router.push('/')}
            style={{
              width: '100%', height: '56px', backgroundColor: '#3d2b1a', color: '#c9a74d',
              borderRadius: '100px', fontFamily: 'Manrope, sans-serif', fontSize: '13px',
              fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
              border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '8px', boxShadow: '0 4px 16px rgba(61,43,26,0.25)',
            }}
          >
            <span>Continue to Consent</span>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
          </button>
        </div>
      </main>
    </div>
  );
}
