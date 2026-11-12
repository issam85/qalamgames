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
- Per ronde een keuzescherm met alle minigames (`minigames.js`): er is er al een
  voorgesteld (willekeurig, zonder herhaling), de spelers kunnen een andere kiezen. De
  grote kaart (`img/cards/<sleutel>.webp`, 960×540) toont uitleg en toetsen. Speler 1
  gebruikt spatie, speler 2 pijltje omhoog; op een tablet tik je op je helft.
  - Sprint (3D): momentum opbouwen, turbo bij volhouden, eerste over de finish.
  - Salto (`jump-input.js`, `fx2d.js`): springen = spatie / pijl omhoog; A/D (speler 1)
    of ←/→ (speler 2) = salto, vanaf de grond meteen een salto-sprong of in de lucht
    (Sterrenjacht: alleen in de lucht, op de grond loop je ermee); op een tablet in de
    lucht nog een tik. Alleen = beide sets. De figuur draait rond met vaagspoor
    (`drawSpinning`), "Salto!" springt op.
  - Mijnkar (2D): vier sporen boven elkaar, karretje rijdt vanzelf, spring (boog
    vooruit, in de lucht ×1,15) over rotsen, kristallen en gaten (botsing = 0,9 s
    stil). Salto = na de landing 1 s turbo ×1,5 met vonken. CPU's missen soms, vaker
    als ze ver voor de spelers liggen, en doen in 35% een salto.
  - Sterrenjacht (2D): 30 s, sterren vallen. Speler 1: A/D lopen, spatie springen, W
    salto, S duwen; speler 2: ←/→, ↑, Enter, ↓ (`STAR_KEYS` in `jump-input.js`). Tablet:
    onderste 55% vasthouden = lopen, bovenste 45% tikken = springen/salto, DUW-knop per
    speler (`touch-buttons.js`). Duw (`sterren-push.js`): bereik 80 px in de
    kijkrichting, geduwde vliegt 150 px opzij, 0,6 s duizelig (niet lopen, springen,
    vangen) en laat 1 ster vallen; 1,2 s wachttijd. Gewone ster 1, grote ster 3 punten,
    tijdens een salto dubbel; gelijke stand = wie het eerst zoveel had. CPU's kiezen
    elk een andere ster, springen soms, duwen soms wie naast ze staat en worden trager
    als ze 4 punten voorliggen.
  - Springtouw (2D): twee Toads draaien, omlooptijd 1,5 s → ×0,95 per ronde tot 0,62 s.
    Druk = sprong van 0,55 s, salto = 0,8 s en een stijlpunt (in de lucht tot 0,07 s
    voor de landing). Iedereen twee levens (hartjes). "SPRING!" + gloed op de vloer als
    aanwijzing, vol tot ronde 3, weg vanaf ronde 8. Laatste wint; wie tegelijk afvalt,
    staat hoger met meer salto's. CPU's missen vaker naarmate het sneller gaat, en veel
    vaker zodra alle spelers eruit liggen.
- Toad deelt uit: winnaar 2 sterren + 10 punten, tweede 1 ster + 5 punten, verliezers
  een trede omlaag op een stenen trap van 10 treden (vooraanzicht, ster bovenaan).
- Einde: overwinningsclip van de winnaar, finale, eindscherm met "Opnieuw spelen".
- Filmpjes: de rondefilmpjes (racestart, Toad, trap) alleen in ronde 1. Tijdens een
  filmpje grote knoppen "Overslaan" en "Alle filmpjes overslaan" (rest van dit spel);
  op het keuzescherm "Filmpjes: Aan/Uit", onthouden in `localStorage`
  (`marioparty-clips`).

