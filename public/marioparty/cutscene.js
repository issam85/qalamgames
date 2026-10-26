// Cutscenes: korte video's (video/<naam>.mp4) schermvullend, met een knop
// om over te slaan. Enter en Escape slaan ook over.
const overlay = document.getElementById('cutscene');
const video = document.getElementById('cutscene-video');
const skipBtn = document.getElementById('cutscene-skip');

let finish = null;

function end() {
  if (!finish) return;
  const done = finish;
  finish = null;
  video.pause();
  overlay.hidden = true;
  done();
}

function onKey(e) {
  if (e.code !== 'Enter' && e.code !== 'Escape') return;
  e.preventDefault();
  end();
}

video.addEventListener('ended', end);
video.addEventListener('error', end);
skipBtn.addEventListener('click', end);

// speelt een cutscene af; de promise is klaar als hij is afgelopen of overgeslagen
export function playCutscene(name) {
  end();
  return new Promise((resolve) => {
    finish = () => {
      window.removeEventListener('keydown', onKey);
      resolve();
    };
    window.addEventListener('keydown', onKey);
    overlay.hidden = false;
    video.muted = false;
    video.src = `video/${name}.mp4`;
    video.currentTime = 0;
    // zonder klik vooraf mag de browser geen geluid afspelen: dan zonder geluid
    video.play().catch(() => {
      video.muted = true;
      video.play().catch(end);
    });
    skipBtn.focus();
  });
}

// meerdere cutscenes na elkaar
export async function playCutscenes(names) {
  for (const name of names) await playCutscene(name);
}
