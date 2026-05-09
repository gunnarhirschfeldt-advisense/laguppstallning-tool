import { useState, useRef } from 'react';
import { UserPlus, X } from 'lucide-react';
import { useMatchStore } from '../store/matchStore';

const SFK = {
  purple:  '#3C1053',
  purpleL: '#EDE0F7',
  gold:    '#C1AA7C',
  goldL:   '#F5EDDC',
};

export function Roster() {
  const { match, selectedPlayerId, selectPlayer, addPlayer, removePlayer } = useMatchStore();
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const onFieldIds = new Set(Object.values(match.lineup.positions).filter(Boolean) as string[]);

  function handleAdd() {
    const name = inputValue.trim();
    if (!name) return;
    addPlayer(name);
    setInputValue('');
    inputRef.current?.focus();
  }

  const substitutes = match.lineup.substitutes
    .map(id => match.roster.find(p => p.id === id))
    .filter(Boolean) as typeof match.roster;

  return (
    <div className="space-y-3">
      {/* Add player */}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Spelarens namn..."
          className="flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
          style={{ borderColor: '#D0C8D8', '--tw-ring-color': SFK.purple } as React.CSSProperties}
        />
        <button
          onClick={handleAdd}
          disabled={!inputValue.trim()}
          className="flex items-center justify-center rounded-lg px-3 py-2 text-white min-w-[44px] disabled:opacity-40 transition-opacity"
          style={{ background: SFK.purple }}
        >
          <UserPlus size={16} />
        </button>
      </div>

      {/* On field */}
      {onFieldIds.size > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: SFK.purple }}>
            På plan
          </p>
          <div className="flex flex-wrap gap-2">
            {[...onFieldIds].map(id => {
              const player = match.roster.find(p => p.id === id);
              if (!player) return null;
              return (
                <PlayerChip
                  key={id}
                  player={player}
                  selected={false}
                  onSelect={() => {}}
                  onRemove={() => removePlayer(id)}
                  variant="on-field"
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Bench */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: SFK.purple }}>
          Avbytare{substitutes.length > 0 ? ` (${substitutes.length})` : ''}
        </p>
        {substitutes.length === 0 ? (
          <p className="text-sm italic" style={{ color: '#A090B0' }}>
            Inga avbytare — lägg till spelare ovan
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {substitutes.map(player => (
              <PlayerChip
                key={player.id}
                player={player}
                selected={selectedPlayerId === player.id}
                onSelect={() => selectPlayer(selectedPlayerId === player.id ? null : player.id)}
                onRemove={() => removePlayer(player.id)}
                variant="bench"
              />
            ))}
          </div>
        )}
      </div>

      {selectedPlayerId && (
        <p
          className="text-xs rounded-lg px-3 py-2 border"
          style={{ background: SFK.goldL, borderColor: SFK.gold, color: SFK.purple }}
        >
          Spelare vald — tryck på en position på planen för att placera
        </p>
      )}
    </div>
  );
}

type PlayerChipProps = {
  player: { id: string; name: string };
  variant: 'on-field' | 'bench';
  selected: boolean;
  onSelect: () => void;
  onRemove: () => void;
};

function PlayerChip({ player, variant, selected, onSelect, onRemove }: PlayerChipProps) {
  const selectedStyle = { background: SFK.purple, borderColor: SFK.gold, color: '#FFFFFF' };
  const benchStyle   = { background: '#FFFFFF', borderColor: SFK.gold, color: SFK.purple };
  const fieldStyle   = { background: '#F5F0F8', borderColor: '#D0C8D8', color: '#6B5080' };

  const style = variant === 'bench'
    ? (selected ? selectedStyle : benchStyle)
    : fieldStyle;

  return (
    <div
      className="flex items-center gap-1 rounded-full border-2 px-3 py-1.5 text-sm font-medium transition-all"
      style={style}
    >
      <button onClick={onSelect} className="min-h-[28px]">
        {player.name}
      </button>
      <button
        onClick={onRemove}
        className="ml-1 opacity-50 hover:opacity-100 transition-opacity"
        aria-label={`Ta bort ${player.name}`}
      >
        <X size={13} />
      </button>
    </div>
  );
}
