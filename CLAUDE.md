# Qalam Games

Website van basisschool Al Qalam (Gouda) met spellen die leerlingen uit groep 6, 7 en 8
met AI maken. React 18 + Vite 5, één pagina zonder router. Elk spel is een losse
HTML-pagina in `public/`, geopend in een iframe (`components/GameView.jsx`).

## Repo en draaien

- Bron van de live site (qalamgames.nl): `issam85/qalamgames`, branch `main`. Push naar
  `main` = live. Cloud-sessies hebben daar geen schrijfrecht (403); de lokale Mac wel.
- Kopie: `MinakamiMario/qalamgames2`, voor cloud-sessies. Houd die gelijk met `issam85`
  en bouw nooit verder op een eigen versie (zie "Herstel 26 oktober" hieronder).
- `npm install`, dan `npm run dev` → Vite (lokaal via `.claude/launch.json` op poort
  3099). Mario Party direct: `/marioparty/index.html` of `/#marioparty`.
- Lint: `npx eslint public/marioparty` moet groen zijn. In `src/` staan alleen
  `react/prop-types`-meldingen (het project gebruikt geen PropTypes) en bestaande
  meldingen in `IslamicRacingGame.jsx`.
- Opbouw `src/` (elk bestand < 150 regels, behalve `IslamicRacingGame.jsx`):
  - `App.jsx` kiest homepage of spel via `hooks/useHashPage.js` (deep link `#sleutel`,
    terug naar home herstelt de scrollpositie).
  - `data/games.js`: per spel titel, `src` (null = React-component), accentkleur,
    optioneel `video`, `blurb`, `controls`, `howto`; `thumbOf()` → `public/thumbs/`.
  - `data/lichtingen.js`: `LICHTINGEN` (top/rest per lichting), `FEATURED`, `LEGENDS`,
    `findEntry()`, `moreGames()`.
  - `components/`: NavBar, Hero, About, Featured, Lichtingen + GameCard, Legends, Footer,
    GameView + GameInfo, LoopVideo (video alleen ≥768 px en zonder "minder beweging").
  - `styles/`: `tokens.css` (kleuren, letters, vormen), `base.css`, `buttons.css` en
    per onderdeel een eigen bestand, geïmporteerd door het component.
- Nieuw spel toevoegen: bestand in `public/`, regel in `data/games.js`, leerling in
  `data/lichtingen.js`, thumbnail `public/thumbs/<sleutel>.webp` (960×540), plus
  `<noscript>`, `sitemap.xml` en het SEO-blok.
- Schoolfoto: `public/school.webp` (alleen het gebouw). Het oude `school.png` was een
  screenshot mét browserbalk en bladwijzers en is verwijderd. Deelbeelden (og:image,
  twitter:image, JSON-LD) staan in `public/og/` als 1200×630 JPG: `home.jpg` en één per
  spel; nieuw spel = ook een `og/<sleutel>.jpg`.
- De Hajj-game draait extern (`https://hajj-simulator-3d.vercel.app`, eigen repo).
- SEO staat al: meta, Open Graph, JSON-LD en `<noscript>` in `index.html`, een
  `<!-- qalam-seo -->`-blok per spelpagina, `public/robots.txt` en `public/sitemap.xml`.
  Nieuw spel = ook in `<noscript>`, `sitemap.xml` en een eigen SEO-blok.
- Meer achtergrond: `PROJECT.md`.

## Herstel 26 oktober 2026

`qalamgames2` was in juni opnieuw opgebouwd uit de gedeployde build ("bron verloren"),
omdat een cloud-sessie niet bij `issam85` kon. Daardoor misten daar SEO, Fight Night en
Hall of Legends, en stond Mario Party alleen in `qalamgames2`. Hersteld door Mario Party
over te zetten op `issam85/main`; de geschiedenis van `qalamgames2` is via een merge
bewaard. De lokale Hajj-kopie (`public/hajj/`) uit `qalamgames2` is bewust niet
meegenomen.

## Werkwijze

- Communicatie in het Nederlands, kort en concreet.
- Eerst kort beschrijven wat je gaat aanpassen en wachten op akkoord; in stappen werken,
  één commit per stap.
- Bestanden kort houden (richtlijn < 150 regels); bij groei eerst logisch opsplitsen.
- Geen spaties aan regeleinden of op lege regels. Geen workarounds zonder te vragen.

## Voortgang 26 oktober 2026: Mario Party (Lichting 4)

