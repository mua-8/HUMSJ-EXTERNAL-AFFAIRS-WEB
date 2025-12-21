import { Link } from "react-router-dom";
import {
  BookOpen,
  Users,
  Calendar,
  DollarSign,
  ArrowLeft,
  Sparkles,
  GraduationCap,
  Mic,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RegistrationModal, { RegistrationType } from "@/components/external-affairs/RegistrationModal";
import { useState } from "react";
import StatCard from "@/components/external-affairs/StatCard";
import ProgramCard from "@/components/external-affairs/ProgramCard";
import EventGallery from "@/components/ui/EventGallery";

// Qirat event images - add more images to public/images/events/qirat/
const qiratEventImages = [
  { src: "/images/events/qirat/qiraty.jpg", alt: "Qirat recitation session" },
  { src: "/images/events/qirat/qiraty1.jpg", alt: "Quran memorization class" },
  { src: "/images/events/qirat/charity5.jpg", alt: "Qirat program activity" },
];

const studentStats = [
  { icon: BookOpen, value: 55, label: "Nuraniya Students", subLabel: "Foundational Program", variant: "teal" as const },
  { icon: GraduationCap, value: 70, label: "Advanced Students", subLabel: "Memorization & Recitation", variant: "teal" as const },
  { icon: Users, value: 125, label: "Total Students", subLabel: "Currently Enrolled", variant: "teal" as const },
];

const QiratSector = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<RegistrationType>("student");

  const openModal = (type: RegistrationType) => {
    setModalType(type);
    setIsModalOpen(true);
  };
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[40vh] flex items-center overflow-hidden bg-[#f0fafa]">
        {/* Subtle pattern - #29b6b0 (Faith & Service color) */}
        <div className="absolute inset-0 pattern-squares-teal" />
        {/* Decorative corner squares - 10-20% opacity */}
        <div className="absolute top-16 left-16 w-14 h-14 rounded-xl bg-[#29b6b0]/[0.15] rotate-6" />
        <div className="absolute top-12 right-20 w-10 h-10 rounded-lg bg-[#29b6b0]/[0.10] -rotate-12" />
        <div className="absolute bottom-16 right-12 w-12 h-12 rounded-xl bg-[#29b6b0]/[0.12] rotate-45" />

        <div className="container mx-auto px-4 py-20 relative z-10">
          <Link
            to="/external-affairs"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-[#29b6b0] transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            Back to External Affairs
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-[#29b6b0] flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1f2937]">
                Qirat Sub-Sector
              </h1>
              <p className="text-gray-500">Social Affairs Sector - HUMSJ</p>
            </div>
          </div>

          <p className="text-lg text-gray-600 max-w-3xl">
            Focuses on educating Quran and 'Dini' (religious education) to the society's children.
            Currently serving 125 students: 55 in the foundational Nuraniya Program and 70 in the
            Advanced Quran Memorization/Recitation Program.
          </p>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto border-l-4 border-l-[#29b6b0]">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#29b6b0] to-[#239e99] flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Head of Qirat Sub-Sector</p>
                  <p className="text-xl font-serif font-bold text-gray-800">Mohammed Ahmed</p>
                  <p className="text-sm text-[#29b6b0] font-medium">3rd Year Computer Science Student</p>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">📞 +251 91 XXX XXXX</span>
                    <span className="flex items-center gap-1">✉️ qirat@humsj.org</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Program Overview Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-4">
              <Sparkles size={16} />
              <span className="text-sm font-medium">Program Overview</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Student Enrollment
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The Qirat Sector currently serves 125 dedicated students across two main programs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {studentStats.map((stat, index) => (
              <StatCard
                key={stat.label}
                icon={stat.icon}
                value={stat.value}
                label={stat.label}
                subLabel={stat.subLabel}
                variant={stat.variant}
                delay={index * 100}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Muhadara Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#29b6b0]/10 border border-[#29b6b0]/20 text-[#29b6b0] mb-4">
              <Mic size={16} />
              <span className="text-sm font-medium">Inspirational Gatherings</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Muhadara Programs
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Regular gatherings that inspire, educate, and unite our students through Islamic teachings.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <ProgramCard
              icon={BookOpen}
              title="Nuraniya Program"
              description="Foundational Quran Reading"
              stats={[
                { label: "Gatherings per Year", value: 4 },
                { label: "Cost per Gathering", value: "12,000 Birr" },
              ]}
              totalCost="48,000 Birr"
              variant="teal"
              delay={0}
            />

            <ProgramCard
              icon={GraduationCap}
              title="Quran Program"
              description="Advanced Memorization & Recitation"
              stats={[
                { label: "Gatherings per Year", value: 8 },
                { label: "Cost per Gathering", value: "2,500 Birr" },
              ]}
              totalCost="20,000 Birr"
              variant="teal"
              delay={150}
            />
          </div>

          {/* Total Budget */}
          <div className="max-w-md mx-auto mt-12">
            <Card variant="gradient" className="text-center animate-fade-in-up delay-300">
              <CardHeader>
                <div className="w-14 h-14 mx-auto mb-2 rounded-2xl bg-primary/20 flex items-center justify-center">
                  <DollarSign className="w-7 h-7 text-primary" />
                </div>
                <CardTitle>Total Required Budget</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-serif font-bold text-gradient mb-2">68,000 Birr</p>
                <p className="text-muted-foreground">Annual Muhadara Programs</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Program Details */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-8 text-center">
              Program Details
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <Card variant="elevated" className="animate-fade-in-up">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <BookOpen size={20} className="text-primary" />
                    </div>
                    <CardTitle>Nuraniya Program</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    The foundational program teaches students the basics of Quranic reading,
                    including proper pronunciation (Tajweed) and Arabic letter recognition.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Basic Arabic alphabet mastery
                    </li>
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Introduction to Tajweed rules
                    </li>
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Beginning Quran recitation
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card variant="elevated" className="animate-fade-in-up delay-100">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#29b6b0]/10 flex items-center justify-center">
                      <GraduationCap size={20} className="text-[#29b6b0]" />
                    </div>
                    <CardTitle>Advanced Program</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    For students who have mastered the basics, this program focuses on
                    Quran memorization (Hifz) and advanced recitation techniques.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#29b6b0]" />
                      Quran memorization (Hifz)
                    </li>
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#29b6b0]" />
                      Advanced Tajweed application
                    </li>
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#29b6b0]" />
                      Beautiful recitation (Tarteel)
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Event Gallery Section */}
      <EventGallery
        title="Our Activities"
        subtitle="Highlights from our Quranic education programs and recitation sessions"
        images={qiratEventImages}
        accentColor="#29b6b0"
      />

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-teal-light/10 to-accent/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            Support Quranic Education
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Help us expand our Qirat programs and reach more students eager to learn the Quran.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="hero" size="lg" onClick={() => openModal("donor")}>
              <Calendar size={20} />
              Donate to Programs
            </Button>
            <Button variant="outline" size="lg" onClick={() => openModal("teacher")}>
              Join as Teacher
            </Button>
          </div>
        </div>
      </section>

      <RegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={modalType}
        sector="qirat"
      />
    </Layout >
  );
};

export default QiratSector;
