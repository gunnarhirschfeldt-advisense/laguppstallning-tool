import { Plus, X } from 'lucide-react';
import { useMatchStore } from '../store/matchStore';

const SFK = { purple: '#3C1053', gold: '#C1AA7C', goldL: '#F5EDDC' };

export function PeriodTabs() {
  const { match, activePeriodIdx, setActivePeriod, addPeriod, removePeriod } = useMatchStore();
  const { periods } = match;

  return (
    <div className="flex items-center gap-1.5 mb-2">
      {periods.map((_, i) => {
        const active = i === activePeriodIdx;
        return (
          <div key={i} className="flex items-center">
            <button
              onClick={() => setActivePeriod(i)}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold transition-all"
              style={
                active
                  ? { background: SFK.purple, color: '#fff' }
                  : { background: 'rgba(255,255,255,0.5)', color: SFK.purple, border: `1px solid ${SFK.gold}60` }
              }
            >
              Period {i + 1}
            </button>
            {periods.length > 1 && active && (
              <button
                onClick={() => removePeriod(i)}
                className="ml-1 opacity-50 hover:opacity-100 transition-opacity"
                style={{ color: SFK.purple }}
                aria-label={`Ta bort period ${i + 1}`}
              >
                <X size={13} />
              </button>
            )}
          </div>
        );
      })}

      {periods.length < 3 && (
        <button
          onClick={addPeriod}
          className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all"
          style={{ background: SFK.goldL, color: SFK.purple, border: `1px solid ${SFK.gold}80` }}
          title="Kopiera uppställning till ny period"
        >
          <Plus size={12} />
          Period
        </button>
      )}
    </div>
  );
}
