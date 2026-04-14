# Qalam Games — Projectdocumentatie

## Overzicht
Qalam Games is het game-ontwikkelprogramma van **Al Qalam School**. Leerlingen uit groep 6, 7 en 8 maken hun eigen spellen met behulp van AI. De website toont alle spellen, gerangschikt per lichting.

## Technische Stack
- **Frontend**: React 18 + Vite 5 (SPA, geen React Router)
- **Routing**: `useState` voor pagina-navigatie (`page` state) en tab-navigatie (`activeTab`)
- **Games**: Standalone HTML-bestanden in `public/`, geladen via `<iframe>` in `GameView` component
- **Hosting**: GitHub Pages of Vercel (push naar `main` = live)
- **Git remote**: `https://github.com/issam85/qalamgames.git` (branch: `main`)
- **Node**: v22.20.0 via NVM (`export PATH="$HOME/.nvm/versions/node/v22.20.0/bin:$PATH"`)
- **Dev server**: poort 3099

## Projectstructuur
```
qalamgames/
├── public/
│   ├── school.png              # Hero afbeelding
│   ├── bananastorm2.html       # Saifeddine - Banana Storm Survivor V2
│   ├── vicecity.html           # Yahya - Vice City Racing 3D
│   ├── vicecity2.html          # Yahya - Vice City V2
│   ├── grannyhorrorgame.html   # Abdulahi - Granny's Nightmare
│   ├── sonicultimate.html      # Abdoerrahmaan - Sonic Ultimate (5 levels)
│   ├── kickoff3d.html          # Imran - Voetbal Legends / Kick Off 3D
│   ├── stuntracer.html         # Amin - Stunt Racer 3D
│   ├── fifaultimate.html       # Mohamed Fatehi - Fifa Ultimate (FC26)
│   ├── mijncraft.html          # Youssef - MijnCraft
│   ├── basketballislam.html    # Adam - Basketball Islam
│   ├── turborace.html          # Junayd - Turbo Race
│   ├── penalty.html            # Marouan - Penalty Shooters Pro
│   ├── autospel.html           # Mahir - Auto Spel
│   ├── autospel2.html          # Mahir - Auto Spel V2
│   └── turboracer.html/2.html  # Reda - Turbo Racer 3D
├── src/
│   ├── App.jsx                 # Hoofdcomponent (routing, data, UI)
│   ├── IslamicRacingGame.jsx   # Zakaria's Race of Peace (React component)
│   └── main.jsx                # Entry point
├── index.html
├── package.json
└── vite.config.js
```

## App.jsx Structuur

### Data Arrays
```javascript
// Lichting 1 — Top 3
const top3 = [
  { rank: 1, name, game, klas, playable, v2 },  // Saifeddine
  { rank: 2, ... },                               // Yahya
  { rank: 3, ... },                               // Zakaria
];

// Lichting 1 — Eervolle vermelding (#4-#7)
const honorable = [
  { rank: 4, name, game, klas, playable, v2 },   // Marouan
  ...
];

// Lichting 2 — Top 3 (op score)
const lichting2Top3 = [
  { rank: 1, name, game, klas, playable, score }, // Mohamed Fatehi (9.48)
  { rank: 2, ... },                                // Abdoerrahmaan (9.16)
  { rank: 3, ... },                                // Amin (9.00)
];

// Lichting 2 — Eervolle vermelding (#4-#8)
const lichting2Rest = [
  { rank: 4, ... },  // Abdulahi (8.63)
  ...                 // Junayd, Adam, Imran, Youssef
];

// Visuele configuratie per spel
const gameStyles = {
  bananastorm: { border, color, bg, font, src, title },
  // ... elk spel heeft een entry
};
```

### Componenten
- **`GameView`**: Rendert een spel in fullscreen iframe met terug-knop en fullscreen toggle
- **`App`**: Hoofdpagina met hero, tabs (Lichting 1/2), rankings, speelknoppen

### Navigatie
- `page === 'home'` → hoofdpagina met tabs
- `page === 'bananastorm'` → GameView met dat spel
- `activeTab` → 'lichting1' of 'lichting2' (default: lichting2)

## Lichtingen

### Lichting 1 (Eerste groep)
| Rank | Naam | Spel | Klas | Key |
|------|------|------|------|-----|
| 1 | Saifeddine Boulabkoul | Banana Storm Survivor | Groep 7b | bananastorm / bananastorm2 |
| 2 | Yahya Essanousi | Vice City Racing 3D | Groep 6b | vicecity / vicecity2 |
| 3 | Zakaria El Aamim | سباق السلام (Race of Peace) | Groep 6b | game (React component) |
| 4 | Marouan El Amrani | Penalty Shooters Pro | Groep 7c | penalty |
| 5 | Mahir Tazammourti | Auto Spel met Islam Vragen | Groep 6a | autospel / autospel2 |
| 6 | Reda Oruadia | Turbo Racer 3D | Groep 6c | turboracer / turboracer2 |
| 7 | Junayd Bakkali | Turbo Race | Groep 6a | turborace |

