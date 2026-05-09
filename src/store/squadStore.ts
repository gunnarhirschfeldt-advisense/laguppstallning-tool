import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { squad } from '../data/squad';
import type { SquadPlayer } from '../data/squad';

type SquadStore = {
  calledPlayers: string[];
  toggleCalled: (id: string) => void;
  isCalledToMatch: (id: string) => boolean;
  getCalledSquad: () => SquadPlayer[];
};

export const useSquadStore = create<SquadStore>()(
  persist(
    (set, get) => ({
      calledPlayers: [],

      toggleCalled: (id) =>
        set(s => ({
          calledPlayers: s.calledPlayers.includes(id)
            ? s.calledPlayers.filter(pid => pid !== id)
            : [...s.calledPlayers, id],
        })),

      isCalledToMatch: (id) => get().calledPlayers.includes(id),

      getCalledSquad: () => squad.filter(p => get().calledPlayers.includes(p.id)),
    }),
    { name: 'calledPlayers' }
  )
);
