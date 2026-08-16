import React from 'react';
import { useLocation, Navigate, Routes, Route } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import AgencyLayout from '../components/dashboard/AgencyLayout';
import NotificationsPage from './NotificationsPage';
import JobDashboardPage from './JobDashboardPage';

const PlaceholderPage = ({ title }) => (
  <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col items-center justify-center min-h-[400px]">
    <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1890FF]/10 text-[#1890FF]">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="9" x2="9" y1="21" y2="9"/></svg>
    </div>
    <h1 className="text-3xl font-bold text-[#212b36] mb-3">{title}</h1>
    <p className="text-[#637381] text-lg text-center max-w-md">
      This page is under construction. Content will be added later.
    </p>
  </div>
);

export default function DashboardPage() {
  const location = useLocation();
  
  // Simple mock persistence for demo: if no state, try to fall back to Agencies if URL is /dashboard/*
  const userType = location.state?.userType || 'Agencies';

  if (userType === 'Agencies') {
    return (
      <AgencyLayout>
        <Routes>
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="agencies" element={<JobDashboardPage />} />
          <Route path="job" element={<PlaceholderPage title="Job Page" />} />
          <Route path="candidate-reports" element={<PlaceholderPage title="Candidate Reports" />} />
          <Route path="integrations" element={<PlaceholderPage title="Integrations" />} />
          <Route path="*" element={<Navigate to="agencies" replace />} />
        </Routes>
      </AgencyLayout>
    );
  }

  // Fallback for other roles (Corporate, Super Admin) until built
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-8 mt-20">
        <div className="w-full max-w-2xl bg-white p-12 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 text-center">
          <h1 className="text-4xl font-bold text-[#212b36] mb-4">{userType} Dashboard</h1>
          <p className="text-[#637381] text-lg">
            This dashboard layout is currently under construction.
          </p>
        </div>
      </main>
    </div>
  );
}
