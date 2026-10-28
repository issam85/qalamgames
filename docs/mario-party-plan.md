# Mario Party — plan voor de eindversie

Versie 27 oktober 2026. Dit is het groeiplan voor `public/marioparty/`: wat het spel
moet worden, welke beelden en geluiden daarvoor nodig zijn, en de prompts om die met
Higgsfield te maken. Gemaakte beelden staan in `game-assets/` (zie `manifest.tsv`).

## 1. Het spel in één zin

Twee spelers (of één tegen de computer) klimmen met zeven karakters een trap op naar de
ster. Elke ronde speel je een minigame; de winnaar stijgt, verliezers zakken. Met een
eigen skill per karakter kun je het spel één keer per ronde naar je hand zetten.

## 2. Spelverloop

1. **Titelscherm**: karakters voor de trap, logo in de lucht (`menu/` + titel-art).
2. **Modus**: Snel (5 rondes), Volledig (10 rondes), Oefenen (één minigame kiezen).
3. **Karakterkeuze** (bestaat al) + **werelden kiezen** op de wereldkaart.
4. **Ronde**:
   1. Minigame-rad draait → minigame-titelkaart met uitleg en besturing.
   2. Minigame spelen (30–45 s).
   3. Toad deelt uit: winnaar +2 sterren en +1 trede, tweede +1 ster, laatste −1 trede.
   4. Skillmoment: wie zijn skillmeter vol heeft, mag zijn skill inzetten (animatie).
   5. Bordgebeurtenis op de trede waar je staat (zie §6).
5. **Finale**: eerste bij de ster of meeste sterren na de laatste ronde → podium →
   trofee-ceremonie → overwinningsclip (bestaat per karakter).

## 3. Karakters en skills

Skillmeter vult met minigame-punten (winst 2, tweede 1). Vol = één keer inzetten op het
bord, daarna leeg. Elke skill heeft (a) een cutscene van 3–4 s, (b) een sprite-animatie
voor in het spel en (c) een effect-sprite.

| Karakter | Skill | Effect in het spel | Effect-sprite |
|---|---|---|---|
| Mario | **Vuurbal** | Eén tegenstander naar keuze zakt 1 trede | vuurbal |
| Luigi | **Superhoge sprong** | Zelf direct 2 treden omhoog | groene windwervel |
| Peach | **Parasolschild** | Deze ronde kan je niet zakken | roze bubbelschild |
| Daisy | **Bloemenstorm** | Je krijgt 1 extra ster | bloemblaadjes, madeliefjes |
| Toad | **Superpaddenstoel** | Volgende minigame telt dubbel | rode paddenstoel, lichtring |
| Yoshi | **Eiergooi** | Pikt 1 ster van een tegenstander | gestippeld ei |
| Bowser | **Schokgolf-stamp** | Iedereen onder jou zakt 1 trede | schokgolfring, stofwolk |

Balans: Bowser en Mario zijn aanvallend, Peach verdedigend, Luigi/Daisy/Toad/Yoshi
opbouwend. Een skill tegen Peach met schild doet niets (schild "plopt" zichtbaar).

## 4. Werelden (borden)

Alle werelden hebben dezelfde opbouw (10 treden in vooraanzicht, ster bovenaan), zodat
`board.js` alleen achtergrond, steentextuur en kleuren wisselt.

| Wereld | Achtergrond | Extra regel |
|---|---|---|
| Stenen Trap (bestaat) | `bg-stairs.jpg` | — |
| Wolkentrap | `borden/wolkentrap.png` | Wolkentrede 5 is een "lift": +1 extra |
| Lavatoren | `borden/lavatoren.png` | Lavatrede 3 en 7: −1 als je erop eindigt |
| IJsberg | `borden/ijsberg.png` | Gladde treden: winnaar glijdt soms 1 verder |
| Piramide | `borden/piramide.png` | Schatkamer op trede 6: bonusronde (schatkist) |

## 5. Minigames

Besturing blijft simpel: speler 1 = Spatie (en A/D), speler 2 = Pijltje omhoog (en ←/→).
Later ook aanraken op tablet.

