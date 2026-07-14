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
    <div className="grid h-dvh place-items-center overflow-hidden bg-[radial-gradient(circle_at_top_left,#31533d_0%,#1f3a35_34%,#101d2b_72%,#07111f_100%)] px-4">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(223,230,210,0.08)_0%,transparent_38%,rgba(63,77,45,0.14)_100%)]" />
      <section className="relative z-10 w-full max-w-md">
        <div className="space-y-4 rounded-xl border border-olive-200/60 bg-olive-900/88 p-5 text-white shadow-[0_18px_45px_rgba(15,23,42,0.38)] backdrop-blur-md dark:border-olive-200/30 dark:bg-olive-950/90">
          <div className="flex flex-col items-center text-center">
            <img className="size-28 object-contain" src={siapLogo} alt="SIAP logo" />
            <p className="mt-3 text-sm font-semibold uppercase text-olive-100">Sistem Informasi Aktiviti PALAPES</p>
          </div>
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-olive-50">Username</span>
            <input className="field" value={username} onChange={(event) => setUsername(event.target.value)} />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-olive-50">Password</span>
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