**Bestanden:**
- `game.js` spelverloop · `setup.js` keuzescherm · `hud.js` spelerskaarten
- `board.js` trap, ster, sterrenlogica · `board-anim.js` springen/zakken op de trap
- Sprint in 3D (three.js 0.186.1, lokaal in `vendor/`, uitgesloten van ESLint):
  `minigame-sprint.js` raceverloop en spelklok · `sprint-input.js` toetsen, aanraken
  en CPU-tempo (volgt het tempo van de spelers) · `sprint-momentum.js` power/turbo ·
  `sprint-runners.js` lopers bewegen · `sprint-view.js` scène + 2D-overlay (logisch
  960×540) · `sprint-world.js` gedeelde renderer, lucht, heuvels, opruimen per ronde ·
  `sprint-track.js` baan · `sprint-decor.js` tribune, borden · `sprint-crowd.js`
  Toad-publiek · `sprint-runner3d.js` sprites als billboards (één GPU-textuur per strip)
  · `sprint-camera.js` camerashots · `sprint-particles.js` wolken, confetti in 3D ·
  `sprint-hud.js` + `sprint-hud.css`/`sprint-gauge.css` portret, tijd, power bars ·
  `sprint-fx.js` snelheidslijnen, flits, P1/P2-markering · `sprint-tex.js` ·
  `sprint.css` speelveld
- Minigames 2D: `stage2d.js` (canvas op logisch 960×540, status, labels) ·
  `minigame-mijnkar.js` verloop · `mijnkar-course.js` parcours, karretjes, CPU ·
  `mijnkar-scene.js` grot en sporen · `mijnkar-draw.js` karretjes, vonken, voortgang ·
  `minigame-sterren.js` verloop · `sterren-input.js` links/rechts vasthouden ·
  `sterren-world.js` sterren, lopen, springen, vangen · `sterren-push.js` duwen ·
  `sterren-cpu.js` · `sterren-scene.js` hemel, heuvels · `sterren-draw.js` sterren,
  figuren, scores · `touch-buttons.js` knoppen op het veld voor tablets · `minigame-springtouw.js` verloop ·
  `springtouw-world.js` touw, springen, levens, CPU · `springtouw-scene.js` plein en
  Toads · `springtouw-draw.js` touw, aanwijzing, springers, stand.
  Nieuwe minigame = regel in `minigames.js` (`start(canvas, statusEl, players,
  onFinish)` en `stop()`), kaart in `img/cards/`, en `three: true` als hij het
  3D-canvas gebruikt.
- `toad.js` Toad wijst/klapt, sterren vliegen naar de kaarten
- `sprites.js` sprite sheets afspelen · `effects.js` stof, confetti, sterretjes
- `cutscene.js` video's met "Overslaan" · `transition.js` sterwipe tussen schermen
- `characters.js`, `assets.js` plaatjes en cache
- CSS: `base.css`, `setup.css`, `play.css`, `toad.css`, `overlay.css`, `card.css`; schermindeling
  in `layout.css` (elk scherm één schermhoogte, grote knop altijd in beeld),
  `layout-phone.css` (staand) en `layout-low.css` (liggend)
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

- Yoshi heeft geen rust-animatie (stilstaande pose met ademhaling in de code).
- Sprint: de karakters rennen nog met de bestaande sprites; driewieler-sprites zoals in
  "Trike Harder" kunnen met Higgsfield (zie `docs/mario-party-plan.md`, §9.4) zodra er
  credits zijn. Nog open uit de review: finishlint die knapt; sprite-strips breder dan
  4096 px (Bowser cheer/sad, 4828 px) opsplitsen in rijen; testen op een echte
  Chromebook (framerate).
- Nieuwe minigames (volgorde van de gebruiker): Mijnkar, Sterrenjacht en Springtouw
  zijn klaar. Speelveld-achtergronden zijn nu getekend in code; de Higgsfield-prompts
  staan in `docs/mario-party-plan.md` §9.1 voor als er credits zijn.

## Mijn Leven (nieuw spel, november 2026)

Idee van een leerling: een levensspel voor moslimmeisjes. Een huis met kamers:
kledingkast (dress-up), kapper, badkamer (douchen, make-up), keuken, gezin (man en
kinderen), moskee en Mekka, slaapkamer (slapen, liedjes) en een winkel. Werktitel
"Mijn Leven"; naam en maker zijn nog niet bekend. Ontwerp op het Design-canvas:
https://claude.ai/artifact/PEg7qC9eBYx5Fp4X2mryHq (Kledingkast, Kapper, Het huis).

