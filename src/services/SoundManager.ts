import { Platform, Vibration } from 'react-native';
import { AudioSettings, SoundEffect } from '../core/types/audio';

// Safe lazy resolution of expo-av to prevent "Cannot find native module ExponentAV" in Expo Go
let ExpoAudio: any = null;
let isNativeAudioSupported: boolean | null = null;

function getAudioModule() {
  if (isNativeAudioSupported === false) return null;
  if (ExpoAudio) return ExpoAudio;

  try {
    // Dynamically require expo-av inside try/catch
    const av = require('expo-av');
    if (av && av.Audio) {
      ExpoAudio = av.Audio;
      isNativeAudioSupported = true;
      return ExpoAudio;
    }
  } catch (err) {
    // Graceful fallback for Expo Go or environments without ExponentAV native module
    console.warn(
      '[Pikso Audio] Native ExponentAV modülü bu ortamda (Expo Go) bulunamadı. Sessiz & titreşimli güvenli moda geçildi.'
    );
    isNativeAudioSupported = false;
    ExpoAudio = null;
  }
  return null;
}

class SoundManagerService {
  private bgmSound: any = null;
  private isBgmPlaying: boolean = false;
  private isInitialized: boolean = false;
  private settings: AudioSettings = {
    musicEnabled: true,
    sfxEnabled: true,
    musicVolume: 0.7,
    sfxVolume: 0.9,
  };

  public isAvailable(): boolean {
    return !!getAudioModule();
  }

  public async init(initialSettings?: AudioSettings) {
    if (initialSettings) {
      this.settings = initialSettings;
    }

    const audio = getAudioModule();
    if (!audio) {
      this.isInitialized = true;
      return;
    }

    try {
      if (typeof audio.setAudioModeAsync === 'function') {
        await audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });
      }
      this.isInitialized = true;
    } catch (e) {
      console.warn('[Pikso Audio] AudioMode configuration skipped:', e);
    }
  }

  public updateSettings(settings: AudioSettings) {
    const oldMusic = this.settings.musicEnabled;
    this.settings = settings;

    // Handle music toggle
    if (!settings.musicEnabled && this.isBgmPlaying) {
      this.stopMusic();
    } else if (settings.musicEnabled && !oldMusic) {
      this.playMusic();
    }

    // Update BGM volume if active
    if (this.bgmSound && typeof this.bgmSound.setVolumeAsync === 'function') {
      this.bgmSound.setVolumeAsync(settings.musicVolume).catch(() => {});
    }
  }

  public async playMusic() {
    if (!this.settings.musicEnabled) return;

    const audio = getAudioModule();
    if (!audio) return;

    try {
      if (!this.bgmSound) {
        const result = await audio.Sound.createAsync(
          require('../../assets/audio/bgm.wav'),
          {
            isLooping: true,
            volume: this.settings.musicVolume,
            shouldPlay: true,
          }
        );
        this.bgmSound = result.sound;
        this.isBgmPlaying = true;
      } else {
        const status = await this.bgmSound.getStatusAsync();
        if (status.isLoaded && !status.isPlaying) {
          await this.bgmSound.setVolumeAsync(this.settings.musicVolume);
          await this.bgmSound.playAsync();
          this.isBgmPlaying = true;
        }
      }
    } catch (e) {
      console.warn('[Pikso Audio] BGM çalınamadı (güvenli fallback devrede):', e);
    }
  }

  public async stopMusic() {
    try {
      if (this.bgmSound && typeof this.bgmSound.stopAsync === 'function') {
        await this.bgmSound.stopAsync();
        this.isBgmPlaying = false;
      }
    } catch (e) {
      // Ignored for safety
    }
  }

  public async pauseMusic() {
    try {
      if (this.bgmSound && this.isBgmPlaying && typeof this.bgmSound.pauseAsync === 'function') {
        await this.bgmSound.pauseAsync();
        this.isBgmPlaying = false;
      }
    } catch (e) {
      // Ignored for safety
    }
  }

  public async resumeMusic() {
    if (this.settings.musicEnabled && this.bgmSound) {
      try {
        if (typeof this.bgmSound.playAsync === 'function') {
          await this.bgmSound.playAsync();
          this.isBgmPlaying = true;
        }
      } catch (e) {
        // Ignored for safety
      }
    }
  }

  public async playSfx(effect: SoundEffect) {
    if (!this.settings.sfxEnabled) return;

    // Provide immediate, native tactile feedback (works in ALL clients, including Expo Go)
    try {
      if (Platform.OS !== 'web') {
        switch (effect) {
          case 'click':
            Vibration.vibrate(15);
            break;
          case 'correct':
            Vibration.vibrate(35);
            break;
          case 'wrong':
            Vibration.vibrate([0, 50, 40, 50]);
            break;
          case 'gameover':
            Vibration.vibrate([0, 80, 50, 120]);
            break;
        }
      }
    } catch {
      // Vibration error ignored
    }

    const audio = getAudioModule();
    if (!audio) return;

    try {
      let soundSource: any;
      switch (effect) {
        case 'click':
          soundSource = require('../../assets/audio/click.wav');
          break;
        case 'correct':
          soundSource = require('../../assets/audio/correct.wav');
          break;
        case 'wrong':
          soundSource = require('../../assets/audio/wrong.wav');
          break;
        case 'gameover':
          soundSource = require('../../assets/audio/gameover.wav');
          break;
      }

      const { sound } = await audio.Sound.createAsync(soundSource, {
        shouldPlay: true,
        volume: this.settings.sfxVolume,
      });

      sound.setOnPlaybackStatusUpdate((status: any) => {
        if (status && status.isLoaded && status.didJustFinish) {
          sound.unloadAsync().catch(() => {});
        }
      });
    } catch (e) {
      console.warn(`[Pikso Audio] SFX ${effect} çalınamadı (güvenli fallback):`, e);
    }
  }

  public async cleanup() {
    try {
      if (this.bgmSound && typeof this.bgmSound.unloadAsync === 'function') {
        await this.bgmSound.unloadAsync();
        this.bgmSound = null;
      }
    } catch (e) {
      // Ignored for safety
    }
  }
}

export const SoundManager = new SoundManagerService();
