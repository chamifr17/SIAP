import { Send } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

export function AnnouncementsPage() {
  const { data = [] } = useQuery({ queryKey: ['announcements'], queryFn: api.announcements });

  return (
    <div className="space-y-4">
      <section className="card space-y-3">
        <h2 className="text-xl font-bold">Create Announcement</h2>
        <input className="field" placeholder="Title" />
        <textarea className="field min-h-24" placeholder="Content" />
        <button className="btn-primary w-full"><Send size={18} /> Publish</button>
      </section>
      {data.map((item) => (
        <article className="card" key={item.id}>
          <h3 className="font-semibold">{item.title}</h3>
          <p className="mt-1 text-sm text-slate-500">{item.content}</p>
        </article>
      ))}
    </div>
  );
}

