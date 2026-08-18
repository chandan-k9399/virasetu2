'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';

export const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme, setPersona, setSelectedStopId, setHasConsented } = useApp();

  // '/mode-select' is the real first screen of the flow (root '/' redirects here).
  const isHome = pathname === '/mode-select';

  const handleBack = () => {
    if (pathname === '/guidance-select') {
      router.push('/mode-select');
    } else if (pathname === '/location-select') {
      router.push('/guidance-select');
    } else if (pathname === '/consent') {
      router.push('/location-select');
    } else if (pathname === '/guide') {
      router.push('/consent');
    } else {
      router.back();
    }
  };

  const handleResetDemo = () => {
    setPersona('student');
    setSelectedStopId('glass-house');
    setHasConsented(false);
    router.push('/mode-select');
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-8 h-16 bg-[#FFF9F0] dark:bg-slate-900 border-b border-[#5B3A29]/10 dark:border-slate-800 transition-colors">
      {!isHome ? (
        <button
          onClick={handleBack}
          aria-label="Go back"
          className="w-10 h-10 flex items-center justify-center text-[#5B3A29] dark:text-indigo-300 hover:bg-[#5B3A29]/10 rounded-full transition-colors active:scale-95"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
      ) : (
        <div className="w-10" />
      )}

      <h1
        className="font-serif text-2xl font-bold tracking-tight text-[#5B3A29] dark:text-indigo-300 absolute left-1/2 -translate-x-1/2 cursor-pointer flex items-center gap-1.5"
        onClick={() => router.push('/mode-select')}
      >
        <span className="material-symbols-outlined text-xl text-[#c9a74d]">account_balance</span>
        VIRASETU
      </h1>

      <div className="flex items-center gap-1">
        {/* Quick Reset Button for Hackathon Live Demo */}
        <button
          onClick={handleResetDemo}
          aria-label="Reset Demo"
          title="Reset flow for new demo"
          className="w-10 h-10 flex items-center justify-center text-[#5B3A29]/70 dark:text-slate-400 hover:bg-[#5B3A29]/10 rounded-full transition-colors active:scale-95 text-xs"
        >
          <span className="material-symbols-outlined text-xl">restart_alt</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          title={`Current mode: ${theme}. Click to switch.`}
          className="w-10 h-10 flex items-center justify-center text-[#5B3A29] dark:text-indigo-300 hover:bg-[#5B3A29]/10 rounded-full transition-colors active:scale-95"
        >
          <span className="material-symbols-outlined text-xl">contrast</span>
        </button>
      </div>
    </header>
  );
};