- Staat in `public/mijnleven/` (ES-modules zonder build), direct te openen op
  `/mijnleven/index.html` of `/#mijnleven`. Op de homepage in Lichting 4 met badge
  "Nieuw", maker voorlopig "Al Qalam kids" (vervang zodra de leerling bekend is).
  `thumbs/mijnleven.webp` en `og/mijnleven.jpg` zijn gemaakt uit de eigen tekeningen
  van het spel: een HTML-pagina met drie meisjes (`dollSvg`) en de titel, gerenderd met
  headless Chrome op 960×540 en 1200×630. Het hulpscript staat niet in de repo.
- Klaar: het huis (overzicht) en alle acht kamers, in deze volgorde: Badkamer,
  Kledingkast, Kapper, Keuken, Gezin, Moskee en Mekka, Slaapkamer, Winkel. Alles wordt
  bewaard in `localStorage` (`mijnleven`); "Klaar!" geeft per kamer de eerste keer per
  dag 2 sterren.
  - Badkamer: onder de douche 8 plekken, elk spons → douche → handdoek (slepen; je
    ziet alleen het hoofd, de rest zit achter het douchescherm). Voor de spiegel (in
    badjas, handdoek om het haar): tanden poetsen (slepen over de mond) en make-up:
    lippenstift, blush en oogschaduw, elk 5 kleuren (kleur kiezen of op het gezicht
    tikken), watje = eraf. Make-up blijft zitten in het huis, de kast, op de foto en
    bij de kapper. "Klaar!" kan pas na douchen en tanden poetsen; elke dag opnieuw.
  - Kledingkast: 6 categorieën × 6 soorten × 8 kleuren, "Verras me!" en "Foto" (PNG
    720×960 om op te slaan).
  - Kapper (wensen van de leerling): elke dag 6 knopen, die je eruit borstelt door
    erover te slepen (borstel 2 halen, kam 4; de knoop wordt per haal kleiner). Puntkam
    = scheiding en twee vlechten. Schaar: los haar heeft zes lokken vóór de schouders,
    je sleept de schaar door een lok en die wordt daar afgeknipt (het stukje valt; per
    dag groeit een lok 50 terug, lengte 150–300; staart en vlechten volgen de
    gemiddelde lengte). Föhn = slepen tot het glanst (de glans komt langzaam op, een
    tik telt ook), hoed, hoofddoek (die uit de kledingkast). Kapsels met waar ze voor zijn: los (spelen met je dochters),
    staart (eten maken), vlechten, hoge knot, lage knot (onder een hoed), bruiloft.
    "Klaar!" kan pas als alle knopen eruit zijn.
  - Keuken: recept kiezen (pannenkoeken, couscous, soep). Stap 1: de 4 ingrediënten
    in de volgorde van het briefje in de kom tikken (er staan er 6, twee horen er
    niet in). Stap 2: met de lepel rondjes roeren (slepen, 4 rondjes). Stap 3: het
    vuur: een pijl loopt in 3,2 s over een balk, tik als hij in het groen staat
    (pannenkoeken 3 keer omdraaien, de andere 1 keer van het vuur); te vroeg of te
    laat = opnieuw. "Klaar!" kan pas als het gerecht af is; het wordt bewaard als
    `meal` voor het gezin.
  - Gezin: papa en de dochters Amira en Noor (namen zelf gekozen, de leerling mag ze
    veranderen) met hartjes: papa eten en thee, een dochter eten, spelen en voorlezen.
    Links kies je wat je doet, daarna tik je op iemand: eten (alleen als er een `meal`
    is; als alle drie gegeten hebben is het op), thee (papa), bal (3 keer tikken),
    voorlezen (het boek over een dochter slepen), naar bed (pas met drie volle
    hartjes). "Klaar!" kan pas als alle hartjes vol zijn en beide dochters slapen;
    elke dag opnieuw.
  - Moskee en Mekka, drie onderdelen (links; wat af is krijgt een vinkje):
    Wudu: de 7 stappen in volgorde tikken (handen, mond, neus, gezicht, armen, hoofd,
    voeten); een foute keuze zegt wat eerst komt. Gebed (pas na wudu): de lucht laat
    een moment van de dag zien, kies het goede gebed (Fajr, Dhuhr, Asr, Maghrib,
    Isha; gevraagd in een vaste, door elkaar gezette volgorde). Reis naar Mekka, in
    het zwart en goud van het Hajj-spel: tawaf (7 rondes om de Kaaba slepen, alleen
    tegen de klok in telt), Zamzam drinken (tik), sa'i (7 keer slepen tussen Safa en
    Marwa, begin op Safa, eind op Marwa); daarna een knop naar het Hajj-spel
    (`/#hajj`, `target="_top"`). "Klaar!" kan na wudu en de vijf gebeden; de reis
    geeft 3 extra sterren, één keer per dag (`mekkaDay`).
  - Slaapkamer: pyjama (4 soorten × 8 kleuren; aan = `pyjama.day` is vandaag),
    muziekdoosje (acht toetsen om zelf te spelen en drie eigen liedjes, geluid via
    WebAudio) en de groene knop "Slapen". Slapen kan pas als er vandaag 3 kamers af
    zijn en de pyjama aan is. Daarna is het nacht (2,6 s) en begint een nieuwe dag:
    `nights` + 1, make-up eraf, terug naar het huis.
  - Winkel: 16 dingen voor sterren (`shop.js`, sleutel `<soort>:<nummer>` in
    `game.owned`): per kledingcategorie de zevende soort (4–8 sterren; `FREE_ITEMS`
    in `data.js`), twee extra make-upkleuren per soort (3 sterren; `FREE_COLORS` in
    `makeup.js`) en vier haarspullen (haarband, strik, bloem, diadeem; `HATS` in
    `hair.js`, `hair.hat` is een nummer, 1 = hoed, bij de kapper tik je met de hoed
    door wat je hebt). Links kies je de groep, tik op iets en het meisje past het in
    de etalage; de groene knop is "Kopen" (geen Opnieuw). Gekocht = meteen aan, en
    zichtbaar in kast, badkamer en kapper.
