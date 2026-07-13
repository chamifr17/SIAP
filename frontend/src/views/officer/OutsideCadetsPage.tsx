import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

export function OutsideCadetsPage() {
  const { data = [] } = useQuery({ queryKey: ['movements'], queryFn: api.movements });
  const outside = data.filter((item) => item.status === 'approved' || item.status === 'overdue');

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold">Current Outside Cadets</h2>
      {outside.map((item) => (
        <article className="card space-y-3" key={item.id}>
          <div className="flex justify-between gap-3"><h3 className="font-semibold">{item.cadetName}</h3><span className={`rounded-full px-3 py-1 text-xs font-bold ${item.status === 'overdue' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>{item.status}</span></div>
          <p className="text-sm text-slate-500">{item.destination}</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-500"><span>Checkout: {item.checkoutTime}</span><span>Expected: {item.expectedReturn}</span></div>
          <div className="grid grid-cols-2 gap-3"><Link className="btn-secondary" to={`/officer/cadets/${item.userId}`}>View Details</Link><button className="btn-primary"><CheckCircle2 size={18} /> Mark Returned</button></div>
        </article>
      ))}
    </div>
  );
}

