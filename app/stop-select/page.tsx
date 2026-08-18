'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import stopsSeed from '@/data/stops-seed.json';

interface StopItem {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  image: string;
  description: string;
}

export default function StopSelectPage() {
  const router = useRouter();
  const { selectedStopId, setSelectedStopId, persona } = useApp();
  const [stops, setStops] = useState<StopItem[]>([]);

  useEffect(() => {
    // Read from seed JSON fallback per RULES.md Section 4
    setStops(stopsSeed);
  }, []);

  const handleSelectStop = (stopId: string) => {
    setSelectedStopId(stopId);
    router.push('/guide');
  };

  return (
    <main className="max-w-4xl mx-auto px-5 py-8 min-h-[calc(100vh-4rem)] flex flex-col justify-between">
      <div>
        <header className="mb-8 text-center md:text-left">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
            <span className="text-xs uppercase tracking-widest font-semibold text-[#c9a74d] dark:text-amber-400 block">
              Step 2 of 2
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#5B3A29]/10 text-[#5B3A29] dark:bg-indigo-950 dark:text-indigo-300 border border-[#5B3A29]/20">
              Active Persona: <strong className="capitalize">{persona}</strong>
            </span>
          </div>

          <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#5B3A29] dark:text-indigo-200 mb-2">
            Where are you standing in Lal Bagh?
          </h2>
          <p className="font-sans text-base text-[#5B3A29]/80 dark:text-slate-300">
            Select the nearest landmark or artifact to begin your AI-guided exploration.
          </p>
        </header>

        {/* Stops Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {stops.map((stop) => {
            const isSelected = selectedStopId === stop.id;
            return (
              <div
                key={stop.id}
                onClick={() => handleSelectStop(stop.id)}
                className={`group rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#F8F2EC] dark:bg-slate-800 border-[#5B3A29] dark:border-indigo-400 shadow-md ring-2 ring-[#5B3A29]/20 dark:ring-indigo-400/30'
                    : 'bg-white dark:bg-slate-900/70 border-[#5B3A29]/10 dark:border-slate-800 hover:border-[#5B3A29]/30 dark:hover:border-slate-700 shadow-sm'
                }`}
              >
                {/* Image Header */}
                <div className="h-44 w-full relative overflow-hidden bg-slate-200">
                  <img
                    src={stop.image}
                    alt={stop.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 bg-[#5B3A29]/90 text-[#FFF9F0] text-xs font-semibold px-2.5 py-1 rounded-md backdrop-blur-sm">
                    {stop.category}
                  </span>
                  {isSelected && (
                    <span className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[#5B3A29] text-white flex items-center justify-center shadow-md">
                      <span className="material-symbols-outlined text-base">check</span>
                    </span>
                  )}
                  <h3 className="absolute bottom-3 left-3 right-3 text-white font-serif font-bold text-xl drop-shadow-md">
                    {stop.name}
                  </h3>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-grow flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="font-serif text-sm font-semibold text-[#c9a74d] dark:text-amber-400 mb-1">
                      {stop.subtitle}
                    </h4>
                    <p className="font-sans text-sm text-[#5B3A29]/80 dark:text-slate-300 line-clamp-2">
                      {stop.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#5B3A29]/10 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-[#5B3A29] dark:text-indigo-300">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">location_on</span>
                      Lal Bagh Botanical Garden
                    </span>
                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Start Guide
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Direct Action */}
      <div className="mt-10 flex justify-end">
        <button
          onClick={() => handleSelectStop(selectedStopId || 'glass-house')}
          className="w-full md:w-auto px-8 h-14 rounded-full bg-[#5B3A29] dark:bg-indigo-600 text-[#FFF9F0] font-medium text-base flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md hover:bg-[#4A2E20] dark:hover:bg-indigo-700"
        >
          <span>Open Guide View</span>
          <span className="material-symbols-outlined text-xl">photo_camera</span>
        </button>
      </div>
    </main>
  );
}
