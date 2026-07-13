export const dutyOfficers = [
  'LTM NAQIB WAZIEN BIN ABU TALIB (7546159)',
  'LTM JASSICA ANAK CASTERY (7546148)',
  'LTM STEVEN MELKISEDEK ANAK WILLI (7546173)',
  'LTM FION EVAN ANAK JEROME (7546143)',
  'LTM NICHOLAS TING TIING HOU (7546160)',
  'LTM EMYSA WOLTA (7546141)',
  'LTM NURSYAKIRAH BINTI HAMZAH (7546164)',
  'LTM MAY BRENDA ANAK RITCHI (7546151)',
  'LTM HANIS ERICA FARHANA (7546145)',
  'LTM FAQRULRAZI BIN MUHAMMAD YUNUS (7546142)',
  'LTM CHERY MYTTEL VOON (7546139)'
];

const SESSION_KEY = 'siap_duty_session';

type DutySession = {
  expiresAt: number;
  officerName?: string;
};

export function nextDutyExpiry(now = new Date()): number {
  const expiry = new Date(now);
  expiry.setHours(22, 0, 0, 0);
  if (now >= expiry) {
    expiry.setDate(expiry.getDate() + 1);
  }
  return expiry.getTime();
}

export function createDutySession() {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ expiresAt: nextDutyExpiry() }));
}

export function getDutySession(): DutySession | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const session = JSON.parse(raw) as DutySession;
    if (!session.expiresAt || Date.now() >= session.expiresAt) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function setDutyOfficer(officerName: string) {
  const session = getDutySession() ?? { expiresAt: nextDutyExpiry() };
  localStorage.setItem(SESSION_KEY, JSON.stringify({ ...session, officerName }));
}

export function clearDutySession() {
  localStorage.removeItem(SESSION_KEY);
}

export function dutyWindowLabel(session = getDutySession()) {
  if (!session) return '22:00 - 22:00';
  const end = new Date(session.expiresAt);
  const start = new Date(end);
  start.setDate(start.getDate() - 1);
  return `${start.toLocaleDateString()} 22:00 - ${end.toLocaleDateString()} 22:00`;
}