- De dag in het spel (`today()` in `ui.js`) = de echte datum plus het aantal nachten
  (`2026-11-09/3`; zonder nachten alleen de datum, zodat oude spellen blijven
  kloppen). Een nieuwe dag begint dus door te slapen én als het echt morgen is; dan
  zijn de knopen terug, moet je weer douchen, heeft het gezin lege hartjes en zijn
  de sterren per kamer weer te verdienen.
- Bestanden: `app.js` schermen, sterren, foto · `wardrobe.js` kiezen in de kast ·
  `data.js` categorieën, soorten, kleuren · `glans.js` de Glans-stijl (verloop per
  kleur via `paint()`, `defs()` bovenin elke SVG, `shape()`, glans, sterretjes,
  `mirror()`) · `doll.js` (gezicht met grote glanzende ogen en make-up, mouwen,
  handen; hoofd rond (150, 118), schouders op 196, handen op (90, 330) en (210, 330))
  + `doll-parts.js` de kleren als SVG (vak 300×520, één functie per soort, krijgt de
  verf `p`; de tas hangt aan de rechterhand; bij de baljurk `GOWN` geen tas en
  schoenen, wel pofmouwen) · `photo.js`
  · `storage.js` · `ui.js` · `pointer.js` slepen met muis of vinger op een tekening
  (rekent om naar de viewBox, met pointer capture omdat de SVG bij elke beweging
  opnieuw wordt gemaakt; gebruik dit voor elke kamer waar je sleept) ·
  kapper: `salon.js` scherm en slepen · `salon-panel.js` knoppen en meter ·
  `salon-actions.js` wat het gereedschap doet (losse functies, zo te testen) ·
  `salon-tools.js` gereedschap en het plaatje bij de muis · `hair.js` knopen, nieuwe
  dag, hoofd en schouders · `hair-styles.js` kapsels (elk twee lagen: achter en vóór
  het lijf), lokken en vallende stukjes ·
  badkamer: `bathroom.js` scherm · `bath.js` plekken en wassen (losse functies) ·
  `bath-scene.js` douche en spiegel · `bath-tools.js` spullen · `makeup.js` kleuren ·
  keuken: `kitchen.js` scherm · `cook.js` stappen, roeren, op tijd zijn (losse
  functies) · `cook-scene.js` aanrecht, recept, kom · `cook-stove.js` fornuis, balk,
  gerechten · `recipes.js` ingrediënten en recepten ·
  gezin: `family-room.js` scherm en wat je vasthoudt · `family.js` hartjes en wat
  elke actie doet (losse functies) · `family-scene.js` woonkamer en de figuren ·
  moskee: `mosque-room.js` scherm · `mosque.js` wudu, gebeden, tawaf en sa'i (losse
  functies) · `mosque-text.js` uitleg · `mosque-scene.js` wasplaats en de lucht per
  gebed · `mecca-scene.js` tawaf, Zamzam en sa'i ·
  slaapkamer: `bedroom.js` scherm en slapen · `bedroom-scene.js` kamer, pyjama's en
  muziekdoosje · `tunes.js` toetsen en liedjes ·
  winkel: `shop-room.js` scherm · `shop.js` aanbod en kopen (losse functies) ·
  `shop-scene.js` etalage met het meisje die past.
  `rooms.js` sluit de kamers aan op het spel (wat een kamer mag lezen en bewaren, en
  de regel voor "Klaar!" per kamer); `app.js` houdt het spel, de sterren en de foto.
  `screen.js` bouwt het scherm van een kamer met de vaste indeling (balk, knoppen
  links, tekening, paneel met meter, uitleg, Opnieuw en Klaar!); onderdelen heten
  `<kamer>-nav`, `-stage`, `-title`, `-label`, `-meter`, `-hint`, `-reset`, `-done`.
  Alleen het huis en de kast staan nog in `index.html`.
  CSS: `base.css`, `huis.css`, `kast.css`, `kast-phone.css` (staand en liggend),
  `kapper.css`, `bad.css`, `keuken.css`, `moskee.css`, `winkel.css`, `overlay.css`.
  Elk scherm is één schermhoogte; knoppen altijd in beeld.
