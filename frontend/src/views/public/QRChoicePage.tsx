import { HeartPulse, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { isQRTokenValid, readQRToken, secondsRemaining, tokenSearch } from '../../lib/qrToken';

export function QRChoicePage() {
  const location = useLocation();
  const qrState = readQRToken(location.search);

  if (!isQRTokenValid(qrState)) {
    return (
      <section className="card space-y-3 text-center">
        <h2 className="text-xl font-bold">QR Expired</h2>
        <p className="text-sm text-slate-500">Please scan the latest QR shown by the Duty Officer.</p>
      </section>
    );
  }

  const search = tokenSearch(qrState!);

  return (
    <div className="space-y-4">
      <section className="card space-y-2">
        <h2 className="text-xl font-bold">Choose Report Type</h2>
        <p className="text-sm text-slate-500">Select one form to check in with the Duty Officer.</p>
        <p className="text-xs font-semibold text-olive-700 dark:text-olive-100">QR valid for {secondsRemaining(qrState!.expiresAt)} seconds</p>
      </section>
      <Link to={`/qr/sick/check-in${search}`} className="btn-danger min-h-24 w-full justify-start text-base">
        <HeartPulse size={24} />
        <span>Report Sick</span>
      </Link>
      <Link to={`/qr/outside/check-in${search}`} className="btn-primary min-h-24 w-full justify-start text-base">
        <LogOut size={24} />
        <span>Going Out</span>
      </Link>
    </div>
  );
}
