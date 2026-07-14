type DutyOfficerNoticeProps = {
  name?: string | null;
  id?: string | null;
  startedAt?: string | null;
  endedAt?: string | null;
};

function formatDateTime(value?: string | null) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString();
}

export function dutyDetailsFromSearch(search: string): DutyOfficerNoticeProps {
  const params = new URLSearchParams(search);
  return {
    name: params.get('duty_officer_name'),
    id: params.get('duty_officer_id'),
    startedAt: params.get('duty_started_at'),
    endedAt: params.get('duty_ended_at')
  };
}

export function DutyOfficerNotice({ name, id, startedAt, endedAt }: DutyOfficerNoticeProps) {
  return (
    <section className="rounded-xl border border-olive-100 bg-olive-50 p-4 text-sm text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
      <p className="text-xs font-bold uppercase text-olive-700 dark:text-olive-100">Current Duty Officer</p>
      <p className="mt-1 font-semibold">{name || '-'}</p>
      <div className="mt-2 grid grid-cols-1 gap-1 text-xs text-slate-500 dark:text-slate-300">
        <p><span className="font-semibold text-slate-700 dark:text-slate-100">ID:</span> {id || '-'}</p>
        <p><span className="font-semibold text-slate-700 dark:text-slate-100">Duty:</span> {formatDateTime(startedAt)} - {formatDateTime(endedAt)}</p>
      </div>
    </section>
  );
}