Gebouwd in `qalamgames2` (PR #1, merge-commit `ee82060`), daarna overgezet naar
`issam85` (zie Herstel). Staat op de homepage als Lichting 4, "De nieuwste lichting —
oktober 2026". Maker staat nu als "Al Qalam kids"; vervang door de leerling(en) zodra
bekend.

**Spel** (`public/marioparty/`, ES-modules zonder build):
- 1 of 2 spelers kiezen uit Mario, Luigi, Peach, Daisy, Toad, Yoshi en Bowser; de rest
  is CPU, 4 deelnemers. 5 rondes.
- Minigame "Sprint": speler 1 ramt op spatie, speler 2 op pijltje omhoog.
- Toad deelt uit: winnaar 2 sterren + 10 punten, tweede 1 ster + 5 punten, verliezers
  een trede omlaag op een stenen trap van 10 treden (vooraanzicht, ster bovenaan).
- Einde: overwinningsclip van de winnaar, finale, eindscherm met "Opnieuw spelen".

**Bestanden:**
- `game.js` spelverloop · `setup.js` keuzescherm · `hud.js` spelerskaarten
- `board.js` trap, ster, sterrenlogica · `board-anim.js` springen/zakken op de trap
- `minigame-sprint.js` race-logica · `sprint-draw.js` race tekenen
- `toad.js` Toad wijst/klapt, sterren vliegen naar de kaarten
- `sprites.js` sprite sheets afspelen · `effects.js` stof, confetti, sterretjes
- `cutscene.js` video's met "Overslaan" · `transition.js` sterwipe tussen schermen
- `characters.js`, `assets.js` plaatjes en cache
- CSS: `base.css`, `setup.css`, `play.css`, `toad.css`, `overlay.css`
- Beeld: `img/` (renders, achtergronden), `sprites/` (3,8 MB), `video/` (12 cutscenes, 16 MB)

**Huisstijl van de game** (basis voor de website-upgrade): blauwe lucht als radiaal
verloop (`#8ee0ff` → `#35a7f0` → `#1565c0`), lettertype Fredoka 600/700, goudgele koppen
(`#ffd43b`) met rode schaduw (`#c62828`), witte kaarten met ronde hoeken (18–24 px) en
zachte schaduw, bolle knoppen met een 3D-onderrand (groen `#43a047`, blauw `#1e88e5`,
geselecteerd goud), glanzende 3D-cartoonrenders.

## Higgsfield: wat werkt

- Beelden: `nano_banana_pro` met de bestaande renders als `image_references` houdt de
  karakters consistent (~2 credits). Noem karakters beschrijvend ("the cartoon plumber in
  the red cap"), niet bij naam: GPT Image weigert namen.
- Video: `kling4_0` image-to-video, 720p/1080p, 3–6 s, met geluid (~2–6 credits).
  Seedance weigert de karakters (IP). AutoSprite faalt op deze karakters.
- Max ± 4 taken tegelijk. Bij "Preset … was recommended" opnieuw indienen met
  `declined_preset_id`. Yoshi wordt soms onterecht geblokkeerd: "little green dinosaur toy".
- Sprites zijn zo gemaakt: Kling-clip van 3–4 s op witte achtergrond (bron met veel ruimte
  boven het karakter) → frames met ffmpeg op 12 fps → lokaal uitsnijden met `rembg`
  (`isnet-general-use`) → schalen op de bronpose van frame 0 (staande hoogte 128 px,
  voeten op één punt) → WebP-strip + JSON. De hulpscripts stonden alleen in de werkmap
  van de sessie en zitten niet in de repo.

Bruikbare Higgsfield-ID's (referenties voor nieuw beeld in dezelfde stijl):

| Wat | ID |
|---|---|
| Mario / Luigi | `03e52974-7be5-4f7b-989f-24a649271e82` / `28326022-03cb-45e6-9aed-95b391a2d111` |
| Peach / Daisy | `deb81863-c78d-4248-af03-9f650d01a787` / `9e8500de-a515-4177-b0ae-9993746e4f6a` |
| Toad / Yoshi | `150beb68-7840-4cc0-b3d6-0d4e2d2b1e91` / `e225866b-8561-4069-9109-54147e73acc4` |
| Bowser | `89e34496-1f83-42b8-8196-8e6a2b9b9918` |
| Achtergrond trap / ster | `5787645a-2597-4774-a11d-f5556d89b5af` / `f38ea363-dca2-4d72-8379-15386a321467` |
| Steentextuur / racebaan | `6c97f402-dad0-4eb1-b9d7-1d4240898bdd` / `ab56c744-ca4b-4d2a-8d32-f4c00fe35710` |
| Intro-keyframe (7 karakters voor de trap) | `103cd6f8-66b1-4e13-8c05-ed3e2cf7c39a` |

## Open punten Mario Party

- Per ronde drie cutscenes van 6 s (racestart, Toad, trap); misschien te lang. Optie: de
  trap-clip alleen na ronde 1.
- Yoshi heeft geen rust-animatie (stilstaande pose met ademhaling in de code).
- `minigame-sprint.js` is 154 regels.

## Volgende opdracht: website-upgrade

Opdracht van de gebruiker: "de website moet geüpgraded worden. Gebruik Higgsfield waar
mogelijk. Structuur, professionalisering en duidelijkheid van het huidige actuele project
van Mario moeten herkenbaar zijn."

Oude site: donker bruin/goud thema, serif-lettertype Amiri, hero met de schoolfoto,
blok "Wat is Qalam Games?" (groep 6, 7 en 8 maken met AI hun eigen spellen; "Geen
ervaring nodig — alleen creativiteit en nieuwsgierigheid!"), tabs Lichting 4 → 1, per
lichting top 3 en eervolle vermeldingen, uitgelichte spellen (Fight Night, Hajj) en
Hall of Legends (winnaars per lichting).

Richting: de heldere structuur en huisstijl van Mario Party (zie Huisstijl hierboven)
doorvoeren op de hele site, met het goud van Al Qalam als accent. Duidelijke secties,
één kaartensysteem voor alle spellen, consistente knoppen, goed op telefoon.

Stappen (elk eerst voorleggen):
1. Klaar (27 okt): ontwerp op het Design-canvas
   https://claude.ai/artifact/7wcxC1rz83yokZzQ4f9efs: homepage desktop, spelpagina
   Mario Party, homepage mobiel. Witte navigatiebalk, hero als illustratie over de volle
   breedte met donkerblauw verloop links achter de tekst, schoolfoto bij "Wat is Qalam
   Games?", Mario Party als brede kaart, één kaartensysteem (thumbnail 16:9, badge
   Nieuw/#rang, cijfer, Speel + Versie 2), Hall of Legends met 3 winnaars (Lichting 3 =
   Hajj, namens de hele groep). Letters: Fredoka (koppen) + Nunito (tekst). Knoppen groen
   `#2e7d32`/`#1b5e20`, blauw `#1565c0`/`#0d47a1`, goud `#ffd43b`/`#c9a400`.
2. Klaar (27 okt): beelden in `public/thumbs/` (17 spellen, WebP 960×540),
   `public/hero/` (A/B/C, desktop 21:9 en `-mobile` uitsnede) en `public/video/`
   (hero-a/b/c, fightnight, hajj; zonder geluid, `marioparty.mp4` is een montage van de
   game-cutscenes). Nog niet gecommit. Gekozen hero is nog open (canvas: Tweaks → Hero;
   A = kinderen aan laptops is de standaard).
3. Klaar (27 okt), op branch `website-upgrade`: App.jsx opgesplitst en de nieuwe stijl
   gebouwd (hero A gekozen). Nog niet gemerged/gepusht; wacht op akkoord gebruiker.
4. `og:image` per spel naar de thumbnail. Video's alleen op desktop afspelen
   (`muted`, `playsinline`, `loop`), op mobiel het stilstaande beeld.

Higgsfield-ID's website-beelden (`nano_banana_pro`, 2k; video `kling4_0` 1080p met
dezelfde start- en eindframe voor een naadloze loop). Thumbnails zijn gemaakt met een
screenshot van het startscherm van elk spel als `image_references`; Sonic werd met
screenshot geweigerd en is zonder referentie (zonder figuur) gemaakt.

| Wat | ID |
|---|---|
| Hero A (zonder logo's) / B / C | `b43eef1c-1f9c-4609-b448-6df4e83c982a` / `d1cc0456-2f4d-4081-b21b-80a84b614fd4` / `9d093655-5e82-4b45-b556-4111cd46d4ef` |
| Fight Night / Hajj / Fifa Ultimate | `07e49b0c-2564-4b20-9873-7a54842d39a2` / `15f542e8-d6c3-49b5-955b-da041293199c` / `03a96326-4c6c-44dc-b252-4b962ff64955` |
| Sonic / Stunt Racer / Granny | `38e00cad-d513-405e-8fd1-d5c0b711fb14` / `efcc4cd3-2b72-4b0c-944a-00b4b5a4e88c` / `46c0a2d7-c9b4-4da2-939b-feec57d3b125` |
| Turbo Race / Basketball Islam / Voetbal Legends | `322368b8-c469-47a1-9ab7-48cd24135709` / `0a2f35e7-26a0-40ec-ad10-82e943d4817c` / `a6515259-efab-4a99-b819-261f35b3ce4d` |
| MijnCraft / Banana Storm / Vice City | `e156562c-e71e-4cc9-9d41-2fefaea0002b` / `3fc67245-4272-4f04-8999-d9e1c96b1c8d` / `16857310-51c8-4e7d-9699-c9a148672557` |
| Penalty / Auto Spel / Turbo Racer 3D | `2e0fa1e6-e961-4a25-b17e-2f95c47f658a` / `3dcfa57b-5b10-4bbd-92fd-5af7de90320a` / `9b194f15-c439-4592-887c-51b557b1a694` |
| سباق السلام (Race of Peace) | `9b9be001-db78-4c1e-a355-7f9bb22b9d61` |
| Video hero A / B / C | `fe2d198b-7ee7-49bd-b0a4-bf67523ccd81` / `a4170df9-d86e-42d7-aa4e-02b419d974b8` / `821a1284-d2ab-42bd-8fd5-bafa13fc6bbf` |
| Video Fight Night / Hajj | `9c9c2e01-4955-499d-85c4-2d98d05ed975` / `edab91e8-1953-4ded-92a3-2bd82fd2c764` |
