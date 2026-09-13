import { Audio } from 'expo-av';
import { AudioSettings, SoundEffect } from '../core/types/audio';

class SoundManagerService {
  private bgmSound: Audio.Sound | null = null;
  private sfxSounds: Map<SoundEffect, Audio.Sound> = new Map();
  private isBgmPlaying: boolean = false;
  private isInitialized: boolean = false;
  private settings: AudioSettings = {
    musicEnabled: true,
    sfxEnabled: true,
    musicVolume: 0.7,
    sfxVolume: 0.9,
  };

  public async init(initialSettings?: AudioSettings) {
    if (initialSettings) {
      this.settings = initialSettings;
    }

    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
      this.isInitialized = true;
    } catch (e) {
      console.warn('AudioMode configuration error:', e);
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
    if (this.bgmSound) {
      this.bgmSound.setVolumeAsync(settings.musicVolume).catch(() => {});
    }
  }

  public async playMusic() {
    if (!this.settings.musicEnabled) return;

    try {
      if (!this.bgmSound) {
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/audio/bgm.wav'),
          {
            isLooping: true,
            volume: this.settings.musicVolume,
            shouldPlay: true,
          }
        );
        this.bgmSound = sound;
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
      console.warn('Could not play BGM:', e);
    }
  }

  public async stopMusic() {
    try {
      if (this.bgmSound) {
        await this.bgmSound.stopAsync();
        this.isBgmPlaying = false;
      }
    } catch (e) {
      console.warn('Could not stop BGM:', e);
    }
  }

  public async pauseMusic() {
    try {
      if (this.bgmSound && this.isBgmPlaying) {
        await this.bgmSound.pauseAsync();
        this.isBgmPlaying = false;
      }
    } catch (e) {
      console.warn('Could not pause BGM:', e);
    }
  }

  public async resumeMusic() {
    if (this.settings.musicEnabled && this.bgmSound) {
      try {
        await this.bgmSound.playAsync();
        this.isBgmPlaying = true;
      } catch (e) {
        console.warn('Could not resume BGM:', e);
      }
    }
  }

  public async playSfx(effect: SoundEffect) {
    if (!this.settings.sfxEnabled) return;

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

      const { sound } = await Audio.Sound.createAsync(soundSource, {
        shouldPlay: true,
        volume: this.settings.sfxVolume,
      });

      // Auto unload after playback finishes
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync().catch(() => {});
        }
      });
    } catch (e) {
      console.warn(`Could not play SFX ${effect}:`, e);
    }
  }

  public async cleanup() {
    try {
      if (this.bgmSound) {
        await this.bgmSound.unloadAsync();
        this.bgmSound = null;
      }
    } catch (e) {
      console.warn('Sound cleanup error:', e);
    }
  }
}

export const SoundManager = new SoundManagerService();
