'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

interface IdentifiedLandmark {
  name: string;
  subtitle: string;
  category: string;
  description: string;
  architect: string;
  materials: string;
  era: string;
  significance: string;
  historicalFacts: string[];
  pexelsPhotos?: string[];
}

export default function GuidePage() {
  const router = useRouter();
  const { persona, guidanceType, selectedLocation, chatHistory, addChatMessage } = useApp();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const [isIdentifying, setIsIdentifying] = useState<boolean>(false);
  const [landmark, setLandmark] = useState<IdentifiedLandmark | null>(null);

  // Audio Player State (Matching Image 5)
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioProgress, setAudioProgress] = useState<number>(35);
  const [showTranscriptModal, setShowTranscriptModal] = useState<boolean>(false);

  // Q&A Chat Input State
  const [userQuestion, setUserQuestion] = useState<string>('');
  const [isAsking, setIsAsking] = useState<boolean>(false);

  // Default Fallback Landmark
  const defaultLandmark: IdentifiedLandmark = {
    name: selectedLocation === 'taj-mahal' ? 'Taj Mahal' : selectedLocation === 'tipu-palace' ? "Tipu Sultan's Summer Palace" : 'Glass House',
    subtitle: 'Built in 1889, this magnificent Victorian conservatory remains one of the largest surviving glasshouses in the world.',
    category: 'Historical Landmark',
    description: 'Built in 1889, this magnificent Victorian conservatory remains one of the largest surviving glasshouses in the world. It was meticulously designed to house rare and exotic plant specimens brought back by pioneering naturalists.',
    architect: 'John Cameron & Decimus Burton',
    materials: 'Wrought Iron & Glass',
    era: 'Victorian (1889)',
    significance: 'Grade I Listed Structure',
    historicalFacts: [
      'Commissioned in 1889 during the administration of John Cameron.',
      'Cast iron framing imported directly from Glasgow, Scotland.',
      'Hosts the famous twice-yearly Lal Bagh flower shows.'
    ],
    pexelsPhotos: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
    ],
  };

  const activeLandmark = landmark || defaultLandmark;
  const pexelsGrid = activeLandmark.pexelsPhotos && activeLandmark.pexelsPhotos.length >= 4
    ? activeLandmark.pexelsPhotos
    : defaultLandmark.pexelsPhotos!;

  // Initialize Camera Stream
  const startCamera = useCallback(async () => {
    try {
      if (typeof window !== 'undefined' && navigator.mediaDevices) {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
        }
        setCameraActive(true);
      }
    } catch (err: any) {
      console.warn('Camera stream notice:', err?.message || err);
      setCameraActive(false);
    }
  }, []);

  useEffect(() => {
    startCamera();

    return () => {
      if (stream) stream.getTracks().forEach((track) => track.stop());
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Run Vision Recognition & Pexels Retrieval
  const handleIdentifyCameraFrame = async () => {
    setIsIdentifying(true);
    let capturedBase64: string | undefined = uploadedImage || undefined;

    if (!capturedBase64 && cameraActive && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        capturedBase64 = canvas.toDataURL('image/jpeg', 0.85);
      }
    }

    try {
      const res = await fetch('/api/identify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: capturedBase64,
          persona,
          location: selectedLocation,
        }),
      });

      const data = await res.json();
      if (data.landmark) {
        setLandmark(data.landmark);
        if (guidanceType === 'audio' || guidanceType === 'both') {
          speakText(`${data.landmark.name}. ${data.landmark.description}`);
        }
      }
    } catch (err) {
      console.error('Identification API error:', err);
    } finally {
      setIsIdentifying(false);
    }
  };

  // Photo Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setUploadedImage(base64);
        setCameraActive(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Audio Speech Synthesis
  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  const toggleAudio = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    if (isPlayingAudio) {
      window.speechSynthesis.pause();
      setIsPlayingAudio(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPlayingAudio(true);
      } else {
        speakText(`${activeLandmark.name}. ${activeLandmark.description}`);
      }
    }
  };

  // Handle Q&A Follow-up Questions
  const handleSendQuestion = async (textToSend?: string) => {
    const query = textToSend || userQuestion;
    if (!query.trim() || isAsking) return;

    addChatMessage({ role: 'user', content: query });
    if (!textToSend) setUserQuestion('');
    setIsAsking(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          landmarkContext: activeLandmark,
          persona,
          history: chatHistory,
        }),
      });

      const data = await res.json();
      if (data.reply) {
        addChatMessage({ role: 'assistant', content: data.reply });
        if (guidanceType === 'audio' || guidanceType === 'both') {
          speakText(data.reply);
        }
      }
    } catch (err) {
      console.error('Chat Q&A error:', err);
    } finally {
      setIsAsking(false);
    }
  };

  const renderAudioPlayerUI = () => (
    /* Audio View matching Image 5 */
    <div className="bg-[#FFF9F0] dark:bg-slate-900 rounded-3xl p-6 border border-[#5B3A29]/15 shadow-xl max-w-sm mx-auto space-y-6 animate-fade-in text-center">
      <div className="text-xs uppercase tracking-widest text-[#5B3A29]/70 font-semibold mb-1">
        Explanation Output (Audio) — Heritage
      </div>

      {/* Hero Photo Card */}
      <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-md bg-slate-200 relative">
        {uploadedImage ? (
          <img src={uploadedImage} alt="Uploaded" className="w-full h-full object-cover" />
        ) : (
          <img
            src={pexelsGrid[0]}
            alt={activeLandmark.name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-x-0 bottom-0 h-1 bg-[#5B3A29]/20">
          <div className="h-full bg-[#c9a74d]" style={{ width: `${audioProgress}%` }} />
        </div>
      </div>

      {/* Audio Title & Subtitle */}
      <div>
        <h3 className="font-serif font-bold text-2xl text-[#5B3A29] dark:text-indigo-200">
          {activeLandmark.name} Origin
        </h3>
        <p className="font-sans text-xs text-[#5B3A29]/70 dark:text-slate-400 mt-1">
          Chapter 1 • {activeLandmark.category}
        </p>
      </div>

      {/* Animated Waveform Visualizer */}
      <div className="flex items-center justify-center gap-1.5 h-10">
        {[40, 70, 30, 90, 60, 100, 45, 80, 50, 30, 60].map((h, i) => (
          <div
            key={i}
            className={`w-1.5 rounded-full bg-[#5B3A29] transition-all duration-300 ${
              isPlayingAudio ? 'animate-pulse' : 'opacity-60'
            }`}
            style={{ height: isPlayingAudio ? `${h}%` : '30%' }}
          />
        ))}
      </div>

      {/* Controls: Skip -10s, Play/Pause, Skip +10s */}
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={() => setAudioProgress((p) => Math.max(0, p - 10))}
          className="w-10 h-10 rounded-full text-[#5B3A29] hover:bg-[#5B3A29]/10 flex items-center justify-center transition-transform active:scale-90"
        >
          <span className="material-symbols-outlined text-2xl">replay_10</span>
        </button>

        <button
          onClick={toggleAudio}
          className="w-16 h-16 rounded-full bg-[#5B3A29] text-[#FFF9F0] flex items-center justify-center shadow-lg hover:bg-[#4A2E20] transition-transform active:scale-95"
        >
          <span className="material-symbols-outlined text-3xl">
            {isPlayingAudio ? 'pause' : 'play_arrow'}
          </span>
        </button>

        <button
          onClick={() => setAudioProgress((p) => Math.min(100, p + 10))}
          className="w-10 h-10 rounded-full text-[#5B3A29] hover:bg-[#5B3A29]/10 flex items-center justify-center transition-transform active:scale-90"
        >
          <span className="material-symbols-outlined text-2xl">forward_10</span>
        </button>
      </div>

      {/* Coming Soon Spatial Audio Badge */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#F8F2EC] rounded-xl border border-[#5B3A29]/10 text-xs">
        <span className="flex items-center gap-2 text-[#5B3A29] font-medium">
          <span className="material-symbols-outlined text-base">headphones</span>
          Spatial Audio Mode
        </span>
        <span className="px-2 py-0.5 rounded-full bg-[#c9a74d] text-[#503d00] font-bold text-[10px] uppercase">
          COMING SOON
        </span>
      </div>

      {/* Read Transcript Button */}
      <button
        onClick={() => setShowTranscriptModal(true)}
        className="w-full py-3 rounded-xl border border-[#5B3A29]/30 text-[#5B3A29] font-sans text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#5B3A29]/5"
      >
        <span className="material-symbols-outlined text-base">menu_book</span>
        Read Transcript
      </button>
    </div>
  );

  const renderVisualTextUI = () => (
    /* Visual View matching Image 4 with Dynamic Pexels Photos */
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-[#5B3A29]/15 shadow-xl space-y-6 animate-fade-in max-w-xl mx-auto">
      {/* Top Media Row: Related Archival Photo Grid + Camera Live Feed */}
      <div className="grid grid-cols-2 gap-3">
        {/* Dynamic Pexels Photos Grid */}
        <div className="bg-[#F8F2EC] dark:bg-slate-800 p-2.5 rounded-2xl border border-[#5B3A29]/10 space-y-2">
          <span className="text-[10px] uppercase tracking-widest font-bold text-[#5B3A29]/70 block">
            PEXELS PHOTOS
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {pexelsGrid.slice(0, 4).map((imgUrl, i) => (
              <img key={i} src={imgUrl} alt={`Pexels Ref ${i}`} className="w-full aspect-square object-cover rounded-lg" />
            ))}
          </div>
        </div>

        {/* Live Camera Viewfinder Box */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-[#5B3A29]/20 shadow-inner flex items-center justify-center">
          {uploadedImage ? (
            <img src={uploadedImage} alt="Uploaded" className="w-full h-full object-cover" />
          ) : cameraActive ? (
            <video ref={videoRef} playsInline muted className="w-full h-full object-cover" />
          ) : (
            <img src={pexelsGrid[0]} alt="Default" className="w-full h-full object-cover opacity-80" />
          )}

          {/* Live Indicator */}
          <span className="absolute top-2 right-2 bg-red-600 text-white font-bold text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            LIVE
          </span>
        </div>
      </div>

      {/* Landmark Header & Category Badge */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-serif font-bold text-3xl text-[#4f378a] dark:text-indigo-300 leading-tight">
            {activeLandmark.name}
          </h2>
        </div>
        <span className="px-3 py-1 rounded-xl bg-purple-100 dark:bg-purple-950 text-[#4f378a] dark:text-purple-300 text-xs font-bold flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">account_balance</span>
          {activeLandmark.category}
        </span>
      </div>

      {/* Description Text */}
      <p className="font-sans text-sm text-[#1d1b20] dark:text-slate-200 leading-relaxed">
        {activeLandmark.description}
      </p>

      {/* Metadata 2x2 Metrics Grid (Matching Image 4) */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#5B3A29]/10">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#5B3A29]/60 block mb-0.5">
            ARCHITECT
          </span>
          <span className="font-serif text-sm font-semibold text-[#1d1b20] dark:text-slate-200">
            {activeLandmark.architect}
          </span>
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#5B3A29]/60 block mb-0.5">
            MATERIALS
          </span>
          <span className="font-serif text-sm font-semibold text-[#1d1b20] dark:text-slate-200">
            {activeLandmark.materials}
          </span>
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#5B3A29]/60 block mb-0.5">
            ERA
          </span>
          <span className="font-serif text-sm font-semibold text-[#1d1b20] dark:text-slate-200">
            {activeLandmark.era}
          </span>
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#5B3A29]/60 block mb-0.5">
            SIGNIFICANCE
          </span>
          <span className="font-serif text-sm font-semibold text-[#1d1b20] dark:text-slate-200">
            {activeLandmark.significance}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <main className="max-w-4xl mx-auto px-4 py-6 min-h-[calc(100vh-4rem)] flex flex-col justify-between">
      {/* Hidden Canvas & File Upload */}
      <canvas ref={canvasRef} className="hidden" />
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />

      {/* Top Camera Controls & Live Vision Trigger */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-2xl border border-[#5B3A29]/10 shadow-sm mb-6">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-[#c9a74d] dark:text-amber-400 block">
            Multimodal Vision Identification
          </span>
          <h2 className="font-serif font-bold text-lg text-[#5B3A29] dark:text-indigo-200 capitalize">
            {activeLandmark.name} • Location: {selectedLocation}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 rounded-full bg-[#5B3A29]/10 text-[#5B3A29] font-medium text-xs flex items-center gap-1 hover:bg-[#5B3A29]/20"
          >
            <span className="material-symbols-outlined text-base">upload_file</span>
            Photo File
          </button>

          <button
            onClick={handleIdentifyCameraFrame}
            disabled={isIdentifying}
            className="px-4 py-2 rounded-full bg-[#5B3A29] text-[#FFF9F0] font-semibold text-xs flex items-center gap-1.5 shadow-md hover:bg-[#4A2E20]"
          >
            <span className="material-symbols-outlined text-base">auto_awesome</span>
            {isIdentifying ? 'Recognizing...' : 'Analyze Live Camera'}
          </button>
        </div>
      </div>

      {/* Main Guidance Render View */}
      {guidanceType === 'audio' && renderAudioPlayerUI()}
      {guidanceType === 'visual' && renderVisualTextUI()}
      {guidanceType === 'both' && (
        <div className="space-y-6">
          {renderAudioPlayerUI()}
          {renderVisualTextUI()}
        </div>
      )}

      {/* Interactive Follow-up Q&A Section */}
      <div className="mt-8 bg-white dark:bg-slate-900 rounded-3xl p-5 border border-[#5B3A29]/15 shadow-lg max-w-xl mx-auto space-y-4">
        <h3 className="font-serif font-bold text-base text-[#5B3A29] dark:text-indigo-200 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#c9a74d]">chat</span>
          Ask Virasetu AI about {activeLandmark.name}
        </h3>

        {/* Quick Question Suggestion Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          {['How old is this?', 'Who built it?', 'What plants grow nearby?', 'Tell a fun story'].map((chip) => (
            <button
              key={chip}
              onClick={() => handleSendQuestion(chip)}
              className="px-3 py-1.5 rounded-full bg-[#F8F2EC] dark:bg-slate-800 text-[#5B3A29] dark:text-slate-300 font-medium whitespace-nowrap hover:bg-[#5B3A29]/10 border border-[#5B3A29]/10"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Chat History Messages */}
        {chatHistory.length > 0 && (
          <div className="space-y-2 max-h-48 overflow-y-auto p-3 bg-[#F8F2EC] dark:bg-slate-800/60 rounded-2xl border border-[#5B3A29]/10 text-xs">
            {chatHistory.map((m) => (
              <div
                key={m.id}
                className={`p-2.5 rounded-xl ${
                  m.role === 'user'
                    ? 'bg-[#5B3A29] text-white ml-auto max-w-[80%]'
                    : 'bg-white dark:bg-slate-800 text-[#1d1b20] dark:text-slate-200 border border-[#5B3A29]/10 max-w-[90%]'
                }`}
              >
                <div className="font-bold text-[10px] opacity-75 mb-0.5 capitalize">{m.role}</div>
                <div>{m.content}</div>
              </div>
            ))}
          </div>
        )}

        {/* Chat Input Field */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={userQuestion}
            onChange={(e) => setUserQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendQuestion()}
            placeholder={`Ask a question about ${activeLandmark.name}...`}
            className="flex-1 px-4 py-3 rounded-full bg-[#F8F2EC] dark:bg-slate-800 border border-[#5B3A29]/20 text-xs text-[#1d1b20] dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5B3A29]"
          />
          <button
            onClick={() => handleSendQuestion()}
            disabled={isAsking}
            className="w-10 h-10 rounded-full bg-[#5B3A29] text-white flex items-center justify-center hover:bg-[#4A2E20] transition-transform active:scale-95 shadow-md"
          >
            <span className="material-symbols-outlined text-lg">send</span>
          </button>
        </div>
      </div>

      {/* Transcript Modal Drawer */}
      {showTranscriptModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFF9F0] dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full space-y-4 max-h-[80vh] overflow-y-auto border border-[#5B3A29]/20 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#5B3A29]/10 pb-3">
              <h3 className="font-serif font-bold text-lg text-[#5B3A29] dark:text-indigo-200">
                Audio Narration Transcript
              </h3>
              <button
                onClick={() => setShowTranscriptModal(false)}
                className="w-8 h-8 rounded-full text-[#5B3A29] hover:bg-[#5B3A29]/10 flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
            <p className="font-sans text-sm text-[#1d1b20] dark:text-slate-200 leading-relaxed whitespace-pre-line">
              {activeLandmark.description}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
