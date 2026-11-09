// Het gezin zonder scherm: wie er zijn, hun hartjes en wat eten, thee, de bal, het
// boek en het bed doen. Losse functies, zo te testen.
// family = { fed: [per gezinslid], tea, play: [per kind, aantal keer], read: [per kind],
//            bed: [per kind], day }
export const MEMBERS = [
  { name: 'Papa', x: 88, child: false },
  { name: 'Amira', x: 168, child: true, color: '#ff8ac8' },
  { name: 'Noor', x: 228, child: true, color: '#4cd4a0' },
];
export const THROWS = 3; // zo vaak de bal gooien voor een hartje
export const READ_STEPS = 30; // zo lang voorlezen (slepen) voor een hartje
const WANTS = ['eten', 'spelen met de bal', 'een verhaaltje'];

export const freshFamily = () => ({
  fed: MEMBERS.map(() => false), tea: false, play: [0, 0], read: [false, false], bed: [false, false], day: '',
});

// elke nieuwe dag hebben ze weer honger en zin om te spelen
export const newDay = (family, today) => (family.day === today ? family : { ...freshFamily(), day: today });

// de hartjes van gezinslid i: papa eten en thee, een kind eten, spelen en voorlezen
export function hearts(family, i) {
  if (!MEMBERS[i].child) return [family.fed[i], family.tea];
  return [family.fed[i], family.play[i - 1] >= THROWS, family.read[i - 1]];
}

// 0 – 1 voor de meter: alle hartjes, plus de kinderen in bed
export function progress(family) {
  const all = MEMBERS.flatMap((m, i) => hearts(family, i)).concat(family.bed);
  return all.filter(Boolean).length / all.length;
}

export const allFed = (family) => family.fed.every(Boolean);

// op wie staat de muis of vinger? -1 = op niemand
export function memberAt(p) {
  return MEMBERS.findIndex((m) => Math.abs(p.x - m.x) < (m.child ? 28 : 36) && p.y > (m.child ? 130 : 45) && p.y < 305);
}

const patch = (family, key, at, value) => ({ ...family, [key]: family[key].map((old, j) => (j === at ? value : old)) });

// het voorlezen is af (het slepen zelf telt het scherm)
export const readTo = (family, i) => patch(family, 'read', i - 1, true);

// Een tik op gezinslid i met eten, thee, bal of bed. Geeft { family, text } terug:
// family = de nieuwe stand (ontbreekt als er niets verandert), text = wat erbij staat
export function act(family, tool, i, hasMeal) {
  const { name, child } = MEMBERS[i];
  const kid = i - 1;
  if (child && family.bed[kid]) return { text: `Ssst, ${name} slaapt al.` };
  if (tool === 'eten') {
    if (family.fed[i]) return { text: `${name} heeft al gegeten.` };
    if (!hasMeal) return { text: 'Er is geen eten. Kook eerst iets lekkers in de keuken.' };
    return { family: patch(family, 'fed', i, true), text: `${name} smult ervan!` };
  }
  if (tool === 'thee') {
    if (child) return { text: 'De thee is voor papa. De meisjes willen spelen!' };
    return family.tea ? { text: 'Papa heeft zijn thee al op.' } : { family: { ...family, tea: true }, text: 'Papa zegt: dank je wel!' };
  }
  if (!child) return { text: tool === 'bed' ? 'Papa blijft nog even op.' : 'Dat is iets voor de meisjes.' };
  if (tool === 'bal') {
    if (family.play[kid] >= THROWS) return { text: `${name} heeft genoeg gespeeld.` };
    const count = family.play[kid] + 1;
    return {
      family: patch(family, 'play', kid, count),
      text: count < THROWS ? `${name} vangt de bal! Nog ${THROWS - count} keer.` : `${name} heeft heerlijk gespeeld!`,
    };
  }
  if (tool === 'bed') {
    const missing = hearts(family, i).indexOf(false);
    if (missing >= 0) return { text: `${name} wil eerst nog ${WANTS[missing]}.` };
    return { family: patch(family, 'bed', kid, true), text: `Welterusten, ${name}!` };
  }
  return {};
}
