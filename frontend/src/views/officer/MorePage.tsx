import { LogOut } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearDutySession } from '../../lib/dutySession';

export function MorePage() {
  const navigate = useNavigate();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const logout = () => {
    clearDutySession();
    navigate('/login', { replace: true });
  };

  return (
    <div className="space-y-4">
      <section className="card space-y-2">
        <h2 className="text-xl font-bold">Profile</h2>
        <p className="text-sm text-slate-500">Duty officer account.</p>
      </section>
      <button className="btn-danger w-full justify-start" onClick={() => setConfirmLogout(true)}>
        <LogOut size={19} /> Logout
      </button>
      {confirmLogout && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm">
          <section className="w-full max-w-sm rounded-xl bg-white p-4 shadow-xl dark:bg-slate-900">
            <h3 className="text-lg font-bold">Log out?</h3>
            <p className="mt-1 text-sm text-slate-500">Are you sure you want to log out from this duty session?</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button className="btn-secondary w-full" onClick={() => setConfirmLogout(false)} type="button">Cancel</button>
              <button className="btn-danger w-full" onClick={logout} type="button">Logout</button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