- Nieuwe kamer = `roomScreen({...})` bovenaan de module van de kamer, `init…`,
  `show…` en de regel voor "Klaar!" in `rooms.js`, knop `data-room` in het huis, en
  een `<kamer>Day` in `storage.js` voor de sterren. Nieuwe bestanden in `public/` ziet Vite pas
  na een herstart van de dev-server.
- Nieuwe soort kleding = naam in `data.js` en tekening op dezelfde plek in
  `doll-parts.js`, met `shape(d, p)` uit `glans.js`.
- Stijl (10 nov 2026): de gebruiker koos "C · Glans" (verloop, dunne lijn in een
  donkere tint, glans, sterretjes, zoals de Mario Party-renders) boven "Zacht" en
  "Strip". Het meisje, de kapsels, de badkamer en de slaapkamer zijn overgetekend; de
  haarlengtes staan nog in het oude vak (`HAIR_DY` in `hair-styles.js`). Papa (gewaad,
  kufi, baard) en de dochters (knotjes) staan ook in deze stijl (`family-scene.js`,
  gezicht via `look()`). Nog te doen: de kamers zelf en de winkel-etalage.
- Echte liedjes (de leerling noemde bestaande nummers) mogen er niet in: wel eigen
  liedjes maken met AI. Plaatjes zijn getekend in code; met Higgsfield-credits worden
  het 3D-renders zoals bij Mario Party.