| # | Minigame | Spelregel | Toetsen | Titelkaart | Speelveld |
|---|---|---|---|---|---|
| 1 | Sprint (3D, okt) | Momentum opbouwen, turbo bij volhouden, eerste over de finish | ram | — | bestaat |
| 2 | Muntenregen | Vang munten, ontwijk bommen, 30 s | links/rechts | ✓ | te maken |
| 3 | Ballonnen knallen | Pomp tot de ballon knalt | ram | ✓ | te maken |
| 4 | Springtouw | Spring op tijd, wie het langst volhoudt | timing | ✓ | te maken |
| 5 | Memory | Om de beurt 2 kaarten, meeste paren | kiezen | ✓ | te maken |
| 6 | Reactie | Toad heft de vlag: eerst drukken; te vroeg = af | 1 druk | ✓ | te maken |
| 7 | Kanonschot | Stop de balk op het juiste moment, raak het doel | timing | ✓ | te maken |
| 8 | Quiz | Kennisvragen (rekenen, taal, islam), snelste goed | 4 knoppen | ✓ | te maken |
| 9 | Evenwicht | Houd de wip in balans met links/rechts | links/rechts | ✓ | te maken |
| 10 | Vissen | Gooi uit op het juiste moment, grootste vis | timing | ✓ | te maken |
| 11 | Sneeuwballen | Gooi en duik weg achter je muur | gooien/bukken | ✓ | te maken |
| 12 | Mijnkar | Spring over gaten, wissel van spoor | spring/wissel | ✓ | te maken |
| 13 | Sterrenjacht | Vang vallende sterren in het donker | links/rechts | ✓ | te maken |

Advies volgorde bouwen: Reactie, Ballonnen, Muntenregen, Quiz (eenvoudig, veel plezier),
daarna Springtouw, Kanonschot, Memory, de rest later.

## 6. Bordgebeurtenissen en voorwerpen

- **Vraagteken-trede**: Toad geeft een willekeurig voorwerp.
- **Voorwerpen** (max. 1 tegelijk): paddenstoel (+1 trede), gouden paddenstoel (+2),
  wekker (nog een keer minigame-rad draaien), sleutel (opent schatkamer), schild.
- **Munten** uit minigames kopen voorwerpen in de winkel van Toad na ronde 3 en 6.

## 7. Geluid

- Muziek: titel, karakterkeuze, elk bord, minigame (snel), spanning (laatste ronde),
  overwinning, podium.
- Effecten: munt, ster, trede omhoog/omlaag, aftellen, fluit, buzzer goed/fout, ballon
  knalt, plons, juichend publiek, dobbelsteen, vuurbal, ei, schokgolf, schild.
- Omroeper in het Nederlands (Inworld-stemmen Erik, Lennart, Katrien, Lore): "Klaar…
  start!", "Ronde 1" t/m "Laatste ronde!", "Winnaar!", "Gelijkspel!", minigame-namen.

## 8. Status beelden (27 oktober)

Gemaakt met `nano_banana_pro` (36 beelden) en opgeslagen in `game-assets/`; per bestand
het Higgsfield-ID in `game-assets/manifest.tsv`:

- `borden/`: wolkentrap, lavatoren, ijsberg, piramide
- `menu/`: titel-desktop, titel-mobiel, podium, trofee-ceremonie, partykamer,
  minigame-rad, wereldkaart, schatkist-bonus
