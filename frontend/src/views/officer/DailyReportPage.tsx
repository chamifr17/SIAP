import { FileSpreadsheet, FileText } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

export function DailyReportPage() {
  const movements = useQuery({ queryKey: ['movements'], queryFn: api.movements });
  const sick = useQuery({ queryKey: ['sickReports'], queryFn: api.sickReports });
  const items = movements.data ?? [];
  const rows = [
    ['Total Requests', items.length],
    ['Approved', items.filter((x) => x.status === 'approved').length],
    ['Rejected', items.filter((x) => x.status === 'rejected').length],
    ['Returned', items.filter((x) => x.status === 'returned').length],
    ['Still Outside', items.filter((x) => x.status === 'approved' || x.status === 'overdue').length],
    ['Late Returns', items.filter((x) => x.status === 'overdue').length],
    ['Sick Reports', sick.data?.length ?? 0]
  ];

  return (
    <div className="space-y-4">
      <section className="card"><h2 className="text-xl font-bold">Daily Report</h2><p className="text-sm text-slate-500">{new Date().toLocaleDateString()}</p></section>
      <div className="grid grid-cols-2 gap-3">
        {rows.map(([label, value]) => <div className="card" key={label}><p className="text-sm text-slate-500">{label}</p><strong className="text-2xl">{value}</strong></div>)}
      </div>
      <div className="grid grid-cols-2 gap-3"><button className="btn-secondary"><FileText size={18} /> Export PDF</button><button className="btn-secondary"><FileSpreadsheet size={18} /> Export Excel</button></div>
    </div>
  );
}

