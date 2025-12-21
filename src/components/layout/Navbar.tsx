import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import humjsLogo from "@/assets/humjs-logo.png";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "External Affairs", path: "/external-affairs" },
  { name: "Events", path: "/events" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out.",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#29b6b0] border-b border-[#239e99] shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={humjsLogo}
              alt="HUMSJ Logo"
              className="h-10 md:h-12 w-auto transition-transform duration-300 group-hover:scale-105"
            />
            <span className="hidden sm:block font-serif text-lg font-semibold text-white">
              HUMSJ
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  location.pathname === link.path
                    ? "text-white bg-white/20"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons - Only show for logged in admins */}
          <div className="hidden md:flex items-center gap-3">
            {user && isAdmin && (
              <>
                <Link to="/admin">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:text-white hover:bg-white/10"
                  >
                    <LayoutDashboard size={16} className="mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-white hover:text-white hover:bg-white/10"
                >
                  <LogOut size={16} className="mr-2" />
                  Sign Out
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-white"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-white/20 animate-fade-in bg-[#29b6b0]">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    location.pathname === link.path
                      ? "text-white bg-white/20"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/20">
                {user && isAdmin && (
                  <>
                    <Link to="/admin" onClick={() => setIsOpen(false)}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-white hover:bg-white/10"
                      >
                        <LayoutDashboard size={16} className="mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        handleSignOut();
                        setIsOpen(false);
                      }}
                      className="w-full justify-start text-white hover:bg-white/10"
                    >
                      <LogOut size={16} className="mr-2" />
                      Sign Out
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
