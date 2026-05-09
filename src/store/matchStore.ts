import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Match, Player, Position, PlannedSub } from '../types/domain';
import { ALL_POSITIONS } from '../utils/formations';

function emptyLineup(): Match['lineup'] {
  return {
    positions: Object.fromEntries(ALL_POSITIONS.map(p => [p, null])) as Record<Position, null>,
    substitutes: [],
    plannedSubs: [],
  };
}

function newMatch(name = 'Ny match'): Match {
  return {
    id: crypto.randomUUID(),
    name,
    roster: [],
    lineup: emptyLineup(),
  };
}

type MatchStore = {
  match: Match;
  selectedPlayerId: string | null;

  setMatchName: (name: string) => void;
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  selectPlayer: (id: string | null) => void;
  assignToPosition: (position: Position) => void;
  removeFromPosition: (position: Position) => void;
  addPlannedSub: (sub: Omit<PlannedSub, 'id'>) => void;
  removePlannedSub: (id: string) => void;
  resetMatch: () => void;
};

export const useMatchStore = create<MatchStore>()(
  persist(
    (set, get) => ({
      match: newMatch(),
      selectedPlayerId: null,

      setMatchName: (name) =>
        set(s => ({ match: { ...s.match, name } })),

      addPlayer: (name) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        const player: Player = { id: crypto.randomUUID(), name: trimmed };
        set(s => ({
          match: {
            ...s.match,
            roster: [...s.match.roster, player],
            lineup: {
              ...s.match.lineup,
              substitutes: [...s.match.lineup.substitutes, player.id],
            },
          },
        }));
      },

      removePlayer: (id) =>
        set(s => {
          const positions = { ...s.match.lineup.positions };
          for (const pos of ALL_POSITIONS) {
            if (positions[pos] === id) positions[pos] = null;
          }
          return {
            selectedPlayerId: s.selectedPlayerId === id ? null : s.selectedPlayerId,
            match: {
              ...s.match,
              roster: s.match.roster.filter(p => p.id !== id),
              lineup: {
                ...s.match.lineup,
                positions,
                substitutes: s.match.lineup.substitutes.filter(pid => pid !== id),
                plannedSubs: s.match.lineup.plannedSubs.filter(
                  sub => sub.playerInId !== id && sub.playerOutId !== id
                ),
              },
            },
          };
        }),

      selectPlayer: (id) => set({ selectedPlayerId: id }),

      assignToPosition: (position) => {
        const { match, selectedPlayerId } = get();
        if (!selectedPlayerId) return;
        const existing = match.lineup.positions[position];
        const positions = { ...match.lineup.positions, [position]: selectedPlayerId };
        let substitutes = match.lineup.substitutes.filter(id => id !== selectedPlayerId);
        // If a player was already there, move them back to bench
        if (existing && existing !== selectedPlayerId) {
          substitutes = [...substitutes, existing];
        }
        set({
          selectedPlayerId: null,
          match: {
            ...match,
            lineup: { ...match.lineup, positions, substitutes },
          },
        });
      },

      removeFromPosition: (position) =>
        set(s => {
          const playerId = s.match.lineup.positions[position];
          if (!playerId) return s;
          return {
            match: {
              ...s.match,
              lineup: {
                ...s.match.lineup,
                positions: { ...s.match.lineup.positions, [position]: null },
                substitutes: [...s.match.lineup.substitutes, playerId],
              },
            },
          };
        }),

      addPlannedSub: (sub) =>
        set(s => ({
          match: {
            ...s.match,
            lineup: {
              ...s.match.lineup,
              plannedSubs: [
                ...s.match.lineup.plannedSubs,
                { ...sub, id: crypto.randomUUID() },
              ],
            },
          },
        })),

      removePlannedSub: (id) =>
        set(s => ({
          match: {
            ...s.match,
            lineup: {
              ...s.match.lineup,
              plannedSubs: s.match.lineup.plannedSubs.filter(sub => sub.id !== id),
            },
          },
        })),

      resetMatch: () =>
        set({ match: newMatch(), selectedPlayerId: null }),
    }),
    {
      name: 'laguppstallning-v01',
    }
  )
);
