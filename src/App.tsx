import { useState } from 'react';
import { Edit2, Check, Plus, X } from 'lucide-react';
import sfkLogo from './assets/sfk-logo.svg';
import { useMatchStore } from './store/matchStore';
import { PitchSVG } from './components/PitchSVG';
import { Bench } from './components/Bench';
import { Roster } from './components/Roster';
import { SubstitutionPlan } from './components/SubstitutionPlan';
import { ActionBar, type AppTab } from './components/ActionBar';
import type { Position } from './types/domain';
import './index.css';

const GOLD = '#C1AA7C';

function deriveFormation(positions: Record<Position, string | null>): string {
  const def = (['VB', 'HB'] as Position[]).filter(p => positions[p]).length;
  const mid = (['VM', 'CM', 'HM'] as Position[]).filter(p => positions[p]).length;
  const fw  = (['FW'] as Position[]).filter(p => positions[p]).length;
  const parts = [def, mid, fw].filter(n => n > 0);
  return parts.length ? parts.join('-') : '–';
}

export default function App() {
  const {
    match, activePeriodIdx, selectedPlayerId,
    setMatchName, addPeriod, removePeriod, setActivePeriod, resetMatch,
  } = useMatchStore();

  const [activeTab, setActiveTab] = useState<AppTab>('plan');
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);

  const activePeriod = match.periods[activePeriodIdx];
  const formation = deriveFormation(activePeriod.positions);

  function startEditName() { setNameInput(match.name); setEditingName(true); }
  function saveName() {
    const t = nameInput.trim();
    if (t) setMatchName(t);
    setEditingName(false);
  }

  return (
    <div className="flex flex-col min-h-svh" style={{ background: '#0a0a0f', color: '#EDEDF1' }}>

      {/* ── Topbar ── */}
      <header className="sticky top-0 z-20 flex items-stretch"
        style={{
          background: '#000',
          borderBottom: `1.5px solid rgba(193,170,124,0.35)`,
          minHeight: 52,
        }}>

        {/* Left: logo + match name */}
        <div className="flex items-center gap-2.5 px-3 flex-1 min-w-0">
          <img src={sfkLogo} alt="SFK" className="h-7 w-7 shrink-0" />
          {editingName ? (
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <input autoFocus type="text" value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && saveName()}
                onBlur={saveName}
                className="flex-1 bg-transparent border-b focus:outline-none text-sm font-semibold min-w-0"
                style={{ borderColor: GOLD, color: GOLD }} />
              <button onClick={saveName} style={{ color: GOLD }}><Check size={13} /></button>
            </div>
          ) : (
            <button onClick={startEditName} className="flex items-center gap-1.5 min-w-0">
              <span className="truncate" style={{
                color: GOLD,
                fontFamily: "'Barlow Condensed', sans-serif",
                fontStyle: 'italic', fontWeight: 800, fontSize: '1rem',
              }}>
                {match.name.toUpperCase()}
              </span>
              <Edit2 size={11} style={{ color: `${GOLD}70` }} className="shrink-0" />
            </button>
          )}
        </div>

        {/* Center: period tabs */}
        <div className="flex items-center gap-1 px-1">
          {match.periods.map((_, i) => (
            <button key={i}
              onClick={() => { setActivePeriod(i); setActiveTab('plan'); }}
              className="flex items-center justify-center rounded-md text-xs font-bold transition-all"
              style={{
                width: 28, height: 28,
                background: i === activePeriodIdx ? GOLD : 'transparent',
                color: i === activePeriodIdx ? '#000' : 'rgba(193,170,124,0.55)',
                border: i === activePeriodIdx ? 'none' : '1px solid rgba(193,170,124,0.2)',
              }}>
              {i + 1}
            </button>
          ))}
          {match.periods.length < 3 && (
            <button onClick={addPeriod}
              className="flex items-center justify-center rounded-md transition-all"
              style={{
                width: 28, height: 28,
                color: 'rgba(193,170,124,0.4)',
                border: '1px dashed rgba(193,170,124,0.2)',
              }}>
              <Plus size={13} />
            </button>
          )}
          {match.periods.length > 1 && (
            <button onClick={() => removePeriod(activePeriodIdx)}
              className="flex items-center justify-center rounded-md transition-all"
              style={{
                width: 22, height: 22,
                color: 'rgba(237,237,241,0.25)',
              }}>
              <X size={11} />
            </button>
          )}
        </div>

        {/* Right: formation + reset */}
        <div className="flex items-center gap-2 px-3">
          <span className="rounded-full px-2.5 py-0.5 text-xs font-bold"
            style={{
              background: 'rgba(92,6,140,0.4)',
              border: '1px solid rgba(154,32,244,0.4)',
              color: '#D4AAFF',
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '0.04em',
            }}>
            {formation}
          </span>
          <button onClick={() => {
            if (confirmReset) { resetMatch(); setConfirmReset(false); }
            else { setConfirmReset(true); setTimeout(() => setConfirmReset(false), 3000); }
          }}
            className="text-xs px-2 py-1 rounded"
            style={confirmReset
              ? { background: '#FC273F', color: '#fff' }
              : { color: 'rgba(237,237,241,0.3)', border: '1px solid rgba(237,237,241,0.1)' }
            }>
            {confirmReset ? '✓?' : 'Ny'}
          </button>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto">

        {activeTab === 'plan' && (
          <>
            {/* Helper hint */}
            {selectedPlayerId && (
              <div className="mx-3 mt-2 px-3 py-1.5 rounded-lg text-xs text-center"
                style={{ background: 'rgba(193,170,124,0.12)', color: GOLD, border: '1px solid rgba(193,170,124,0.25)' }}>
                Tryck på en position för att placera spelaren
              </div>
            )}
            <PitchSVG />
            <Bench />
          </>
        )}

        {activeTab === 'trupp' && (
          <div className="p-4">
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'rgba(193,170,124,0.6)' }}>
              Trupp
            </h2>
            <Roster />
          </div>
        )}

        {activeTab === 'byten' && (
          <div className="p-4">
            <SubstitutionPlan />
          </div>
        )}
      </main>

      {/* ── Bottom action bar ── */}
      <ActionBar active={activeTab} onChange={setActiveTab} />
    </div>
  );
}
