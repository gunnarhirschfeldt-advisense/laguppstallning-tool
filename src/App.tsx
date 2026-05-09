import { useState } from 'react';
import { RotateCcw, Edit2, Check } from 'lucide-react';
import { useMatchStore } from './store/matchStore';
import { Pitch } from './components/Pitch';
import { Roster } from './components/Roster';
import { SubstitutionPlan } from './components/SubstitutionPlan';
import './index.css';

export default function App() {
  const { match, setMatchName, resetMatch } = useMatchStore();
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);

  function startEditName() {
    setNameInput(match.name);
    setEditingName(true);
  }

  function saveName() {
    const trimmed = nameInput.trim();
    if (trimmed) setMatchName(trimmed);
    setEditingName(false);
  }

  function handleReset() {
    if (confirmReset) {
      resetMatch();
      setConfirmReset(false);
    } else {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 3000);
    }
  }

  return (
    <div className="min-h-svh bg-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-20 shadow-sm">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            {editingName ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  autoFocus
                  type="text"
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && saveName()}
                  onBlur={saveName}
                  className="text-base font-semibold border-b-2 border-green-500 bg-transparent focus:outline-none min-w-0 flex-1"
                />
                <button onClick={saveName} className="text-green-600">
                  <Check size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={startEditName}
                className="flex items-center gap-2 text-left min-w-0"
              >
                <span className="text-base font-semibold text-slate-800 truncate">
                  {match.name}
                </span>
                <Edit2 size={13} className="text-slate-400 shrink-0" />
              </button>
            )}
          </div>

          <button
            onClick={handleReset}
            className={[
              'flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border transition-all shrink-0',
              confirmReset
                ? 'bg-red-600 text-white border-red-600'
                : 'text-slate-500 border-slate-200 bg-white active:bg-slate-50',
            ].join(' ')}
          >
            <RotateCcw size={14} />
            {confirmReset ? 'Bekräfta?' : 'Ny match'}
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-lg mx-auto px-4 py-4 space-y-4 pb-8">
        {/* Pitch */}
        <section>
          <Pitch />
        </section>

        {/* Roster */}
        <section className="bg-white rounded-xl border border-slate-200 p-4">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
            Trupp
          </h2>
          <Roster />
        </section>

        {/* Substitutions */}
        <section className="bg-slate-50 rounded-xl border border-slate-200 p-4">
          <SubstitutionPlan />
        </section>
      </main>
    </div>
  );
}
