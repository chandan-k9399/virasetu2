'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useApp, PersonaType } from '@/context/AppContext';

interface PersonaCard {
  id: PersonaType;
  title: string;
  subtitle: string;
  icon: string;
  bgColor: string;
  iconColor: string;
}

const PERSONAS: PersonaCard[] = [
  {
    id: 'kid',
    title: 'Kid',
    subtitle: 'Fun stories and interactive games',
    icon: 'child_care',
    bgColor: 'bg-indigo-100 dark:bg-indigo-950',
    iconColor: 'text-indigo-600 dark:text-indigo-300',
  },
  {
    id: 'student',
    title: 'Student',
    subtitle: 'Detailed historical facts and timelines',
    icon: 'school',
    bgColor: 'bg-amber-100 dark:bg-amber-950',
    iconColor: 'text-amber-700 dark:text-amber-300',
  },
  {
    id: 'researcher',
    title: 'Researcher',
    subtitle: 'In-depth archival data and citations',
    icon: 'menu_book',
    bgColor: 'bg-purple-100 dark:bg-purple-950',
    iconColor: 'text-purple-700 dark:text-purple-300',
  },
  {
    id: 'tourist',
    title: 'Tourist',
    subtitle: 'General overview and highlights of the site',
    icon: 'explore',
    bgColor: 'bg-emerald-100 dark:bg-emerald-950',
    iconColor: 'text-emerald-700 dark:text-emerald-300',
  },
];

export default function PersonaSelectPage() {
  const router = useRouter();
  const { persona, setPersona } = useApp();

  const handleSelect = (id: PersonaType) => {
    setPersona(id);
  };

  const handleNext = () => {
    router.push('/guidance-select');
  };

  return (
    <main className="max-w-md mx-auto px-5 py-8 min-h-[calc(100vh-4rem)] flex flex-col justify-between">
      <div>
        <header className="mb-6 text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#5B3A29] dark:text-indigo-200 mb-2">
            Who&apos;s exploring today?
          </h2>
          <p className="font-sans text-sm text-[#5B3A29]/80 dark:text-slate-300 px-2">
            Select your profile to customize your heritage journey.
          </p>
        </header>

        {/* Persona List */}
        <div className="space-y-4">
          {PERSONAS.map((p) => {
            const isSelected = persona === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handleSelect(p.id)}
                className={`w-full p-5 rounded-2xl text-left transition-all duration-200 flex flex-col items-start border cursor-pointer ${
                  isSelected
                    ? 'bg-[#F8F2EC] dark:bg-slate-800 border-[#5B3A29] dark:border-indigo-400 shadow-md ring-2 ring-[#5B3A29]/20'
                    : 'bg-white/80 dark:bg-slate-900/60 border-[#5B3A29]/10 dark:border-slate-800 hover:border-[#5B3A29]/30 shadow-sm'
                }`}
              >
                <div className={`w-10 h-10 rounded-full ${p.bgColor} ${p.iconColor} flex items-center justify-center mb-3`}>
                  <span className="material-symbols-outlined text-xl icon-fill">{p.icon}</span>
                </div>
                <h3 className="font-serif font-bold text-lg text-[#5B3A29] dark:text-indigo-200 mb-1">
                  {p.title}
                </h3>
                <p className="font-sans text-xs text-[#5B3A29]/70 dark:text-slate-400">
                  {p.subtitle}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-8">
        <button
          onClick={handleNext}
          className="w-full h-14 rounded-full bg-[#4f378a] dark:bg-indigo-600 text-white font-medium text-base flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md hover:bg-[#3b286b]"
        >
          <span>Next: Choose Guidance</span>
          <span className="material-symbols-outlined text-xl">arrow_forward</span>
        </button>
      </div>
    </main>
  );
}
