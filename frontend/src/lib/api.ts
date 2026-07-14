import type { Announcement, MovementRequest, Role, SickReport, User } from '../types';

const apiBaseUrl = () => {
  const configured = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (configured) return configured;
  if (import.meta.env.PROD) return 'https://siap-hwle.onrender.com/api/v1';
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
  peringkat?: string;
  phone: string;
  symptoms: string;
  description: string;
  location_type: 'Duty Officer Room' | 'Own Room';
  building?: string;
  room?: string;
  status: 'active' | 'recovered' | 'clinic';
  officer_remarks?: string;
  qr_token?: string;
  duty_officer_name?: string;
  duty_officer_id?: string;
  duty_started_at?: string;
  duty_ended_at?: string;
  check_in_time: string;
  check_out_time?: string;
  created_at: string;
  is_archived?: boolean;
  delete_reason?: string;
  deleted_at?: string;
  deleted_by?: string;
};

type BackendMovement = {
  id: string;
  user_id: string;
  body_number?: string;
  rank: string;
  name: string;
  peringkat?: string;
  phone?: string;
  vehicle?: string;
  destination: string;
  purpose: string;
  expected_return: string;
  checkout_time?: string;
  return_time?: string;
  status: 'pending' | 'approved' | 'rejected' | 'returned' | 'overdue';
  approved_by?: string;
  approval_time?: string;
  remarks?: string;
  qr_token?: string;
  duty_officer_name?: string;
  duty_officer_id?: string;
  duty_started_at?: string;
  duty_ended_at?: string;
  created_at: string;
  is_archived?: boolean;
  delete_reason?: string;
  deleted_at?: string;
  deleted_by?: string;
};

const mapSickReport = (item: BackendSickReport): SickReport => ({
  id: item.id,
  userId: item.user_id,
  cadetName: item.name,
  bodyNumber: item.body_number,
  rank: item.rank,
  peringkat: item.peringkat,
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
  dutyOfficerName: item.duty_officer_name,
  dutyOfficerId: item.duty_officer_id,
  dutyStartedAt: item.duty_started_at,
  dutyEndedAt: item.duty_ended_at,
  createdAt: item.created_at,
  isArchived: item.is_archived,
  deleteReason: item.delete_reason,
  deletedAt: item.deleted_at,
  deletedBy: item.deleted_by
});

const mapMovement = (item: BackendMovement): MovementRequest => ({
  id: item.id,
  userId: item.user_id,
  cadetName: item.name,
  bodyNumber: item.body_number,
  rank: item.rank,
  peringkat: item.peringkat,
  phone: item.phone,
  vehicle: item.vehicle,
  destination: item.destination,
  purpose: item.purpose,
  expectedReturn: item.expected_return,
  checkoutTime: item.checkout_time,
  approvalTime: item.approval_time,
  returnTime: item.return_time,
  status: item.status,
  approvedBy: item.approved_by,
  remarks: item.remarks,
  qrToken: item.qr_token,
  dutyOfficerName: item.duty_officer_name,
  dutyOfficerId: item.duty_officer_id,
  dutyStartedAt: item.duty_started_at,
  dutyEndedAt: item.duty_ended_at,
  createdAt: item.created_at,
  isArchived: item.is_archived,
  deleteReason: item.delete_reason,
  deletedAt: item.deleted_at,
  deletedBy: item.deleted_by
});

export type PublicSickReportPayload = {
  bodyNumber: string;
  rank: string;
  name: string;
  peringkat: string;
  phone: string;
  symptoms: string;
  description: string;
  locationType: 'Duty Officer Room' | 'Own Room';
  building?: string;
  room?: string;
  qrToken?: string;
  dutyOfficerName?: string;
  dutyOfficerId?: string;
  dutyStartedAt?: string;
  dutyEndedAt?: string;
};

export type PublicMovementPayload = {
  bodyNumber: string;
  rank: string;
  name: string;
  peringkat: string;
  phone: string;
  vehicle: string;
  destination: string;
  purpose: string;
  remarks?: string;
  qrToken?: string;
  dutyOfficerName?: string;
  dutyOfficerId?: string;
  dutyStartedAt?: string;
  dutyEndedAt?: string;
};

export const api = {
  login: async (_role: Role): Promise<User> => dutyOfficer,
  me: async (_role: Role): Promise<User> => dutyOfficer,
  movements: async (): Promise<MovementRequest[]> => {
    const response = await fetch(`${apiBaseUrl()}/movements`);
    if (!response.ok) throw new Error('Failed to load movements');
    const data = await response.json() as BackendMovement[];
    return data.map(mapMovement);
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
        peringkat: payload.peringkat,
        phone: payload.phone,
        symptoms: payload.symptoms,
        description: payload.description,
        location_type: payload.locationType,
        building: payload.building || null,
        room: payload.room || null,
        qr_token: payload.qrToken || null,
        duty_officer_name: payload.dutyOfficerName || null,
        duty_officer_id: payload.dutyOfficerId || null,
        duty_started_at: payload.dutyStartedAt || null,
        duty_ended_at: payload.dutyEndedAt || null
      })
    });
    if (!response.ok) throw new Error('Failed to submit sick report');
    return mapSickReport(await response.json() as BackendSickReport);
  },
  createPublicMovement: async (payload: PublicMovementPayload): Promise<MovementRequest> => {
    const fallbackReturn = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const response = await fetch(`${apiBaseUrl()}/movements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        body_number: payload.bodyNumber,
        rank: payload.rank,
        name: payload.name,
        peringkat: payload.peringkat,
        phone: payload.phone,
        vehicle: payload.vehicle,
        destination: payload.destination,
        purpose: payload.purpose,
        expected_return: fallbackReturn.toISOString(),
        remarks: payload.remarks || null,
        qr_token: payload.qrToken || null,
        duty_officer_name: payload.dutyOfficerName || null,
        duty_officer_id: payload.dutyOfficerId || null,
        duty_started_at: payload.dutyStartedAt || null,
        duty_ended_at: payload.dutyEndedAt || null
      })
    });
    if (!response.ok) throw new Error('Failed to submit movement');
    return mapMovement(await response.json() as BackendMovement);
  },
  markSickRecovered: async (id: string): Promise<SickReport> => {
    const response = await fetch(`${apiBaseUrl()}/sick-reports/${id}/recover`, { method: 'POST' });
    if (!response.ok) throw new Error('Failed to mark recovered');
    return mapSickReport(await response.json() as BackendSickReport);
  },
  markMovementReturned: async (id: string): Promise<MovementRequest> => {
    const response = await fetch(`${apiBaseUrl()}/movements/${id}/return`, { method: 'POST' });
    if (!response.ok) throw new Error('Failed to mark returned');
    return mapMovement(await response.json() as BackendMovement);
  },
  deleteSickReport: async (id: string): Promise<void> => {
    const response = await fetch(`${apiBaseUrl()}/sick-reports/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete sick report');
  },
  deleteMovement: async (id: string): Promise<void> => {
    const response = await fetch(`${apiBaseUrl()}/movements/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete movement');
  }
};
