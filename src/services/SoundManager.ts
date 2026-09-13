import { Platform, Vibration } from 'react-native';
import { AudioSettings, SoundEffect } from '../core/types/audio';

class SafeSoundManagerService {
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
  }

  public updateSettings(settings: AudioSettings) {
    this.settings = settings;
  }

  public async playMusic() {
    // Web audio synthesis or silent ambient in Expo Go (prevents native module missing errors)
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        // Optional web audio oscillator if desired
      } catch {}
    }
  }

  public async stopMusic() {}
  public async pauseMusic() {}
  public async resumeMusic() {}

  public playSfx(effect: SoundEffect) {
    if (!this.settings.sfxEnabled) return;

    // Haptic feedback works on ALL devices without any third-party native modules!
    try {
      if (Platform.OS !== 'web') {
        switch (effect) {
          case 'click':
            Vibration.vibrate(20);
            break;
          case 'correct':
            Vibration.vibrate(40);
            break;
          case 'wrong':
            Vibration.vibrate([0, 60, 40, 60]);
            break;
          case 'gameover':
            Vibration.vibrate([0, 100, 60, 150]);
            break;
        }
      }
    } catch {
      // Ignored
    }
  }

  public async cleanup() {}
}

export const SoundManager = new SafeSoundManagerService();
