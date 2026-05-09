import { useState } from 'react';
import { Plus, Trash2, ArrowRight } from 'lucide-react';
import { useMatchStore } from '../store/matchStore';
import { useSquadStore } from '../store/squadStore';
import { squad, squadPlayerName } from '../data/squad';

export function SubstitutionPlan() {
  const { match, activePeriodIdx, addPlannedSub, removePlannedSub } = useMatchStore();
  const { positions, plannedSubs } = match.periods[activePeriodIdx];
  const calledPlayers = useSquadStore(s => s.calledPlayers);

  const onFieldIds = Object.values(positions).filter(Boolean) as string[];
  const onFieldSet = new Set(onFieldIds);
  const benchPlayers = squad.filter(p => calledPlayers.includes(p.id) && !onFieldSet.has(p.id));

  const [minuteInput, setMinuteInput] = useState('');
  const [playerOutId, setPlayerOutId] = useState('');
  const [playerInId, setPlayerInId] = useState('');
  const [error, setError] = useState('');

  function playerName(id: string) { return squadPlayerName(id); }
  function positionFor(id: string) {
    for (const [pos, pid] of Object.entries(positions)) {
      if (pid === id) return pos;
    }
    return '';
  }

  function handleAdd() {
    setError('');
    if (!playerOutId) { setError('Välj spelare ut'); return; }
    if (!playerInId)  { setError('Välj spelare in'); return; }
    if (playerOutId === playerInId) { setError('Samma spelare'); return; }
    const minute = minuteInput.trim() === '' ? null : parseInt(minuteInput);
    if (minuteInput.trim() !== '' && (isNaN(minute!) || minute! < 0)) { setError('Ogiltig minut'); return; }
    addPlannedSub({ minute: minute ?? null, playerInId, playerOutId });
    setMinuteInput(''); setPlayerOutId(''); setPlayerInId('');
  }

  const sorted = [...plannedSubs].sort((a, b) => {
    if (a.minute === null && b.minute === null) return 0;
    if (a.minute === null) return 1;
    if (b.minute === null) return -1;
    return a.minute - b.minute;
  });

  const selectStyle = {
    background: '#111118',
    border: '1px solid rgba(255,255,255,0.12)',
    color: '#EDEDF1',
    borderRadius: 8,
    padding: '8px 10px',
    fontSize: 14,
    width: '100%',
    outline: 'none',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'rgba(193,170,124,0.6)' }}>
          Planerade byten
        </h2>
        <span className="rounded-full px-2 py-0.5 text-xs font-bold"
          style={{
            background: 'rgba(193,170,124,0.15)',
            color: '#C1AA7C',
            border: '1px solid rgba(193,170,124,0.25)',
          }}>
          P{activePeriodIdx + 1}
        </span>
      </div>

      {/* Add form */}
      <div className="rounded-xl p-3 space-y-3"
        style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex gap-2 items-center">
          <label className="text-xs w-12 shrink-0" style={{ color: 'rgba(237,237,241,0.45)' }}>Minut</label>
          <input type="number" min={0} max={90} value={minuteInput}
            onChange={e => setMinuteInput(e.target.value)} placeholder="Valfritt"
            style={{ ...selectStyle, width: '100%' }} />
        </div>
        <div className="flex gap-2 items-center">
          <label className="text-xs w-12 shrink-0" style={{ color: 'rgba(237,237,241,0.45)' }}>Ut</label>
          <select value={playerOutId} onChange={e => setPlayerOutId(e.target.value)}
            style={selectStyle}>
            <option value="">Välj spelare...</option>
            {onFieldIds.map(id => (
              <option key={id} value={id}>{playerName(id)} ({positionFor(id)})</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 items-center">
          <label className="text-xs w-12 shrink-0" style={{ color: 'rgba(237,237,241,0.45)' }}>In</label>
          <select value={playerInId} onChange={e => setPlayerInId(e.target.value)}
            style={selectStyle}>
            <option value="">Välj spelare...</option>
            {benchPlayers.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {error && <p className="text-xs" style={{ color: '#FC273F' }}>{error}</p>}

        <button onClick={handleAdd}
          disabled={onFieldIds.length === 0 || benchPlayers.length === 0}
          className="w-full flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all disabled:opacity-30"
          style={{ background: '#3C1053', color: '#EDEDF1', border: '1px solid rgba(92,6,140,0.6)' }}>
          <Plus size={15} /> Lägg till byte
        </button>

        {onFieldIds.length === 0 && (
          <p className="text-xs text-center" style={{ color: 'rgba(237,237,241,0.3)' }}>
            Placera spelare på planen först (Plan-fliken)
          </p>
        )}
        {onFieldIds.length > 0 && benchPlayers.length === 0 && (
          <p className="text-xs text-center" style={{ color: 'rgba(237,237,241,0.3)' }}>
            Kalla fler spelare i Trupp-fliken
          </p>
        )}
      </div>

      {/* List */}
      {sorted.length > 0 && (
        <div className="space-y-2">
          {sorted.map(sub => (
            <div key={sub.id}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5"
              style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.07)' }}>
              <span className="text-xs font-bold w-12 shrink-0 text-center"
                style={{ color: '#C1AA7C' }}>
                {sub.minute !== null ? `${sub.minute}'` : 'Vb'}
              </span>
              <div className="flex-1 flex items-center gap-1.5 text-sm min-w-0">
                <span className="truncate" style={{ color: '#FC273F', fontWeight: 600 }}>
                  {playerName(sub.playerOutId)}
                </span>
                <ArrowRight size={12} className="shrink-0" style={{ color: 'rgba(237,237,241,0.25)' }} />
                <span className="truncate font-semibold" style={{ color: '#7EE89E' }}>
                  {playerName(sub.playerInId)}
                </span>
              </div>
              <button onClick={() => removePlannedSub(sub.id)}
                className="p-1 transition-opacity"
                style={{ opacity: 0.35 }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '0.35')}
                aria-label="Ta bort byte">
                <Trash2 size={14} style={{ color: '#EDEDF1' }} />
              </button>
            </div>
          ))}
        </div>
      )}

      {sorted.length === 0 && (
        <p className="text-sm italic text-center py-3" style={{ color: 'rgba(237,237,241,0.25)' }}>
          Inga planerade byten
        </p>
      )}
    </div>
  );
}
