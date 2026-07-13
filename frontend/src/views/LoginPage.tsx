import { ShieldCheck } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

export function LoginPage() {
  const navigate = useNavigate();
  const login = useMutation({
    mutationFn: api.login,
    onSuccess: () => navigate('/officer')
  });

  return (
    <div className="app-page grid place-items-center px-4">
      <section className="w-full max-w-md space-y-5">
        <div className="flex items-center gap-3">
          <div className="grid size-14 place-items-center rounded-lg bg-olive-700 text-white">
            <ShieldCheck size={28} />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase text-olive-700">Duty Officer System</p>
            <h1 className="text-3xl font-bold">SIAP</h1>
          </div>
        </div>
        <div className="card space-y-4">
          <div className="rounded-lg bg-olive-100 p-3 text-center text-sm font-bold text-olive-900 dark:bg-slate-800 dark:text-slate-100">Duty Officer Access Only</div>
          <label className="block space-y-2">
            <span className="label">Username</span>
            <input className="field" defaultValue="do.azman" />
          </label>
          <label className="block space-y-2">
            <span className="label">Password</span>
            <input className="field" type="password" defaultValue="password" />
          </label>
          <button className="btn-primary w-full" disabled={login.isPending} onClick={() => login.mutate('duty_officer')}>
            {login.isPending ? 'Signing in...' : 'Login'}
          </button>
        </div>
      </section>
    </div>
  );
}
