import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Public Pages
import Index from "./pages/Index";
import About from "./pages/About";
import Events from "./pages/Events";
import Contact from "./pages/Contact";
import SubmitEvent from "./pages/SubmitEvent";
import ExternalAffairs from "./pages/ExternalAffairs";
import CharitySector from "./pages/CharitySector";
import QiratSector from "./pages/QiratSector";
import AcademicSector from "./pages/AcademicSector";
import DawaSector from "./pages/DawaSector";
import Donate from "./pages/Donate";
import StudentSadaqah from "./pages/StudentSadaqah";
import NotFound from "./pages/NotFound";

// Admin Pages (Secret)
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";
import CharityDashboard from "./pages/admin/CharityDashboard";
import AcademicDashboard from "./pages/admin/AcademicDashboard";
import QiratDashboard from "./pages/admin/QiratDashboard";
import SuperAdminDashboard from "./pages/admin/SuperAdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/external-affairs" element={<ExternalAffairs />} />
            <Route path="/external-affairs/charity" element={<CharitySector />} />
            <Route path="/external-affairs/qirat" element={<QiratSector />} />
            <Route path="/external-affairs/academic" element={<AcademicSector />} />
            <Route path="/external-affairs/dawa" element={<DawaSector />} />
            <Route path="/charity-sector" element={<CharitySector />} />
            <Route path="/qirat-sector" element={<QiratSector />} />
            <Route path="/academic-sector" element={<AcademicSector />} />
            <Route path="/events" element={<Events />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/student-sadaqah" element={<StudentSadaqah />} />
            <Route path="/submit-event" element={<SubmitEvent />} />

            {/* Single Secret Admin Login URL - All admins use this */}
            <Route path="/humsj-admin-portal" element={<AdminLogin />} />

            {/* Protected Admin Dashboard - Super Admin Only */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["super_admin"]}>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Old Events Dashboard */}
            <Route
              path="/admin/events"
              element={
                <ProtectedRoute allowedRoles={["super_admin"]}>
                  <Admin />
                </ProtectedRoute>
              }
            />

            {/* Sector Dashboards - Role Restricted */}
            <Route
              path="/admin/charity"
              element={
                <ProtectedRoute allowedRoles={["super_admin", "charity_amir"]}>
                  <CharityDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/academic"
              element={
                <ProtectedRoute allowedRoles={["super_admin", "academic_amir"]}>
                  <AcademicDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/qirat"
              element={
                <ProtectedRoute allowedRoles={["super_admin", "qirat_amir"]}>
                  <QiratDashboard />
                </ProtectedRoute>
              }
            />

            {/* 404 - Also catches unauthorized access attempts */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
