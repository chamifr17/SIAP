import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import siapLogo from '../assets/siap-logo.png';
import { api } from '../lib/api';
import { createDutySession, getDutySession } from '../lib/dutySession';

export function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('DutyOfficer');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (getDutySession()) navigate('/officer');
  }, [navigate]);

  const login = useMutation({
    mutationFn: api.login,
    onSuccess: () => {
      createDutySession();
      navigate('/officer');
    }
  });

  const submit = () => {
    if (username !== 'DutyOfficer' || password !== 'DO999') {
      setError('Invalid username or password');
      return;
    }
    setError('');
    login.mutate('duty_officer');
  };

  return (
    <div className="fixed inset-0 grid h-[100dvh] w-screen touch-none place-items-center overflow-hidden bg-[#344225] px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#4b5d33_0%,#344225_45%,#1d2615_100%)]" />
      <section className="relative z-10 w-full max-w-md">
        <div className="space-y-3 rounded-xl border border-[#d6e3bf] bg-[#dfeacb]/95 p-4 text-[#1d2615] shadow-[0_22px_55px_rgba(9,14,6,0.42)] sm:p-5">
          <div className="flex flex-col items-center text-center">
            <img className="size-24 object-contain sm:size-28" src={siapLogo} alt="SIAP logo" />
            <p className="mt-2 text-sm font-semibold uppercase text-[#344225]">Sistem Informasi Aktiviti PALAPES</p>
          </div>
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-[#1d2615]">Username</span>
            <input
              className="w-full rounded-lg border border-[#9cac73] bg-[#f7faef] px-3 py-3 text-sm text-[#1d2615] outline-none ring-[#5f743f] transition placeholder:text-[#6f7a5a]/60 focus:border-[#5f743f] focus:ring-2"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-[#1d2615]">Password</span>
            <input
              className="w-full rounded-lg border border-[#9cac73] bg-[#f7faef] px-3 py-3 text-sm text-[#1d2615] outline-none ring-[#5f743f] transition placeholder:text-[#6f7a5a]/60 focus:border-[#5f743f] focus:ring-2"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button
            className="flex w-full items-center justify-center rounded-lg bg-[#344225] px-4 py-3 text-sm font-bold text-[#f7faef] shadow-sm transition hover:bg-[#26311b] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={login.isPending}
            onClick={submit}
          >
            {login.isPending ? 'Signing in...' : 'Login'}
          </button>
        </div>
      </section>
    </div>
  );
}
