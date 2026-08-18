'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useApp, GuidanceType } from '@/context/AppContext';

interface GuidanceOption {
  id: GuidanceType;
  title: string;
  subtitle: string;
  icon: string;
}

const GUIDANCE_OPTIONS: GuidanceOption[] = [
  {
    id: 'audio',
    title: 'Audio Guidance',
    subtitle: 'Immersive narrated walking tours.',
    icon: 'headphones',
  },
  {
    id: 'visual',
    title: 'Visual/Text Guidance',
    subtitle: 'Read at your own pace with rich imagery and maps.',
    icon: 'menu_book',
  },
  {
    id: 'both',
    title: 'Both (Audio & Visual)',
    subtitle: 'Combined audio narration with visual aids and text.',
    icon: 'mic',
  },
];

export default function GuidanceSelectPage() {
  const router = useRouter();
  const { guidanceType, setGuidanceType } = useApp();

  const handleSelect = (id: GuidanceType) => {
    setGuidanceType(id);
  };

  const handleContinue = () => {
    router.push('/');
  };

  return (
    <main className="max-w-md mx-auto px-5 py-8 min-h-[calc(100vh-4rem)] flex flex-col justify-between">
      <div>
        <header className="mb-6 text-left">
          <span className="font-sans text-xs uppercase tracking-widest font-semibold text-[#c9a74d] dark:text-amber-400 block mb-1">
            Step 2 of 2
          </span>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#4a3b22] dark:text-indigo-200 mb-2">
            How would you like to be guided?
          </h2>
          <p className="font-sans text-sm text-[#4a3b22]/80 dark:text-slate-300">
            Choose your preferred way to receive information and navigate through the heritage sites.
          </p>
        </header>

        {/* Guidance Cards */}
        <div className="space-y-4">
          {GUIDANCE_OPTIONS.map((g) => {
            const isSelected = guidanceType === g.id;
            return (
              <button
                key={g.id}
                onClick={() => handleSelect(g.id)}
                className={`w-full p-5 rounded-2xl text-left transition-all duration-200 flex items-start gap-4 border cursor-pointer ${
                  isSelected
                    ? 'bg-[#f5eedf] dark:bg-slate-800 border-[#c9a74d] shadow-md'
                    : 'bg-white dark:bg-slate-900/60 border-transparent shadow-sm hover:bg-slate-50'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-[#f5eedf] dark:bg-slate-800 text-[#4a3b22] dark:text-indigo-300 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined icon-fill text-2xl">{g.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-serif font-bold text-lg text-[#4a3b22] dark:text-indigo-200 mb-1">
                    {g.title}
                  </h3>
                  <p className="font-sans text-xs text-[#4a3b22]/80 dark:text-slate-400">
                    {g.subtitle}
                  </p>
                </div>
                <div className="w-6 h-6 rounded-full border-2 border-[#c9a74d] flex items-center justify-center shrink-0 mt-1">
                  {isSelected && (
                    <span className="material-symbols-outlined text-sm text-[#c9a74d]">check</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-8">
        <button
          onClick={handleContinue}
          className="w-full h-14 bg-[#4a3b22] dark:bg-indigo-600 text-[#c9a74d] dark:text-white rounded-full font-sans text-sm font-semibold uppercase tracking-widest shadow-md hover:bg-[#382d1a] transition-colors flex items-center justify-center gap-2"
        >
          <span>Continue to Site</span>
          <span className="material-symbols-outlined text-xl">arrow_forward</span>
        </button>
      </div>
    </main>
  );
}
