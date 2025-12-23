import { useState } from "react";
import { Menu, X, LogOut, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import humjsLogo from "@/assets/humjs-logo.png";

interface NavItem {
  icon: React.ElementType;
  label: string;
  section: string;
}

interface MobileNavProps {
  title: string;
  navItems: NavItem[];
  activeSection: string;
  onSectionChange: (section: string) => void;
  onSignOut: () => void;
  userEmail?: string;
}

const MobileNav = ({
  title,
  navItems,
  activeSection,
  onSectionChange,
  onSignOut,
  userEmail,
}: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (section: string) => {
    onSectionChange(section);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#25A7A1] to-[#1F8B86] px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <img src={humjsLogo} alt="HUMSJ" className="h-8 w-auto" />
          <span className="font-serif font-bold text-white text-sm">{title}</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`lg:hidden fixed top-0 right-0 h-full w-72 bg-gradient-to-b from-[#25A7A1] to-[#1F8B86] z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6">
          {/* Close button */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-white hover:bg-white/10 rounded-lg"
            >
              <X size={24} />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.section}
                onClick={() => handleNavClick(item.section)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeSection === item.section
                    ? "bg-white/20 text-white shadow-lg"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="absolute bottom-6 left-6 right-6 space-y-3">
            {userEmail && (
              <p className="text-xs text-white/50 truncate">{userEmail}</p>
            )}
            <Link to="/" onClick={() => setIsOpen(false)}>
              <Button
                variant="outline"
                className="w-full border-white/20 text-white bg-transparent hover:bg-white/10 mb-2"
              >
                <Home size={16} className="mr-2" />
                Back to Site
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full border-white/20 text-white bg-transparent hover:bg-white/10"
              onClick={() => {
                onSignOut();
                setIsOpen(false);
              }}
            >
              <LogOut size={16} className="mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div className="lg:hidden h-14" />
    </>
  );
};

export default MobileNav;
