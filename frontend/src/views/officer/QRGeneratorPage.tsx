import { Copy, Download, ExternalLink, QrCode } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createQRToken, secondsRemaining, tokenSearch } from '../../lib/qrToken';

const defaultBaseUrl = () => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://192.168.37.35:4173';
  }
  return window.location.origin;
};

const normalizeBaseUrl = (value: string) => {
  const withProtocol = /^https?:\/\//i.test(value.trim()) ? value.trim() : `http://${value.trim()}`;
  try {
    const parsed = new URL(withProtocol);
    const isLanIp = /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(parsed.hostname);
    if (isLanIp) parsed.protocol = 'http:';
    return parsed.toString().replace(/\/$/, '');
  } catch {
    return withProtocol.replace(/\/$/, '');
  }
};

export function QRGeneratorPage() {
  const [qrState, setQrState] = useState(createQRToken);
  const [remaining, setRemaining] = useState(secondsRemaining(qrState.expiresAt));
  const [baseUrl, setBaseUrl] = useState(defaultBaseUrl);
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
  const url = `${normalizedBaseUrl}/qr${tokenSearch(qrState)}`;

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

  const refreshNow = () => {
    const next = createQRToken();
    setQrState(next);
    setRemaining(secondsRemaining(next.expiresAt));
  };

  const downloadQr = () => {
    const canvas = document.getElementById('cadet-entry-qr') as HTMLCanvasElement | null;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'siap-qr.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

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
        <label className="block space-y-2">
          <span className="label">QR Base URL</span>
          <input
            className="field"
            value={baseUrl}
            onChange={(event) => setBaseUrl(event.target.value)}
            inputMode="url"
          />
          <span className="block text-xs text-slate-500">Use your laptop Wi-Fi address with http:// for local testing. HTTPS will only work after deployment.</span>
        </label>
        <div className="flex items-center justify-between rounded-lg bg-olive-50 p-3 dark:bg-slate-800">
          <div>
            <p className="text-xs font-semibold uppercase text-olive-700 dark:text-olive-100">Current Token</p>
            <p className="font-mono text-sm font-bold">{qrState.token}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Refreshes in</p>
            <p className="text-2xl font-bold">{remaining}s</p>
          </div>
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
        <p className="break-all rounded-lg bg-olive-50 p-3 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">{url}</p>
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-xs text-yellow-900 dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-100">
          If Brave or another browser shows a secure connection error, check that the opened address starts with http://, not https://.
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button className="btn-secondary" onClick={() => navigator.clipboard?.writeText(url)}><Copy size={18} /> Copy</button>
          <button className="btn-secondary" onClick={downloadQr}><Download size={18} /> Save</button>
          <button className="btn-secondary" onClick={refreshNow}>Refresh</button>
          <a className="btn-primary" href={url} target="_blank" rel="noreferrer"><ExternalLink size={18} /> Open</a>
        </div>
      </article>
    </div>
  );
}
