import { Car, CheckCircle2, HeartPulse, Trash2 } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { EmptyState } from '../../ui/EmptyState';

type Tab = 'sick' | 'movement';
const SWIPE_ACTION_WIDTH = 96;

type SwipeHistoryCardProps = {
  children: ReactNode;
  onArchive: () => void;
};

function SwipeHistoryCard({ children, onArchive }: SwipeHistoryCardProps) {
  const [startX, setStartX] = useState<number | null>(null);
  const [offset, setOffset] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const beginSwipe = (clientX: number) => {
    setStartX(clientX);
  };

  const moveSwipe = (clientX: number) => {
    if (startX === null) return;
    const nextOffset = Math.min(0, Math.max(-SWIPE_ACTION_WIDTH, clientX - startX + (isOpen ? -SWIPE_ACTION_WIDTH : 0)));
    setOffset(nextOffset);
  };

  const endSwipe = () => {
    if (startX === null) return;
    const shouldOpen = offset < -SWIPE_ACTION_WIDTH / 2;
    setIsOpen(shouldOpen);
    setOffset(shouldOpen ? -SWIPE_ACTION_WIDTH : 0);
    setStartX(null);
  };

  return (
    <div className="relative overflow-hidden rounded-lg">
      <button
        className="absolute inset-y-0 right-0 flex w-24 flex-col items-center justify-center gap-1 bg-red-600 text-xs font-bold text-white"
        onClick={onArchive}
        type="button"
      >
        <Trash2 size={20} />
        Delete
      </button>
      <article
        className="card relative space-y-2 touch-pan-y transition-transform"
        onMouseDown={(event) => beginSwipe(event.clientX)}
        onMouseMove={(event) => moveSwipe(event.clientX)}
        onMouseLeave={endSwipe}
        onMouseUp={endSwipe}
        onTouchStart={(event) => beginSwipe(event.touches[0].clientX)}
        onTouchMove={(event) => moveSwipe(event.touches[0].clientX)}
        onTouchEnd={endSwipe}
        style={{ transform: `translateX(${offset}px)` }}
      >
        {children}
      </article>
    </div>
  );
}

export function HistoryPage() {
  const [tab, setTab] = useState<Tab>('sick');
  const [successMessage, setSuccessMessage] = useState('');
  const movements = useQuery({ queryKey: ['movements'], queryFn: api.movements });
  const sick = useQuery({ queryKey: ['sickReports'], queryFn: api.sickReports });
  const returned = (movements.data ?? []).filter((item) => item.status === 'returned');
  const recovered = (sick.data ?? []).filter((item) => item.status === 'recovered');
  const refresh = () => {
    void movements.refetch();
    void sick.refetch();
  };
  const showDeleted = () => {
    setSuccessMessage('Successfully deleted history');
    window.setTimeout(() => setSuccessMessage(''), 2500);
  };
  const deleteMovement = useMutation({ mutationFn: api.deleteMovement, onSuccess: () => { refresh(); showDeleted(); } });
  const deleteSick = useMutation({ mutationFn: api.deleteSickReport, onSuccess: () => { refresh(); showDeleted(); } });

  return (
    <div className="space-y-4">
      {successMessage && (
        <div className="fixed left-1/2 top-20 z-50 w-[min(360px,calc(100%-32px))] -translate-x-1/2 rounded-lg bg-emerald-600 px-4 py-3 text-center text-sm font-bold text-white shadow-soft">
          {successMessage}
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
            <SwipeHistoryCard
              key={item.id}
              onArchive={() => deleteSick.mutate(item.id)}
            >
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
            </SwipeHistoryCard>
          ))}
        </section>
      )}

      {tab === 'movement' && (
        <section className="space-y-3">
          {returned.length === 0 && <EmptyState icon={Car} title="No going-out history" body="Returned movement records will appear here." />}
          {returned.map((item) => (
            <SwipeHistoryCard
              key={item.id}
              onArchive={() => deleteMovement.mutate(item.id)}
            >
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
            </SwipeHistoryCard>
          ))}
        </section>
      )}
    </div>
  );
}
