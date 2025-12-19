import { Link } from "react-router-dom";
import { Heart, BookOpen, GraduationCap, ArrowRight, Globe, Users, Target } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const sectors = [
  {
    icon: Heart,
    title: "Charity Sector",
    description: "Supporting the needy through meal programs, Eid gifts, and ongoing aid distribution to orphans, elderly, and students in need.",
    link: "/external-affairs/charity",
    color: "from-[#29b6b0] to-[#239e99]",
    stats: ["86+ Eid Gifts", "80,000 Birr Budget"],
  },
  {
    icon: BookOpen,
    title: "Qirat Sector",
    description: "Nurturing Quran education through Nuraniya programs, advanced memorization classes, and inspirational Muhadara gatherings.",
    link: "/external-affairs/qirat",
    color: "from-[#29b6b0] to-[#239e99]",
    stats: ["125 Students", "68,000 Birr Budget"],
  },
  {
    icon: GraduationCap,
    title: "Academic Sector",
    description: "Enhancing academic excellence through tutorials, study resources, training programs, and learning support for students.",
    link: "/external-affairs/academic",
    color: "from-[#29b6b0] to-[#239e99]",
    stats: ["Coming Soon", "In Development"],
  },
];

const ExternalAffairs = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-[#f0fafa]">
        {/* Subtle pattern - #29b6b0 (Faith & Service color) */}
        <div className="absolute inset-0 pattern-squares-teal" />
        {/* Decorative corner squares - 10-20% opacity */}
        <div className="absolute top-16 left-12 w-16 h-16 rounded-xl bg-[#29b6b0]/[0.15] rotate-12" />
        <div className="absolute top-20 right-20 w-12 h-12 rounded-lg bg-[#29b6b0]/[0.10] -rotate-6" />
        <div className="absolute bottom-16 right-16 w-14 h-14 rounded-xl bg-[#29b6b0]/[0.12] rotate-6" />
        <div className="absolute bottom-20 left-20 w-10 h-10 rounded-lg bg-[#29b6b0]/[0.08] rotate-45" />
        
        <div className="container mx-auto px-4 py-24 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#29b6b0]/10 border border-[#29b6b0]/20 text-[#29b6b0] mb-6 animate-fade-in">
            <Globe size={16} />
            <span className="text-sm font-medium">External Affairs Sector</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#1f2937] mb-6 animate-fade-in-up">
            Serving the <span className="text-[#29b6b0]">Community</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8 animate-fade-in-up delay-100">
            The External Affairs Sector of HUMSJ is dedicated to community outreach, charitable initiatives, 
            Quranic education, and academic support for students and the broader Muslim community.
          </p>

          <div className="flex flex-wrap justify-center gap-8 mt-12 animate-fade-in-up delay-200">
            {[
              { icon: Users, label: "Community Outreach", value: "500+" },
              { icon: Heart, label: "Beneficiaries", value: "350+" },
              { icon: Target, label: "Programs Active", value: "12" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-[#29b6b0]/10 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-[#29b6b0]" />
                </div>
                <p className="text-2xl font-serif font-bold text-[#1f2937]">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
              Our Mission
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              The External Affairs Sector serves as the bridge between HUMSJ and the broader community. 
              We are responsible for managing charitable initiatives, coordinating Quranic education programs, 
              and providing academic support to empower students and serve those in need. Our goal is to 
              create a positive impact that reflects the values of compassion, knowledge, and excellence in Islam.
            </p>
          </div>
        </div>
      </section>

      {/* Sub-Sectors Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Our Sub-Sectors
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore the three pillars of our External Affairs Sector, each dedicated to a unique aspect of community service.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {sectors.map((sector, index) => (
              <Card
                key={sector.title}
                variant="interactive"
                className="group animate-fade-in-up overflow-hidden"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="h-1 bg-[#29b6b0]" />
                <CardHeader className="text-center pt-8">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-[#29b6b0]/10 flex items-center justify-center">
                    <sector.icon className="w-10 h-10 text-[#29b6b0]" />
                  </div>
                  <CardTitle className="text-xl mb-2 group-hover:text-[#29b6b0] transition-colors">
                    {sector.title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {sector.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {sector.stats.map((stat) => (
                      <span
                        key={stat}
                        className="px-3 py-1 text-xs font-medium bg-[#29b6b0]/10 rounded-full text-[#29b6b0]"
                      >
                        {stat}
                      </span>
                    ))}
                  </div>
                  <Link to={sector.link}>
                    <Button variant="outline" className="w-full group-hover:bg-[#29b6b0] group-hover:text-white group-hover:border-[#29b6b0] transition-all">
                      Learn More
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            Want to Contribute?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Your support makes a difference. Join us in serving the community through donations, volunteering, or spreading awareness.
          </p>
          <Link to="/external-affairs/charity">
            <Button variant="hero" size="lg">
              <Heart size={20} />
              Donate Now
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default ExternalAffairs;
