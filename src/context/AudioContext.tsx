import React, { createContext, useContext } from 'react';
import { SoundEffect } from '../core/types/audio';
import { SoundManager } from '../services/SoundManager';
import { useSettings } from './SettingsContext';

interface AudioContextValue {
  playSfx: (effect: SoundEffect) => void;
  playMusic: () => void;
  stopMusic: () => void;
  pauseMusic: () => void;
  resumeMusic: () => void;
}

const AudioContext = createContext<AudioContextValue | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useSettings();

  const playSfx = (effect: SoundEffect) => {
    if (settings.audio.sfxEnabled) {
      SoundManager.playSfx(effect);
    }
  };

  const playMusic = () => {
    if (settings.audio.musicEnabled) {
      SoundManager.playMusic();
    }
  };

  const stopMusic = () => {
    SoundManager.stopMusic();
  };

  const pauseMusic = () => {
    SoundManager.pauseMusic();
  };

  const resumeMusic = () => {
    SoundManager.resumeMusic();
  };

  return (
    <AudioContext.Provider
      value={{
        playSfx,
        playMusic,
        stopMusic,
        pauseMusic,
        resumeMusic,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = (): AudioContextValue => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
