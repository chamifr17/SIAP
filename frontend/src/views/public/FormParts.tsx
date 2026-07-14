import type { ReactNode } from 'react';

type FormSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

type FieldShellProps = {
  label: string;
  error?: string;
  children: ReactNode;
};

export function FormHero({ title, description, remaining }: { title: string; description: string; remaining: number }) {
  return (
    <section className="rounded-xl border border-olive-100 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase text-olive-700 dark:text-olive-100">SIAP Cadet Form</p>
          <h2 className="mt-1 text-2xl font-bold leading-tight">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
        <div className="shrink-0 rounded-lg bg-olive-50 px-3 py-2 text-center dark:bg-slate-800">
          <p className="text-[11px] font-semibold uppercase text-slate-500">QR</p>
          <p className="text-lg font-bold">{remaining}s</p>
        </div>
      </div>
    </section>
  );
}

export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <section className="rounded-xl border border-olive-100 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4">
        <h3 className="font-bold">{title}</h3>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export function FieldShell({ label, error, children }: FieldShellProps) {
  return (
    <label className="block space-y-1.5">
      <span className="label">{label}</span>
      {children}
      {error && <p className="text-sm font-medium text-red-600">{error}</p>}
    </label>
  );
}
