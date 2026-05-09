import { useState, useRef } from 'react';
import { UserPlus, X } from 'lucide-react';
import { useMatchStore } from '../store/matchStore';

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

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleAdd();
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
          onKeyDown={handleKeyDown}
          placeholder="Spelarens namn..."
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={handleAdd}
          disabled={!inputValue.trim()}
          className="flex items-center gap-1 bg-green-600 text-white rounded-lg px-3 py-2 text-sm font-medium disabled:opacity-40 active:bg-green-700 min-w-[44px] justify-center"
        >
          <UserPlus size={16} />
        </button>
      </div>

      {/* On field */}
      {onFieldIds.size > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
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
                  variant="on-field"
                  selected={selectedPlayerId === id}
                  onSelect={() => selectPlayer(selectedPlayerId === id ? null : id)}
                  onRemove={() => removePlayer(id)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Bench */}
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
          Avbytare{substitutes.length > 0 ? ` (${substitutes.length})` : ''}
        </p>
        {substitutes.length === 0 ? (
          <p className="text-sm text-slate-400 italic">
            Inga avbytare — lägg till spelare ovan
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {substitutes.map(player => (
              <PlayerChip
                key={player.id}
                player={player}
                variant="bench"
                selected={selectedPlayerId === player.id}
                onSelect={() => selectPlayer(selectedPlayerId === player.id ? null : player.id)}
                onRemove={() => removePlayer(player.id)}
              />
            ))}
          </div>
        )}
      </div>

      {selectedPlayerId && (
        <p className="text-xs text-green-700 bg-green-50 rounded-lg px-3 py-2 border border-green-200">
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
  return (
    <div
      className={[
        'flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-medium transition-all',
        variant === 'bench'
          ? selected
            ? 'bg-green-600 text-white border-green-600 shadow-md scale-105'
            : 'bg-white text-slate-700 border-slate-300 active:bg-slate-100'
          : 'bg-slate-100 text-slate-600 border-slate-200',
      ].join(' ')}
    >
      <button onClick={onSelect} className="min-h-[28px]">
        {player.name}
      </button>
      <button
        onClick={onRemove}
        className="ml-1 text-current opacity-50 hover:opacity-100 transition-opacity"
        aria-label={`Ta bort ${player.name}`}
      >
        <X size={13} />
      </button>
    </div>
  );
}
