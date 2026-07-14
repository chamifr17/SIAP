import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { clearDutySession } from '../../lib/dutySession';

export function MorePage() {
  const navigate = useNavigate();
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
      <button className="btn-danger w-full justify-start" onClick={logout}>
        <LogOut size={19} /> Logout
      </button>
    </div>
  );
}
