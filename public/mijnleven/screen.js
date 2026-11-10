// Bouwt het scherm van een kamer met de vaste indeling: de balk met Huis en de
// sterren, links de knoppen, in het midden de tekening en rechts het paneel met de
// meter, de uitleg en de knoppen Opnieuw en Klaar!. De onderdelen heten <kamer>-nav,
// -stage, -title, -label, -meter, -hint, -reset en -done.
// nav = wat de knoppen links zijn (voor schermlezers) · stage = klasse van het
// speelvlak · heading = kop boven de meter · extra = wat er nog in het paneel moet ·
// doneLabel = wat er op de groene knop staat · reset = false laat Opnieuw weg
export function roomScreen({ room, title, nav, stage, heading = '', extra = '', doneLabel = 'Klaar!', reset = true }) {
  const el = document.createElement('section');
  el.id = `screen-${room}`;
  el.className = 'screen';
  el.innerHTML = `<header class="bar">
      <button class="pill home">Huis</button>
      <h1>${title}</h1>
      <div class="stars"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l3 6.5 7 .8-5.2 4.8 1.5 7L12 17.5 5.7 21l1.5-7L2 9.3l7-.8z"/></svg><span class="stars-count">0</span> sterren</div>
    </header>
    <div class="kast">
      <nav id="${room}-nav" class="cats" aria-label="${nav}"></nav>
      <div class="kast-stage ${stage}"><div id="${room}-stage" class="doll"></div></div>
      <div class="kast-panel">
        <div class="meter-row"><h2 id="${room}-title">${heading}</h2><span id="${room}-label"></span></div>
        <div class="meter"><div id="${room}-meter"></div></div>
        <p id="${room}-hint" class="hint"></p>
        ${extra}
        <div class="kast-buttons ${reset ? 'two' : 'one'}">
          ${reset ? `<button id="${room}-reset" class="btn blue">Opnieuw</button>` : ''}
          <button id="${room}-done" class="btn green">${doneLabel}</button>
        </div>
      </div>
    </div>`;
  document.getElementById('photo').before(el);
}
