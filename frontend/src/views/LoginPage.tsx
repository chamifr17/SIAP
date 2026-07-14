import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loginCamo from '../assets/login-camo.png';
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
    <div className="grid h-dvh place-items-center overflow-hidden bg-cover bg-center px-4" style={{ backgroundImage: `url(${loginCamo})` }}>
      <div className="absolute inset-0 bg-[#11190d]/30 backdrop-blur-[0.5px]" />
      <section className="relative z-10 w-full max-w-md">
        <div className="space-y-4 rounded-xl border border-[#d4c783]/25 bg-[#17220f]/90 p-5 text-[#f4efd7] shadow-[0_22px_55px_rgba(9,14,6,0.55)] backdrop-blur-md">
          <div className="flex flex-col items-center text-center">
            <img className="size-28 object-contain" src={siapLogo} alt="SIAP logo" />
            <p className="mt-3 text-sm font-semibold uppercase text-[#efe6b5]">Sistem Informasi Aktiviti PALAPES</p>
          </div>
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-[#f4efd7]">Username</span>
            <input
              className="w-full rounded-lg border border-[#d4c783]/35 bg-[#0d1509]/75 px-3 py-3 text-sm text-[#f8f2d4] outline-none ring-[#c8b95f] transition placeholder:text-[#d7cb98]/55 focus:border-[#d4c783] focus:ring-2"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-[#f4efd7]">Password</span>
            <input
              className="w-full rounded-lg border border-[#d4c783]/35 bg-[#0d1509]/75 px-3 py-3 text-sm text-[#f8f2d4] outline-none ring-[#c8b95f] transition placeholder:text-[#d7cb98]/55 focus:border-[#d4c783] focus:ring-2"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button
            className="flex w-full items-center justify-center rounded-lg bg-[#d4c783] px-4 py-3 text-sm font-bold text-[#18220f] shadow-sm transition hover:bg-[#e2d893] disabled:cursor-not-allowed disabled:opacity-60"
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
