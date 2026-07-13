export type Role = 'duty_officer';

export type CadetStatus =
  | 'Inside College'
  | 'Outside College'
  | 'Pending Approval'
  | 'Sick (DO Room)'
  | 'Sick (Own Room)'
  | 'Overdue';

export type User = {
  id: string;
  bodyNumber?: string;
  username?: string;
  rank: string;
  name: string;
  company: string;
  phone: string;
  role: Role;
  photoUrl?: string;
  status: CadetStatus;
};

export type MovementRequest = {
  id: string;
  userId: string;
  cadetName: string;
  bodyNumber?: string;
  rank: string;
  peringkat?: string;
  phone?: string;
  vehicle?: string;
  destination: string;
  purpose: string;
  expectedReturn: string;
  checkoutTime?: string;
  approvalTime?: string;
  returnTime?: string;
  status: 'pending' | 'approved' | 'rejected' | 'returned' | 'overdue';
  approvedBy?: string;
  remarks?: string;
  qrToken?: string;
  createdAt: string;
};

export type SickReport = {
  id: string;
  userId: string;
  cadetName: string;
  symptoms: string;
  description: string;
  locationType: 'Duty Officer Room' | 'Own Room';
  building?: string;
  room?: string;
  status: 'active' | 'recovered' | 'clinic';
  officerRemarks?: string;
  bodyNumber?: string;
  rank?: string;
  peringkat?: string;
  phone?: string;
  checkInTime?: string;
  checkOutTime?: string;
  createdAt: string;
};

export type Announcement = {
  id: string;
  title: string;
  content: string;
  createdBy: string;
  createdAt: string;
};
