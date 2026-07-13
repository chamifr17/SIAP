import type { Announcement, MovementRequest, Role, SickReport, User } from '../types';

const apiBaseUrl = () => {
  const configured = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (configured) return configured;
  const host = window.location.hostname;
  return `${window.location.protocol}//${host}:8000/api/v1`;
};

const dutyOfficer: User = {
  id: 'local-duty-officer',
  username: 'do',
  rank: 'DO',
  name: 'Duty Officer',
  company: 'Duty Office',
  phone: '',
  role: 'duty_officer',
  status: 'Inside College'
};

type BackendSickReport = {
  id: string;
  user_id: string;
  body_number: string;
  rank: string;
  name: string;
  phone: string;
  symptoms: string;
  description: string;
  location_type: 'Duty Officer Room' | 'Own Room';
  building?: string;
  room?: string;
  status: 'active' | 'recovered' | 'clinic';
  officer_remarks?: string;
  qr_token?: string;
  check_in_time: string;
  check_out_time?: string;
  created_at: string;
};

const mapSickReport = (item: BackendSickReport): SickReport => ({
  id: item.id,
  userId: item.user_id,
  cadetName: item.name,
  bodyNumber: item.body_number,
  rank: item.rank,
  phone: item.phone,
  symptoms: item.symptoms,
  description: item.description,
  locationType: item.location_type,
  building: item.building,
  room: item.room,
  status: item.status,
  officerRemarks: item.officer_remarks,
  checkInTime: item.check_in_time,
  checkOutTime: item.check_out_time,
  createdAt: item.created_at
});

export type PublicSickReportPayload = {
  bodyNumber: string;
  rank: string;
  name: string;
  phone: string;
  symptoms: string;
  description: string;
  locationType: 'Duty Officer Room' | 'Own Room';
  building?: string;
  room?: string;
  qrToken?: string;
};

export const api = {
  login: async (_role: Role): Promise<User> => dutyOfficer,
  me: async (_role: Role): Promise<User> => dutyOfficer,
  movements: async (): Promise<MovementRequest[]> => {
    const response = await fetch(`${apiBaseUrl()}/movements`);
    if (!response.ok) throw new Error('Failed to load movements');
    return [];
  },
  sickReports: async (): Promise<SickReport[]> => {
    const response = await fetch(`${apiBaseUrl()}/sick-reports`);
    if (!response.ok) throw new Error('Failed to load sick reports');
    const data = await response.json() as BackendSickReport[];
    return data.map(mapSickReport);
  },
  announcements: async (): Promise<Announcement[]> => {
    const response = await fetch(`${apiBaseUrl()}/announcements`);
    if (!response.ok) throw new Error('Failed to load announcements');
    return await response.json() as Announcement[];
  },
  createMovementRequest: async (_payload: Pick<MovementRequest, 'destination' | 'purpose' | 'expectedReturn' | 'remarks'>) => {
    throw new Error('Movement database integration is not implemented yet');
  },
  createSickReport: async (_payload: Pick<SickReport, 'symptoms' | 'description' | 'locationType' | 'building' | 'room'>) => {
    throw new Error('Use public sick report submission');
  },
  createPublicSickReport: async (payload: PublicSickReportPayload): Promise<SickReport> => {
    const response = await fetch(`${apiBaseUrl()}/sick-reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        body_number: payload.bodyNumber,
        rank: payload.rank,
        name: payload.name,
        phone: payload.phone,
        symptoms: payload.symptoms,
        description: payload.description,
        location_type: payload.locationType,
        building: payload.building || null,
        room: payload.room || null,
        qr_token: payload.qrToken || null
      })
    });
    if (!response.ok) throw new Error('Failed to submit sick report');
    return mapSickReport(await response.json() as BackendSickReport);
  }
};
