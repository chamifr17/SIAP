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
    <div className="app-page grid place-items-center px-4">
      <section className="w-full max-w-md">
        <div className="space-y-4 rounded-xl border border-olive-200 bg-white p-5 shadow-[0_18px_45px_rgba(31,40,24,0.18)] dark:border-slate-700 dark:bg-slate-900">
          <div className="flex flex-col items-center text-center">
            <img className="size-28 object-contain" src={siapLogo} alt="SIAP logo" />
            <h1 className="mt-3 text-3xl font-bold">SIAP</h1>
            <p className="mt-1 text-sm font-semibold uppercase text-olive-700">Sistem Informasi Aktiviti PALAPES</p>
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
