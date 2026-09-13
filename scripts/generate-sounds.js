const fs = require('fs');
const path = require('path');

const sampleRate = 44100;

function createWavBuffer(samples) {
  const numSamples = samples.length;
  const byteRate = sampleRate * 2; // 16-bit mono = 2 bytes per sample
  const buffer = Buffer.alloc(44 + numSamples * 2);

  // RIFF identifier
  buffer.write('RIFF', 0);
  // file length minus 8
  buffer.writeUInt32LE(36 + numSamples * 2, 4);
  // RIFF type
  buffer.write('WAVE', 8);
  // format chunk identifier
  buffer.write('fmt ', 12);
  // format chunk length
  buffer.writeUInt32LE(16, 16);
  // sample format (1 = PCM)
  buffer.writeUInt16LE(1, 20);
  // channel count (1 = mono)
  buffer.writeUInt16LE(1, 22);
  // sample rate
  buffer.writeUInt32LE(sampleRate, 24);
  // byte rate (SampleRate * NumChannels * BitsPerSample/8)
  buffer.writeUInt32LE(byteRate, 28);
  // block align (NumChannels * BitsPerSample/8)
  buffer.writeUInt16LE(2, 32);
  // bits per sample
  buffer.writeUInt16LE(16, 34);
  // data chunk identifier
  buffer.write('data', 36);
  // data chunk length
  buffer.writeUInt32LE(numSamples * 2, 40);

  // write sample data
  for (let i = 0; i < numSamples; i++) {
    let s = Math.max(-1, Math.min(1, samples[i]));
    let intVal = s < 0 ? s * 0x8000 : s * 0x7FFF;
    buffer.writeInt16LE(Math.floor(intVal), 44 + i * 2);
  }

  return buffer;
}

// 1. Click (Bubble pop) - 0.08 sec
function generateClick() {
  const duration = 0.08;
  const numSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const freq = 600 + 400 * Math.sin(t * 80);
    const env = Math.exp(-t * 45);
    samples[i] = Math.sin(2 * Math.PI * freq * t) * env * 0.4;
  }
  return createWavBuffer(samples);
}

// 2. Correct Chime - 0.45 sec (Arpeggio C5 -> E5 -> G5 -> C6)
function generateCorrect() {
  const duration = 0.5;
  const numSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(numSamples);
  const notes = [523.25, 659.25, 783.99, 1046.50];
  const noteDuration = duration / notes.length;

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const noteIdx = Math.min(Math.floor(t / noteDuration), notes.length - 1);
    const noteTime = t - noteIdx * noteDuration;
    const freq = notes[noteIdx];
    const env = Math.exp(-noteTime * 12);
    // Sine + slight 2nd harmonic for warm bell tone
    const wave = Math.sin(2 * Math.PI * freq * t) * 0.7 + Math.sin(4 * Math.PI * freq * t) * 0.3;
    samples[i] = wave * env * 0.45;
  }
  return createWavBuffer(samples);
}

// 3. Wrong / Boing - 0.35 sec (Gentle low downward boing)
function generateWrong() {
  const duration = 0.35;
  const numSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const freq = 220 - 90 * (t / duration);
    const env = Math.exp(-t * 8);
    const wave = Math.sin(2 * Math.PI * freq * t) + 0.3 * Math.sin(4 * Math.PI * freq * t);
    samples[i] = wave * env * 0.35;
  }
  return createWavBuffer(samples);
}

// 4. Game Over - 0.7 sec
function generateGameOver() {
  const duration = 0.8;
  const numSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(numSamples);
  const notes = [392.00, 349.23, 329.63, 261.63]; // G4, F4, E4, C4
  const noteDuration = duration / notes.length;

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const noteIdx = Math.min(Math.floor(t / noteDuration), notes.length - 1);
    const noteTime = t - noteIdx * noteDuration;
    const freq = notes[noteIdx];
    const env = Math.exp(-noteTime * 6);
    const wave = Math.sin(2 * Math.PI * freq * t) * 0.8 + Math.sin(3 * Math.PI * freq * t) * 0.2;
    samples[i] = wave * env * 0.4;
  }
  return createWavBuffer(samples);
}

// 5. Sweet Lo-Fi Background Music Loop (~12 seconds seamless loop)
function generateBgm() {
  const bpm = 110;
  const beatSec = 60 / bpm;
  // 16 beats = 4 bars = ~8.72 seconds
  const totalBeats = 16;
  const duration = totalBeats * beatSec;
  const numSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(numSamples);

  // Sweet pentatonic chord progression: Cmaj7 - Am7 - Fmaj7 - G7
  // Melodic sequence: [C5, E5, G5, A5, G5, E5, D5, C5, E5, G5, D5, B4, C5, D5, E5, C5]
  const melodyNotes = [
    523.25, 659.25, 783.99, 880.00,
    783.99, 659.25, 587.33, 523.25,
    659.25, 783.99, 587.33, 493.88,
    523.25, 587.33, 659.25, 523.25
  ];

  // Bass notes for 4 bars (4 beats each)
  const bassNotes = [130.81, 110.00, 87.31, 98.00]; // C3, A2, F2, G2

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const currentBeat = (t / beatSec);
    const beatIndex = Math.floor(currentBeat) % totalBeats;
    const beatFract = currentBeat - Math.floor(currentBeat);

    // Melody (Marimba / Music Box tone)
    const melFreq = melodyNotes[beatIndex];
    const melEnv = Math.exp(-beatFract * 7);
    const melWave = Math.sin(2 * Math.PI * melFreq * t) * 0.6 +
                    Math.sin(4 * Math.PI * melFreq * t) * 0.25 +
                    Math.sin(6 * Math.PI * melFreq * t) * 0.1;

    // Bass (Soft Rhodes / warm sub)
    const barIndex = Math.floor(currentBeat / 4) % 4;
    const bassFreq = bassNotes[barIndex];
    const barFract = (currentBeat % 4) / 4;
    const bassEnv = 0.5 + 0.5 * Math.sin(barFract * Math.PI);
    const bassWave = Math.sin(2 * Math.PI * bassFreq * t) * 0.5 +
                     Math.sin(4 * Math.PI * bassFreq * t) * 0.15;

    // Soft percussion tick every beat (subtle hi-hat)
    const tickEnv = Math.exp(-beatFract * 50);
    const noise = (Math.random() * 2 - 1) * tickEnv * 0.04;

    // Loop envelope crossfade at start and end to avoid clicking
    let loopFade = 1.0;
    const fadeSec = 0.05;
    if (t < fadeSec) loopFade = t / fadeSec;
    if (t > duration - fadeSec) loopFade = (duration - t) / fadeSec;

    samples[i] = (melWave * melEnv * 0.28 + bassWave * bassEnv * 0.22 + noise) * loopFade;
  }

  return createWavBuffer(samples);
}

const audioDir = path.join(__dirname, '..', 'assets', 'audio');
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

console.log('Generating game audio assets...');
fs.writeFileSync(path.join(audioDir, 'click.wav'), generateClick());
fs.writeFileSync(path.join(audioDir, 'correct.wav'), generateCorrect());
fs.writeFileSync(path.join(audioDir, 'wrong.wav'), generateWrong());
fs.writeFileSync(path.join(audioDir, 'gameover.wav'), generateGameOver());
fs.writeFileSync(path.join(audioDir, 'bgm.wav'), generateBgm());

console.log('Audio assets generated successfully in assets/audio!');
