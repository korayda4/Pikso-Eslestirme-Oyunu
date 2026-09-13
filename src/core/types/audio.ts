export type SoundEffect = 'click' | 'correct' | 'wrong' | 'gameover';

export interface AudioSettings {
  musicEnabled: boolean;
  sfxEnabled: boolean;
  musicVolume: number;
  sfxVolume: number;
}
