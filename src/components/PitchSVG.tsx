import { useMatchStore } from '../store/matchStore';
import { POSITIONS, ALL_POSITIONS } from '../utils/formations';
import { JerseyPositionButton } from './JerseyPositionButton';
import { squadPlayerName, squadPlayerNumber } from '../data/squad';
import type { Position, PlannedSub } from '../types/domain';

const SVG_W = 336;
const SVG_H = 460;

type PositionRole = 'GK' | 'DEF' | 'MID' | 'FWD';

const ROLE_MAP: Record<Position, PositionRole> = {
  MV: 'GK',
  VB: 'DEF', HB: 'DEF',
  VM: 'MID', CM: 'MID', HM: 'MID',
  FW: 'FWD',
};

function getNumber(pos: Position, playerId: string): number {
  if (pos === 'MV') return 1;
  return squadPlayerNumber(playerId) ?? 99;
}

function outBadgeLabel(subs: PlannedSub[], playerId: string): string | null {
  const relevant = subs
    .filter(s => s.playerOutId === playerId)
    .sort((a, b) => (a.minute ?? 999) - (b.minute ?? 999));
  if (!relevant.length) return null;
  const first = relevant[0];
  return first.minute !== null ? `${first.minute}'` : '↓';
}

export function PitchSVG() {
  const { match, activePeriodIdx, selectedPlayerId, assignToPosition, removeFromPosition } = useMatchStore();
  const { positions, plannedSubs } = match.periods[activePeriodIdx];

  function playerName(id: string) { return squadPlayerName(id); }

  function handlePositionClick(pos: Position) {
    if (selectedPlayerId) {
      assignToPosition(pos);
    } else if (positions[pos]) {
      removeFromPosition(pos);
    }
  }

  return (
    <div className="relative w-full select-none" style={{ aspectRatio: `${SVG_W} / ${SVG_H}`, background: '#358a40' }}>

      {/* ── SVG pitch background ── */}
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        width="100%" height="100%"
        style={{ display: 'block', position: 'absolute', inset: 0 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Grass stripes */}
        {Array.from({ length: 10 }, (_, i) => (
          <rect key={i} x={0} y={i * 46} width={SVG_W} height={46}
            fill={i % 2 === 0 ? '#3d9e4a' : '#358a40'} />
        ))}

        {/* Pitch markings */}
        <g stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" fill="none">
          <rect x="18" y="14" width="300" height="432" rx="2" />
          <line x1="18" y1="230" x2="318" y2="230" />
          <circle cx="168" cy="230" r="42" />
          <rect x="82" y="14" width="172" height="72" />
          <rect x="120" y="14" width="96" height="24" />
          <rect x="82" y="374" width="172" height="72" />
          <rect x="120" y="422" width="96" height="24" />
          <path d="M 18 30 A 16 16 0 0 1 34 14" />
          <path d="M 302 14 A 16 16 0 0 1 318 30" />
          <path d="M 18 430 A 16 16 0 0 0 34 446" />
          <path d="M 302 446 A 16 16 0 0 0 318 430" />
        </g>
        <circle cx="168" cy="230" r="2.5" fill="rgba(255,255,255,0.3)" />
        <circle cx="168" cy="58"  r="2.5" fill="rgba(255,255,255,0.3)" />
        <circle cx="168" cy="402" r="2.5" fill="rgba(255,255,255,0.3)" />
        <rect x="120" y="5"   width="96" height="12" rx="2" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <rect x="120" y="443" width="96" height="12" rx="2" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      </svg>

      {/* ── HTML jersey overlays ── */}
      {ALL_POSITIONS.map(pos => {
        const meta   = POSITIONS[pos];
        const pctX   = (meta.svgX / SVG_W) * 100;
        const pctY   = (meta.svgY / SVG_H) * 100;
        const playerId = positions[pos];
        const badge    = playerId ? outBadgeLabel(plannedSubs, playerId) : null;

        return (
          <div
            key={pos}
            style={{
              position: 'absolute',
              left: `${pctX}%`,
              top: `${pctY}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
            }}>

            <JerseyPositionButton
              positionLabel={meta.label}
              role={ROLE_MAP[pos]}
              player={playerId
                ? { name: playerName(playerId), number: getNumber(pos, playerId) }
                : undefined}
              selected={!playerId && !!selectedPlayerId}
              onClick={() => handlePositionClick(pos)}
            />

            {/* Sub-out badge */}
            {badge && playerId && (
              <span
                className="absolute flex items-center justify-center rounded-full font-black text-white select-none pointer-events-none"
                style={{
                  top: 0, right: 0,
                  width: 20, height: 20,
                  fontSize: 9,
                  background: '#FC273F',
                  border: '1.5px solid #0a1a0e',
                  fontFamily: 'Inter, sans-serif',
                  zIndex: 20,
                }}>
                {badge}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
