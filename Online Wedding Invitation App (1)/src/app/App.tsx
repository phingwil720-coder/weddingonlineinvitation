import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { AdminDashboardMobile } from './components/admin-dashboard-mobile';
import { GuestInvitationMobile } from './components/guest-invitation-mobile';
import { SetupPage } from './components/setup-page';
import { Toaster } from './components/ui/sonner';
import { isSupabaseConfigured } from '../lib/supabase';
import '../styles/index.css';

export default function App() {
  // Check if Supabase is configured
  if (!isSupabaseConfigured()) {
    return (
      <>
        <Toaster position="top-center" />
        <SetupPage />
      </>
    );
  }

  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/admin" element={<AdminDashboardMobile />} />
        <Route path="/:slug" element={<GuestInvitationMobile />} />
      </Routes>
    </BrowserRouter>
  );
}