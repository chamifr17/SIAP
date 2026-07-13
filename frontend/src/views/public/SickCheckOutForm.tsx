import { CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export function SickCheckOutForm() {
  const [done, setDone] = useState(false);

  if (done) {
    return <section className="card space-y-2 text-center"><CheckCircle2 className="mx-auto text-emerald-600" size={36} /><h2 className="text-xl font-bold">Clocked Out</h2><p className="text-sm text-slate-500">Your recovery checkout has been recorded.</p></section>;
  }

  return (
    <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); setDone(true); }}>
      <section className="card space-y-2"><h2 className="text-xl font-bold">Sick Clock Out</h2><p className="text-sm text-slate-500">Use this when you feel well and are leaving sick status.</p></section>
      <label className="block space-y-2"><span className="label">No. Badan</span><input className="field" required /></label>
      <label className="block space-y-2"><span className="label">Nama</span><input className="field" required /></label>
      <label className="block space-y-2"><span className="label">Condition Remarks</span><textarea className="field min-h-24" placeholder="I feel well and can return to routine." /></label>
      <button className="btn-primary w-full">Clock Out</button>
    </form>
  );
}

