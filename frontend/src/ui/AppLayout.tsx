import { Bell, History, Home, MoreHorizontal, QrCode, Shield, UsersRound } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import type { Role } from '../types';

type Props = { role: Role };

export function AppLayout({ role }: Props) {
  const officerNav = [
    { to: '/officer', icon: Home, label: 'Home' },
    { to: '/officer/outside', icon: UsersRound, label: 'Cadets' },
    { to: '/officer/qr', icon: QrCode, label: 'QR' },
    { to: '/officer/history', icon: History, label: 'History' },
    { to: '/officer/more', icon: MoreHorizontal, label: 'More' }
  ];
  const nav = officerNav;

  return (
    <div className="app-page">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-olive-50 dark:bg-slate-950">
        <header className="sticky top-0 z-20 border-b border-olive-100 bg-olive-50/95 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-lg bg-olive-700 text-white">
                <Shield size={22} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-olive-700 dark:text-olive-100">SIAP</p>
                <h1 className="text-lg font-bold">Duty Officer</h1>
              </div>
            </div>
            <button className="btn-secondary size-11 p-0" aria-label="Notifications">
              <Bell size={19} />
            </button>
          </div>
        </header>
        <main className="flex-1 px-4 py-4 pb-24">
          <Outlet />
        </main>
        <nav className="fixed bottom-3 left-1/2 z-30 grid w-[min(448px,calc(100%-24px))] -translate-x-1/2 grid-cols-5 gap-1 rounded-2xl bg-olive-900 p-2 text-white shadow-soft">
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} end className={({ isActive }) => `grid min-h-12 place-items-center rounded-lg text-xs ${isActive ? 'bg-white/15' : 'text-white/65'}`}>
              <item.icon size={19} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
