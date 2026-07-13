import { HeartPulse, ShieldCheck, Timer } from 'lucide-react';
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
    <div className="space-y-4">
      <section className="card space-y-3">
        <div className="flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-lg bg-olive-700 text-white">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Person on duty</p>
            <h2 className="text-xl font-bold">{session?.officerName ?? 'Not selected'}</h2>
          </div>
        </div>
        <div className="grid gap-3 text-sm">
          <div className="rounded-lg bg-olive-50 p-3 dark:bg-slate-800">
            <p className="text-slate-500">Duty Duration</p>
            <strong>{dutyWindowLabel(session)}</strong>
          </div>
        </div>
      </section>
      <div className="grid grid-cols-2 gap-3">
        {cards.map((card) => (
          <Link className="card min-h-28 space-y-2" to={card.to} key={card.label}>
            <card.icon className="text-olive-700 dark:text-olive-100" />
            <p className="text-sm text-slate-500">{card.label}</p>
            <strong className="text-3xl">{card.value}</strong>
          </Link>
        ))}
      </div>
    </div>
  );
}
