# Prompt: OutMatch (nieuw spel, november 2026)

Bouw een nieuw spel voor Qalam Games: **OutMatch**. Lees eerst `CLAUDE.md` en `PROJECT.md` en
volg de werkwijze: Nederlands, eerst voorleggen, in stappen, één commit per stap, bestanden
< 150 regels, geen spaties aan regeleinden. Werk op een eigen branch `outmatch`.

## Wat het is

Een eigen arcade-voetbalspel, 3 tegen 3 plus een CPU-keeper per team, in een kooi op een dak in
een avondstad. Het is geen nabouw van Rematch: geen namen, logo's, figuren, arena's, menu's of
interface van dat spel. Het hoort wel bij hetzelfde genre:

- Elke speler bestuurt één voetballer, niet het hele team.
- De bal kaatst tegen de muren en het plafondnet, dus er is geen uitbal of corner.
- Geen buitenspel, overtredingen of kaarten. Een tackle zonder bal laat je zelf even struikelen.
- Een wedstrijd duurt 1,5 minuut, plus 10 of 20 s blessuretijd (willekeurig, getoond op een
  bordje). Staat het daarna gelijk, dan volgen penalty's.
- Maker voorlopig "Al Qalam kids" (vervangen zodra de leerling bekend is).

## Teams en figuren

- Alleen jongens, in sportkleding met lange broek, gemaakt van simpele vormen en met animaties in
  code: lopen, sprinten, trappen, lob, tackle, struikelen, juichen. De keeper kan ook duiken,
  vangen en uitgooien.
- Elk team heeft vaste kleuren (die altijd goed van elkaar te onderscheiden zijn). Je kunt de
  teamnaam en per speler een naam en een rugnummer aanpassen. Shirtkleur kies je niet zelf.
- De keeper is altijd een CPU. Kinderen spelen altijd in het veld.

## Spelvormen

- **Losse wedstrijd**: 1 speler (met 2 CPU-teamgenoten) of 2 spelers samen in één team, tegen een
  CPU-team. Moeilijkheid: Makkelijk, Normaal en Lastig.
- **Toernooi**: 4 wedstrijden tegen steeds sterkere CPU-teams (eigen namen en kleuren), met een
  beker aan het eind. Verlies = opnieuw proberen. De voortgang wordt bewaard.
- **Training**: drie oefeningen met een score: schieten op doelen in het net, passen door
  poortjes en de keeper uitspelen (1 tegen keeper).
- Geen spelvorm met 2 spelers tegen elkaar, en geen online spel.

## Penalty's

Om en om 3 penalty's per team, daarna sudden death. Spelers nemen de penalty's van hun eigen
team: richten met een pijl die heen en weer gaat, tik op het goede moment, kracht met een balk.
De CPU-keepers duiken met een reactietijd die hoort bij de moeilijkheid. Voorstel (eerst
voorleggen): bij penalty's van de tegenstander mag speler 1 de keeper laten duiken.

## Besturing

- Speler 1: WASD lopen, Shift sprinten (uithoudingsbalk), Spatie passen naar de teamgenoot in je
  looprichting, F schieten (vasthouden = harder, met een balk), R lob, E tackle, Q om de bal
  roepen.
- Speler 2: pijltjes lopen, rechter Shift, Enter, `/`, `.` en `'`. Alle toetsen staan in één
  tabel `KEYS` in `input.js`.
- Tablet en telefoon (liggend): virtuele joystick links, knoppen rechts (Pas, Schiet, Lob,
  Tackle, Sprint). Telefoon staand toont "Draai je telefoon". Bij 2 spelers op een tablet krijgt
  elke speler een eigen helft met joystick en knoppen.
- Een beetje hulp: de bal neem je automatisch aan als je ernaartoe loopt, en passen en schieten
  buigen een beetje naar een teamgenoot of het doel.

## Camera en beeld

- Altijd een brede camera, schuin boven langs de lange zijde, die de bal rustig volgt (ook bij 2
  spelers). Je eigen speler heeft een gekleurde ring en "P1"/"P2" boven het hoofd.
