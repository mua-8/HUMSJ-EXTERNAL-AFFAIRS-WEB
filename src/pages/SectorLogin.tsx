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

interface SectorLoginProps {
  sector: "super_admin" | "charity" | "academic" | "qirat" | "dawa";
}

const sectorConfig = {
  super_admin: {
    title: "Super Admin Portal",
    color: "from-[#1a8a85] to-[#29b6b0]",
    badge: "🔐 Super Admin Access",
    role: "super_admin" as UserRole,
    email: "humsjadmin@gmail.com",
    redirect: "/admin",
  },
  charity: {
    title: "Charity Sector Portal",
    color: "from-green-600 to-green-500",
    badge: "🟢 Charity Admin",
    role: "charity_amir" as UserRole,
    email: "humsjcharity@gmail.com",
    redirect: "/admin/charity",
  },
  academic: {
    title: "Academic Sector Portal",
    color: "from-blue-600 to-blue-500",
    badge: "🔵 Academic Admin",
    role: "academic_amir" as UserRole,
    email: "humsjacademic@gmail.com",
    redirect: "/admin/academic",
  },
  qirat: {
    title: "Qirat Sector Portal",
    color: "from-purple-600 to-purple-500",
    badge: "🟣 Qirat Admin",
    role: "qirat_amir" as UserRole,
    email: "humsjqirat@gmail.com",
    redirect: "/admin/qirat",
  },
  dawa: {
    title: "Dawa Sector Portal",
    color: "from-amber-600 to-amber-500",
    badge: "🟡 Dawa Admin",
    role: "dawa_amir" as UserRole,
    email: "humsjdawa@gmail.com",
    redirect: "/admin/dawa",
  },
};

const SectorLogin = ({ sector }: SectorLoginProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAdmin, role } = useAuth();
  const config = sectorConfig[sector];
  
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);

  // Redirect if already logged in with correct role
  useEffect(() => {
    const devAuth = localStorage.getItem("devAuth");
    if (devAuth) {
      const parsed = JSON.parse(devAuth);
      if (parsed.role === config.role || parsed.role === "super_admin") {
        navigate(config.redirect);
      }
    } else if (user && isAdmin) {
      if (role === config.role || role === "super_admin") {
        navigate(config.redirect);
      }
    }
  }, [user, isAdmin, role, navigate, config]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      setLoginAttempts(0);
      toast({ title: "Welcome!", description: `Logged in to ${config.title}` });
      navigate(config.redirect);
    } catch (error: any) {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);

      if (newAttempts >= 5) {
        setIsLocked(true);
        setLockTimer(60);
        toast({ title: "Account Locked", description: "Too many failed attempts. Wait 60 seconds.", variant: "destructive" });
      } else {
        toast({ title: "Login Failed", description: `Invalid credentials. ${5 - newAttempts} attempts remaining.`, variant: "destructive" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Dev login for testing
  const handleDevLogin = () => {
    localStorage.setItem("devAuth", JSON.stringify({ role: config.role, email: config.email }));
    toast({ title: "Dev Login", description: `Logged in as ${config.badge}` });
    navigate(config.redirect);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${config.color} flex items-center justify-center p-4`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Security Badge */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-white/20 backdrop-blur text-white px-4 py-1 rounded-full text-xs font-semibold flex items-center gap-2 shadow-lg">
            <Shield size={14} />
            {config.badge}
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className={`bg-gradient-to-r ${config.color} p-8 text-center`}>
            <img src={humjsLogo} alt="HUMSJ" className="h-16 w-auto mx-auto mb-4" />
            <h1 className="text-2xl font-serif font-bold text-white">{config.title}</h1>
            <p className="text-white/80 text-sm mt-2">Authorized personnel only</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder={config.email}
                    className="pl-10 h-12"
                    required
                    disabled={isLocked}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="••••••••"
                    className="pl-10 pr-10 h-12"
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

              {isLocked && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <p className="text-red-600 text-sm font-medium">Account temporarily locked</p>
                  <p className="text-red-500 text-xs mt-1">Try again in {lockTimer} seconds</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading || isLocked}
                className={`w-full h-12 bg-gradient-to-r ${config.color} hover:opacity-90 text-white font-semibold`}
              >
                {isLoading ? "Authenticating..." : isLocked ? `Locked (${lockTimer}s)` : (
                  <span className="flex items-center gap-2 justify-center">Sign In <ArrowRight size={18} /></span>
                )}
              </Button>
            </form>

            {/* Dev Login */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center mb-3">🔧 Development Mode</p>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleDevLogin}
              >
                Quick Dev Login
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-6">
              Unauthorized access is prohibited. All attempts are logged.
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <a href="/" className="text-white/80 hover:text-white text-sm">← Back to Website</a>
        </div>
      </div>
    </div>
  );
};

export default SectorLogin;
