import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from './ui/AppLayout';
import { LoginPage } from './views/LoginPage';
import { OfficerHome } from './views/officer/OfficerHome';
import { PendingRequestsPage } from './views/officer/PendingRequestsPage';
import { OutsideCadetsPage } from './views/officer/OutsideCadetsPage';
import { SickCadetsPage } from './views/officer/SickCadetsPage';
import { AnnouncementsPage } from './views/officer/AnnouncementsPage';
import { DailyReportPage } from './views/officer/DailyReportPage';
import { CadetDetailsPage } from './views/officer/CadetDetailsPage';
import { QRGeneratorPage } from './views/officer/QRGeneratorPage';
import { HistoryPage } from './views/officer/HistoryPage';
import { MorePage } from './views/officer/MorePage';
import { PublicQRLayout } from './views/public/PublicQRLayout';
import { QRChoicePage } from './views/public/QRChoicePage';
import { SickCheckInForm } from './views/public/SickCheckInForm';
import { SickCheckOutForm } from './views/public/SickCheckOutForm';
import { OutsideCheckInForm } from './views/public/OutsideCheckInForm';
import { SpecialCaseForm } from './views/public/SpecialCaseForm';

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/login', element: <LoginPage /> },
  {
    path: '/officer',
    element: <AppLayout role="duty_officer" />,
    children: [
      { index: true, element: <OfficerHome /> },
      { path: 'pending', element: <PendingRequestsPage /> },
      { path: 'outside', element: <OutsideCadetsPage /> },
      { path: 'qr', element: <QRGeneratorPage /> },
      { path: 'history', element: <HistoryPage /> },
      { path: 'more', element: <MorePage /> },
      { path: 'sick', element: <SickCadetsPage /> },
      { path: 'announcements', element: <AnnouncementsPage /> },
      { path: 'report', element: <DailyReportPage /> },
      { path: 'cadets/:id', element: <CadetDetailsPage /> }
    ]
  },
  {
    path: '/qr',
    element: <PublicQRLayout />,
    children: [
      { index: true, element: <QRChoicePage /> },
      { path: 'sick/check-in', element: <SickCheckInForm /> },
      { path: 'sick/check-out', element: <SickCheckOutForm /> },
      { path: 'outside/check-in', element: <OutsideCheckInForm /> },
      { path: 'special-case', element: <SpecialCaseForm /> }
    ]
  }
]);
