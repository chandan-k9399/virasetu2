'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useApp, GuidanceType } from '@/context/AppContext';

interface GuidanceOption {
  id: GuidanceType;
  title: string;
  subtitle: string;
  icon: string;
  accentColor: string;
}

const GUIDANCE_OPTIONS: GuidanceOption[] = [
  {
    id: 'audio',
    title: 'Audio Guidance',
    subtitle: 'Immersive narrated walking tours. Listen as the AI describes what you see.',
    icon: 'headphones',
    accentColor: '#c9a74d',
  },
  {
    id: 'visual',
    title: 'Visual / Text Guidance',
    subtitle: 'Read at your own pace with rich imagery, historical metadata, and live photo search.',
    icon: 'menu_book',
    accentColor: '#4f378a',
  },
  {
    id: 'both',
    title: 'Both — Audio & Visual',
    subtitle: 'Combined audio narration with visual card layout and historical reference photos.',
    icon: 'spatial_audio_off',
    accentColor: '#5B3A29',
  },
];

export default function GuidanceSelectPage() {
  const router = useRouter();
  const { guidanceType, setGuidanceType } = useApp();

  const handleSelect = (id: GuidanceType) => {
    setGuidanceType(id);
  };

  const handleContinue = () => {
    router.push('/location-select');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FFF9F0' }}>
      <main className="max-w-md mx-auto px-5 py-8 flex flex-col justify-between" style={{ minHeight: 'calc(100vh - 4rem)' }}>
        <div>
          {/* Header */}
          <div className="mb-8">
            <span style={{ color: '#c9a74d', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
              Step 2 of 3
            </span>
            <h2 style={{ fontFamily: 'Newsreader, serif', fontSize: '28px', fontWeight: 700, color: '#3d2b1a', marginBottom: '8px', lineHeight: 1.2 }}>
              How would you like to be guided?
            </h2>
            <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', color: '#5B3A29', opacity: 0.75, lineHeight: 1.6 }}>
              Choose your preferred way to experience heritage sites.
            </p>
          </div>

          {/* Guidance Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {GUIDANCE_OPTIONS.map((g) => {
              const isSelected = guidanceType === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => handleSelect(g.id)}
                  style={{
                    width: '100%',
                    padding: '18px',
                    borderRadius: '18px',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    border: isSelected ? `2px solid ${g.accentColor}` : '2px solid rgba(91,58,41,0.12)',
                    backgroundColor: isSelected ? 'rgba(201,167,77,0.08)' : '#ffffff',
                    boxShadow: isSelected ? `0 4px 16px rgba(91,58,41,0.12)` : '0 1px 4px rgba(0,0,0,0.06)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                  }}
                >
                  {/* Icon Circle */}
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: isSelected ? g.accentColor : '#F8F2EC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <span className="material-symbols-outlined icon-fill" style={{
                      fontSize: '22px',
                      color: isSelected ? '#fff' : '#5B3A29',
                    }}>
                      {g.icon}
                    </span>
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontFamily: 'Newsreader, serif', fontWeight: 700, fontSize: '17px', color: '#3d2b1a', marginBottom: '4px' }}>
                      {g.title}
                    </h3>
                    <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12px', color: '#5B3A29', opacity: 0.75, lineHeight: 1.5 }}>
                      {g.subtitle}
                    </p>
                  </div>

                  {/* Check circle */}
                  <div style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    border: `2px solid ${isSelected ? g.accentColor : '#d6c4b0'}`,
                    backgroundColor: isSelected ? g.accentColor : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}>
                    {isSelected && (
                      <span className="material-symbols-outlined" style={{ fontSize: '13px', color: '#fff', fontVariationSettings: "'FILL' 1" }}>check</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Button */}
        <div style={{ marginTop: '32px' }}>
          <button
            onClick={handleContinue}
            style={{
              width: '100%',
              height: '56px',
              backgroundColor: '#3d2b1a',
              color: '#c9a74d',
              borderRadius: '100px',
              fontFamily: 'Manrope, sans-serif',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 16px rgba(61,43,26,0.25)',
              transition: 'background-color 0.2s',
            }}
          >
            <span>Continue to Location</span>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
          </button>
        </div>
      </main>
    </div>
  );
}