- Alle kamers uit het idee van de leerling zijn gebouwd. Het kapsel is alleen bij
  de kapper, onder de douche en in pyjama te zien; in het huis draagt het meisje haar
  hoofddoek. Open: echte naam en maker van het spel, de namen van de dochters, test
  op een echte tablet of telefoon, en een leerkracht die wudu, de gebedstijden en de
  reis naar Mekka nakijkt.

## Tiktak Boom Bom (nieuw spel, november 2026)

Idee en schets van een leerling: kinderen staan in een kring, de bom knippert rood en gaat
met pijltje naar rechts door tot hij ontploft. "Tik Tak Boem" is de naam van een bestaand
bordspel, daarom heet dit spel Tiktak Boom Bom. Maker voorlopig "Al Qalam kids". Staat in
`public/tiktakboombom/` (ES-modules zonder build), op de homepage in Lichting 4.

- 1 t/m 5 spelers plus computerkinderen, samen 6. Toetsen (`input.js`), ver uit elkaar en
  in de volgorde van de kring: 1 = →; 2 = A, →; 3 = A, spatie, →; 4 = A, G, L, →; 5 = A, G,
  spatie, L, →. Tablet: per speler een strook. De bom gaat met de klok mee; wie onderaan
  staat, ziet hem dus naar links gaan (pijlen op de grond).
- Lont 12–30 s, knippert steeds sneller. Druk je terwijl de bom nog naar je toe vliegt, dan
  valt hij (0,8 s kwijt). Ontploft hij in de lucht, dan ligt de ontvanger eruit. Het spel
  stopt zodra er één over is of geen enkele speler meer meedoet.
- `game.js` regels (zonder tekenen, zo te testen) · `game-setup.js` · `result.js` · `cpu.js` ·
  `scene.js` + `scene-bg.js` + `scene-hud.js` · `kid.js` · `bomb.js` · `fx.js` · `sound.js` ·
  `input.js` · `app.js` · `controls.css`. Thumbnail en deelbeeld zijn gemaakt uit de eigen tekeningen.

## Sterrensprong (nieuw spel, november 2026)

De gebruiker vroeg om Geometry Dash in 3D. Dat wordt niet nagebouwd (naam, figuur, levels en
uiterlijk horen bij dat spel): dit is een eigen spel in hetzelfde genre, met een lantaarn in
een nachtstad. Geen muziek (keuze van de gebruiker). Maker voorlopig "Al Qalam kids". Staat in
`public/sterrensprong/` (ES-modules zonder build, three.js uit `marioparty/vendor/`), op de
homepage in Lichting 4.

- Eén knop (spatie, pijl omhoog, W, klik, tik); vasthouden blijft springen. Drie werelden, elk
  één level aan één stuk tot 100%: Lantaarnstad, Sterrenbazaar, Hemelpaleis (84, 122 en 162 s).
  Elk stuk heeft een eigen kleur, naam en snelheid (9 → 13). De volgende wereld gaat open na
  100% met Start, niet met Oefenen. In `localStorage` (`sterrensprong`): kleuren, open werelden,
  beste percentage.
- Start: 5 levens (`tries.js`) en checkpoints (gouden ruitjes) op de veilige plek het dichtst bij
  20, 40, 60 en 80%. Botsen = een leven minder en terug naar het laatste checkpoint; levens op = terug
  naar 0% met weer 5 levens.
- Vliegen (`patterns-fly.js`, `carpet.js`, `portals3d.js`): door een roze poort op het vliegende
  tapijt, vasthouden = omhoog, loslaten = zakken; een mint poort = weer lopen. Tussen een plafond
  (onderkant op 7) en doornen door openingen van 3 (makkelijk) of 2 blokken hoog. Langs de
  onderkant van een blok schuif je, tegen de zijkant ben je af. Elke wereld heeft een vliegstuk.
  De ring: een druk in de lucht telt 0,2 s vooruit (`ringBuffer`), een sprong vanaf de grond niet.
