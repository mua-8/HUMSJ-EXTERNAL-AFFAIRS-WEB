import { Link } from "react-router-dom";
import {
  GraduationCap,
  BookOpen,
  Users,
  Lightbulb,
  ArrowLeft,
  Clock,
  Target,
  Rocket,
  Library,
  PenTool,
  Award,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import EventGallery from "@/components/ui/EventGallery";

// Academy event images - add more images to public/images/events/academy/
const academyEventImages = [
  { src: "/images/events/academy/acadamy.jpg", alt: "Academy workshop session" },
];

const upcomingPrograms = [
  {
    icon: BookOpen,
    title: "Academic Tutorials",
    description: "Peer-to-peer tutoring sessions covering core university subjects to help struggling students excel.",
    status: "Planning",
  },
  {
    icon: PenTool,
    title: "Study Skills Workshop",
    description: "Training on effective study techniques, time management, and exam preparation strategies.",
    status: "Planning",
  },
  {
    icon: Library,
    title: "Learning Resource Center",
    description: "A dedicated space with study materials, past exams, and reference books for student use.",
    status: "Proposed",
  },
  {
    icon: Award,
    title: "Academic Excellence Awards",
    description: "Recognition program for outstanding academic achievement among HUMSJ members.",
    status: "Proposed",
  },
];

const goals = [
  {
    icon: Target,
    title: "Improve GPA",
    description: "Help students achieve better academic results through structured support.",
  },
  {
    icon: Users,
    title: "Peer Mentorship",
    description: "Connect high-performing students with those who need academic guidance.",
  },
  {
    icon: Lightbulb,
    title: "Skill Development",
    description: "Enhance critical thinking, research, and presentation skills.",
  },
  {
    icon: Rocket,
    title: "Career Readiness",
    description: "Prepare students for professional success after graduation.",
  },
];

const AcademicSector = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[40vh] flex items-center overflow-hidden bg-[#f0fafa]">
        {/* Subtle pattern - #29b6b0 (Faith & Service color) */}
        <div className="absolute inset-0 pattern-squares-teal" />
        {/* Decorative corner squares - 10-20% opacity */}
        <div className="absolute top-16 left-16 w-14 h-14 rounded-xl bg-[#29b6b0]/[0.15] rotate-12" />
        <div className="absolute top-12 right-20 w-10 h-10 rounded-lg bg-[#29b6b0]/[0.10] -rotate-6" />
        <div className="absolute bottom-16 right-16 w-12 h-12 rounded-xl bg-[#29b6b0]/[0.12] rotate-6" />

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
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1f2937]">
                  Academic Sector
                </h1>
                <Badge className="bg-[#29b6b0]/20 text-[#29b6b0] border-[#29b6b0]/30">
                  <Clock size={12} className="mr-1" />
                  Coming Soon
                </Badge>
              </div>
              <p className="text-gray-500">External Affairs Division</p>
            </div>
          </div>

          <p className="text-lg text-gray-600 max-w-3xl">
            Empowering students through academic support, tutorials, training programs, 
            and learning resources to achieve excellence in their studies.
          </p>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#29b6b0]/10 border border-[#29b6b0]/20 text-[#29b6b0] mb-6">
              <Lightbulb size={16} />
              <span className="text-sm font-medium">Our Vision</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
              Building Academic Excellence
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              The Academic Sector aims to create a supportive environment where every HUMSJ member 
              can achieve their full academic potential. We believe that education is a cornerstone 
              of personal and community development, and we are committed to providing the resources 
              and support needed for student success.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {goals.map((goal, index) => (
                <Card
                  key={goal.title}
                  variant="glass"
                  className="text-center animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[#29b6b0]/10 flex items-center justify-center">
                      <goal.icon size={24} className="text-[#29b6b0]" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{goal.title}</h3>
                    <p className="text-xs text-muted-foreground">{goal.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Programs Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-4">
              <Rocket size={16} />
              <span className="text-sm font-medium">Future Initiatives</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Upcoming Programs
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We are actively developing these programs to launch in the coming academic year.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {upcomingPrograms.map((program, index) => (
              <Card
                key={program.title}
                variant="elevated"
                className="animate-fade-in-up border-l-4 border-l-[#29b6b0]/50"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#29b6b0]/10 flex items-center justify-center">
                        <program.icon size={20} className="text-[#29b6b0]" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{program.title}</CardTitle>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {program.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {program.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Get Involved Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
                Get Involved
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We are looking for volunteers, tutors, and supporters to help build the Academic Sector.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card variant="interactive" className="text-center animate-fade-in-up">
                <CardContent className="pt-6">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Users size={28} className="text-primary" />
                  </div>
                  <h3 className="font-serif font-semibold text-foreground mb-2">Become a Tutor</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Share your knowledge and help fellow students succeed academically.
                  </p>
                </CardContent>
              </Card>

              <Card variant="interactive" className="text-center animate-fade-in-up delay-100">
                <CardContent className="pt-6">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#29b6b0]/10 flex items-center justify-center">
                    <Lightbulb size={28} className="text-[#29b6b0]" />
                  </div>
                  <h3 className="font-serif font-semibold text-foreground mb-2">Suggest Programs</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Have ideas for academic support initiatives? We want to hear from you.
                  </p>
                </CardContent>
              </Card>

              <Card variant="interactive" className="text-center animate-fade-in-up delay-200">
                <CardContent className="pt-6">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#29b6b0]/10 flex items-center justify-center">
                    <Award size={28} className="text-[#29b6b0]" />
                  </div>
                  <h3 className="font-serif font-semibold text-foreground mb-2">Donate Resources</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Contribute books, study materials, or funds to support our programs.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-12">
              <Link to="/contact">
                <Button variant="hero" size="lg">
                  <GraduationCap size={20} />
                  Contact Us to Get Involved
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Event Gallery Section */}
      <EventGallery
        title="Our Activities"
        subtitle="Highlights from our academic programs, workshops, and study sessions"
        images={academyEventImages}
        accentColor="#29b6b0"
      />
    </Layout>
  );
};

export default AcademicSector;
