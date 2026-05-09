import { useState } from 'react';
import { Edit2, Check, RotateCcw } from 'lucide-react';
import sfkLogo from './assets/sfk-logo.svg';
import { useMatchStore } from './store/matchStore';
import { Pitch } from './components/Pitch';
import { Roster } from './components/Roster';
import { SubstitutionPlan } from './components/SubstitutionPlan';
import { PeriodTabs } from './components/PeriodTabs';
import './index.css';

const SFK = { purple: '#3C1053', gold: '#C1AA7C' };

export default function App() {
  const { match, setMatchName, resetMatch } = useMatchStore();
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);

  function startEditName() { setNameInput(match.name); setEditingName(true); }
  function saveName() { const t = nameInput.trim(); if (t) setMatchName(t); setEditingName(false); }
  function handleReset() {
    if (confirmReset) { resetMatch(); setConfirmReset(false); }
    else { setConfirmReset(true); setTimeout(() => setConfirmReset(false), 3000); }
  }

  return (
    <div className="min-h-svh" style={{ background: '#EDEDF1' }}>
      <header className="sticky top-0 z-20 px-4 py-3 shadow-md"
        style={{ background: '#000', borderBottom: `2px solid ${SFK.gold}` }}>
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <img src={sfkLogo} alt="SFK" className="h-9 w-9 shrink-0" />

          <div className="flex-1 min-w-0">
            {editingName ? (
              <div className="flex items-center gap-2">
                <input autoFocus type="text" value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && saveName()} onBlur={saveName}
                  className="flex-1 bg-transparent border-b-2 focus:outline-none text-sm font-semibold min-w-0"
                  style={{ borderColor: SFK.gold, color: SFK.gold }} />
                <button onClick={saveName} style={{ color: SFK.gold }}><Check size={15} /></button>
              </div>
            ) : (
              <button onClick={startEditName} className="flex items-center gap-2 min-w-0">
                <span className="truncate" style={{
                  color: SFK.gold, fontFamily: "'Barlow Condensed', sans-serif",
                  fontStyle: 'italic', fontWeight: 800, fontSize: '1.1rem',
                }}>
                  {match.name.toUpperCase()}
                </span>
                <Edit2 size={12} style={{ color: `${SFK.gold}80` }} className="shrink-0" />
              </button>
            )}
          </div>

          <button onClick={handleReset}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border shrink-0 transition-all"
            style={confirmReset
              ? { background: '#FC273F', borderColor: '#FC273F', color: '#fff' }
              : { background: 'transparent', borderColor: `${SFK.gold}60`, color: `${SFK.gold}CC` }
            }>
            <RotateCcw size={13} />
            {confirmReset ? 'Bekräfta?' : 'Ny match'}
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-4 space-y-4 pb-10">
        <section>
          <PeriodTabs />
          <Pitch />
        </section>

        <section className="rounded-xl border p-4" style={{ background: '#fff', borderColor: '#DCDCDE' }}>
          <h2 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: SFK.purple }}>
            Trupp
          </h2>
          <Roster />
        </section>

        <section className="rounded-xl border p-4" style={{ background: '#F5F0EA', borderColor: '#DCDCDE' }}>
          <SubstitutionPlan />
        </section>
      </main>
    </div>
  );
}
