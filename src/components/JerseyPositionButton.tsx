type PositionRole = 'GK' | 'DEF' | 'MID' | 'FWD';

type JerseyPositionButtonProps = {
  positionLabel: string;
  role: PositionRole;
  player?: { name: string; number: number };
  selected?: boolean;
  compact?: boolean;
  onClick: () => void;
};

export function JerseyPositionButton({
  positionLabel,
  role,
  player,
  selected = false,
  compact = false,
  onClick,
}: JerseyPositionButtonProps) {
  const isGK = role === 'GK';

  const jerseyH = compact ? 48 : selected ? 64 : 56;
  const jerseyW = Math.round(jerseyH * (240 / 360));
  const numSize = compact ? 20 : selected ? 28 : 24;

  const ariaLabel = player
    ? `${positionLabel}, ${player.name}, nummer ${player.number}`
    : `${positionLabel}, obesatt, välj spelare`;

  if (!player) {
    return (
      <button
        onClick={onClick}
        aria-label={ariaLabel}
        className={`flex min-h-[64px] min-w-[64px] flex-col items-center justify-center rounded-2xl border-2 border-dashed px-2 py-2 active:scale-95 transition-all ${
          selected
            ? 'border-white/60 bg-white/20 text-white scale-105'
            : 'border-slate-400 bg-white/85 text-slate-500'
        }`}>
        <span className="text-xs font-black">{positionLabel}</span>
        <span className="text-[10px] font-semibold">Välj</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`flex min-h-[64px] min-w-[64px] flex-col items-center justify-center transition-all active:scale-95 ${
        selected ? 'scale-105 ring-4 ring-white/60 shadow-lg rounded-xl' : ''
      }`}>
      {/* Jersey + number */}
      <div className="relative" style={{ width: jerseyW, height: jerseyH }}>
        {isGK ? (
          <div
            className="rounded-sm"
            style={{
              width: jerseyW,
              height: jerseyH,
              background: 'linear-gradient(160deg, #15803d 0%, #166534 100%)',
            }}
          />
        ) : (
          <img
            src={`${import.meta.env.BASE_URL}images/jersey-thumbnail-240.webp`}
            alt=""
            draggable={false}
            style={{
              width: jerseyW,
              height: jerseyH,
              display: 'block',
              objectFit: 'cover',
              mixBlendMode: 'multiply',
            }}
          />
        )}
        {/* Ryggnummer */}
        <span
          className="jersey-number absolute left-1/2 -translate-x-1/2 -translate-y-1/2 select-none"
          style={{ top: '42%', fontSize: numSize }}>
          {player.number}
        </span>
      </div>

      {/* Namnpill */}
      <span className="mt-0.5 max-w-[72px] truncate rounded-full bg-white/90 px-1.5 py-0.5 text-[10px] font-bold text-slate-900 shadow-sm">
        {player.name}
      </span>
    </button>
  );
}
