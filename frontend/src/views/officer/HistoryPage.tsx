import { Car, CheckCircle2, HeartPulse } from 'lucide-react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { EmptyState } from '../../ui/EmptyState';

type Tab = 'sick' | 'movement';

export function HistoryPage() {
  const [tab, setTab] = useState<Tab>('sick');
  const movements = useQuery({ queryKey: ['movements'], queryFn: api.movements });
  const sick = useQuery({ queryKey: ['sickReports'], queryFn: api.sickReports });
  const returned = (movements.data ?? []).filter((item) => item.status === 'returned');
  const recovered = (sick.data ?? []).filter((item) => item.status === 'recovered');

  return (
    <div className="space-y-4">
      <section className="card space-y-3">
        <h2 className="text-xl font-bold">History</h2>
        <p className="text-sm text-slate-500">Completed checkout records.</p>
        <div className="grid grid-cols-2 gap-2 rounded-lg bg-olive-100 p-1 dark:bg-slate-800">
          <button className={`rounded-lg py-3 text-sm font-bold ${tab === 'sick' ? 'bg-white text-olive-900 shadow-sm dark:bg-slate-950 dark:text-white' : 'text-olive-700 dark:text-slate-300'}`} onClick={() => setTab('sick')}>
            Sick ({recovered.length})
          </button>
          <button className={`rounded-lg py-3 text-sm font-bold ${tab === 'movement' ? 'bg-white text-olive-900 shadow-sm dark:bg-slate-950 dark:text-white' : 'text-olive-700 dark:text-slate-300'}`} onClick={() => setTab('movement')}>
            Going Out ({returned.length})
          </button>
        </div>
      </section>

      {tab === 'sick' && (
        <section className="space-y-3">
          {recovered.length === 0 && <EmptyState icon={HeartPulse} title="No sick history" body="Recovered sick reports will appear here." />}
          {recovered.map((item) => (
            <article className="card space-y-2" key={item.id}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{item.bodyNumber ?? '-'} · {item.rank ?? '-'} {item.cadetName}</h3>
                  <p className="text-sm text-slate-500">{item.peringkat ?? '-'}</p>
                </div>
                <CheckCircle2 className="text-emerald-600" size={20} />
              </div>
              <div className="grid gap-1 text-sm text-slate-600 dark:text-slate-300">
                <p><span className="font-semibold">From:</span> {item.locationType}{item.room ? `, ${item.building}-${item.room}` : ''}</p>
                <p><span className="font-semibold">Check out:</span> {item.checkOutTime ? new Date(item.checkOutTime).toLocaleString() : '-'}</p>
              </div>
            </article>
          ))}
        </section>
      )}

      {tab === 'movement' && (
        <section className="space-y-3">
          {returned.length === 0 && <EmptyState icon={Car} title="No going-out history" body="Returned movement records will appear here." />}
          {returned.map((item) => (
            <article className="card space-y-2" key={item.id}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{item.bodyNumber ?? '-'} · {item.rank} {item.cadetName}</h3>
                  <p className="text-sm text-slate-500">{item.peringkat ?? '-'}</p>
                </div>
                <CheckCircle2 className="text-emerald-600" size={20} />
              </div>
              <div className="grid gap-1 text-sm text-slate-600 dark:text-slate-300">
                <p><span className="font-semibold">From:</span> {item.destination}</p>
                <p><span className="font-semibold">Check out:</span> {item.returnTime ? new Date(item.returnTime).toLocaleString() : '-'}</p>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
