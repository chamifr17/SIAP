import { Car, CheckCircle2, HeartPulse, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { dateInputValue, groupByDate, peringkatBadgeClass } from '../../lib/recordDisplay';
import { EmptyState } from '../../ui/EmptyState';

type Tab = 'sick' | 'movement';

export function OutsideCadetsPage() {
  const [tab, setTab] = useState<Tab>('sick');
  const [selectedDate, setSelectedDate] = useState('');
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
  const sickDate = (item: typeof activeSick[number]) => item.checkInTime ?? item.createdAt;
  const movementDate = (item: typeof activeMovements[number]) => item.checkoutTime ?? item.createdAt;
  const filteredSick = selectedDate ? activeSick.filter((item) => dateInputValue(sickDate(item)) === selectedDate) : activeSick;
  const filteredMovements = selectedDate ? activeMovements.filter((item) => dateInputValue(movementDate(item)) === selectedDate) : activeMovements;
  const sickGroups = groupByDate(filteredSick, sickDate);
  const movementGroups = groupByDate(filteredMovements, movementDate);

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
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <input className="field" type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} />
          <button className="btn-secondary px-3" onClick={() => setSelectedDate('')} type="button">All</button>
        </div>
      </section>

      {tab === 'sick' && (
        <section className="space-y-3">
          {sick.isLoading && <p className="text-sm text-slate-500">Loading sick reports...</p>}
          {filteredSick.length === 0 && !sick.isLoading && <EmptyState icon={HeartPulse} title="No sick reports" body="Sick cadets will appear here after submitting the QR form." />}
          {sickGroups.map(([date, items]) => (
            <div className="space-y-3" key={date}>
              <p className="px-1 text-xs font-bold uppercase text-slate-500">{date}</p>
              {items.map((item) => (
                <article className="card space-y-3 overflow-visible" key={item.id}>
                  <div>
                    <h3 className="break-words font-semibold">{item.rank ?? 'CDT'} {item.cadetName}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                      <span>{item.bodyNumber ?? 'No body number'}</span>
                      <span className={`rounded-full border px-2 py-0.5 text-xs font-bold ${peringkatBadgeClass(item.peringkat)}`}>{item.peringkat ?? '-'}</span>
                    </div>
                  </div>
                  <div className="grid gap-1 rounded-lg bg-olive-50 p-3 text-sm dark:bg-slate-800">
                    <p><span className="font-semibold">Symptoms:</span> {item.symptoms}</p>
                    <p><span className="font-semibold">Description:</span> {item.description}</p>
                    <p><span className="font-semibold">Location:</span> {item.locationType}{item.room ? `, ${item.building}-${item.room}` : ''}</p>
                    <p><span className="font-semibold">Phone:</span> {item.phone ?? '-'}</p>
                    <p><span className="font-semibold">Check in:</span> {item.checkInTime ? new Date(item.checkInTime).toLocaleString() : '-'}</p>
                    <p><span className="font-semibold">DO:</span> {item.dutyOfficerName ?? '-'}</p>
                  </div>
                  <button className="btn-primary w-full" disabled={recover.isPending} onClick={() => recover.mutate(item.id)}>
                    <CheckCircle2 size={18} /> Verify Recovered
                  </button>
                </article>
              ))}
            </div>
          ))}
        </section>
      )}

      {tab === 'movement' && (
        <section className="space-y-3">
          {movements.isLoading && <p className="text-sm text-slate-500">Loading movement records...</p>}
          {filteredMovements.length === 0 && !movements.isLoading && <EmptyState icon={Car} title="No going-out records" body="Cadets going out will appear here after submitting the QR form." />}
          {movementGroups.map(([date, items]) => (
            <div className="space-y-3" key={date}>
              <p className="px-1 text-xs font-bold uppercase text-slate-500">{date}</p>
              {items.map((item) => (
                <article className="card space-y-3 overflow-visible" key={item.id}>
                  <div className="flex justify-between gap-3">
                    <div>
                      <h3 className="break-words font-semibold">{item.rank} {item.cadetName}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                        <span>{item.bodyNumber ?? 'No body number'}</span>
                        <span className={`rounded-full border px-2 py-0.5 text-xs font-bold ${peringkatBadgeClass(item.peringkat)}`}>{item.peringkat ?? '-'}</span>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800">{item.status}</span>
                  </div>
                  <div className="grid gap-1 rounded-lg bg-olive-50 p-3 text-sm dark:bg-slate-800">
                    <p><span className="font-semibold">Destination:</span> {item.destination}</p>
                    <p><span className="font-semibold">Purpose:</span> {item.purpose}</p>
                    <p><span className="font-semibold">Kenderaan:</span> {item.vehicle ?? '-'}</p>
                    <p><span className="font-semibold">Phone:</span> {item.phone ?? '-'}</p>
                    <p><span className="font-semibold">Expected return:</span> {item.expectedReturn ? new Date(item.expectedReturn).toLocaleString() : '-'}</p>
                    <p><span className="font-semibold">Check in:</span> {item.checkoutTime ? new Date(item.checkoutTime).toLocaleString() : '-'}</p>
                    <p><span className="font-semibold">DO:</span> {item.dutyOfficerName ?? '-'}</p>
                  </div>
                  <button className="btn-primary w-full" disabled={returnMovement.isPending} onClick={() => returnMovement.mutate(item.id)}>
                    <CheckCircle2 size={18} /> Verify Returned
                  </button>
                </article>
              ))}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
