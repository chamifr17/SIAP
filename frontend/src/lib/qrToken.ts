const TOKEN_TTL_MS = 120_000;

export type QRTokenState = {
  token: string;
  expiresAt: number;
};

export function createQRToken(): QRTokenState {
  const random = crypto.getRandomValues(new Uint32Array(2));
  return {
    token: `${random[0].toString(36)}${random[1].toString(36)}`.toUpperCase(),
    expiresAt: Date.now() + TOKEN_TTL_MS
  };
}

export function secondsRemaining(expiresAt: number): number {
  return Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
}

export function readQRToken(search: string): QRTokenState | null {
  const params = new URLSearchParams(search);
  const token = params.get('token');
  const expires = Number(params.get('expires'));
  if (!token || !Number.isFinite(expires)) return null;
  return { token, expiresAt: expires };
}

export function isQRTokenValid(state: QRTokenState | null): boolean {
  return Boolean(state && state.expiresAt > Date.now());
}

export function tokenSearch(state: QRTokenState): string {
  return `?token=${encodeURIComponent(state.token)}&expires=${state.expiresAt}`;
}
