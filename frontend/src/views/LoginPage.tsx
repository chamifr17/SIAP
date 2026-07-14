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
      <div className="absolute inset-0 bg-olive-950/45 backdrop-blur-[1px]" />
      <section className="relative z-10 w-full max-w-md">
        <div className="space-y-4 rounded-xl border border-white/70 bg-white/95 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.32)] backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
          <div className="flex flex-col items-center text-center">
            <img className="size-28 object-contain" src={siapLogo} alt="SIAP logo" />
            <p className="mt-3 text-sm font-semibold uppercase text-olive-700">Sistem Informasi Aktiviti PALAPES</p>
          </div>
          <div className="rounded-lg bg-olive-100 p-3 text-center text-sm font-bold text-olive-900 dark:bg-slate-800 dark:text-slate-100">Duty Officer Access Only</div>
          <label className="block space-y-2">
            <span className="label">Username</span>
            <input className="field" value={username} onChange={(event) => setUsername(event.target.value)} />
          </label>
          <label className="block space-y-2">
            <span className="label">Password</span>
            <input className="field" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button className="btn-primary w-full" disabled={login.isPending} onClick={submit}>
            {login.isPending ? 'Signing in...' : 'Login'}
          </button>
        </div>
      </section>
    </div>
  );
}
