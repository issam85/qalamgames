// De tekst voor het eindscherm.
export function resultOf(g) {
  const humans = g.players.filter((p) => p.human >= 0).sort((a, b) => a.place - b.place);
  const best = humans[0];
  if (best.place === 1) {
    return { won: true, title: g.humans === 1 ? 'Jij wint!' : `${best.name} wint!`, text: 'Jij hield het het langst vol. Stalen zenuwen!' };
  }
  if (g.humans === 1) {
    return { won: false, title: 'BOEM!', text: `Je werd ${best.place}e van de 6. Probeer het nog een keer!` };
  }
  return { won: false, title: 'BOEM!', text: `${best.name} hield het het langst vol en werd ${best.place}e van de 6.` };
}
