import { Archive, Car, CheckCircle2, HeartPulse, X } from 'lucide-react';
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { getDutySession } from '../../lib/dutySession';
import { EmptyState } from '../../ui/EmptyState';

type Tab = 'sick' | 'movement';
type ArchiveTarget = { type: Tab; id: string; label: string } | null;

export function HistoryPage() {
  const [tab, setTab] = useState<Tab>('sick');
  const [archiveTarget, setArchiveTarget] = useState<ArchiveTarget>(null);
  const [reason, setReason] = useState('');
  const movements = useQuery({ queryKey: ['movements'], queryFn: api.movements });
  const sick = useQuery({ queryKey: ['sickReports'], queryFn: api.sickReports });
  const returned = (movements.data ?? []).filter((item) => item.status === 'returned');
  const recovered = (sick.data ?? []).filter((item) => item.status === 'recovered');
  const refresh = () => {
    void movements.refetch();
    void sick.refetch();
  };
  const archiveMovement = useMutation({ mutationFn: api.archiveMovement, onSuccess: refresh });
  const archiveSick = useMutation({ mutationFn: api.archiveSickReport, onSuccess: refresh });
  const isArchiving = archiveMovement.isPending || archiveSick.isPending;
  const canArchive = reason.trim().length >= 5 && archiveTarget;

  const openArchive = (target: ArchiveTarget) => {
    setArchiveTarget(target);
    setReason('');
  };

  const closeArchive = () => {
    setArchiveTarget(null);
    setReason('');
  };

  const submitArchive = () => {
    if (!archiveTarget || reason.trim().length < 5) return;
    const payload = { id: archiveTarget.id, reason: reason.trim(), deletedBy: getDutySession()?.officerName };
    const options = { onSuccess: closeArchive };
    if (archiveTarget.type === 'sick') {
      archiveSick.mutate(payload, options);
    } else {
      archiveMovement.mutate(payload, options);
    }
  };

  return (
    <div className="space-y-4">
      {archiveTarget && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4">
          <section className="w-full max-w-md rounded-lg bg-white p-4 shadow-xl dark:bg-slate-900">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold">Archive History</h3>
                <p className="text-sm text-slate-500">{archiveTarget.label}</p>
              </div>
              <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={closeArchive} type="button">
                <X size={18} />
              </button>
            </div>
            <label className="mt-4 block space-y-2">
              <span className="label">Reason for deletion</span>
              <textarea className="field min-h-28" value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Example: Duplicate record entered by mistake" />
            </label>
            <p className="mt-2 text-xs text-slate-500">This record will move to Archive in More. It will not be permanently deleted.</p>
            {(archiveMovement.isError || archiveSick.isError) && <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">Unable to archive this record. Please try again.</p>}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button className="btn-secondary w-full" onClick={closeArchive} type="button">Cancel</button>
              <button className="btn-danger w-full" disabled={!canArchive || isArchiving} onClick={submitArchive} type="button">
                {isArchiving ? 'Archiving...' : 'Archive'}
              </button>
            </div>
          </section>
        </div>
      )}
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
                  <h3 className="font-semibold">{item.bodyNumber ?? '-'} - {item.rank ?? '-'} {item.cadetName}</h3>
                  <p className="text-sm text-slate-500">{item.peringkat ?? '-'}</p>
                </div>
                <CheckCircle2 className="text-emerald-600" size={20} />
              </div>
              <div className="grid gap-1 text-sm text-slate-600 dark:text-slate-300">
                <p><span className="font-semibold">From:</span> {item.locationType}{item.room ? `, ${item.building}-${item.room}` : ''}</p>
                <p><span className="font-semibold">Check out:</span> {item.checkOutTime ? new Date(item.checkOutTime).toLocaleString() : '-'}</p>
                <p><span className="font-semibold">DO:</span> {item.dutyOfficerName ?? '-'}</p>
              </div>
              <button className="btn-danger w-full" onClick={() => openArchive({ type: 'sick', id: item.id, label: `${item.bodyNumber ?? '-'} - ${item.rank ?? '-'} ${item.cadetName}` })} type="button">
                <Archive size={18} /> Delete History
              </button>
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
                  <h3 className="font-semibold">{item.bodyNumber ?? '-'} - {item.rank} {item.cadetName}</h3>
                  <p className="text-sm text-slate-500">{item.peringkat ?? '-'}</p>
                </div>
                <CheckCircle2 className="text-emerald-600" size={20} />
              </div>
              <div className="grid gap-1 text-sm text-slate-600 dark:text-slate-300">
                <p><span className="font-semibold">From:</span> {item.destination}</p>
                <p><span className="font-semibold">Check out:</span> {item.returnTime ? new Date(item.returnTime).toLocaleString() : '-'}</p>
                <p><span className="font-semibold">DO:</span> {item.dutyOfficerName ?? '-'}</p>
              </div>
              <button className="btn-danger w-full" onClick={() => openArchive({ type: 'movement', id: item.id, label: `${item.bodyNumber ?? '-'} - ${item.rank} ${item.cadetName}` })} type="button">
                <Archive size={18} /> Delete History
              </button>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
