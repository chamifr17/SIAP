import { HeartPulse, Timer } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { dutyWindowLabel, getDutySession } from '../../lib/dutySession';

export function OfficerHome() {
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
      <section className="card space-y-3 p-3">
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
      </section>
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
