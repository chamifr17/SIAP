import { ArrowRight, HeartPulse, Timer } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { dutyWindowLabel, getDutySession } from '../../lib/dutySession';

export function OfficerHome() {
  const [flipped, setFlipped] = useState(false);
  const movements = useQuery({ queryKey: ['movements'], queryFn: api.movements });
  const sick = useQuery({ queryKey: ['sickReports'], queryFn: api.sickReports });
  const session = getDutySession();
  const items = movements.data ?? [];
  const sickItems = sick.data ?? [];
  const activeOutside = items.filter((x) => x.status === 'approved' || x.status === 'overdue').length;
  const activeSick = sickItems.filter((x) => x.status === 'active').length;
  const cards = [
    { label: 'Outside', value: activeOutside, icon: Timer, to: '/officer/outside' },
    { label: 'Sick', value: activeSick, icon: HeartPulse, to: '/officer/outside' }
  ];

  return (
    <div className="space-y-3">
      <button
        className="block w-full text-left [perspective:1000px]"
        onClick={() => setFlipped((value) => !value)}
        type="button"
        aria-label={flipped ? 'Show duty officer details' : 'Show duty analytics'}
      >
        <section className={`relative min-h-[220px] transition-transform duration-500 [transform-style:preserve-3d] ${flipped ? '[transform:rotateY(180deg)]' : ''}`}>
          <div className="card absolute inset-0 space-y-3 p-3 [backface-visibility:hidden]">
            <div className="rounded-lg border border-olive-100 bg-olive-50 p-3 dark:border-slate-800 dark:bg-slate-800">
              <p className="text-xs font-bold uppercase text-olive-700 dark:text-olive-100">Person on duty</p>
              <h2 className="mt-1 text-lg font-bold leading-tight">{session?.officerName ?? 'Not selected'}</h2>
            </div>
            <div className="grid gap-2 text-sm">
              <div className="rounded-lg bg-white p-2.5 dark:bg-slate-900">
                <p className="text-slate-500">Duty Duration</p>
                <strong>{dutyWindowLabel(session)}</strong>
              </div>
            </div>
            <ArrowRight className="absolute bottom-3 right-3 text-slate-400 dark:text-slate-500" size={18} />
          </div>
          <div className="card absolute inset-0 p-3 [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <ArrowRight className="absolute bottom-3 right-3 rotate-180 text-slate-400 dark:text-slate-500" size={18} />
          </div>
        </section>
      </button>
      <div className="grid grid-cols-2 gap-3">
        {cards.map((card) => (
          <Link className="card min-h-24 space-y-1.5 p-3" to={card.to} key={card.label}>
            <card.icon className="text-olive-700 dark:text-olive-100" />
            <p className="text-sm text-slate-500">{card.label}</p>
            <strong className="text-3xl">{card.value}</strong>
          </Link>
        ))}
      </div>
    </div>
  );
}
