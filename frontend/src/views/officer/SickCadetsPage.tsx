import { Hospital, Phone, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

export function SickCadetsPage() {
  const { data = [] } = useQuery({ queryKey: ['sickReports'], queryFn: api.sickReports });

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold">Sick Cadets</h2>
      {data.map((item) => (
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
          <div className="grid grid-cols-2 gap-3"><button className="btn-primary"><UserCheck size={18} /> Recovered</button><button className="btn-secondary"><Hospital size={18} /> Clinic</button></div>
          <Link className="btn-secondary w-full" to={`/officer/cadets/${item.userId}`}>View Details</Link>
        </article>
      ))}
    </div>
  );
}
