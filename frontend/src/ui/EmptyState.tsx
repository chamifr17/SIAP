import type { LucideIcon } from 'lucide-react';

export function EmptyState({ icon: Icon, title, body }: { icon: LucideIcon; title: string; body: string }) {
  return (
    <div className="rounded-lg border border-dashed border-olive-200 bg-white/60 p-6 text-center dark:border-slate-700 dark:bg-slate-900/60">
      <Icon className="mx-auto mb-3 text-olive-700 dark:text-olive-100" size={32} />
      <h2 className="font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{body}</p>
    </div>
  );
}

