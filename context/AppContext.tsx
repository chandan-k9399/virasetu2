'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type PersonaType = 'kid' | 'student' | 'researcher' | 'tourist';
export type GuidanceType = 'audio' | 'visual' | 'both';
export type ThemeMode = 'heritage' | 'accessible';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface AppContextType {
  persona: PersonaType;
  setPersona: (p: PersonaType) => void;
  guidanceType: GuidanceType;
  setGuidanceType: (g: GuidanceType) => void;
  selectedStopId: string;
  setSelectedStopId: (stopId: string) => void;
  theme: ThemeMode;
  toggleTheme: () => void;
  hasConsented: boolean;
  setHasConsented: (consented: boolean) => void;
  chatHistory: ChatMessage[];
  addChatMessage: (msg: { role: 'user' | 'assistant'; content: string }) => void;
  clearChatHistory: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [persona, setPersonaState] = useState<PersonaType>('student');
  const [guidanceType, setGuidanceTypeState] = useState<GuidanceType>('visual');
  const [selectedStopId, setSelectedStopIdState] = useState<string>('glass-house');
  const [theme, setTheme] = useState<ThemeMode>('heritage');
  const [hasConsented, setHasConsented] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('virasetu_theme') as ThemeMode;
    if (savedTheme) setTheme(savedTheme);

    const savedPersona = localStorage.getItem('virasetu_persona') as PersonaType;
    if (savedPersona) setPersonaState(savedPersona);

    const savedGuidance = localStorage.getItem('virasetu_guidance') as GuidanceType;
    if (savedGuidance) setGuidanceTypeState(savedGuidance);

    const savedStop = localStorage.getItem('virasetu_stopId');
    if (savedStop) setSelectedStopIdState(savedStop);
  }, []);

  const setPersona = (p: PersonaType) => {
    setPersonaState(p);
    localStorage.setItem('virasetu_persona', p);
  };

  const setGuidanceType = (g: GuidanceType) => {
    setGuidanceTypeState(g);
    localStorage.setItem('virasetu_guidance', g);
  };

  const setSelectedStopId = (stopId: string) => {
    setSelectedStopIdState(stopId);
    localStorage.setItem('virasetu_stopId', stopId);
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'heritage' ? 'accessible' : 'heritage';
    setTheme(nextTheme);
    localStorage.setItem('virasetu_theme', nextTheme);
  };

  const addChatMessage = (msg: { role: 'user' | 'assistant'; content: string }) => {
    const newMsg: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      role: msg.role,
      content: msg.content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatHistory((prev) => [...prev, newMsg]);
  };

  const clearChatHistory = () => {
    setChatHistory([]);
  };

  return (
    <AppContext.Provider
      value={{
        persona,
        setPersona,
        guidanceType,
        setGuidanceType,
        selectedStopId,
        setSelectedStopId,
        theme,
        toggleTheme,
        hasConsented,
        setHasConsented,
        chatHistory,
        addChatMessage,
        clearChatHistory,
      }}
    >
      <div className={theme === 'accessible' ? 'accessible-theme' : ''}>
        {children}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
