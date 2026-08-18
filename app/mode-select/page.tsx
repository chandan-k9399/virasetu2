'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useApp, PersonaType } from '@/context/AppContext';

interface PersonaCard {
  id: PersonaType;
  title: string;
  subtitle: string;
  icon: string;
  bg: string;
  iconColor: string;
}

const PERSONAS: PersonaCard[] = [
  { id: 'kid', title: 'Kid', subtitle: 'Fun stories and interactive exploration', icon: 'child_care', bg: '#EEF2FF', iconColor: '#4f46e5' },
  { id: 'student', title: 'Student', subtitle: 'Historical facts, timelines and data', icon: 'school', bg: '#FEF3C7', iconColor: '#d97706' },
  { id: 'researcher', title: 'Researcher', subtitle: 'Archival depth, citations, and analysis', icon: 'menu_book', bg: '#F5F3FF', iconColor: '#7c3aed' },
  { id: 'tourist', title: 'Tourist', subtitle: 'Highlights, overview and quick facts', icon: 'explore', bg: '#ECFDF5', iconColor: '#059669' },
];

export default function PersonaSelectPage() {
  const router = useRouter();
  const { persona, setPersona } = useApp();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FFF9F0' }}>
      <main className="max-w-md mx-auto px-5 py-8 flex flex-col justify-between" style={{ minHeight: 'calc(100vh - 4rem)' }}>
        <div>
          {/* Header */}
          <div style={{ marginBottom: '32px', textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'Newsreader, serif', fontSize: '28px', fontWeight: 700, color: '#3d2b1a', marginBottom: '8px', lineHeight: 1.2 }}>
              Who&apos;s exploring today?
            </h2>
            <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', color: '#5B3A29', opacity: 0.75 }}>
              Select your profile to customize your heritage journey.
            </p>
          </div>

          {/* Persona Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {PERSONAS.map((p) => {
              const isSelected = persona === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setPersona(p.id)}
                  style={{
                    width: '100%',
                    padding: '18px',
                    borderRadius: '18px',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    border: isSelected ? '2px solid #5B3A29' : '2px solid rgba(91,58,41,0.12)',
                    backgroundColor: isSelected ? '#F8F2EC' : '#ffffff',
                    boxShadow: isSelected ? '0 4px 16px rgba(91,58,41,0.12)' : '0 1px 4px rgba(0,0,0,0.06)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                  }}
                >
                  <div style={{ width: '46px', height: '46px', borderRadius: '50%', backgroundColor: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span className="material-symbols-outlined icon-fill" style={{ fontSize: '22px', color: p.iconColor }}>{p.icon}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontFamily: 'Newsreader, serif', fontWeight: 700, fontSize: '18px', color: '#3d2b1a', marginBottom: '3px' }}>{p.title}</h3>
                    <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12px', color: '#5B3A29', opacity: 0.7 }}>{p.subtitle}</p>
                  </div>
                  {isSelected && (
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#5B3A29', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '13px', color: '#fff' }}>check</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Button */}
        <div style={{ marginTop: '32px' }}>
          <button
            onClick={() => router.push('/guidance-select')}
            style={{
              width: '100%', height: '56px', backgroundColor: '#4f378a', color: '#ffffff',
              borderRadius: '100px', fontFamily: 'Manrope, sans-serif', fontSize: '14px',
              fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: '0 4px 16px rgba(79,55,138,0.35)',
            }}
          >
            <span>Next: Choose Guidance</span>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
          </button>
        </div>
      </main>
    </div>
  );
}
