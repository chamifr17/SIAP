import { LogOut, Settings, SlidersHorizontal, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';

export function MorePage() {
  return (
    <div className="space-y-4">
      <section className="card space-y-2">
        <h2 className="text-xl font-bold">More</h2>
        <p className="text-sm text-slate-500">Account, settings, and utility tools.</p>
      </section>
      <button className="btn-secondary w-full justify-start"><UserRound size={19} /> Personalize Account</button>
      <button className="btn-secondary w-full justify-start"><Settings size={19} /> Settings</button>
      <button className="btn-secondary w-full justify-start"><SlidersHorizontal size={19} /> Utilities</button>
      <Link className="btn-danger w-full justify-start" to="/login"><LogOut size={19} /> Logout</Link>
    </div>
  );
}

