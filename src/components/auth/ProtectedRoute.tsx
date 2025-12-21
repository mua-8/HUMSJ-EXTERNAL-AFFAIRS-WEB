import { Navigate, useLocation } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

// Role-based route access mapping
const getDefaultRouteForRole = (role: UserRole): string => {
  switch (role) {
    case "super_admin":
      return "/admin";
    case "charity_amir":
      return "/admin/charity";
    case "academic_amir":
      return "/admin/academic";
    case "qirat_amir":
      return "/admin/qirat";
    default:
      return "/";
  }
};

// Check for development auth bypass
const getDevAuth = (): { role: UserRole; email: string } | null => {
  try {
    const devAuth = localStorage.getItem("devAuth");
    if (devAuth) {
      return JSON.parse(devAuth);
    }
  } catch {
    // Ignore parsing errors
  }
  return null;
};

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, loading, isAdmin, role } = useAuth();
  const location = useLocation();

  // Check for dev auth bypass
  const devAuth = getDevAuth();

  if (loading && !devAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#1a9e98] mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Allow access if dev auth is set (for development testing)
  if (devAuth) {
    // Check role-based access if allowedRoles is specified
    if (allowedRoles && allowedRoles.length > 0) {
      if (devAuth.role !== "super_admin" && !allowedRoles.includes(devAuth.role)) {
        const defaultRoute = getDefaultRouteForRole(devAuth.role);
        return <Navigate to={defaultRoute} replace />;
      }
    }
    return <>{children}</>;
  }

  // Not authenticated or not an admin
  if (!user || !isAdmin) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Check role-based access if allowedRoles is specified
  if (allowedRoles && allowedRoles.length > 0) {
    // Super admin can access everything
    if (role !== "super_admin" && !allowedRoles.includes(role)) {
      // Redirect to their appropriate dashboard
      const defaultRoute = getDefaultRouteForRole(role);
      return <Navigate to={defaultRoute} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
