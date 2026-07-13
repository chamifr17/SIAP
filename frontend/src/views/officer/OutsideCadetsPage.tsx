import { Car, CheckCircle2, HeartPulse, Phone, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { EmptyState } from '../../ui/EmptyState';

type Tab = 'sick' | 'movement';

export function OutsideCadetsPage() {
  const [tab, setTab] = useState<Tab>('sick');
  const movements = useQuery({ queryKey: ['movements'], queryFn: api.movements, refetchInterval: 10_000 });
  const sick = useQuery({ queryKey: ['sickReports'], queryFn: api.sickReports, refetchInterval: 10_000 });
  const refresh = () => {
    void movements.refetch();
    void sick.refetch();
  };
  const recover = useMutation({ mutationFn: api.markSickRecovered, onSuccess: refresh });
  const returnMovement = useMutation({ mutationFn: api.markMovementReturned, onSuccess: refresh });
  const activeSick = (sick.data ?? []).filter((item) => item.status === 'active');
  const activeMovements = (movements.data ?? []).filter((item) => item.status === 'approved' || item.status === 'pending' || item.status === 'overdue');

  return (
    <div className="space-y-4">
      <section className="card space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Cadets</h2>
            <p className="text-sm text-slate-500">Live records from QR submissions.</p>
          </div>
          <button className="btn-secondary size-11 p-0" onClick={refresh} aria-label="Refresh">
            <RefreshCw size={18} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2 rounded-lg bg-olive-100 p-1 dark:bg-slate-800">
          <button className={`rounded-lg py-3 text-sm font-bold ${tab === 'sick' ? 'bg-white text-olive-900 shadow-sm dark:bg-slate-950 dark:text-white' : 'text-olive-700 dark:text-slate-300'}`} onClick={() => setTab('sick')}>
            Sick ({activeSick.length})
          </button>
          <button className={`rounded-lg py-3 text-sm font-bold ${tab === 'movement' ? 'bg-white text-olive-900 shadow-sm dark:bg-slate-950 dark:text-white' : 'text-olive-700 dark:text-slate-300'}`} onClick={() => setTab('movement')}>
            Going Out ({activeMovements.length})
          </button>
        </div>
      </section>

      {tab === 'sick' && (
        <section className="space-y-3">
          {sick.isLoading && <p className="text-sm text-slate-500">Loading sick reports...</p>}
          {activeSick.length === 0 && !sick.isLoading && <EmptyState icon={HeartPulse} title="No sick reports" body="Sick cadets will appear here after submitting the QR form." />}
          {activeSick.map((item) => (
            <article className="card space-y-3" key={item.id}>
              <div>
                <h3 className="font-semibold">{item.rank ?? 'CDT'} {item.cadetName}</h3>
                <p className="text-sm text-slate-500">{item.bodyNumber ?? 'No body number'}</p>
              </div>
              <div className="grid gap-1 rounded-lg bg-olive-50 p-3 text-sm dark:bg-slate-800">
                <p><span className="font-semibold">Symptoms:</span> {item.symptoms}</p>
                <p><span className="font-semibold">Description:</span> {item.description}</p>
                <p><span className="font-semibold">Location:</span> {item.locationType}{item.room ? `, ${item.building}-${item.room}` : ''}</p>
                <p><span className="font-semibold">Check in:</span> {item.checkInTime ? new Date(item.checkInTime).toLocaleString() : '-'}</p>
              </div>
              {item.phone && <a className="btn-secondary w-full justify-start" href={`tel:${item.phone}`}><Phone size={18} /> {item.phone}</a>}
              <button className="btn-primary w-full" disabled={recover.isPending} onClick={() => recover.mutate(item.id)}>
                <CheckCircle2 size={18} /> Verify Recovered
              </button>
            </article>
          ))}
        </section>
      )}

      {tab === 'movement' && (
        <section className="space-y-3">
          {movements.isLoading && <p className="text-sm text-slate-500">Loading movement records...</p>}
          {activeMovements.length === 0 && !movements.isLoading && <EmptyState icon={Car} title="No going-out records" body="Cadets going out will appear here after submitting the QR form." />}
          {activeMovements.map((item) => (
            <article className="card space-y-3" key={item.id}>
              <div className="flex justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{item.rank} {item.cadetName}</h3>
                  <p className="text-sm text-slate-500">{item.bodyNumber ?? 'No body number'}</p>
                </div>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800">{item.status}</span>
              </div>
              <div className="grid gap-1 rounded-lg bg-olive-50 p-3 text-sm dark:bg-slate-800">
                <p><span className="font-semibold">Destination:</span> {item.destination}</p>
                <p><span className="font-semibold">Purpose:</span> {item.purpose}</p>
                <p><span className="font-semibold">Kenderaan:</span> {item.vehicle ?? '-'}</p>
                <p><span className="font-semibold">Expected return:</span> {item.expectedReturn ? new Date(item.expectedReturn).toLocaleString() : '-'}</p>
                <p><span className="font-semibold">Check in:</span> {item.checkoutTime ? new Date(item.checkoutTime).toLocaleString() : '-'}</p>
              </div>
              {item.phone && <a className="btn-secondary w-full justify-start" href={`tel:${item.phone}`}><Phone size={18} /> {item.phone}</a>}
              <button className="btn-primary w-full" disabled={returnMovement.isPending} onClick={() => returnMovement.mutate(item.id)}>
                <CheckCircle2 size={18} /> Verify Returned
              </button>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
