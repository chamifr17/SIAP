import { Check, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

export function PendingRequestsPage() {
  const { data = [] } = useQuery({ queryKey: ['movements'], queryFn: api.movements });
  const pending = data.filter((item) => item.status === 'pending');

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold">Pending Requests</h2>
      {pending.map((item) => (
        <article className="card space-y-3" key={item.id}>
          <div><h3 className="font-semibold">{item.rank} {item.cadetName}</h3><p className="text-sm text-slate-500">{item.destination}</p></div>
          <p className="text-sm">{item.purpose}</p>
          <p className="text-xs text-slate-500">Expected return: {item.expectedReturn}</p>
          <div className="grid grid-cols-2 gap-3"><button className="btn-danger"><X size={18} /> Reject</button><button className="btn-primary"><Check size={18} /> Approve</button></div>
        </article>
      ))}
    </div>
  );
}

