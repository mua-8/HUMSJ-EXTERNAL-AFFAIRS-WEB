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
import Donate from "./pages/Donate";
import StudentSadaqah from "./pages/StudentSadaqah";
import NotFound from "./pages/NotFound";

// Admin Pages (Secret)
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";
import CharityDashboard from "./pages/admin/CharityDashboard";
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
            <Route path="/charity-sector" element={<CharitySector />} />
            <Route path="/qirat-sector" element={<QiratSector />} />
            <Route path="/academic-sector" element={<AcademicSector />} />
            <Route path="/events" element={<Events />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/student-sadaqah" element={<StudentSadaqah />} />
            <Route path="/submit-event" element={<SubmitEvent />} />
            
            {/* Secret Admin Login - Not linked anywhere on the site */}
            <Route path="/humsj-admin-portal" element={<AdminLogin />} />
            
            {/* Protected Admin Dashboard - Super Admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Old Events Dashboard */}
            <Route
              path="/admin/events"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
            
            {/* Sector Dashboards */}
            <Route
              path="/admin/charity"
              element={
                <ProtectedRoute>
                  <CharityDashboard />
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
