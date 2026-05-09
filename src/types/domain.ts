export type Position = 'MV' | 'VB' | 'HB' | 'VM' | 'CM' | 'HM' | 'FW';

export type Player = {
  id: string;
  name: string;
};

export type PlannedSub = {
  id: string;
  minute: number | null;
  playerInId: string;
  playerOutId: string;
};

export type Lineup = {
  positions: Record<Position, string | null>;
  substitutes: string[];
  plannedSubs: PlannedSub[];
};

export type Match = {
  id: string;
  name: string;
  roster: Player[];
  lineup: Lineup;
};
