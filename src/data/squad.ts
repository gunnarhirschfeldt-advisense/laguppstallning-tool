export type SquadPlayer = {
  id: string;
  name: string;
  number: number | null;
};

export const squad: SquadPlayer[] = [
  { id: "p1",  name: "Kaj",        number: 2  },
  { id: "p2",  name: "Adrian",     number: 3  },
  { id: "p3",  name: "Linus",      number: 4  },
  { id: "p4",  name: "Cayden",     number: 5  },
  { id: "p5",  name: "Albin L",    number: 6  },
  { id: "p6",  name: "Philip Z",   number: 7  },
  { id: "p7",  name: "Sixten",     number: 8  },
  { id: "p8",  name: "Oliver K",   number: 9  },
  { id: "p9",  name: "Viktor Ö",   number: 10 },
  { id: "p10", name: "Noel",       number: 11 },
  { id: "p11", name: "Theodore E", number: 12 },
  { id: "p12", name: "Ruben",      number: 13 },
  { id: "p13", name: "Teodor S",   number: 14 },
  { id: "p14", name: "Alexander",  number: 15 },
  { id: "p15", name: "Noah",       number: 16 },
  { id: "p16", name: "Leo Z",      number: 17 },
  { id: "p17", name: "Oliver L",   number: 19 },
  { id: "p18", name: "Jakob H",    number: 20 },
  { id: "p19", name: "Calle",      number: 21 },
  { id: "p20", name: "Elton",      number: 22 },
  { id: "p21", name: "Leo S",      number: 23 },
  { id: "p22", name: "Malte",      number: 24 },
  { id: "p23", name: "Edvin",      number: 25 },
  { id: "p24", name: "Arvid",      number: 26 },
  { id: "p25", name: "Leonardo",   number: 27 },
  { id: "p26", name: "Elias L",    number: 28 },
  { id: "p27", name: "Oliver KA",  number: 33 },
  { id: "p28", name: "Martin",     number: 30 },
  { id: "p29", name: "Adrian W",   number: 31 },
  { id: "p30", name: "William",    number: 32 },
  { id: "p31", name: "Frank",      number: 34 },
  { id: "p32", name: "Wilfred",    number: 35 },
  { id: "p33", name: "Alve",       number: null },
  { id: "p34", name: "Charlie",    number: null },
];

export function squadPlayerName(id: string): string {
  return squad.find(p => p.id === id)?.name ?? id;
}

export function squadPlayerNumber(id: string): number | null {
  return squad.find(p => p.id === id)?.number ?? null;
}
