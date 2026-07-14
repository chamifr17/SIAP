import { Archive, Car, HeartPulse, LogOut, X } from 'lucide-react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { clearDutySession } from '../../lib/dutySession';
import { EmptyState } from '../../ui/EmptyState';

type ArchiveTab = 'sick' | 'movement';

export function MorePage() {
  const navigate = useNavigate();
  const [archiveTab, setArchiveTab] = useState<ArchiveTab>('sick');
  const [archiveOpen, setArchiveOpen] = useState(false);
  const archivedMovements = useQuery({ queryKey: ['archivedMovements'], queryFn: api.archivedMovements });
  const archivedSick = useQuery({ queryKey: ['archivedSickReports'], queryFn: api.archivedSickReports });
  const movementItems = archivedMovements.data ?? [];
  const sickItems = archivedSick.data ?? [];
  const logout = () => {
    clearDutySession();
    navigate('/login', { replace: true });
  };

  return (
    <div className="space-y-4">
      <section className="card space-y-2">
        <h2 className="text-xl font-bold">Profile</h2>
        <p className="text-sm text-slate-500">Duty officer account and archived records.</p>
      </section>
      <button className="btn-secondary w-full justify-start" onClick={() => setArchiveOpen(true)}>
        <Archive size={19} /> Archived History
      </button>
      {archiveOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm">
          <section className="flex max-h-[78vh] w-full max-w-md flex-col rounded-xl bg-white shadow-xl dark:bg-slate-900">
            <div className="shrink-0 border-b border-olive-100 p-4 dark:border-slate-800">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold">Archived History</h3>
                  <p className="text-sm text-slate-500">Deleted records with reasons.</p>
                </div>
                <button className="rounded-lg p-2 text-slate-500 hover:bg-olive-100 dark:hover:bg-slate-800" onClick={() => setArchiveOpen(false)} type="button">
                  <X size={18} />
                </button>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg bg-olive-100 p-1 dark:bg-slate-800">
                <button className={`rounded-lg py-3 text-sm font-bold ${archiveTab === 'sick' ? 'bg-white text-olive-900 shadow-sm dark:bg-slate-950 dark:text-white' : 'text-olive-700 dark:text-slate-300'}`} onClick={() => setArchiveTab('sick')}>
                  Sick ({sickItems.length})
                </button>
                <button className={`rounded-lg py-3 text-sm font-bold ${archiveTab === 'movement' ? 'bg-white text-olive-900 shadow-sm dark:bg-slate-950 dark:text-white' : 'text-olive-700 dark:text-slate-300'}`} onClick={() => setArchiveTab('movement')}>
                  Going Out ({movementItems.length})
                </button>
              </div>
            </div>
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
              {archiveTab === 'sick' && (
                <>
                  {archivedSick.isLoading && <p className="text-sm text-slate-500">Loading archived sick records...</p>}
                  {sickItems.length === 0 && !archivedSick.isLoading && <EmptyState icon={HeartPulse} title="No archived sick records" body="Deleted sick histories will appear here." />}
                  {sickItems.map((item) => (
                    <article className="rounded-lg border border-olive-100 bg-olive-50 p-3 dark:border-slate-800 dark:bg-slate-800" key={item.id}>
                      <h4 className="font-semibold">{item.bodyNumber ?? '-'} - {item.rank ?? '-'} {item.cadetName}</h4>
                      <div className="mt-2 grid gap-1 text-sm text-slate-600 dark:text-slate-300">
                        <p><span className="font-semibold">Peringkat:</span> {item.peringkat ?? '-'}</p>
                        <p><span className="font-semibold">From:</span> {item.locationType}{item.room ? `, ${item.building}-${item.room}` : ''}</p>
                        <p><span className="font-semibold">Deleted:</span> {item.deletedAt ? new Date(item.deletedAt).toLocaleString() : '-'}</p>
                        <p><span className="font-semibold">Deleted by:</span> {item.deletedBy ?? '-'}</p>
                        <p><span className="font-semibold">Reason:</span> {item.deleteReason ?? '-'}</p>
                      </div>
                    </article>
                  ))}
                </>
              )}
              {archiveTab === 'movement' && (
                <>
                  {archivedMovements.isLoading && <p className="text-sm text-slate-500">Loading archived movement records...</p>}
                  {movementItems.length === 0 && !archivedMovements.isLoading && <EmptyState icon={Car} title="No archived going-out records" body="Deleted going-out histories will appear here." />}
                  {movementItems.map((item) => (
                    <article className="rounded-lg border border-olive-100 bg-olive-50 p-3 dark:border-slate-800 dark:bg-slate-800" key={item.id}>
                      <h4 className="font-semibold">{item.bodyNumber ?? '-'} - {item.rank} {item.cadetName}</h4>
                      <div className="mt-2 grid gap-1 text-sm text-slate-600 dark:text-slate-300">
                        <p><span className="font-semibold">Peringkat:</span> {item.peringkat ?? '-'}</p>
                        <p><span className="font-semibold">Destination:</span> {item.destination}</p>
                        <p><span className="font-semibold">Deleted:</span> {item.deletedAt ? new Date(item.deletedAt).toLocaleString() : '-'}</p>
                        <p><span className="font-semibold">Deleted by:</span> {item.deletedBy ?? '-'}</p>
                        <p><span className="font-semibold">Reason:</span> {item.deleteReason ?? '-'}</p>
                      </div>
                    </article>
                  ))}
                </>
              )}
            </div>
          </section>
        </div>
      )}
      <button className="btn-danger w-full justify-start" onClick={logout}><LogOut size={19} /> Logout</button>
    </div>
  );
}
