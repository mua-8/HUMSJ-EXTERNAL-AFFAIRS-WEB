import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, ArrowRight, Shield, Eye, EyeOff } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import humjsLogo from "@/assets/humjs-logo.png";

// Get dashboard path based on role
const getDashboardByRole = (role: UserRole): string => {
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

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAdmin, role } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);

  // Redirect if already logged in - to their specific dashboard
  useEffect(() => {
    if (user && isAdmin) {
      const dashboardPath = getDashboardByRole(role);
      navigate(dashboardPath);
    }
  }, [user, isAdmin, role, navigate]);

  // Lock timer countdown
  useEffect(() => {
    if (lockTimer > 0) {
      const timer = setTimeout(() => setLockTimer(lockTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (lockTimer === 0 && isLocked) {
      setIsLocked(false);
      setLoginAttempts(0);
    }
  }, [lockTimer, isLocked]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLocked) {
      toast({
        title: "Account Locked",
        description: `Too many failed attempts. Try again in ${lockTimer} seconds.`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      
      // Reset attempts on success
      setLoginAttempts(0);

      // Get role from email to determine redirect
      const email = userCredential.user.email?.toLowerCase() || "";
      let dashboardPath = "/";
      let roleName = "User";
      
      if (email === "humsjadmin@gmail.com" || email === "admin@humsj.org" || email === "superadmin@humsj.org") {
        dashboardPath = "/admin";
        roleName = "Super Admin";
      } else if (email === "humsjcharity@gmail.com" || email === "charity@humsj.org") {
        dashboardPath = "/admin/charity";
        roleName = "Charity Admin";
      } else if (email === "humsjacademic@gmail.com" || email === "academic@humsj.org") {
        dashboardPath = "/admin/academic";
        roleName = "Academic Admin";
      } else if (email === "humsjqirat@gmail.com" || email === "qirat@humsj.org") {
        dashboardPath = "/admin/qirat";
        roleName = "Qirat & Dawa Admin";
      }

      toast({
        title: `Welcome, ${roleName}!`,
        description: "You have been logged in successfully.",
      });
      navigate(dashboardPath);
    } catch (error: unknown) {
      console.error("Login error:", error);

      // Increment failed attempts
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);

      // Lock after 5 failed attempts
      if (newAttempts >= 5) {
        setIsLocked(true);
        setLockTimer(60); // 60 second lockout
        toast({
          title: "Account Locked",
          description: "Too many failed attempts. Please wait 60 seconds.",
          variant: "destructive",
        });
      } else {
        let errorMessage = "Invalid credentials. Please try again.";

        if (error && typeof error === "object" && "code" in error) {
          const firebaseError = error as { code: string };
          switch (firebaseError.code) {
            case "auth/user-not-found":
            case "auth/wrong-password":
            case "auth/invalid-credential":
              errorMessage = `Invalid email or password. ${5 - newAttempts} attempts remaining.`;
              break;
            case "auth/invalid-email":
              errorMessage = "Invalid email address format.";
              break;
            case "auth/user-disabled":
              errorMessage = "This account has been disabled.";
              break;
            case "auth/too-many-requests":
              errorMessage = "Too many requests. Please try again later.";
              setIsLocked(true);
              setLockTimer(300);
              break;
          }
        }

        toast({
          title: "Login Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a8a85] via-[#239e99] to-[#29b6b0] flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Security Badge */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-[#d4af37] text-white px-4 py-1 rounded-full text-xs font-semibold flex items-center gap-2 shadow-lg">
            <Shield size={14} />
            Secure Admin Access
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1a8a85] to-[#29b6b0] p-8 text-center">
            <img
              src={humjsLogo}
              alt="HUMSJ Logo"
              className="h-16 w-auto mx-auto mb-4"
            />
            <h1 className="text-2xl font-serif font-bold text-white">
              Admin Portal
            </h1>
            <p className="text-white/80 text-sm mt-2">
              Authorized personnel only
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Admin Email
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin@humsj.org"
                    className="pl-10 h-12 border-gray-200 focus:border-[#29b6b0] focus:ring-[#29b6b0]"
                    required
                    disabled={isLocked}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="pl-10 pr-10 h-12 border-gray-200 focus:border-[#29b6b0] focus:ring-[#29b6b0]"
                    required
                    disabled={isLocked}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Lock Warning */}
              {isLocked && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <p className="text-red-600 text-sm font-medium">
                    Account temporarily locked
                  </p>
                  <p className="text-red-500 text-xs mt-1">
                    Try again in {lockTimer} seconds
                  </p>
                </div>
              )}

              {/* Attempts Warning */}
              {loginAttempts > 0 && loginAttempts < 5 && !isLocked && (
                <p className="text-amber-600 text-xs text-center">
                  {5 - loginAttempts} login attempts remaining before lockout
                </p>
              )}

              <Button
                type="submit"
                disabled={isLoading || isLocked}
                className="w-full h-12 bg-[#29b6b0] hover:bg-[#239e99] text-white font-semibold rounded-lg transition-all"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Authenticating...
                  </span>
                ) : isLocked ? (
                  `Locked (${lockTimer}s)`
                ) : (
                  <span className="flex items-center gap-2">
                    Sign In
                    <ArrowRight size={18} />
                  </span>
                )}
              </Button>
            </form>

            {/* Security Notice */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                This is a secure admin area. All login attempts are monitored and logged.
                Unauthorized access is prohibited.
              </p>
            </div>
          </div>
        </div>

        {/* Back to Site */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-white/80 hover:text-white text-sm transition-colors"
          >
            ← Back to Website
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
