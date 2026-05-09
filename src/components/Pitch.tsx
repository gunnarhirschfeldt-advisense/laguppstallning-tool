import { useMatchStore } from '../store/matchStore';
import { POSITIONS, ALL_POSITIONS } from '../utils/formations';
import type { Position } from '../types/domain';

export function Pitch() {
  const { match, selectedPlayerId, assignToPosition, removeFromPosition } = useMatchStore();
  const { positions } = match.lineup;

  function handlePositionClick(pos: Position) {
    const occupantId = positions[pos];
    if (selectedPlayerId) {
      // A player is selected — assign them here (even if occupied)
      assignToPosition(pos);
    } else if (occupantId) {
      // No selection — click occupied position to remove
      removeFromPosition(pos);
    }
  }

  return (
    <div
      className="relative rounded-xl overflow-hidden select-none"
      style={{
        background: 'linear-gradient(180deg, #22863a 0%, #2ea043 50%, #22863a 100%)',
        minHeight: 340,
      }}
    >
      {/* Pitch markings */}
      <PitchMarkings />

      {/* Position grid — 5 cols × 4 rows */}
      <div
        className="relative z-10 grid py-4 px-2"
        style={{
          gridTemplateColumns: 'repeat(5, 1fr)',
          gridTemplateRows: 'repeat(4, 80px)',
        }}
      >
        {ALL_POSITIONS.map(pos => {
          const meta = POSITIONS[pos];
          const playerId = positions[pos];
          const player = playerId ? match.roster.find(p => p.id === playerId) : null;
          const isTarget = !!selectedPlayerId;

          return (
            <div
              key={pos}
              className="flex items-center justify-center"
              style={{
                gridRow: meta.gridRow,
                gridColumn: meta.gridCol,
              }}
            >
              <button
                onClick={() => handlePositionClick(pos)}
                className={[
                  'flex flex-col items-center justify-center rounded-xl border-2 transition-all',
                  'min-w-[64px] min-h-[64px] px-2 py-1 cursor-pointer',
                  player
                    ? `${meta.bgColor} ${meta.borderColor} ${meta.color}`
                    : isTarget
                    ? 'bg-white/30 border-white border-dashed text-white'
                    : 'bg-white/20 border-white/40 border-dashed text-white/70',
                  isTarget && !player ? 'scale-105 shadow-lg' : '',
                ].join(' ')}
              >
                <span className="text-xs font-bold leading-none">{meta.label}</span>
                {player ? (
                  <span className="text-sm font-semibold leading-tight mt-0.5 text-center max-w-[72px] truncate">
                    {player.name}
                  </span>
                ) : (
                  <span className="text-xs opacity-60 mt-0.5">–</span>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PitchMarkings() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      fill="none"
      stroke="rgba(255,255,255,0.25)"
      strokeWidth="0.5"
    >
      {/* Outer border */}
      <rect x="3" y="2" width="94" height="96" />
      {/* Halfway line */}
      <line x1="3" y1="50" x2="97" y2="50" />
      {/* Center circle */}
      <circle cx="50" cy="50" r="12" />
      {/* Center spot */}
      <circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.25)" />
      {/* Penalty area top */}
      <rect x="25" y="2" width="50" height="18" />
      {/* Goal top */}
      <rect x="37" y="2" width="26" height="6" />
      {/* Penalty area bottom */}
      <rect x="25" y="80" width="50" height="18" />
      {/* Goal bottom */}
      <rect x="37" y="92" width="26" height="6" />
    </svg>
  );
}
