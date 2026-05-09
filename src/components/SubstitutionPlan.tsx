import { useState } from 'react';
import { Plus, Trash2, ArrowRight } from 'lucide-react';
import { useMatchStore } from '../store/matchStore';

export function SubstitutionPlan() {
  const { match, addPlannedSub, removePlannedSub } = useMatchStore();
  const { positions, substitutes, plannedSubs } = match.lineup;

  const onFieldIds = Object.values(positions).filter(Boolean) as string[];
  const benchIds = substitutes;

  const [minuteInput, setMinuteInput] = useState('');
  const [playerOutId, setPlayerOutId] = useState('');
  const [playerInId, setPlayerInId] = useState('');
  const [error, setError] = useState('');

  function playerName(id: string) {
    return match.roster.find(p => p.id === id)?.name ?? id;
  }

  function positionFor(id: string): string {
    for (const [pos, pid] of Object.entries(positions)) {
      if (pid === id) return pos;
    }
    return '';
  }

  function handleAdd() {
    setError('');
    if (!playerOutId) { setError('Välj spelare ut'); return; }
    if (!playerInId) { setError('Välj spelare in'); return; }
    if (playerOutId === playerInId) { setError('Samma spelare'); return; }

    const minute = minuteInput.trim() === '' ? null : parseInt(minuteInput);
    if (minuteInput.trim() !== '' && (isNaN(minute!) || minute! < 0)) {
      setError('Ogiltig minut');
      return;
    }

    addPlannedSub({ minute: minute ?? null, playerInId, playerOutId });
    setMinuteInput('');
    setPlayerOutId('');
    setPlayerInId('');
  }

  const sorted = [...plannedSubs].sort((a, b) => {
    if (a.minute === null && b.minute === null) return 0;
    if (a.minute === null) return 1;
    if (b.minute === null) return -1;
    return a.minute - b.minute;
  });

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
        Planerade byten
      </h2>

      {/* Add form */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 space-y-3">
        <div className="flex gap-2 items-center">
          <label className="text-xs text-slate-500 w-12 shrink-0">Minut</label>
          <input
            type="number"
            min={0}
            max={60}
            value={minuteInput}
            onChange={e => setMinuteInput(e.target.value)}
            placeholder="Vid behov"
            className="w-full rounded-lg border border-slate-300 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="flex gap-2 items-center">
          <label className="text-xs text-slate-500 w-12 shrink-0">Ut</label>
          <select
            value={playerOutId}
            onChange={e => setPlayerOutId(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          >
            <option value="">Välj spelare...</option>
            {onFieldIds.map(id => (
              <option key={id} value={id}>
                {playerName(id)} ({positionFor(id)})
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 items-center">
          <label className="text-xs text-slate-500 w-12 shrink-0">In</label>
          <select
            value={playerInId}
            onChange={e => setPlayerInId(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          >
            <option value="">Välj spelare...</option>
            {benchIds.map(id => (
              <option key={id} value={id}>
                {playerName(id)}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <button
          onClick={handleAdd}
          disabled={onFieldIds.length === 0 || benchIds.length === 0}
          className="w-full flex items-center justify-center gap-2 bg-green-600 text-white rounded-lg px-3 py-2.5 text-sm font-medium disabled:opacity-40 active:bg-green-700"
        >
          <Plus size={15} />
          Lägg till byte
        </button>

        {onFieldIds.length === 0 && (
          <p className="text-xs text-slate-400 text-center">
            Placera spelare på planen först
          </p>
        )}
      </div>

      {/* Substitution list */}
      {sorted.length > 0 && (
        <div className="space-y-2">
          {sorted.map(sub => (
            <div
              key={sub.id}
              className="flex items-center gap-3 bg-white rounded-xl border border-slate-200 px-3 py-2.5"
            >
              <span className="text-xs font-bold text-slate-500 w-12 shrink-0 text-center">
                {sub.minute !== null ? `${sub.minute}'` : 'Vid behov'}
              </span>
              <div className="flex-1 flex items-center gap-1.5 text-sm min-w-0">
                <span className="font-medium truncate">{playerName(sub.playerOutId)}</span>
                <ArrowRight size={13} className="text-slate-400 shrink-0" />
                <span className="font-medium truncate text-green-700">
                  {playerName(sub.playerInId)}
                </span>
              </div>
              <button
                onClick={() => removePlannedSub(sub.id)}
                className="text-slate-400 hover:text-red-500 transition-colors p-1"
                aria-label="Ta bort byte"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      {sorted.length === 0 && (
        <p className="text-sm text-slate-400 italic text-center py-2">
          Inga planerade byten
        </p>
      )}
    </div>
  );
}
