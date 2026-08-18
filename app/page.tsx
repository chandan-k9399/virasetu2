'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

export default function ConsentPage() {
  const router = useRouter();
  const { setHasConsented } = useApp();
  const [loading, setLoading] = useState(false);

  const handleAllowAndContinue = async () => {
    setLoading(true);
    try {
      if (typeof window !== 'undefined' && navigator.mediaDevices) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        stream.getTracks().forEach((track) => track.stop());
      }
      setHasConsented(true);
      router.push('/guide');
    } catch (err: any) {
      console.warn('Camera/mic permission notice:', err?.message || err);
      setHasConsented(true);
      router.push('/guide');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    setHasConsented(true);
    router.push('/guide');
  };

  return (
    <main className="flex-grow flex flex-col items-center justify-between px-5 py-6 max-w-md mx-auto w-full min-h-[calc(100vh-4rem)]">
      {/* Eye Graphic Illustration Header */}
      <div className="w-full max-w-xs aspect-square mb-4 rounded-2xl overflow-hidden shadow-md relative bg-[#F8F2EC] flex items-center justify-center border border-[#5B3A29]/10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFF9F0] via-[#F8F2EC] to-transparent flex flex-col items-center justify-center p-4 text-center">
          <div className="w-24 h-24 rounded-full bg-[#5B3A29]/10 text-[#5B3A29] flex items-center justify-center mb-2 shadow-inner border border-[#5B3A29]/20">
            <span className="material-symbols-outlined text-5xl">visibility</span>
          </div>
          <span className="font-serif font-semibold text-[#5B3A29] text-sm tracking-wider uppercase">
            Multimodal Vision &amp; Voice
          </span>
        </div>
      </div>

      {/* Consent Text */}
      <div className="text-center w-full space-y-3">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#5B3A29] dark:text-indigo-200">
          Experience the Past
        </h2>
        <p className="font-sans text-xs md:text-sm text-[#5B3A29]/80 dark:text-slate-300 px-2">
          To bring history to life, VIRASETU needs to see and hear your surroundings.
        </p>

        {/* Permission Details */}
        <div className="bg-[#F8F2EC] dark:bg-slate-800 rounded-2xl p-4 text-left shadow-sm space-y-3 border border-[#5B3A29]/10">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-[#5B3A29]/10 flex items-center justify-center shrink-0 text-[#5B3A29]">
              <span className="material-symbols-outlined text-xl">photo_camera</span>
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-[#5B3A29] dark:text-indigo-200">
                Camera Access
              </h3>
              <p className="font-sans text-xs text-[#5B3A29]/70 dark:text-slate-400 mt-0.5">
                To identify artifacts and structures instantly.
              </p>
            </div>
          </div>

          <div className="h-[1px] w-full bg-[#5B3A29]/10" />

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-[#5B3A29]/10 flex items-center justify-center shrink-0 text-[#5B3A29]">
              <span className="material-symbols-outlined text-xl">mic</span>
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-[#5B3A29] dark:text-indigo-200">
                Microphone Access
              </h3>
              <p className="font-sans text-xs text-[#5B3A29]/70 dark:text-slate-400 mt-0.5">
                To interact with the AI guide via voice.
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Lock Banner */}
        <div className="flex items-center justify-center gap-2 px-3 py-2 bg-[#5B3A29]/5 rounded-lg border border-[#5B3A29]/10">
          <span className="material-symbols-outlined text-[#5B3A29] text-base">lock</span>
          <p className="font-sans text-xs font-medium text-[#5B3A29]">
            No footage or audio is stored - your privacy is protected.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="w-full mt-6 space-y-3">
        <button
          onClick={handleAllowAndContinue}
          disabled={loading}
          className="w-full h-14 rounded-xl bg-[#5B3A29] text-[#FFF9F0] font-sans text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md hover:bg-[#4A2E20]"
        >
          {loading ? 'Requesting Access...' : 'Allow & Continue'}
          <span className="material-symbols-outlined text-xl">arrow_forward</span>
        </button>

        <button
          onClick={handleSkip}
          className="w-full py-2 text-center text-xs text-[#5B3A29]/60 dark:text-slate-400 hover:text-[#5B3A29]"
        >
          Skip for now
        </button>
      </div>
    </main>
  );
}