- Arena: kooi op een dak in een avondstad, met lampen, hekken, stadslichten en een maan.
  Huisstijl van de site: Fredoka, goudgele koppen, witte kaarten met ronde hoeken en bolle
  knoppen.
- HUD: teamnamen en stand, klok, bordje met de blessuretijd, uithoudingsbalk, schietkracht, en
  een pijl naar de bal als die buiten beeld is.
- Doelpunt: korte vertraging, confetti en "GOAL!", het team juicht, daarna de aftrap.
- Geen muziek. Wel geluid via WebAudio: trap, muur, net, paal, fluit en publiek.

## Techniek

- `public/outmatch/` (ES-modules zonder build), three.js uit `marioparty/vendor/`, direct te
  openen op `/outmatch/index.html` en `/#outmatch`.
- 60 fps op een Chromebook, vlot op tablet en telefoon: weinig polygonen, één schaduwbron,
  texturen ≤ 1024 px, lagere resolutie op zwakke apparaten. Gebruik `performance.now()`, want
  requestAnimationFrame geeft in de app-browser geen tijd mee.
- De spelregels en de natuurkunde staan apart van het tekenen, zodat ze in Node te testen zijn:
  - bal: zwaartekracht, effect, stuiteren tegen vloer, muren, net en paal, rollen, afremmen;
  - spelers: versnellen, sprinten, draaien, balbezit, tackles, struikelen;
  - wedstrijd: aftrap, doelpunt, klok, blessuretijd, penalty's.
- CPU: per rol een plek die meeschuift met de bal; vrijlopen, passen naar wie vrij staat,
  schieten als de kans groot genoeg is, niet met z'n allen achter de bal aan. CPU-teamgenoten
  passen naar de speler als die om de bal roept.
- In `localStorage` (`outmatch`): teamnaam, spelersnamen en nummers, voortgang in het toernooi,
  bekers, en de beste score per oefening.

## Bestanden (voorstel)

`app.js` schermen · `game.js` wedstrijdverloop · `rules.js` klok, blessuretijd, doelpunt, aftrap
· `penalties.js` · `ball.js` + `collide.js` natuurkunde · `player.js` beweging en acties ·
`keeper.js` · `cpu.js` + `cpu-roles.js` · `tournament.js` · `training.js` · `input.js` +
`touch.js` · `world.js` renderer en camera · `arena.js` kooi, doelen en stad · `figure3d.js` +
`anim.js` · `ball3d.js` · `fx.js` · `hud.js` + `hud.css` · `menu.js` + `menu.css` · `teams.js`
namen en kleuren · `sound.js` · `storage.js` · `config.js` (alle getallen op één plek).

## Stappen (elk eerst voorleggen, elk een eigen commit)

1. Kooi, doelen, bal en één speler die loopt, sprint en schiet; natuurkunde getest in Node.
2. Passen, lob, tackle, balaanname en de CPU-keeper.
3. CPU-teams 3 tegen 3; een Node-script laat 50 CPU-wedstrijden draaien en controleert dat er
   gescoord wordt en niemand vastloopt.
4. Wedstrijdverloop: aftrap, doelpunt, klok, blessuretijd, penalty's, HUD en eindscherm.
5. 2 spelers in één team, en de besturing voor tablet en telefoon.
6. Menu, teamnaam, spelersnamen en nummers, en opslaan.
7. Toernooi en training.
8. Afwerking: animaties, effecten en geluid.
9. Homepage: regel in `src/data/games.js`, leerling in `src/data/lichtingen.js` (Lichting 4,
   badge "Nieuw"), `public/thumbs/outmatch.webp` (960×540) en `public/og/outmatch.jpg`
   (1200×630), gerenderd uit de eigen 3D-wereld, plus `<noscript>`, `sitemap.xml` en het
   `<!-- qalam-seo -->`-blok.
10. `CLAUDE.md` bijwerken met een sectie over OutMatch.

Na elke stap: `npx eslint public/outmatch`, het spel openen in de preview (poort 3099) en een
schermafdruk laten zien, ook op telefoonformaat.
