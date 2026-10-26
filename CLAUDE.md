# Qalam Games

Website van basisschool Al Qalam (Gouda) met spellen die leerlingen uit groep 6, 7 en 8
met AI maken. React 18 + Vite 5, één pagina zonder router (`src/App.jsx`). Elk spel is
een losse HTML-pagina in `public/`, geopend in een iframe (`GameView`).

## Repo en draaien

- Bron van de live site (qalamgames.nl): `issam85/qalamgames`, branch `main`. Push naar
  `main` = live. Cloud-sessies hebben daar geen schrijfrecht (403); de lokale Mac wel.
- Kopie: `MinakamiMario/qalamgames2`, voor cloud-sessies. Houd die gelijk met `issam85`
  en bouw nooit verder op een eigen versie (zie "Herstel 26 oktober" hieronder).
- `npm install`, dan `npm run dev` → Vite (lokaal via `.claude/launch.json` op poort
  3099). Mario Party direct: `/marioparty/index.html` of `/#marioparty`.
- Lint: `npx eslint public/marioparty` moet groen zijn. `src/App.jsx` heeft 7 bestaande
  ESLint-meldingen die al op `main` stonden.
- `src/App.jsx` (1086 regels): `gameStyles` (sleutel → iframe-bron en stijl), per
  lichting een array (`top3`/`honorable` = Lichting 1, `lichting2Top3`/`lichting2Rest`,
  `lichting3`, `lichting4`), `cardLichtingen` (Lichting 4 en 3 delen één kaartblok) en
  de tabknoppen. Deep links via de URL-hash (`#marioparty`).
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

Huidige site: donker bruin/goud thema, serif-lettertype Amiri, hero met `school.png`,
blok "Wat is Qalam Games?" (groep 6, 7 en 8 maken met AI hun eigen spellen; "Geen
ervaring nodig — alleen creativiteit en nieuwsgierigheid!"), tabs Lichting 4 → 1, per
lichting top 3 en eervolle vermeldingen, uitgelichte spellen (Fight Night, Hajj) en
Hall of Legends (winnaars per lichting).

Richting: de heldere structuur en huisstijl van Mario Party (zie Huisstijl hierboven)
doorvoeren op de hele site, met het goud van Al Qalam als accent. Duidelijke secties,
één kaartensysteem voor alle spellen, consistente knoppen, goed op telefoon.

Voorgestelde stappen (elk eerst voorleggen):
1. Ontwerp maken: desktop-homepage, spelpagina (bijv. Mario Party) en mobiele homepage.
   Er staat al een leeg Design-canvas klaar:
   https://claude.ai/artifact/7wcxC1rz83yokZzQ4f9efs
2. Met Higgsfield (`nano_banana_pro`, zelfde 3D-cartoonstijl): een hero-illustratie en
   per spel een thumbnail; de intro-keyframe hierboven voor de Mario Party-kaart.
3. `src/App.jsx` (1086 regels) eerst opsplitsen in componenten (hero, tabs,
   spelkaart, GameView, Hall of Legends, data), dan de nieuwe stijl bouwen. Deep links,
   SEO-meta in `index.html`, `<noscript>` en de SEO-blokken per spel behouden.
4. Thumbnails in `public/thumbs/`; `og:image` per spel kan dan naar de thumbnail.
