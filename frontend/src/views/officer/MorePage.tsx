import { LogOut, Settings, SlidersHorizontal, UserRound } from 'lucide-react';
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
        <h2 className="text-xl font-bold">More</h2>
        <p className="text-sm text-slate-500">Account, settings, and utility tools.</p>
      </section>
      <button className="btn-secondary w-full justify-start"><UserRound size={19} /> Personalize Account</button>
      <button className="btn-secondary w-full justify-start"><Settings size={19} /> Settings</button>
      <button className="btn-secondary w-full justify-start"><SlidersHorizontal size={19} /> Utilities</button>
      <button className="btn-danger w-full justify-start" onClick={logout}><LogOut size={19} /> Logout</button>
    </div>
  );
}
