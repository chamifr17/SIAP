import { QrCode, X } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useEffect, useState } from 'react';
import { dutySearchParams, getDutySession } from '../../lib/dutySession';
import { createQRToken, secondsRemaining, tokenSearch } from '../../lib/qrToken';

export function QRGeneratorPage() {
  const [qrState, setQrState] = useState(createQRToken);
  const [remaining, setRemaining] = useState(secondsRemaining(qrState.expiresAt));
  const [open, setOpen] = useState(false);
  const dutyParams = dutySearchParams(getDutySession());
  const tokenParams = tokenSearch(qrState).replace('?', '');
  const url = `${window.location.origin}/qr?${[tokenParams, dutyParams].filter(Boolean).join('&')}`;

  useEffect(() => {
    const interval = window.setInterval(() => {
      setRemaining(secondsRemaining(qrState.expiresAt));
      if (Date.now() >= qrState.expiresAt) {
        const next = createQRToken();
        setQrState(next);
        setRemaining(secondsRemaining(next.expiresAt));
      }
    }, 500);
    return () => window.clearInterval(interval);
  }, [qrState]);

  return (
    <div className="space-y-3">
      <section className="card space-y-3 p-3">
        <div className="flex items-center gap-3">
          <QrCode className="text-olive-700 dark:text-olive-100" size={24} />
          <div>
            <h2 className="text-lg font-bold">QR Function</h2>
            <p className="text-sm text-slate-500">Open the dynamic QR for cadet check-in.</p>
          </div>
        </div>
        <div className="rounded-lg bg-olive-50 p-2.5 text-center dark:bg-slate-800">
          <p className="text-xs text-slate-500">Refreshes in</p>
          <p className="text-xl font-bold">{remaining}s</p>
        </div>
        <button className="btn-primary w-full" onClick={() => setOpen(true)} type="button">
          <QrCode size={19} /> Show QR
        </button>
      </section>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <section className="w-full max-w-sm rounded-xl bg-white p-4 shadow-xl dark:bg-slate-900">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h3 className="font-bold">Cadet QR</h3>
                <p className="text-xs text-slate-500">Refreshes in {remaining}s</p>
              </div>
              <button className="rounded-lg p-2 text-slate-500 hover:bg-olive-100 dark:hover:bg-slate-800" onClick={() => setOpen(false)} type="button">
                <X size={18} />
              </button>
            </div>
            <div className="grid aspect-square place-items-center rounded-lg border border-olive-100 bg-white p-3 dark:border-slate-800">
              <QRCodeCanvas
                id="cadet-entry-qr"
                value={url}
                size={250}
                level="H"
                includeMargin
                bgColor="#ffffff"
                fgColor="#111827"
              />
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
