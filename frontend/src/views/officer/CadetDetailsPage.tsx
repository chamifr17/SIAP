import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

export function CadetDetailsPage() {
  const { id } = useParams();
  const movements = useQuery({ queryKey: ['movements'], queryFn: api.movements });
  const sick = useQuery({ queryKey: ['sickReports'], queryFn: api.sickReports });
  const cadetMovements = movements.data?.filter((item) => item.userId === id) ?? [];
  const sickHistory = sick.data?.filter((item) => item.userId === id) ?? [];

  return (
    <div className="space-y-4">
      <section className="card"><h2 className="text-xl font-bold">Cadet Details</h2><p className="text-sm text-slate-500">Profile and duty history for {id}</p></section>
      <section className="space-y-3"><h3 className="font-semibold">Movement History</h3>{cadetMovements.map((item) => <article className="card" key={item.id}><p className="font-semibold">{item.destination}</p><p className="text-sm text-slate-500">{item.purpose}</p></article>)}</section>
      <section className="space-y-3"><h3 className="font-semibold">Sick History</h3>{sickHistory.map((item) => <article className="card" key={item.id}><p className="font-semibold">{item.symptoms}</p><p className="text-sm text-slate-500">{item.description}</p></article>)}</section>
      <section className="card space-y-2"><h3 className="font-semibold">Officer Remarks</h3><textarea className="field min-h-24" placeholder="Add remarks" /></section>
    </div>
  );
}

