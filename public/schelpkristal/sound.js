// Een hoog "ting" bij het oprapen (strand) of pakken van een parel (zee), met WebAudio.
let audio = null;

export function ting(high) {
  try {
    audio = audio || new AudioContext();
    const o = audio.createOscillator();
    const g = audio.createGain();
    o.frequency.value = high ? 1320 : 880;
    o.type = 'sine';
    g.gain.setValueAtTime(0.15, audio.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.4);
    o.connect(g).connect(audio.destination);
    o.start();
    o.stop(audio.currentTime + 0.4);
  } catch {
    // geen geluid: dan maar stil
  }
}
