import { useState } from 'react';
import { Plus, Trash2, ArrowRight } from 'lucide-react';
import { useMatchStore } from '../store/matchStore';

const SFK = { purple: '#3C1053', gold: '#C1AA7C' };

export function SubstitutionPlan() {
  const { match, activePeriodIdx, addPlannedSub, removePlannedSub } = useMatchStore();
  const { positions, substitutes, plannedSubs } = match.periods[activePeriodIdx];

  const onFieldIds = Object.values(positions).filter(Boolean) as string[];

  const [minuteInput, setMinuteInput] = useState('');
  const [playerOutId, setPlayerOutId] = useState('');
  const [playerInId, setPlayerInId] = useState('');
  const [error, setError] = useState('');

  function playerName(id: string) {
    return match.roster.find(p => p.id === id)?.name ?? id;
  }
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

  const inputStyle = { borderColor: '#D0C8D8' };
  const inputClass = 'w-full rounded-lg border px-2 py-2 text-sm focus:outline-none bg-white';

  return (
    <div className="space-y-4">
      <h2 className="text-xs font-semibold uppercase tracking-wide" style={{ color: SFK.purple }}>
        Planerade byten — period {activePeriodIdx + 1}
      </h2>

      <div className="bg-white rounded-xl border p-3 space-y-3" style={{ borderColor: '#DCDCDE' }}>
        <div className="flex gap-2 items-center">
          <label className="text-xs w-12 shrink-0" style={{ color: '#6B5080' }}>Minut</label>
          <input type="number" min={0} max={60} value={minuteInput}
            onChange={e => setMinuteInput(e.target.value)} placeholder="Vid behov"
            className={inputClass} style={inputStyle} />
        </div>
        <div className="flex gap-2 items-center">
          <label className="text-xs w-12 shrink-0" style={{ color: '#6B5080' }}>Ut</label>
          <select value={playerOutId} onChange={e => setPlayerOutId(e.target.value)}
            className={inputClass} style={inputStyle}>
            <option value="">Välj spelare...</option>
            {onFieldIds.map(id => (
              <option key={id} value={id}>{playerName(id)} ({positionFor(id)})</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 items-center">
          <label className="text-xs w-12 shrink-0" style={{ color: '#6B5080' }}>In</label>
          <select value={playerInId} onChange={e => setPlayerInId(e.target.value)}
            className={inputClass} style={inputStyle}>
            <option value="">Välj spelare...</option>
            {substitutes.map(id => (
              <option key={id} value={id}>{playerName(id)}</option>
            ))}
          </select>
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <button onClick={handleAdd}
          disabled={onFieldIds.length === 0 || substitutes.length === 0}
          className="w-full flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
          style={{ background: SFK.purple }}>
          <Plus size={15} /> Lägg till byte
        </button>

        {onFieldIds.length === 0 && (
          <p className="text-xs text-center" style={{ color: '#A090B0' }}>
            Placera spelare på planen först
          </p>
        )}
      </div>

      {sorted.length > 0 && (
        <div className="space-y-2">
          {sorted.map(sub => (
            <div key={sub.id} className="flex items-center gap-3 bg-white rounded-xl border px-3 py-2.5"
              style={{ borderColor: '#DCDCDE' }}>
              <span className="text-xs font-bold w-12 shrink-0 text-center" style={{ color: SFK.gold }}>
                {sub.minute !== null ? `${sub.minute}'` : 'Vid behov'}
              </span>
              <div className="flex-1 flex items-center gap-1.5 text-sm min-w-0">
                <span className="font-medium truncate">{playerName(sub.playerOutId)}</span>
                <ArrowRight size={13} className="shrink-0" style={{ color: '#C0B0C8' }} />
                <span className="font-semibold truncate" style={{ color: SFK.purple }}>
                  {playerName(sub.playerInId)}
                </span>
              </div>
              <button onClick={() => removePlannedSub(sub.id)}
                className="p-1 opacity-40 hover:opacity-100 transition-opacity"
                aria-label="Ta bort byte">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      {sorted.length === 0 && (
        <p className="text-sm italic text-center py-2" style={{ color: '#A090B0' }}>
          Inga planerade byten
        </p>
      )}
    </div>
  );
}
