import { Bell, History, Home, MoreHorizontal, QrCode, Shield, UsersRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { dutyOfficers, getDutySession, setDutyOfficer } from '../lib/dutySession';
import type { Role } from '../types';

type Props = { role: Role };

export function AppLayout({ role }: Props) {
  const navigate = useNavigate();
  const [session, setSession] = useState(getDutySession);
  const [selectedOfficer, setSelectedOfficer] = useState('');
  const officerNav = [
    { to: '/officer', icon: Home, label: 'Home' },
    { to: '/officer/outside', icon: UsersRound, label: 'Cadets' },
    { to: '/officer/qr', icon: QrCode, label: 'QR' },
    { to: '/officer/history', icon: History, label: 'History' },
    { to: '/officer/more', icon: MoreHorizontal, label: 'More' }
  ];
  const nav = officerNav;

  useEffect(() => {
    const active = getDutySession();
    if (!active) {
      navigate('/login');
      return;
    }
    setSession(active);
  }, [navigate]);

  const saveOfficer = () => {
    if (!selectedOfficer) return;
    setDutyOfficer(selectedOfficer);
    setSession(getDutySession());
  };

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
        {session && !session.officerName && (
          <div className="fixed inset-0 z-50 grid place-items-end bg-black/50 p-4">
            <section className="w-full max-w-md rounded-lg bg-white p-4 shadow-soft dark:bg-slate-900">
              <h2 className="text-xl font-bold">Select Duty Officer</h2>
              <p className="mt-1 text-sm text-slate-500">Choose the DO taking this 22:00 to 22:00 duty.</p>
              <select className="field mt-4" value={selectedOfficer} onChange={(event) => setSelectedOfficer(event.target.value)}>
                <option value="">Select DO</option>
                {dutyOfficers.map((officer) => <option key={officer}>{officer}</option>)}
              </select>
              <button className="btn-primary mt-4 w-full" disabled={!selectedOfficer} onClick={saveOfficer}>Continue</button>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