### Lichting 2 (Tweede groep — gerankt op score)
| Rank | Naam | Spel | Klas | Score | Key |
|------|------|------|------|-------|-----|
| 1 | Mohamed Fatehi | Fifa Ultimate | Groep 7c | 9.48 | fifaultimate |
| 2 | Abdoerrahmaan Ezzarfani | Sonic Ultimate | Groep 7c | 9.16 | sonicultimate |
| 3 | Amin van Ee | Stunt Racer | Groep 6b | 9.00 | stuntracer |
| 4 | Abdulahi Abdulkhader | Granny's Nightmare | Groep 7c | 8.63 | grannyhorrorgame |
| 5 | Junayd Bakkali | Turbo Race | Groep 6a | 8.41 | turborace |
| 6 | Adam El Majidi | Basketball Islam | Groep 7b | 8.14 | basketballislam |
| 7 | Imran Mestour | Voetbal Legends | Groep 6a | 7.50 | kickoff3d |
| 8 | Youssef El Mahjoubi | MijnCraft | Groep 6b | 7.19 | mijncraft |

## Nieuw spel toevoegen — Stappen

### 1. HTML-bestand opslaan
```bash
# Zet het HTML-bestand in public/
/Users/oussama/alqalam/qalamgames/public/[spelnaam].html
```

### 2. App.jsx updaten
**A) Voeg toe aan de juiste data-array:**
```javascript
// Voor Lichting 2 top 3:
const lichting2Top3 = [
  ...,
  { rank: X, name: 'Naam', game: 'Spelnaam', klas: 'Groep Xa', playable: 'spelnaam', score: 'X.XX' },
];

// Of voor eervolle vermelding:
const lichting2Rest = [
  ...,
  { rank: X, name: 'Naam', game: 'Spelnaam', klas: 'Groep Xa', playable: 'spelnaam', score: 'X.XX' },
];
```

**B) Voeg gameStyles entry toe:**
```javascript
const gameStyles = {
  ...,
  spelnaam: {
    border: '#kleur',      // Rand kleur
    color: '#kleur',       // Tekst kleur
    bg: 'rgba(...)',       // Achtergrond
    font: '"Font", sans-serif',
    src: '/spelnaam.html', // Pad naar HTML
    title: 'Spelnaam'      // Weergavenaam
  },
};
```

### 3. Commit & Push
```bash
cd /Users/oussama/alqalam/qalamgames
git add public/spelnaam.html src/App.jsx
git commit -m "Add [Spelnaam] by [Naam] to Lichting X"
export PATH="$HOME/.nvm/versions/node/v22.20.0/bin:$PATH"
git push origin main
```

## Veelvoorkomende patronen

### Spellen zijn standalone HTML
- Elk spel is een volledig zelfstandig HTML-bestand met inline CSS en JS
- Geen externe dependencies behalve soms Three.js via CDN
- Geladen in iframe via `GameView` component
- Uitzondering: Zakaria's spel (`game` key) is een React component (`IslamicRacingGame.jsx`)

### Islamitische Quiz
- Bijna elk spel heeft een islamitische quiz-component ingebouwd
- Vragen over pilaren van Islam, Quran, gebed, etc.
- In het Nederlands

### Three.js spellen
- Veel spellen gebruiken Three.js r128 via CDN: `https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js`
- Canvas-based 3D: kickoff3d, stuntracer, fifaultimate, mijncraft

### Spel-updates
- Leerlingen sturen nieuwe versies via email of direct
- Bestand wordt overschreven in `public/`
- Soms verandert de spelnaam (bijv. "Granny Horror Game" → "Granny's Nightmare")

## Bekende issues / Aandachtspunten
- **Verwijderde bestanden**: Sommige Lichting 1 HTML-bestanden zijn lokaal verwijderd maar niet gecommit (autospel, mariospel, penalty, etc.) — deze staan nog in git history
- **Quran tekst**: Bij spellen met Arabische Quran-tekst ALTIJD verifiëren via api.alquran.cloud — gebruik NOOIT AI-geheugen voor Arabische tekst
- **Iframe klik-issues**: Sommige laptops/browsers hebben moeite met klikken in iframes — pointer-events moet correct staan
- **React vs Vanilla**: Nieuwe spellen komen bijna altijd als vanilla HTML. Als iemand React-code stuurt, converteer naar standalone HTML met React via CDN
- **Junayd dubbel**: Junayd Bakkali staat in BEIDE lichtingen (Lichting 1 rank 7 met Turbo Race, Lichting 2 rank 5 met Turbo Race)

## Contact
- **Docent**: Oussama Abdellaoui (o.abdellaoui@outlook.com)
- **School**: Al Qalam School
- **Website**: qalamgames.nl
