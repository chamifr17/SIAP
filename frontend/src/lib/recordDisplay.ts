export function peringkatBadgeClass(peringkat?: string) {
  const value = peringkat?.toLowerCase();
  if (value === 'junior') return 'bg-yellow-100 text-yellow-900 border-yellow-200';
  if (value === 'intermediate') return 'bg-blue-100 text-blue-900 border-blue-200';
  if (value === 'senior') return 'bg-red-100 text-red-900 border-red-200';
  return 'bg-slate-100 text-slate-700 border-slate-200';
}

export function dateInputValue(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-CA');
}

export function dateSectionLabel(value?: string) {
  if (!value) return 'Unknown date';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unknown date';
  return date.toLocaleDateString(undefined, { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
}

export function groupByDate<T>(items: T[], getDate: (item: T) => string | undefined) {
  const groups = new Map<string, T[]>();
  items.forEach((item) => {
    const key = dateSectionLabel(getDate(item));
    groups.set(key, [...(groups.get(key) ?? []), item]);
  });
  return Array.from(groups.entries());
}
