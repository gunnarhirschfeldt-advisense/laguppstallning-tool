import { Check } from 'lucide-react';
import { squad } from '../data/squad';
import { useSquadStore } from '../store/squadStore';

const OUTFIELD_JERSEY = `${import.meta.env.BASE_URL}images/outfield-jersey-transparent-240.webp`;

export function SquadPage() {
  const calledPlayers = useSquadStore(s => s.calledPlayers);
  const toggleCalled = useSquadStore(s => s.toggleCalled);

  const called = squad.filter(p => calledPlayers.includes(p.id));
  const notCalled = squad.filter(p => !calledPlayers.includes(p.id));

  return (
    <div className="pb-4">
      {/* Called section */}
      <div className="px-4 py-2 text-[11px] font-medium uppercase tracking-widest"
        style={{ color: 'rgba(237,237,241,0.4)' }}>
        Kallad · {called.length} spelare
      </div>

      {called.length === 0 && (
        <p className="px-4 py-2 text-sm italic" style={{ color: 'rgba(237,237,241,0.25)' }}>
          Inga kallade spelare ännu
        </p>
      )}

      {called.map(player => (
        <PlayerRow
          key={player.id}
          name={player.name}
          number={player.number}
          called={true}
          onToggle={() => toggleCalled(player.id)}
        />
      ))}

      {/* Divider */}
      <div className="my-2" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }} />

      {/* Not called section */}
      <div className="px-4 py-2 text-[11px] font-medium uppercase tracking-widest"
        style={{ color: 'rgba(237,237,241,0.4)' }}>
        Ej kallad · {notCalled.length} spelare
      </div>

      {notCalled.map(player => (
        <PlayerRow
          key={player.id}
          name={player.name}
          number={player.number}
          called={false}
          onToggle={() => toggleCalled(player.id)}
        />
      ))}
    </div>
  );
}

type PlayerRowProps = {
  name: string;
  number: number | null;
  called: boolean;
  onToggle: () => void;
};

function PlayerRow({ name, number, called, onToggle }: PlayerRowProps) {
  return (
    <button
      onClick={onToggle}
      className="flex w-full items-center gap-2 px-4 py-3 active:bg-white/5 transition-colors"
    >
      <img
        src={OUTFIELD_JERSEY}
        alt=""
        className="h-12 w-10 shrink-0 object-contain"
        style={{ opacity: called ? 1 : 0.4 }}
      />
      <span className="text-sm font-medium w-6 shrink-0 text-left"
        style={{ color: called ? 'rgba(237,237,241,0.7)' : 'rgba(237,237,241,0.3)' }}>
        {number ?? '—'}
      </span>
      <span className="flex-1 text-left text-[15px]"
        style={{ color: called ? '#EDEDF1' : 'rgba(237,237,241,0.45)' }}>
        {name}
      </span>
      <div
        className="h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
        style={called
          ? { borderColor: '#7EE89E', background: '#7EE89E' }
          : { borderColor: 'rgba(255,255,255,0.25)', background: 'transparent' }
        }>
        {called && <Check size={13} strokeWidth={3} color="#0a2a12" />}
      </div>
    </button>
  );
}
