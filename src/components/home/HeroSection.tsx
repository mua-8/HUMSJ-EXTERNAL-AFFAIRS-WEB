import { Link } from "react-router-dom";
import {
  Heart,
  BookOpen,
  GraduationCap,
  Copy,
  Check,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import humjsLogo from "@/assets/humjs-logo.png";

const HeroSection = () => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const mainSectors = [
    {
      icon: Heart,
      title: "Charity Sector",
      description:
        "Supporting elderly, orphans, and persons with disabilities through transparent aid distribution",
      link: "/charity-sector",
      stats: "80,000+ Birr distributed",
    },
    {
      icon: BookOpen,
      title: "Qirati Sector",
      description:
        "Nuraniya & Advanced Quran Memorization programs nurturing spiritual growth",
      link: "/qirat-sector",
      stats: "125+ active students",
    },
    {
      icon: GraduationCap,
      title: "Academy Sector",
      description:
        "Academic excellence programs, scholarships, and educational support initiatives",
      link: "/academic-sector",
      stats: "12+ Muhadara sessions",
    },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero-bg.png')" }}
      />
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/50" />

      <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
        {/* Hero Header */}
        <div className="text-center mb-12 md:mb-16">
          {/* Logo */}
          <div className="flex flex-col items-center gap-4 mb-8 animate-fade-in">
            <img
              src={humjsLogo}
              alt="HUMSJ Logo"
              className="h-24 md:h-28 w-auto"
            />
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2">
              <span className="text-white text-sm font-semibold tracking-wide">
                External Affairs Sector • Haramaya University
              </span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight mb-6 animate-fade-in-up">
            Empowering Lives Through
            <span className="block text-[#29b6b0]">Faith & Service</span>
          </h1>

          {/* Description */}
          <p className="text-gray-200 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-100">
            A student-led Islamic organization dedicated to Quranic education,
            community welfare, and supporting those in need.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center mt-8 animate-fade-in-up delay-200">
            <Link to="/charity-sector">
              <Button className="bg-[#d4af37] hover:bg-[#c9a22f] text-white font-semibold px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all">
                <Heart size={20} />
                Donate Now
              </Button>
            </Link>
            <Link to="/about">
              <Button
                variant="outline"
                className="border-2 border-[#29b6b0] text-[#29b6b0] hover:bg-[#29b6b0] hover:text-white font-semibold px-8 py-6 text-lg rounded-xl transition-all"
              >
                Learn More
                <ArrowRight size={20} />
              </Button>
            </Link>
          </div>
        </div>

        {/* Three Main Sector Cards - Unified Card Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-fade-in-up delay-300">
          {mainSectors.map((sector, index) => (
            <Link
              key={sector.title}
              to={sector.link}
              aria-label={`Learn more about ${sector.title}`}
              className="group relative bg-white/10 backdrop-blur-md rounded-xl overflow-hidden cursor-pointer
                       border border-white/20 shadow-lg
                       hover:shadow-xl hover:bg-white/20
                       transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${(index + 3) * 100}ms` }}
            >
              {/* Teal top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#29b6b0]" />

              {/* Card Content */}
              <div className="p-6">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-[#29b6b0]/20 flex items-center justify-center mb-4">
                  <sector.icon size={24} className="text-[#29b6b0]" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-serif font-bold text-white mb-2">
                  {sector.title}
                </h3>

                {/* Description */}
                <p className="text-gray-200 text-sm leading-relaxed mb-4">
                  {sector.description}
                </p>

                {/* Stats Badge & Arrow */}
                <div className="flex items-center justify-between">
                  <span className="text-[#29b6b0] text-xs font-medium bg-[#29b6b0]/20 px-3 py-1 rounded-full">
                    {sector.stats}
                  </span>
                  <ArrowRight
                    size={16}
                    className="text-gray-400 group-hover:text-[#29b6b0] group-hover:translate-x-1 transition-all"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Donation Quick Access */}
        <div className="max-w-2xl mx-auto animate-fade-in-up delay-400">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 md:p-8">
            <h3 className="text-xl font-serif font-bold text-white text-center mb-6">
              Quick Donation Access
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* CBE */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <p className="text-gray-300 text-xs uppercase tracking-wide mb-1">
                  Commercial Bank of Ethiopia
                </p>
                <p className="text-white text-sm font-medium mb-2">
                  HUMSJ Charity Sector
                </p>
                <div className="flex items-center justify-between bg-black/20 rounded-lg px-3 py-2">
                  <code className="text-[#29b6b0] text-sm font-mono font-semibold">
                    1000614307599
                  </code>
                  <button
                    onClick={() => copyToClipboard("1000614307599", "cbe")}
                    className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
                  >
                    {copiedField === "cbe" ? (
                      <Check size={16} className="text-green-400" />
                    ) : (
                      <Copy size={16} className="text-gray-300" />
                    )}
                  </button>
                </div>
              </div>

              {/* E-Birr */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <p className="text-gray-300 text-xs uppercase tracking-wide mb-1">
                  E-Birr Mobile Money
                </p>
                <p className="text-white text-sm font-medium mb-2">
                  HUMSJ Charity Sector
                </p>
                <div className="flex items-center justify-between bg-black/20 rounded-lg px-3 py-2">
                  <code className="text-[#29b6b0] text-sm font-mono font-semibold">
                    +251 985 736 451
                  </code>
                  <button
                    onClick={() => copyToClipboard("+251985736451", "ebirr")}
                    className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
                  >
                    {copiedField === "ebirr" ? (
                      <Check size={16} className="text-green-400" />
                    ) : (
                      <Copy size={16} className="text-gray-300" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
