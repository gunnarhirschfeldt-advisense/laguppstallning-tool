import { useMatchStore } from '../store/matchStore';
import { POSITIONS, ALL_POSITIONS } from '../utils/formations';
import type { PlannedSub, Position } from '../types/domain';

function outBadgeLabel(subs: PlannedSub[], playerId: string): string | null {
  const relevant = subs
    .filter(s => s.playerOutId === playerId)
    .sort((a, b) => (a.minute ?? 999) - (b.minute ?? 999));
  if (!relevant.length) return null;
  const first = relevant[0];
  return first.minute !== null ? `${first.minute}'` : '↓';
}

const W = 336;
const H = 460;

function shortName(name: string): string {
  return name.length > 9 ? name.slice(0, 8) + '…' : name;
}

export function PitchSVG() {
  const { match, activePeriodIdx, selectedPlayerId, assignToPosition, removeFromPosition } = useMatchStore();
  const { positions, plannedSubs } = match.periods[activePeriodIdx];

  function handlePositionClick(pos: Position) {
    if (selectedPlayerId) {
      assignToPosition(pos);
    } else if (positions[pos]) {
      removeFromPosition(pos);
    }
  }

  return (
    <div className="w-full" style={{ background: '#0a1a0e' }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ display: 'block', maxHeight: '72vh' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Grass stripes */}
        {Array.from({ length: 10 }, (_, i) => (
          <rect key={i} x={0} y={i * 46} width={W} height={46}
            fill={i % 2 === 0 ? '#0e2212' : '#122817'} />
        ))}

        {/* Pitch markings */}
        <g stroke="rgba(255,255,255,0.22)" strokeWidth="1.2" fill="none">
          {/* Outer boundary */}
          <rect x="18" y="14" width="300" height="432" rx="2" />
          {/* Halfway line */}
          <line x1="18" y1="230" x2="318" y2="230" />
          {/* Center circle */}
          <circle cx="168" cy="230" r="42" />
          {/* Top penalty area */}
          <rect x="82" y="14" width="172" height="72" />
          {/* Top goal box */}
          <rect x="120" y="14" width="96" height="24" />
          {/* Bottom penalty area */}
          <rect x="82" y="374" width="172" height="72" />
          {/* Bottom goal box */}
          <rect x="120" y="422" width="96" height="24" />
          {/* Corner arcs */}
          <path d="M 18 30 A 16 16 0 0 1 34 14" />
          <path d="M 302 14 A 16 16 0 0 1 318 30" />
          <path d="M 18 430 A 16 16 0 0 0 34 446" />
          <path d="M 302 446 A 16 16 0 0 0 318 430" />
        </g>
        {/* Center spot */}
        <circle cx="168" cy="230" r="2.5" fill="rgba(255,255,255,0.3)" />
        {/* Penalty spots */}
        <circle cx="168" cy="58" r="2.5" fill="rgba(255,255,255,0.3)" />
        <circle cx="168" cy="402" r="2.5" fill="rgba(255,255,255,0.3)" />

        {/* Goals */}
        <rect x="120" y="5" width="96" height="12" rx="2"
          fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <rect x="120" y="443" width="96" height="12" rx="2"
          fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />

        {/* Player pucks */}
        {ALL_POSITIONS.map(pos => {
          const meta = POSITIONS[pos];
          const playerId = positions[pos];
          const player = playerId ? match.roster.find(p => p.id === playerId) : null;
          const isTarget = !!selectedPlayerId;
          const cx = meta.svgX;
          const cy = meta.svgY;

          const badge = player ? outBadgeLabel(plannedSubs, player.id) : null;

          return (
            <g key={pos} onClick={() => handlePositionClick(pos)} style={{ cursor: 'pointer' }}>
              {player ? (
                <>
                  {/* Filled puck */}
                  <circle cx={cx} cy={cy} r="24"
                    fill={meta.bg} stroke={badge ? '#FC273F' : meta.border}
                    strokeWidth={badge ? "2.5" : "2"} />
                  <text x={cx} y={cy - 4}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize="10" fontWeight="700" fill={meta.text}
                    fontFamily="Inter, sans-serif">
                    {meta.label}
                  </text>
                  <text x={cx} y={cy + 9}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize="9" fontWeight="500" fill={meta.text}
                    fontFamily="Inter, sans-serif">
                    {shortName(player.name)}
                  </text>
                  {/* Sub-out badge */}
                  {badge && (
                    <g>
                      <circle cx={cx + 17} cy={cy - 17} r="9"
                        fill="#FC273F" stroke="#0a1a0e" strokeWidth="1.5" />
                      <text x={cx + 17} y={cy - 17}
                        textAnchor="middle" dominantBaseline="middle"
                        fontSize={badge.length > 2 ? "6" : "7.5"}
                        fontWeight="700" fill="#fff"
                        fontFamily="Inter, sans-serif">
                        {badge}
                      </text>
                    </g>
                  )}
                </>
              ) : (
                <>
                  {/* Empty slot */}
                  <circle cx={cx} cy={cy} r="22"
                    fill={isTarget ? 'rgba(193,170,124,0.15)' : 'rgba(255,255,255,0.06)'}
                    stroke={isTarget ? 'rgba(193,170,124,0.7)' : 'rgba(255,255,255,0.25)'}
                    strokeWidth="1.5"
                    strokeDasharray={isTarget ? '4 3' : '3 3'} />
                  <text x={cx} y={cy}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize="10" fontWeight="600"
                    fill={isTarget ? 'rgba(193,170,124,0.9)' : 'rgba(255,255,255,0.35)'}
                    fontFamily="Inter, sans-serif">
                    {meta.label}
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
