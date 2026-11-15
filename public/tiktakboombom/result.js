// De tekst voor het eindscherm; bij meer spelers de stand als gekleurde chips.
export function resultOf(g) {
  const humans = g.players.filter((p) => p.human >= 0).sort((a, b) => a.place - b.place);
  const best = humans[0];
  if (g.humans === 1) {
    return best.place === 1
      ? { won: true, title: 'Jij wint!', text: 'Jij hield het het langst vol. Stalen zenuwen!', ranks: [] }
      : { won: false, title: 'BOEM!', text: `Je werd ${best.place}e van de 6. Probeer het nog een keer!`, ranks: [] };
  }
  const ranks = humans.map((p) => ({ text: `${p.place}e ${p.name}`, color: p.color }));
  return best.place === 1
    ? { won: true, title: `${best.name} wint!`, text: '', ranks }
    : { won: false, title: 'BOEM!', text: `${best.name} hield het het langst vol.`, ranks };
}