- Gevaren (`hazards.js` regels, `hazards3d.js` beeld, `patterns-hazards.js` stukken): punten
  omhoog, omlaag (plafond) of naar links (zijkant van een toren), doornen, zilveren sterzagen
  (rond, raken iets binnen de rand) en knotsen aan een ketting. De knots zwaait mee met hoe ver
  je bent (`maceBall(ob, x)`), niet met de klok, zodat hij na een checkpoint altijd hetzelfde
  hangt. Om en om hangt hij onderaan als je aankomt (springen) of zwaait hij opzij (doorlopen).
  Vliegstukken kunnen `spiky` (punten rond de openingen) en `saws` (zagen in het plafond).
- Uiterlijk per wereld (`styles.js`): Lantaarnstad steen met een gouden ster, Sterrenbazaar
  mozaïek met marktkraampjes en lichtsnoeren, Hemelpaleis marmer met goud, gouden koepels en
  wolken. Blokvlakken in `textures-blocks.js`, kraampjes en wolken in `scenery-extra.js`.
- Oefenen: onbeperkt, checkpoints (groene ruitjes) voor de meeste stukjes, na een botsing 0,7 s klaarstaan.
  Op hoge snelheid geen checkpoint vlak voor torens en trappen (`noCheckpoint`): zonder aanloop
  klopt de sprong daar niet.
- Nieuw parcours: stukjes in `patterns.js` rekenen met de snelheid, de volgorde staat in
  `levels.js`. Controleer na een wijziging met een zoeker over `physics.js` (zonder beeld, in
  Node) of elke wereld én elk checkpoint te halen is; het hulpscript staat niet in de repo.
- `game.js` spelverloop · `physics.js` spelregels (zonder beeld) · `config.js` · `levels.js` +
  `patterns.js` · `view.js` alles in 3D samen · `world.js` renderer, camera, vloer, muur,
  kleurzones · `scenery.js` stad en maan · `obstacles3d.js` + `neon.js` · `boosts3d.js` ringen
  en veren · `player3d.js` lantaarn · `shatter.js` · `fx.js` + `events.js` · `pattern.js`
  texturen · `menu.js` + `menu.css` · `skins.js` kleuren · `progress.js` + `storage.js` ·
  `hud.js` · `input.js`. Thumbnail en deelbeeld zijn gerenderd uit de eigen 3D-wereld.

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

## Zoek Schelp Kristal (nieuw spel, november 2026)

Idee van een leerling: een prinses loopt 's avonds (zomer, donker) over het strand en zoekt
kristallen en schelpen; op het strand kan ze douchen en zich aankleden. Wensen: prinsessen
zoals in tekenfilms, zonder hoofddoek en zonder tas, verschillende jurken in alle kleuren,
een kroon, een ketting die bij de jurk past, hakken en andere schoenen. Echte
tekenfilmprinsessen mogen er niet in: het zijn eigen prinsessen (Lina, Sara, Yasmina, Roos).
Maker "Al Qalam kids". Staat in `public/schelpkristal/` (ES-modules zonder build), branch
`schelpkristal`.

- Stappen: 1 prinsessen + kleedhokje (klaar), 2 strand met zoeken in het donker (klaar), 3 douche (klaar),
  4a met schelpen en kristallen kronen, jurken, kettingen en schoenen vrijspelen (klaar), 4b
  homepage (Lichting 4), thumbnail, `og/`, `<noscript>`, sitemap en SEO-blok (klaar).
  `thumbs/schelpkristal.webp` en `og/schelpkristal.jpg` zijn gemaakt uit de eigen
  tekeningen (drie prinsessen op het strand, headless Chrome); het hulpscript staat niet in
  de repo. Open: echte naam en maker, namen van de prinsessen, test op een echte tablet.
- `princess.js` bouwt de prinses (vak 300 × 520, zoals het meisje van Mijn Leven) ·
  `hair.js` lang haar in drie lagen (golf, krul, vlecht, steil) · `dresses.js` jurken
  (lijfje, mouwen, rok, soms sleep) · `jewels.js` kronen, kettingen, schoenen · `glans.js`
  de Glans-stijl; `svg()` geeft elke tekening eigen id's (een verloop in een verborgen
  scherm werkt anders niet) · `data.js` prinsessen, soorten, 18 kleuren, ketting `MATCH` =
  kleur van de jurk · `storage.js` (`localStorage` `schelpkristal`) · `dressing.js`
  kleedhokje · `app.js` beginscherm en schermen.
