import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import IntroPage from "@/components/IntroPage";
import Homepage from "./pages/Homepage";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import ReportIssue from "./pages/ReportIssue";
import CitizenDashboard from "./pages/CitizenDashboard";
import ReportDetail from "./pages/ReportDetail";
import DistrictReports from "./pages/DistrictReports";
import Help from "./pages/Help";
import Settings from "./pages/Settings";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminIssues from "./pages/admin/AdminIssues";
import AdminIssueDetail from "./pages/admin/AdminIssueDetail";
import AdminAssign from "./pages/admin/AdminAssign";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="civic-ui-theme">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/help" element={<Layout><Help /></Layout>} />
                
                <Route path="/report" element={
                  <ProtectedRoute>
                    <ReportIssue />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <CitizenDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                <Route path="/report/:id" element={
                  <ProtectedRoute>
                    <Layout><ReportDetail /></Layout>
                  </ProtectedRoute>
                } />
                <Route path="/district-reports" element={
                  <ProtectedRoute>
                    <DistrictReports />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } />
                
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<Layout type="admin"><AdminDashboard /></Layout>} />
                <Route path="/admin/issues" element={<Layout type="admin"><AdminIssues /></Layout>} />
                <Route path="/admin/issues/:id" element={<Layout type="admin"><AdminIssueDetail /></Layout>} />
                <Route path="/admin/assign" element={<Layout type="admin"><AdminAssign /></Layout>} />
                <Route path="/admin/analytics" element={<Layout type="admin"><AdminAnalytics /></Layout>} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;