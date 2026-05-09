import { useMatchStore } from '../store/matchStore';
import type { PlannedSub } from '../types/domain';

function initials(name: string): string {
  return name.split(' ').map(w => w[0] ?? '').join('').toUpperCase().slice(0, 2);
}

function inBadgeLabel(subs: PlannedSub[], playerId: string): string | null {
  const relevant = subs
    .filter(s => s.playerInId === playerId)
    .sort((a, b) => (a.minute ?? 999) - (b.minute ?? 999));
  if (!relevant.length) return null;
  const first = relevant[0];
  return first.minute !== null ? `${first.minute}'` : '↑';
}

export function Bench() {
  const { match, activePeriodIdx, selectedPlayerId, selectPlayer } = useMatchStore();
  const { substitutes, plannedSubs } = match.periods[activePeriodIdx];

  const players = substitutes
    .map(id => match.roster.find(p => p.id === id))
    .filter(Boolean) as typeof match.roster;

  if (players.length === 0) {
    return (
      <div className="px-4 py-3 flex items-center gap-2"
        style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <span className="text-xs" style={{ color: 'rgba(237,237,241,0.35)' }}>
          Avbytarbänk — inga spelare
        </span>
      </div>
    );
  }

  return (
    <div className="px-3 py-2.5 flex items-center gap-2 overflow-x-auto"
      style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <span className="text-xs font-semibold uppercase tracking-widest shrink-0 mr-1"
        style={{ color: 'rgba(193,170,124,0.6)', fontSize: 9 }}>
        BÄNK
      </span>
      {players.map(player => {
        const sel = selectedPlayerId === player.id;
        const badge = inBadgeLabel(plannedSubs, player.id);
        return (
          <button
            key={player.id}
            onClick={() => selectPlayer(sel ? null : player.id)}
            className="relative flex items-center gap-2 rounded-full shrink-0 transition-all"
            style={{
              padding: '5px 12px 5px 6px',
              background: sel ? '#C1AA7C' : badge ? 'rgba(126,232,158,0.1)' : 'rgba(255,255,255,0.08)',
              border: sel
                ? '2px solid #C1AA7C'
                : badge
                ? '2px solid rgba(126,232,158,0.5)'
                : '2px solid rgba(255,255,255,0.12)',
            }}>
            {/* Avatar circle */}
            <span className="flex items-center justify-center rounded-full shrink-0"
              style={{
                width: 26, height: 26,
                background: sel ? 'rgba(0,0,0,0.2)' : badge ? 'rgba(126,232,158,0.2)' : 'rgba(255,255,255,0.1)',
                fontSize: 9, fontWeight: 700, letterSpacing: '0.04em',
                color: sel ? '#3C1053' : badge ? '#7EE89E' : 'rgba(237,237,241,0.7)',
                fontFamily: 'Inter, sans-serif',
              }}>
              {initials(player.name)}
            </span>
            <span style={{
              fontSize: 12, fontWeight: 600,
              color: sel ? '#3C1053' : badge ? '#7EE89E' : '#EDEDF1',
              whiteSpace: 'nowrap',
            }}>
              {player.name}
            </span>
            {/* Sub-in badge */}
            {badge && !sel && (
              <span className="flex items-center justify-center rounded-full"
                style={{
                  width: 16, height: 16, marginLeft: -4,
                  background: '#7EE89E',
                  fontSize: 7, fontWeight: 800,
                  color: '#0a2a12',
                  fontFamily: 'Inter, sans-serif',
                  flexShrink: 0,
                }}>
                {badge === '↑' ? '↑' : badge.replace("'", '')}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
