'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

export default function ConsentPage() {
  const router = useRouter();
  const { setHasConsented } = useApp();
  const [loading, setLoading] = useState(false);

  const handleAllow = async () => {
    setLoading(true);
    try {
      if (typeof window !== 'undefined' && navigator.mediaDevices) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        stream.getTracks().forEach((track) => track.stop());
      }
    } catch {
      // Permission denied or unavailable — proceed anyway
    } finally {
      setHasConsented(true);
      setLoading(false);
      router.push('/guide');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FFF9F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <main style={{ maxWidth: '400px', width: '100%', padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>

        {/* Eye Icon */}
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#F8F2EC', border: '2px solid rgba(91,58,41,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px rgba(91,58,41,0.1)' }}>
          <span className="material-symbols-outlined icon-fill" style={{ fontSize: '56px', color: '#5B3A29' }}>visibility</span>
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Newsreader, serif', fontSize: '30px', fontWeight: 700, color: '#3d2b1a', marginBottom: '8px' }}>
            Experience the Past
          </h2>
          <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', color: '#5B3A29', opacity: 0.75, lineHeight: 1.6 }}>
            To bring history to life, VIRASETU needs access to your camera and microphone.
          </p>
        </div>

        {/* Permission Cards */}
        <div style={{ width: '100%', backgroundColor: '#F8F2EC', borderRadius: '18px', padding: '18px', border: '1.5px solid rgba(91,58,41,0.12)' }}>
          {/* Camera row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(91,58,41,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#5B3A29' }}>photo_camera</span>
            </div>
            <div>
              <h3 style={{ fontFamily: 'Newsreader, serif', fontWeight: 700, fontSize: '15px', color: '#3d2b1a', marginBottom: '2px' }}>Camera Access</h3>
              <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12px', color: '#5B3A29', opacity: 0.7 }}>To identify landmarks and artifacts in real-time.</p>
            </div>
          </div>

          <div style={{ height: '1px', backgroundColor: 'rgba(91,58,41,0.1)', marginBottom: '14px' }} />

          {/* Mic row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(91,58,41,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#5B3A29' }}>mic</span>
            </div>
            <div>
              <h3 style={{ fontFamily: 'Newsreader, serif', fontWeight: 700, fontSize: '15px', color: '#3d2b1a', marginBottom: '2px' }}>Microphone Access</h3>
              <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12px', color: '#5B3A29', opacity: 0.7 }}>To interact with the AI guide via voice commands.</p>
            </div>
          </div>
        </div>

        {/* Privacy banner */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: 'rgba(91,58,41,0.05)', borderRadius: '12px', border: '1px solid rgba(91,58,41,0.1)', width: '100%' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#5B3A29' }}>lock</span>
          <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12px', fontWeight: 600, color: '#5B3A29' }}>No footage or audio is stored — your privacy is protected.</p>
        </div>

        {/* Buttons */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={handleAllow}
            disabled={loading}
            style={{
              width: '100%', height: '54px', backgroundColor: '#5B3A29', color: '#FFF9F0',
              borderRadius: '14px', fontFamily: 'Manrope, sans-serif', fontSize: '15px',
              fontWeight: 700, border: 'none', cursor: loading ? 'wait' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: '0 4px 16px rgba(91,58,41,0.3)',
              opacity: loading ? 0.8 : 1,
            }}
          >
            <span>{loading ? 'Requesting Access...' : 'Allow & Continue'}</span>
            {!loading && <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>}
          </button>

          <button
            onClick={() => { setHasConsented(true); router.push('/guide'); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Manrope, sans-serif', fontSize: '12px', color: 'rgba(91,58,41,0.55)', padding: '6px' }}
          >
            Skip for now
          </button>
        </div>
      </main>
    </div>
  );
}
