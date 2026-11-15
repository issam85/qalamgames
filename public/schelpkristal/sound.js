// Een hoog "ting" bij het oprapen (strand), het pakken van een parel (zee) of het kopen van
// iets in het kleedhokje, met WebAudio. Een tablet laat pas geluid toe na een aanraking:
// daarom wordt het geluid bij de eerste tik op het scherm aangezet.
let audio = null;

function wake() {
  try {
    audio = audio || new AudioContext();
    if (audio.state === 'suspended') audio.resume();
  } catch {
    audio = null; // geen geluid op dit apparaat
  }
}
if (typeof window !== 'undefined') window.addEventListener('pointerdown', wake, { once: true });

export function ting(high) {
  try {
    wake();
    if (!audio) return;
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
