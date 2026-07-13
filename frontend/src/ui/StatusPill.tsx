import { statusTone } from '../lib/status';
import type { CadetStatus } from '../types';

export function StatusPill({ status }: { status: CadetStatus }) {
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${statusTone[status]}`}>{status}</span>;
}

