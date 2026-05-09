import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Match, Player, Position, PlannedSub, Lineup } from '../types/domain';
import { ALL_POSITIONS } from '../utils/formations';

function emptyLineup(roster: Player[] = []): Lineup {
  return {
    positions: Object.fromEntries(ALL_POSITIONS.map(p => [p, null])) as Record<Position, null>,
    substitutes: roster.map(p => p.id),
    plannedSubs: [],
  };
}

function copyLineup(src: Lineup, roster: Player[]): Lineup {
  const usedIds = new Set(Object.values(src.positions).filter(Boolean) as string[]);
  return {
    positions: { ...src.positions },
    substitutes: roster.map(p => p.id).filter(id => !usedIds.has(id)),
    plannedSubs: [],
  };
}

function newMatch(name = 'Ny match'): Match {
  return {
    id: crypto.randomUUID(),
    name,
    roster: [],
    periods: [emptyLineup()],
  };
}

// Update one period in the array immutably
function updatePeriod(periods: Lineup[], idx: number, fn: (l: Lineup) => Lineup): Lineup[] {
  return periods.map((p, i) => (i === idx ? fn(p) : p));
}

type MatchStore = {
  match: Match;
  activePeriodIdx: number;
  selectedPlayerId: string | null;

  setMatchName: (name: string) => void;
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  selectPlayer: (id: string | null) => void;
  assignToPosition: (position: Position) => void;
  removeFromPosition: (position: Position) => void;
  addPlannedSub: (sub: Omit<PlannedSub, 'id'>) => void;
  removePlannedSub: (id: string) => void;

  addPeriod: () => void;
  removePeriod: (idx: number) => void;
  setActivePeriod: (idx: number) => void;

  resetMatch: () => void;
};

export const useMatchStore = create<MatchStore>()(
  persist(
    (set, get) => ({
      match: newMatch(),
      activePeriodIdx: 0,
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
            // Add to bench in every period
            periods: s.match.periods.map(p => ({
              ...p,
              substitutes: [...p.substitutes, player.id],
            })),
          },
        }));
      },

      removePlayer: (id) =>
        set(s => {
          const periods = s.match.periods.map(p => {
            const positions = { ...p.positions };
            for (const pos of ALL_POSITIONS) {
              if (positions[pos] === id) positions[pos] = null;
            }
            return {
              ...p,
              positions,
              substitutes: p.substitutes.filter(pid => pid !== id),
              plannedSubs: p.plannedSubs.filter(
                sub => sub.playerInId !== id && sub.playerOutId !== id
              ),
            };
          });
          return {
            selectedPlayerId: s.selectedPlayerId === id ? null : s.selectedPlayerId,
            match: { ...s.match, roster: s.match.roster.filter(p => p.id !== id), periods },
          };
        }),

      selectPlayer: (id) => set({ selectedPlayerId: id }),

      assignToPosition: (position) => {
        const { activePeriodIdx, selectedPlayerId } = get();
        if (!selectedPlayerId) return;
        set(s => ({
          selectedPlayerId: null,
          match: {
            ...s.match,
            periods: updatePeriod(s.match.periods, activePeriodIdx, p => {
              const existing = p.positions[position];
              const positions = { ...p.positions, [position]: selectedPlayerId };
              let substitutes = p.substitutes.filter(id => id !== selectedPlayerId);
              if (existing && existing !== selectedPlayerId) {
                substitutes = [...substitutes, existing];
              }
              return { ...p, positions, substitutes };
            }),
          },
        }));
      },

      removeFromPosition: (position) =>
        set(s => ({
          match: {
            ...s.match,
            periods: updatePeriod(s.match.periods, s.activePeriodIdx, p => {
              const playerId = p.positions[position];
              if (!playerId) return p;
              return {
                ...p,
                positions: { ...p.positions, [position]: null },
                substitutes: [...p.substitutes, playerId],
              };
            }),
          },
        })),

      addPlannedSub: (sub) =>
        set(s => ({
          match: {
            ...s.match,
            periods: updatePeriod(s.match.periods, s.activePeriodIdx, p => ({
              ...p,
              plannedSubs: [...p.plannedSubs, { ...sub, id: crypto.randomUUID() }],
            })),
          },
        })),

      removePlannedSub: (id) =>
        set(s => ({
          match: {
            ...s.match,
            periods: updatePeriod(s.match.periods, s.activePeriodIdx, p => ({
              ...p,
              plannedSubs: p.plannedSubs.filter(sub => sub.id !== id),
            })),
          },
        })),

      addPeriod: () =>
        set(s => {
          if (s.match.periods.length >= 3) return s;
          const last = s.match.periods[s.match.periods.length - 1];
          const newPeriod = copyLineup(last, s.match.roster);
          const newIdx = s.match.periods.length;
          return {
            activePeriodIdx: newIdx,
            match: { ...s.match, periods: [...s.match.periods, newPeriod] },
          };
        }),

      removePeriod: (idx) =>
        set(s => {
          if (s.match.periods.length <= 1) return s;
          const periods = s.match.periods.filter((_, i) => i !== idx);
          const activePeriodIdx = Math.min(s.activePeriodIdx, periods.length - 1);
          return { activePeriodIdx, match: { ...s.match, periods } };
        }),

      setActivePeriod: (idx) => set({ activePeriodIdx: idx, selectedPlayerId: null }),

      resetMatch: () => set({ match: newMatch(), activePeriodIdx: 0, selectedPlayerId: null }),
    }),
    {
      name: 'laguppstallning-v02',
      // Persist only match data; activePeriodIdx and selectedPlayerId reset on load
      partialize: (s) => ({ match: s.match }),
      version: 2,
      migrate: (persisted: unknown) => {
        // Migrate v0.1 data: match.lineup → match.periods[0]
        const s = persisted as { match?: { lineup?: Lineup; periods?: Lineup[] } };
        if (s?.match?.lineup && !s.match.periods) {
          s.match.periods = [s.match.lineup];
          delete s.match.lineup;
        }
        return s;
      },
    }
  )
);
