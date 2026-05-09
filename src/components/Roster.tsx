import { useState, useRef } from 'react';
import { UserPlus, X } from 'lucide-react';
import { useMatchStore } from '../store/matchStore';

export function Roster() {
  const { match, activePeriodIdx, selectedPlayerId, selectPlayer, addPlayer, removePlayer } = useMatchStore();
  const { positions, substitutes } = match.periods[activePeriodIdx];
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const onFieldIds = new Set(Object.values(positions).filter(Boolean) as string[]);

  function handleAdd() {
    const name = inputValue.trim();
    if (!name) return;
    addPlayer(name);
    setInputValue('');
    inputRef.current?.focus();
  }

  const benchPlayers = substitutes
    .map(id => match.roster.find(p => p.id === id))
    .filter(Boolean) as typeof match.roster;

  return (
    <div className="space-y-4">
      {/* Add player input */}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Spelarens namn..."
          className="flex-1 rounded-lg px-3 py-2 text-sm focus:outline-none"
          style={{
            background: '#111118',
            border: '1px solid rgba(255,255,255,0.12)',
            color: '#EDEDF1',
          }}
        />
        <button
          onClick={handleAdd}
          disabled={!inputValue.trim()}
          className="flex items-center justify-center rounded-lg px-3 py-2 min-w-[44px] disabled:opacity-30 transition-opacity"
          style={{ background: '#3C1053', color: '#EDEDF1' }}>
          <UserPlus size={16} />
        </button>
      </div>

      {/* On field */}
      {onFieldIds.size > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2"
            style={{ color: 'rgba(193,170,124,0.5)', fontSize: 9 }}>
            På plan
          </p>
          <div className="flex flex-wrap gap-2">
            {[...onFieldIds].map(id => {
              const player = match.roster.find(p => p.id === id);
              if (!player) return null;
              return (
                <PlayerChip key={id} player={player} variant="on-field"
                  selected={false} onSelect={() => {}} onRemove={() => removePlayer(id)} />
              );
            })}
          </div>
        </div>
      )}

      {/* Bench */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-2"
          style={{ color: 'rgba(193,170,124,0.5)', fontSize: 9 }}>
          Avbytare{benchPlayers.length > 0 ? ` (${benchPlayers.length})` : ''}
        </p>
        {benchPlayers.length === 0 ? (
          <p className="text-sm italic" style={{ color: 'rgba(237,237,241,0.3)' }}>
            Inga avbytare
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {benchPlayers.map(player => (
              <PlayerChip key={player.id} player={player} variant="bench"
                selected={selectedPlayerId === player.id}
                onSelect={() => selectPlayer(selectedPlayerId === player.id ? null : player.id)}
                onRemove={() => removePlayer(player.id)} />
            ))}
          </div>
        )}
      </div>

      {selectedPlayerId && (
        <p className="text-xs rounded-lg px-3 py-2"
          style={{
            background: 'rgba(193,170,124,0.1)',
            border: '1px solid rgba(193,170,124,0.25)',
            color: '#C1AA7C',
          }}>
          Spelare vald — gå till Plan för att placera på planen
        </p>
      )}
    </div>
  );
}

type ChipProps = {
  player: { id: string; name: string };
  variant: 'on-field' | 'bench';
  selected: boolean;
  onSelect: () => void;
  onRemove: () => void;
};

function PlayerChip({ player, variant, selected, onSelect, onRemove }: ChipProps) {
  const style =
    variant === 'bench'
      ? selected
        ? { background: '#C1AA7C', borderColor: '#C1AA7C', color: '#3C1053' }
        : { background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(193,170,124,0.3)', color: '#EDEDF1' }
      : { background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(237,237,241,0.5)' };

  return (
    <div className="flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-medium transition-all"
      style={style}>
      <button onClick={onSelect} className="min-h-[28px]">{player.name}</button>
      <button onClick={onRemove} className="ml-1 opacity-40 hover:opacity-100 transition-opacity"
        aria-label={`Ta bort ${player.name}`}>
        <X size={13} />
      </button>
    </div>
  );
}
