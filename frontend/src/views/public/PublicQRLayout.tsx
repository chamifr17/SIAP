import { Shield } from 'lucide-react';
import { Outlet } from 'react-router-dom';

export function PublicQRLayout() {
  return (
    <div className="app-page">
      <div className="smooth-scroll mx-auto h-dvh w-full max-w-md overflow-y-auto bg-olive-50 px-4 py-5 pb-[calc(env(safe-area-inset-bottom)+32px)] dark:bg-slate-950">
        <header className="mb-5 flex items-center gap-3 rounded-xl border border-olive-100 bg-white p-3 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="grid size-11 place-items-center rounded-lg bg-olive-700 text-white">
            <Shield size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-olive-700 dark:text-olive-100">SIAP</p>
            <h1 className="text-lg font-bold">Cadet QR Form</h1>
          </div>
        </header>
        <Outlet />
      </div>
    </div>
  );
}
