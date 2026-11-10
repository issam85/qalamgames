// De tekst voor het eindscherm.
const ranking = (humans) => humans.map((p) => `${p.place}e ${p.name}`).join(' · ');

export function resultOf(g) {
  const humans = g.players.filter((p) => p.human >= 0).sort((a, b) => a.place - b.place);
  const best = humans[0];
  if (g.humans === 1) {
    return best.place === 1
      ? { won: true, title: 'Jij wint!', text: 'Jij hield het het langst vol. Stalen zenuwen!' }
      : { won: false, title: 'BOEM!', text: `Je werd ${best.place}e van de 6. Probeer het nog een keer!` };
  }
  return best.place === 1
    ? { won: true, title: `${best.name} wint!`, text: ranking(humans) }
    : { won: false, title: 'BOEM!', text: `${best.name} hield het het langst vol. ${ranking(humans)}` };
}
