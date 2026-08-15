import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CertificateVerifyPage } from './pages/CertificateVerifyPage';

import { DashboardLayout } from './layouts/DashboardLayout';
import { AdminDashboard } from './pages/AdminDashboard';
import { AnoDashboard } from './pages/AnoDashboard';
import { CadetDashboard } from './pages/CadetDashboard';

import { CadetsPage } from './pages/CadetsPage';
import { CadetProfilePage } from './pages/CadetProfilePage';
import { ProfilePage } from './pages/ProfilePage';
import { AttendancePage } from './pages/AttendancePage';
import { ParadesPage } from './pages/ParadesPage';
import { TrainingPage } from './pages/TrainingPage';
import { EventsPage } from './pages/EventsPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { CertificatesPage } from './pages/CertificatesPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { ReportsPage } from './pages/ReportsPage';
import { UsersPage } from './pages/UsersPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { SettingsPage } from './pages/SettingsPage';

// Role-aware Dashboard Selector
const DashboardSwitch = () => {
  const { user } = useAuth();
  if (user?.role === 'ADMIN') return <AdminDashboard />;
  if (user?.role === 'ANO') return <AnoDashboard />;
  return <CadetDashboard />;
};

// Route Guard for RBAC Permissions
const ProtectedRoleRoute = ({ allowedRoles, children }) => {
  const { user } = useAuth();
  const role = user?.role || 'CADET';

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-certificate/:certNo" element={<CertificateVerifyPage />} />

            {/* Authenticated Dashboard Routes */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardSwitch />} />
              <Route path="/profile" element={<ProfilePage />} />

              {/* Cadets Directory - Officers/Admin Only */}
              <Route path="/cadets" element={
                <ProtectedRoleRoute allowedRoles={['ADMIN', 'ANO']}>
                  <CadetsPage />
                </ProtectedRoleRoute>
              } />

              <Route path="/cadets/:id" element={<CadetProfilePage />} />

              {/* Attendance Marking - Officers/Admin Only */}
              <Route path="/attendance" element={
                <ProtectedRoleRoute allowedRoles={['ADMIN', 'ANO']}>
                  <AttendancePage />
                </ProtectedRoleRoute>
              } />

              {/* Shared Activities & Records */}
              <Route path="/parades" element={<ParadesPage />} />
              <Route path="/training" element={<TrainingPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/achievements" element={<AchievementsPage />} />
              <Route path="/certificates" element={<CertificatesPage />} />
              <Route path="/announcements" element={<AnnouncementsPage />} />
              <Route path="/documents" element={<DocumentsPage />} />

              {/* Reports & Analytics - Officers/Admin Only */}
              <Route path="/reports" element={
                <ProtectedRoleRoute allowedRoles={['ADMIN', 'ANO']}>
                  <ReportsPage />
                </ProtectedRoleRoute>
              } />

              {/* Officers / User Management - Admin Only */}
              <Route path="/users" element={
                <ProtectedRoleRoute allowedRoles={['ADMIN']}>
                  <UsersPage />
                </ProtectedRoleRoute>
              } />

              {/* Audit Logs - Admin Only */}
              <Route path="/audit-logs" element={
                <ProtectedRoleRoute allowedRoles={['ADMIN']}>
                  <AuditLogsPage />
                </ProtectedRoleRoute>
              } />

              {/* System Settings - Officers/Admin Only */}
              <Route path="/settings" element={
                <ProtectedRoleRoute allowedRoles={['ADMIN', 'ANO']}>
                  <SettingsPage />
                </ProtectedRoleRoute>
              } />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
}
