import { Link } from "react-router-dom";
import {
  Heart,
  Users,
  Baby,
  GraduationCap,
  Accessibility,
  Utensils,
  Gift,
  Shirt,
  ArrowLeft,
  TrendingUp,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DonationInfo from "@/components/external-affairs/DonationInfo";
import StatCard from "@/components/external-affairs/StatCard";
import ProgramCard from "@/components/external-affairs/ProgramCard";
import EventGallery from "@/components/ui/EventGallery";

// Charity event images - add more images to public/images/events/charity/
const charityEventImages = [
  { src: "/images/events/charity/charity.jpg", alt: "Charity distribution event" },
  { src: "/images/events/charity/charity1.jpg", alt: "Community aid program" },
  { src: "/images/events/charity/charity6.jpg", alt: "Charity outreach activity" },
  { src: "/images/events/charity/charity7.jpg", alt: "Aid distribution to families" },
  { src: "/images/events/charity/charity8.jpg", alt: "Charity support program" },
  { src: "/images/events/charity/charity9.jpg", alt: "Community welfare event" },
];

const beneficiaryStats = [
  { icon: Users, value: 8, label: "Elderly Individuals", variant: "teal" as const },
  { icon: Baby, value: 22, label: "Orphan-Household Families", variant: "teal" as const },
  { icon: GraduationCap, value: 15, label: "Needy Students", variant: "teal" as const },
  { icon: Accessibility, value: 5, label: "Students with Disabilities", variant: "teal" as const },
];

const CharitySector = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[40vh] flex items-center overflow-hidden bg-[#f0fafa]">
        {/* Subtle pattern - #29b6b0 (Faith & Service color) */}
        <div className="absolute inset-0 pattern-squares-teal" />
        {/* Decorative corner squares - 10-20% opacity */}
        <div className="absolute top-16 left-12 w-16 h-16 rounded-xl bg-[#29b6b0]/[0.15] rotate-12" />
        <div className="absolute top-20 right-20 w-12 h-12 rounded-lg bg-[#29b6b0]/[0.10] -rotate-6" />
        <div className="absolute bottom-16 right-16 w-14 h-14 rounded-xl bg-[#29b6b0]/[0.12] rotate-6" />

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
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1f2937]">
                Charity Sector
              </h1>
              <p className="text-gray-500">External Affairs Division</p>
            </div>
          </div>

          <p className="text-lg text-gray-600 max-w-3xl">
            Dedicated to supporting those in need through meal sponsorships, Eid gift programs, 
            and continuous aid distribution to orphans, elderly, and students requiring assistance.
          </p>
        </div>
      </section>

      {/* Donation Info Section */}
      <DonationInfo />

      {/* Beneficiaries Section */}
      <section className="py-16 bg-transparent">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-4">
              <Users size={16} />
              <span className="text-sm font-medium">Aid Distribution Summary</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Beneficiaries Supported
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our charity programs reach various groups in need within our community.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {beneficiaryStats.map((stat, index) => (
              <StatCard
                key={stat.label}
                icon={stat.icon}
                value={stat.value}
                label={stat.label}
                variant={stat.variant}
                delay={index * 100}
              />
            ))}
          </div>

          {/* Meal Sponsorship Budget */}
          <div className="max-w-2xl mx-auto mt-12">
            <Card variant="gradient" className="animate-fade-in-up delay-300">
              <CardHeader className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#29b6b0]/20 flex items-center justify-center">
                  <Utensils className="w-7 h-7 text-[#29b6b0]" />
                </div>
                <CardTitle>Meal Sponsorship Program</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <p className="text-sm text-muted-foreground mb-1">Estimated Budget</p>
                    <p className="text-2xl font-serif font-bold text-foreground">76,000 Birr</p>
                  </div>
                  <div className="p-4 rounded-xl bg-primary/10">
                    <p className="text-sm text-muted-foreground mb-1">Actual Expenditure</p>
                    <div className="flex items-center justify-center gap-2">
                      <p className="text-2xl font-serif font-bold text-primary">80,000 Birr</p>
                      <TrendingUp size={18} className="text-primary" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Eid Programs Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#29b6b0]/10 border border-[#29b6b0]/20 text-[#29b6b0] mb-4">
              <Gift size={16} />
              <span className="text-sm font-medium">Annual Programs</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Eid Gift Programs
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Celebrating Islamic holidays by bringing joy to those in need through clothing and gift distributions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <ProgramCard
              icon={Shirt}
              title="Eid al-Fitr (2017 E.C.)"
              description="Clothing Distribution Program"
              stats={[
                { label: "Clothing Kits Distributed", value: 86 },
                { label: "Individuals Served", value: 86 },
              ]}
              totalCost="100,000 Birr"
              variant="teal"
              delay={0}
            />

            <ProgramCard
              icon={Gift}
              title="Eid al-Adha"
              description="Comprehensive Gift Program"
              stats={[
                { label: "Clothing Sets Distributed", value: 160 },
                { label: "Individuals Served", value: 160 },
              ]}
              totalCost="200,000 Birr"
              variant="teal"
              delay={150}
            />
          </div>

          {/* Total Impact */}
          <div className="max-w-md mx-auto mt-12">
            <Card variant="elevated" className="text-center animate-fade-in-up delay-300">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-2">Total Annual Eid Programs Impact</p>
                <p className="text-4xl font-serif font-bold text-gradient mb-2">300,000 Birr</p>
                <p className="text-muted-foreground">246 Individuals Served</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Event Gallery Section */}
      <EventGallery
        title="Our Activities"
        subtitle="Highlights from our charity programs and community outreach events"
        images={charityEventImages}
        accentColor="#29b6b0"
      />

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-accent/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            Join Our Mission
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Every contribution, big or small, makes a difference in someone's life. 
            Help us continue serving our community.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/student-sadaqah">
              <Button variant="hero" size="lg">
                <Heart size={20} />
                Student Sadaqah
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CharitySector;
