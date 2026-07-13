import { Archive, Car, HeartPulse, LogOut, Settings, SlidersHorizontal, UserRound } from 'lucide-react';
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
        <h2 className="text-xl font-bold">More</h2>
        <p className="text-sm text-slate-500">Account, settings, and utility tools.</p>
      </section>
      <button className="btn-secondary w-full justify-start"><UserRound size={19} /> Personalize Account</button>
      <button className="btn-secondary w-full justify-start"><Settings size={19} /> Settings</button>
      <button className="btn-secondary w-full justify-start"><SlidersHorizontal size={19} /> Utilities</button>
      <section className="card space-y-3">
        <div className="flex items-center gap-3">
          <Archive className="text-olive-700 dark:text-olive-100" size={22} />
          <div>
            <h3 className="font-bold">Archived History</h3>
            <p className="text-sm text-slate-500">Deleted history records with reasons.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 rounded-lg bg-olive-100 p-1 dark:bg-slate-800">
          <button className={`rounded-lg py-3 text-sm font-bold ${archiveTab === 'sick' ? 'bg-white text-olive-900 shadow-sm dark:bg-slate-950 dark:text-white' : 'text-olive-700 dark:text-slate-300'}`} onClick={() => setArchiveTab('sick')}>
            Sick ({sickItems.length})
          </button>
          <button className={`rounded-lg py-3 text-sm font-bold ${archiveTab === 'movement' ? 'bg-white text-olive-900 shadow-sm dark:bg-slate-950 dark:text-white' : 'text-olive-700 dark:text-slate-300'}`} onClick={() => setArchiveTab('movement')}>
            Going Out ({movementItems.length})
          </button>
        </div>
      </section>
      {archiveTab === 'sick' && (
        <section className="space-y-3">
          {archivedSick.isLoading && <p className="text-sm text-slate-500">Loading archived sick records...</p>}
          {sickItems.length === 0 && !archivedSick.isLoading && <EmptyState icon={HeartPulse} title="No archived sick records" body="Deleted sick histories will appear here." />}
          {sickItems.map((item) => (
            <article className="card space-y-2" key={item.id}>
              <h4 className="font-semibold">{item.bodyNumber ?? '-'} - {item.rank ?? '-'} {item.cadetName}</h4>
              <div className="grid gap-1 text-sm text-slate-600 dark:text-slate-300">
                <p><span className="font-semibold">Peringkat:</span> {item.peringkat ?? '-'}</p>
                <p><span className="font-semibold">From:</span> {item.locationType}{item.room ? `, ${item.building}-${item.room}` : ''}</p>
                <p><span className="font-semibold">Deleted:</span> {item.deletedAt ? new Date(item.deletedAt).toLocaleString() : '-'}</p>
                <p><span className="font-semibold">Deleted by:</span> {item.deletedBy ?? '-'}</p>
                <p><span className="font-semibold">Reason:</span> {item.deleteReason ?? '-'}</p>
              </div>
            </article>
          ))}
        </section>
      )}
      {archiveTab === 'movement' && (
        <section className="space-y-3">
          {archivedMovements.isLoading && <p className="text-sm text-slate-500">Loading archived movement records...</p>}
          {movementItems.length === 0 && !archivedMovements.isLoading && <EmptyState icon={Car} title="No archived going-out records" body="Deleted going-out histories will appear here." />}
          {movementItems.map((item) => (
            <article className="card space-y-2" key={item.id}>
              <h4 className="font-semibold">{item.bodyNumber ?? '-'} - {item.rank} {item.cadetName}</h4>
              <div className="grid gap-1 text-sm text-slate-600 dark:text-slate-300">
                <p><span className="font-semibold">Peringkat:</span> {item.peringkat ?? '-'}</p>
                <p><span className="font-semibold">Destination:</span> {item.destination}</p>
                <p><span className="font-semibold">Deleted:</span> {item.deletedAt ? new Date(item.deletedAt).toLocaleString() : '-'}</p>
                <p><span className="font-semibold">Deleted by:</span> {item.deletedBy ?? '-'}</p>
                <p><span className="font-semibold">Reason:</span> {item.deleteReason ?? '-'}</p>
              </div>
            </article>
          ))}
        </section>
      )}
      <button className="btn-danger w-full justify-start" onClick={logout}><LogOut size={19} /> Logout</button>
    </div>
  );
}
