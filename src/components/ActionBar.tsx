import { Users, ArrowLeftRight, Pencil } from 'lucide-react';

export type AppTab = 'plan' | 'trupp' | 'byten';

type Props = {
  active: AppTab;
  onChange: (tab: AppTab) => void;
};

const TABS: { id: AppTab; label: string; Icon: typeof Users }[] = [
  { id: 'plan',  label: 'Plan',  Icon: ArrowLeftRight },
  { id: 'trupp', label: 'Trupp', Icon: Users },
  { id: 'byten', label: 'Byten', Icon: Pencil },
];

export function ActionBar({ active, onChange }: Props) {
  return (
    <nav className="sticky bottom-0 z-20 flex"
      style={{
        background: '#000',
        borderTop: '1px solid rgba(193,170,124,0.3)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
      {TABS.map(({ id, label, Icon }) => {
        const isActive = active === id;
        return (
          <button key={id} onClick={() => onChange(id)}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 transition-all"
            style={{ color: isActive ? '#C1AA7C' : 'rgba(237,237,241,0.35)' }}>
            <Icon size={18} strokeWidth={isActive ? 2.5 : 1.5} />
            <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 400, letterSpacing: '0.05em' }}>
              {label.toUpperCase()}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
