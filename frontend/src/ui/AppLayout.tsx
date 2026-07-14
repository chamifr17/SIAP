import { History, Home, QrCode, Shield, UserRound, UsersRound } from 'lucide-react';
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
    { to: '/officer/more', icon: UserRound, label: 'Profile' }
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
      <div className="mx-auto h-dvh w-full max-w-md overflow-hidden bg-olive-50 dark:bg-slate-950">
        <header className="fixed left-1/2 top-0 z-30 w-full max-w-md -translate-x-1/2 border-b border-olive-100 bg-olive-50/95 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-lg bg-olive-700 text-white">
                <Shield size={22} />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase text-olive-700 dark:text-olive-100">Smart Integrated Activity Platform</p>
                <h1 className="text-lg font-bold">Duty Officer</h1>
              </div>
            </div>
          </div>
        </header>
        <main className="fixed bottom-[84px] left-1/2 top-[69px] w-full max-w-md -translate-x-1/2 overflow-y-auto px-4 py-3">
          <Outlet />
        </main>
        <nav className="fixed bottom-0 left-1/2 z-30 grid w-full max-w-md -translate-x-1/2 grid-cols-5 gap-1 rounded-t-2xl border-t border-olive-800 bg-olive-900 px-2 pb-[calc(env(safe-area-inset-bottom)+8px)] pt-2 text-white shadow-soft">
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} end className={({ isActive }) => `grid min-h-14 place-items-center rounded-lg text-xs font-semibold ${isActive ? 'bg-white/15 text-white' : 'text-white/65'}`}>
              <item.icon size={21} />
              <span className="mt-1">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        {session && !session.officerName && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-5 backdrop-blur-sm">
            <section className="w-full max-w-[420px] rounded-xl border border-white/70 bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.28)] dark:border-slate-800 dark:bg-slate-900">
              <div className="space-y-1 text-center">
                <p className="text-xs font-bold uppercase tracking-wide text-olive-700 dark:text-olive-100">22:00 Duty Session</p>
                <h2 className="text-2xl font-bold">Select Duty Officer</h2>
                <p className="text-sm text-slate-500">Choose the DO taking this duty.</p>
              </div>
              <label className="mt-5 block space-y-2">
                <span className="label">Duty Officer</span>
                <select
                  className="field min-h-14 appearance-none bg-[linear-gradient(45deg,transparent_50%,#4a5b35_50%),linear-gradient(135deg,#4a5b35_50%,transparent_50%)] bg-[length:6px_6px,6px_6px] bg-[position:calc(100%-20px)_50%,calc(100%-14px)_50%] bg-no-repeat pr-10 font-semibold"
                  value={selectedOfficer}
                  onChange={(event) => setSelectedOfficer(event.target.value)}
                >
                  <option value="">Select DO</option>
                  {dutyOfficers.map((officer) => <option key={officer}>{officer}</option>)}
                </select>
              </label>
              <button className="btn-primary mt-5 w-full" disabled={!selectedOfficer} onClick={saveOfficer}>Continue</button>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
