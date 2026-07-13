import type { CadetStatus } from '../types';

export const statusTone: Record<CadetStatus, string> = {
  'Inside College': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200',
  'Outside College': 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200',
  'Pending Approval': 'bg-yellow-100 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-100',
  'Sick (DO Room)': 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-100',
  'Sick (Own Room)': 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-100',
  Overdue: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-100'
};