- Strand (canvas, logisch 960 × 540, strand 2600 breed): pijltjes/WASD of de vinger
  vasthouden waar ze heen moet. Per tocht 10 schelpen en 5 kristallen, half in het zand;
  in het donker zie je alleen wat in het licht van de lantaarn of de lampjes ligt, de rest
  glinstert af en toe. Oprapen = dichtbij lopen; telt op bij `game.shells`/`crystals`.
  `beach-world.js` regels (zonder tekenen, zo te testen) · `beach-scene.js` lucht, zee,
  palmen, strandhuisje (twee lagen: achter en vóór de golven) · `beach-draw.js` donker,
  glinsteren, prinses met lantaarn · `beach-items.js` schelpen en kristallen ·
  `beach-input.js` · `beach.js` scherm en spellus. De prinses is een plaatje van haar SVG.
- Bloot: de gebruiker wil het spel blootvrij, geen bikini of badpak. Onder de douche en in
  de zee draagt de prinses een burkini (`swim.js`: lange mouwen, tuniek, lange broek).
- Stranddouche: de prinses in burkini achter een houten schotje, 8 plekken met zand; elk
  spons → douche → handdoek (slepen, zoals de badkamer van Mijn Leven). Na elke stap
  pakt ze vanzelf het volgende. Elke keer opnieuw zand, niets bewaard. `shower.js` regels
  · `shower-scene.js` tekening en gereedschap · `shower-room.js` scherm · `pointer.js`
  (uit Mijn Leven) · `bathingPrincess()` in `princess.js`.
- Vrijspelen: per soort `prices` in `data.js` (null = meteen van jou, anders [schelpen,
  kristallen]); tik op iets met een slotje en je betaalt met wat je op het strand vond.
  Vrijgespeeld staat in `game.owned` (`'jurk:4'`); `hasItem()`. Draagt een oude bewaarde
  outfit iets op slot, dan zet `loadGame()` dat terug naar het begin.
- Zwemmen (wens van de leerling: eerst omkleden, dan de zee in): knop Zwemmen opent het
  kleedhokje bij Zwemkleding (4 burkini's: effen, bloemen, golven, sterren, alle kleuren,
  capuchon aan/uit = `outfit.hood`); "Naar de zee!" gaat naar de zee. Daar zwem je met
  pijltjes of vinger (canvas 960 × 540, zee 2400 breed) en pak je bij 8 oesters de parel
  als de oester open is (3 s open, 2 s dicht). Parels = `game.pearls`, voor de Parelkroon
  en het Parelsnoer (prijs `[0, 0, parels]`). `sea-world.js` regels · `sea-scene.js` lucht,
  water, golven, vissen · `sea-oysters.js` · `sea.js` · `sound.js` gedeelde "ting".
  Een oud bewaard spel zonder zwemkleding krijgt die uit de standaard (`fillOutfit`).
- Vrienden op het strand (wens van de leerling): prins Adam, prins Yusuf (`prince.js`:
  kort haar, tuniek, lange broek, laarzen, cape, kroontje; zelfde gezicht zonder wimpers)
  en de eerste prinses die je zelf niet bent, in een paarse glitterjurk. Elk met een
  lantaarn. Ze zoeken samen (wat zij vinden telt mee), lopen langzamer (95) en rusten 4 s
  na een vondst; "Adam vond een schelp!" in een wolkje. Alleen vrienden: alles in ±42 s.
  `beach-friends.js` regels · tekenen in `beach.js` en `drawSay()` in `beach-draw.js`.
- Let op: `requestAnimationFrame` geeft in de browser van de app geen tijd mee, en een
  verborgen browserpaneel tekent alleen bij een schermafdruk. Meet de tijd zelf met
  `performance.now()`.
