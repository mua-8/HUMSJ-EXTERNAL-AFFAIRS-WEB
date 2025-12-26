import { Link } from "react-router-dom";
import {
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import humjsLogo from "@/assets/humjs-logo.png";

const Footer = () => {
  return (
    <footer className="bg-[#1f2933]">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img
                src={humjsLogo}
                alt="HUMSJ Logo"
                className="h-12 w-auto"
              />
              <div>
                <h3 className="font-serif font-semibold text-white">HUMSJ</h3>
                <p className="text-xs text-white/80">Muslim Students Jema'a</p>
              </div>
            </Link>
            <p className="text-sm text-white/80 leading-relaxed">
              Empowering Muslim students at Haramaya University through faith,
              education, and community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-semibold text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { name: "Home", path: "/" },
                { name: "About Us", path: "/about" },
                { name: "Events", path: "/events" },
                { name: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-white/80 hover:text-white transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-serif font-semibold text-white mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm">
                <MapPin size={18} className="text-[#25A7A1] mt-0.5 flex-shrink-0" />
                <span className="text-white">Haramaya University, Dire Dawa, Ethiopia</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail size={18} className="text-[#25A7A1] flex-shrink-0" />
                <a
                  href="mailto:info@humsj.org"
                  className="text-white hover:text-[#25A7A1] transition-colors"
                >
                  info@humsj.org
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone size={18} className="text-[#25A7A1] flex-shrink-0" />
                <span className="text-white">+251 123 456 789</span>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-serif font-semibold text-white mb-4">
              Follow Us
            </h4>
            <div className="flex gap-3">
              {/* Facebook */}
              <a
                href="https://web.facebook.com/profile.php?id=61574585026088"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-[#25A7A1] transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              {/* Telegram */}
              <a
                href="https://t.me/humsjofficialchannel"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-[#25A7A1] transition-all duration-300"
              >
                <Send size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/80 text-center sm:text-left">
            © {new Date().getFullYear()} Haramaya University Muslim Students
            Jema'a. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-white/80">
            <Link
              to="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