- `titelkaarten/`: alle 12 nieuwe minigames (§5)
- `skills/`: keyframes van alle 7 karakters (Bowser: `bowser-schokgolf.png`)
- `effecten/`: vuurbal, ei, roze schild, superpaddenstoel, effectenblad (3×3)
- `bron-spel-26okt/`: de bronbestanden van het huidige spel (26 okt): `renders/`
  (karakters, achtergronden; bekende ID's met naam, de rest op tijd + ID) en `clips/`
  (de Kling-clips voor sprites en cutscenes)
- `website/`: originelen van de website-beelden (`beelden/`) en -video's (`videos/`)

Alle 156 Higgsfield-bestanden staan in het manifest; kolom 3 is de bron-URL of het
originele bestand in Downloads.

Daarna was het tegoed op (account terug op het gratis plan). Alles hieronder is klaar om
te draaien zodra er weer credits zijn.

## 9. Promptbibliotheek

**Stijlregel voor elke beeldprompt** (zet hem achteraan):
"Glossy 3D cartoon render in the style of the reference, modern family party video game,
soft rounded shapes, bright saturated colors, clean soft lighting. No text, no letters,
no logos."

Referenties (Higgsfield-ID's, zie ook `CLAUDE.md`): trap-achtergrond
`5787645a-2597-4774-a11d-f5556d89b5af`; karakters Mario `03e52974-…`, Luigi
`28326022-…`, Peach `deb81863-…`, Daisy `9e8500de-…`, Toad `150beb68-…`, Yoshi
`e225866b-…`, Bowser `89e34496-…`. Noem karakters beschrijvend, nooit bij naam.

### 9.1 Speelvelden (12×, `nano_banana_pro` 16:9 2k, ref = trap, ±24 credits)

Allemaal: "Empty gameplay background …, no characters". Onderwerp per minigame:

1. Muntenregen: zijaanzicht, vlak grasveld onderste vijfde als vloer, open blauwe lucht.
2. Ballonnen: kermispodium vooraanzicht, vier lege vakken op houten vloer, tent, vlaggetjes.
3. Springtouw: schoolplein zijaanzicht, rubber vloer, twee houten palen links en rechts.
4. Memory: groene vilttafel van bovenaf met houten rand, groot leeg midden.
5. Reactie: stadion vooraanzicht, witte startlijn, vier lege banen, publiek wazig.
6. Kanonschot: tropisch strand, zand links als platform, drie palen in zee rechts.
7. Quiz: tv-studio, groot leeg scherm boven midden, vier lege pupitres met buzzers.
8. Evenwicht: zwembad onderste derde, stenen pilaar in het midden zonder plank.
9. Vissen: houten steiger boven, meer in doorsnede eronder met planten en lichtstralen.
10. Sneeuwballen: besneeuwd dorpsplein, twee lage sneeuwmuren links en rechts.
11. Mijnkar: kristalgrot, twee houten sporen horizontaal, naadloos links-rechts.
12. Sterrenjacht: grasheuvel als vloer, diepblauwe sterrenhemel met vriendelijke maan.

### 9.2 Voorwerpen en iconen (16×, `nano_banana_pro` 1:1 2k, ±32 credits)

"Video game item sprite on a plain pure white background: a single …, glossy 3D cartoon
style, centered, no shadow on the background. No text." — daarna `rembg` om uit te snijden.

Dobbelsteenblok met stippen · gouden munt · zwarte cartoonbom met lont · rode ballon ·
gouden paddenstoel · wekker · gouden sleutel · schatkist · gouden trofee · medailles goud,
zilver, brons (3×3-blad) · partykanon · roos-wit doelwit · rode buzzerknop · hengel ·
sneeuwbal · mijnkarretje · houten wipplank · kaartrug met sterpatroon · kaartvoorkanten
(bloem, paddenstoel, ster, munt, hart, maan, 3×2-blad) · vraagteken-trede.

### 9.3 Skill-cutscenes (7×, `kling4_0` image-to-video 16:9 1080p 4 s, ±42 credits)

Start = skill-keyframe (`skills/<karakter>-*.png`). Prompt: "Short action shot, static
camera. [ACTIE]. Ends on a proud pose. Same glossy 3D cartoon style, no text."

- Mario: throws the fireball, it flies off screen with sparks.
- Luigi: launches straight up in a green wind swirl and lands two steps higher.
- Peach: opens the parasol, a pink bubble shield pops up around her, sparkles.
- Daisy: spins, a whirlwind of petals bursts out, a golden star appears above her.
- Toad: eats the glowing mushroom and grows big with golden light rings.
- Yoshi: throws the spotted egg in a high arc, it flies off screen.
- Bowser: stomps, a shockwave ring and dust cloud blast outward, stones bounce.

### 9.4 Skill-sprites (7×, `kling4_0` 3–4 s 720p op wit, ±35 credits)

Start = karakterrender. "On a plain pure white background, full body, lots of space
above the head, static camera, [ACTIE] once and return to the starting pose." Daarna de
bestaande sprite-pijplijn: ffmpeg 12 fps → `rembg` (`isnet-general-use`) → schalen op
frame 0 (staande hoogte 128 px) → WebP-strip + JSON.

### 9.5 Minigame-sprites (3 acties × 7 karakters = 21×, ±105 credits)

Zelfde opzet als 9.4. Acties: **pompen** (duwt een handpomp op en neer), **vangen**
(stapt opzij met de armen omhoog), **springen op de plek** (springtouw), plus later
**gooien** (sneeuwbal) en **denken + buzzer drukken** (quiz).

### 9.6 Cutscenes werelden en menu (±60 credits)

- Per wereld een intro-vlucht (4×, `kling4_0` 6 s): "Slow cinematic drone flight from
  the bottom of the staircase up to the golden platform at the top, gentle ambient motion
  (clouds / lava / snow / sand), same style." Start = `borden/<wereld>.png`.
- Titelscherm-loop (titel-art als start én eind, 6 s): karakters zwaaien, confetti.
- Minigame-rad draait (start = `menu/minigame-rad.png`, 5 s).
- Trofee-ceremonie: vuurwerk, trofee glimt (start = `menu/trofee-ceremonie.png`, 6 s).
- Per titelkaart een korte loop van 4 s (12×, ±60 credits) voor het uitlegscherm.

### 9.7 Muziek en geluid (`sonilo_music` en `mirelo_text_to_audio`)

Muziek, 30–60 s, naadloos herhaalbaar, zonder zang:

- Titel: "Cheerful bouncy orchestral party-game theme, xylophone, brass, playful, 120 bpm, loopable, no vocals."
- Bord: "Light happy board-game music, marimba and pizzicato strings, 100 bpm, loopable."
- Lava: "Playful spooky castle music, organ and timpani, kid-friendly, loopable."
- IJs: "Sparkly winter music, glockenspiel and soft bells, loopable."
- Piramide: "Upbeat desert adventure music, oud and hand drums, playful, loopable."
- Minigame: "Fast energetic chiptune-orchestral minigame music, 140 bpm, loopable."
- Spanning: "Tense ticking countdown music for a final round, building, loopable."
- Overwinning: "Short triumphant fanfare, brass and cymbals, 6 seconds."

Effecten (0,5–3 s): munt, ster, trede omhoog, trede omlaag, piep-piep-piep-start, fluit,
goed, fout, ballon knalt, plons, publiek juicht, dobbelsteen rolt, vuurbal, ei, stamp,
schild plopt.

### 9.8 Omroeper (`inworld_text_to_speech`, stem "Lennart (nl)" of "Lore (nl)")

"Klaar? Start!" · "Ronde één!" … "Laatste ronde!" · "Minigame!" · "Winnaar!" ·
"Gelijkspel!" · "Skill!" · "Naar de ster!" · alle minigame-namen.

### Kosten (schatting)

Speelvelden 24 · voorwerpen 32 · skill-cutscenes 42 · skill-sprites 35 · minigame-sprites
105 · werelden/menu 30 · titelkaart-loops 60 · audio ±40. Totaal ±370 credits.

## 10. Bouwfasen

1. **Fase 1** — skills (meter, 7 skills, cutscenes), 2 nieuwe minigames (Reactie,
   Ballonnen), minigame-rad.
2. **Fase 2** — werelden kiezen (4 nieuwe borden), muziek en effecten, omroeper.
3. **Fase 3** — Muntenregen, Quiz, Springtouw, Kanonschot; voorwerpen en winkel.
4. **Fase 4** — overige minigames, podium en trofee-ceremonie, tablet-bediening.
