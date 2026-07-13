import { CheckCircle2, History } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { EmptyState } from '../../ui/EmptyState';

export function HistoryPage() {
  const movements = useQuery({ queryKey: ['movements'], queryFn: api.movements });
  const sick = useQuery({ queryKey: ['sickReports'], queryFn: api.sickReports });
  const returned = (movements.data ?? []).filter((item) => item.status === 'returned');
  const recovered = (sick.data ?? []).filter((item) => item.status === 'recovered');
  const hasHistory = returned.length > 0 || recovered.length > 0;

  if (!hasHistory) {
    return <EmptyState icon={History} title="No checkout history" body="Records will appear here after cadets have checked out." />;
  }

  return (
    <div className="space-y-4">
      <section className="card space-y-1">
        <h2 className="text-xl font-bold">History</h2>
        <p className="text-sm text-slate-500">Only completed checkout records are shown here.</p>
      </section>
      {returned.map((item) => (
        <article className="card space-y-2" key={item.id}>
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold">{item.cadetName}</h3>
            <CheckCircle2 className="text-emerald-600" size={20} />
          </div>
          <p className="text-sm text-slate-500">Returned from {item.destination}</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
            <span>Out: {item.checkoutTime ?? '-'}</span>
            <span>Back: {item.returnTime ?? '-'}</span>
          </div>
        </article>
      ))}
      {recovered.map((item) => (
        <article className="card space-y-2" key={item.id}>
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold">{item.cadetName}</h3>
            <CheckCircle2 className="text-emerald-600" size={20} />
          </div>
          <p className="text-sm text-slate-500">Recovered from sick report: {item.symptoms}</p>
          <div className="text-xs text-slate-500">Checked out: {item.checkOutTime ?? '-'}</div>
        </article>
      ))}
    </div>
  );
}

