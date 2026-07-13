import { QrCode } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useEffect, useState } from 'react';
import { dutySearchParams, getDutySession } from '../../lib/dutySession';
import { createQRToken, secondsRemaining, tokenSearch } from '../../lib/qrToken';

export function QRGeneratorPage() {
  const [qrState, setQrState] = useState(createQRToken);
  const [remaining, setRemaining] = useState(secondsRemaining(qrState.expiresAt));
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
    <div className="space-y-4">
      <section className="card space-y-2">
        <div className="flex items-center gap-3">
          <QrCode className="text-olive-700 dark:text-olive-100" size={28} />
          <div>
            <h2 className="text-xl font-bold">QR Function</h2>
            <p className="text-sm text-slate-500">Show this one dynamic QR to cadets. It refreshes automatically to protect integrity.</p>
          </div>
        </div>
      </section>
      <article className="card space-y-3">
        <div className="rounded-lg bg-olive-50 p-3 text-center dark:bg-slate-800">
          <p className="text-xs text-slate-500">Refreshes in</p>
          <p className="text-2xl font-bold">{remaining}s</p>
        </div>
        <div className="grid aspect-square place-items-center rounded-lg border border-olive-100 bg-white p-4 dark:border-slate-800">
          <QRCodeCanvas
            id="cadet-entry-qr"
            value={url}
            size={260}
            level="H"
            includeMargin
            bgColor="#ffffff"
            fgColor="#111827"
          />
        </div>
      </article>
    </div>
  );
}
