import { Link } from "react-router-dom";
import { Heart, BookOpen, Megaphone, ArrowRight, Globe, Users, Target, Calendar, Mail, Phone, History, Award, User, Building } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RegistrationModal, { RegistrationType } from "@/components/external-affairs/RegistrationModal";
import { useState } from "react";

// Leadership data - Social Affairs Sector
const sectorHead = {
  name: "Mahdi Jamal",
  title: "Head of Social Affairs Sector",
  year: "4th Year Law Student",
  phone: "+251 91 XXX XXXX",
  email: "socialaffairs@humsj.org",
};

// Leadership data for each sub-sector
const sectorLeadership = {
  qirat: {
    amir: "Mohammed Ahmed",
    title: "Head of Qirat Sub-Sector",
    year: "3rd Year Computer Science Student",
    phone: "+251 91 XXX XXXX",
    email: "qirat@humsj.org",
  },
  charity: {
    amir: "Muhajir Mohammed",
    title: "Head of Charity Sub-Sector",
    year: "3rd Year Economics Student",
    phone: "+251 91 XXX XXXX",
    email: "charity@humsj.org",
  },
  dawa: {
    amir: "Ramadan Aliyi",
    title: "Head of Dawa Sub-Sector",
    year: "3rd Year Computer Science Student",
    phone: "+251 91 XXX XXXX",
    email: "dawa@humsj.org",
  },
};

// Past events organized by year
const pastEvents = [
  {
    year: "2024",
    events: [
      { title: "Eid al-Adha Aid Distribution", date: "June 2024", sector: "Charity", participants: 50, budget: "80,000 ETB" },
      { title: "Eid al-Fitr Clothing Distribution", date: "April 2024", sector: "Charity", participants: 86, budget: "100,000 ETB" },
      { title: "Ramadan Quran Competition", date: "April 2024", sector: "Qirat", participants: 120 },
      { title: "Islamic Awareness Week", date: "March 2024", sector: "Dawa", participants: 500 },
    ],
  },
  {
    year: "2023",
    events: [
      { title: "Hifz Graduation Ceremony", date: "December 2023", sector: "Qirat", participants: 45 },
      { title: "Annual Charity Distribution", date: "November 2023", sector: "Charity", participants: 200 },
      { title: "New Muslim Welcome Program", date: "October 2023", sector: "Dawa", participants: 30 },
      { title: "Community Iftar Events", date: "Ramadan 2023", sector: "All Sectors", participants: 350 },
    ],
  },
  {
    year: "2022",
    events: [
      { title: "Quran Recitation Competition", date: "May 2022", sector: "Qirat", participants: 80 },
      { title: "Orphan Support Initiative Launch", date: "July 2022", sector: "Charity", participants: 50 },
      { title: "Youth Islamic Conference", date: "August 2022", sector: "Dawa", participants: 300 },
    ],
  },
];

const sectors = [
  {
    icon: BookOpen,
    title: "A. Qirat Sub-Sector",
    description: "Focuses on educating Quran and 'Dini' (religious education) to the society's children and university students.",
    abstract: "The Qirat Sub-Sector is dedicated to Quranic education for the community. Currently serving 125 students divided into two programs: the Foundational Nuraniya Program (55 students) teaching basic Quranic reading, and the Advanced Quran Memorization/Recitation Program (70 students) for those pursuing Hifz and advanced Tajweed. Regular Muhadara (educational gatherings) are organized to inspire and unite students through Islamic teachings.",
    link: "/external-affairs/qirat",
    color: "from-[#25A7A1] to-[#1F8B86]",
    stats: ["125 Students", "55 Nuraniya", "70 Advanced"],
    leadership: sectorLeadership.qirat,
  },
  {
    icon: Heart,
    title: "B. Charity Sub-Sector",
    description: "Collects money from different sources (Students, Sponsors, Star-Shining Association) and distributes aid to the needy.",
    abstract: "The Charity Sub-Sector collects funds from three main sources: (1) Students who donate monthly according to their ability, (2) Sponsors from the community, and (3) Star-Shining Association - an association of Muslim students who previously studied at Haramaya University but have now graduated and are working in different parts of the country. The collected funds are used to help various segments of the community in need during Ramadan, Eid al-Fitr, Eid al-Adha, and throughout the year supporting orphans, elderly, needy students, and students with disabilities.",
    link: "/external-affairs/charity",
    color: "from-[#25A7A1] to-[#1F8B86]",
    stats: ["80,000+ ETB Budget", "50+ Beneficiaries", "3 Funding Sources"],
    leadership: sectorLeadership.charity,
  },
  {
    icon: Megaphone,
    title: "C. Dawa Sub-Sector",
    description: "Works on preparation and compilation of all Dawa programs, spreading Islamic knowledge and awareness.",
    abstract: "The Dawa Sub-Sector is responsible for preparing and organizing all Islamic awareness and outreach programs. Activities include organizing Islamic lectures and seminars, youth mentorship programs, new Muslim support initiatives, and community engagement events. The sector works to strengthen the relationship between HUMSJ and the broader society through education and positive engagement.",
    link: "/external-affairs/dawa",
    color: "from-[#25A7A1] to-[#1F8B86]",
    stats: ["15+ Events/Year", "500+ Reached", "Multiple Programs"],
    leadership: sectorLeadership.dawa,
  },
];

const SocialAffairs = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<RegistrationType>("student");
  const [modalSector, setModalSector] = useState<"qirat" | "charity" | "dawa">("qirat");

  const openModal = (type: RegistrationType, sector: "qirat" | "charity" | "dawa") => {
    setModalType(type);
    setModalSector(sector);
    setIsModalOpen(true);
  };
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#f0fafa] to-[#e8f4f3]">
        {/* Subtle pattern */}
        <div className="absolute inset-0 pattern-squares-teal" />
        {/* Decorative elements */}
        <div className="absolute top-16 left-12 w-16 h-16 rounded-xl bg-[#29b6b0]/[0.15] rotate-12" />
        <div className="absolute top-20 right-20 w-12 h-12 rounded-lg bg-[#29b6b0]/[0.10] -rotate-6" />
        <div className="absolute bottom-16 right-16 w-14 h-14 rounded-xl bg-[#29b6b0]/[0.12] rotate-6" />
        <div className="absolute bottom-20 left-20 w-10 h-10 rounded-lg bg-[#29b6b0]/[0.08] rotate-45" />

        <div className="container mx-auto px-4 py-24 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#25A7A1]/10 border border-[#25A7A1]/20 text-[#25A7A1] mb-6 animate-fade-in">
            <Globe size={16} />
            <span className="text-sm font-medium">HUMSJ Social Affairs Sector</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#1f2937] mb-6 animate-fade-in-up">
            Social Affairs <span className="text-[#25A7A1]">Sector</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8 animate-fade-in-up delay-100">
            Strengthening the relationship between HUMSJ (Haramaya University Muslim Students' Jeme'a)
            and the society through Charity, Dawa, and Qirat programs.
          </p>

          <div className="flex flex-wrap justify-center gap-8 mt-12 animate-fade-in-up delay-200">
            {[
              { icon: Users, label: "Students Reached", value: "500+" },
              { icon: Heart, label: "Beneficiaries", value: "350+" },
              { icon: Target, label: "Programs Active", value: "12" },
              { icon: Calendar, label: "Events/Year", value: "25+" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-[#25A7A1]/10 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-[#25A7A1]" />
                </div>
                <p className="text-2xl font-serif font-bold text-[#1f2937]">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About HUMSJ & Social Affairs Sector */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 justify-center mb-8">
              <div className="w-12 h-12 rounded-xl bg-[#25A7A1]/10 flex items-center justify-center">
                <History className="w-6 h-6 text-[#25A7A1]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                About HUMSJ & This Sector
              </h2>
            </div>

            <div className="prose prose-lg max-w-none text-center mb-12">
              <p className="text-muted-foreground text-lg leading-relaxed">
                <strong>Haramaya University</strong> is a university found in Oromia region, Eastern Hararghe part of Ethiopia.
                Students come from all parts of Ethiopia, making it diverse in religion, culture, language, norms, and values.
                Despite this diversity, students live in peace, tolerance, and harmony.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mt-4">
                Muslim students at this university have their own union called <strong>"Haramaya University Muslim Students' Jeme'a" (HUMSJ)</strong>.
                The HUMSJ has 6 main sectors: Dawa and Irshad, Ashob-Ashura sector, Academic Sector, Information Sector,
                <strong> Social Affairs Sector</strong>, and Baytul-Mai Sector.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mt-4">
                The entire Union, as well as all sectors, are led by students elected from the Union.
                Currently, the President of the Union is <strong>"Musab Abdurrahman"</strong>, a 4th year Management student at this university.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mt-4">
                The <strong>Social Affairs Sector</strong> is one of the key sectors of HUMSJ. Its main objective is to strengthen the
                relationship between HUMSJ (the Union) and the society through three different ways: <strong>Charity</strong> (helping orphans,
                poor, and needy people), <strong>Dawa</strong> (Islamic outreach and education), and <strong>Qirat</strong> (Quranic education).
              </p>
            </div>

            {/* Sector Head Card */}
            <Card className="max-w-2xl mx-auto border-t-4 border-t-[#25A7A1] mb-12">
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#25A7A1] to-[#0f4a47] flex items-center justify-center">
                    <Building className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Head of Social Affairs Sector</p>
                    <p className="text-2xl font-serif font-bold text-gray-800">{sectorHead.name}</p>
                    <p className="text-sm text-[#25A7A1] font-medium">{sectorHead.year}</p>
                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Phone size={14} />
                        {sectorHead.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail size={14} />
                        {sectorHead.email}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Achievements */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <Card className="text-center border-t-4 border-t-[#25A7A1] hover:shadow-lg transition-shadow">
                <CardContent className="pt-8">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#25A7A1]/10 flex items-center justify-center">
                    <BookOpen className="w-7 h-7 text-[#25A7A1]" />
                  </div>
                  <h3 className="font-serif font-bold text-xl mb-2">125 Students</h3>
                  <p className="text-muted-foreground text-sm">Currently enrolled in Qirat programs (55 Nuraniya + 70 Advanced)</p>
                </CardContent>
              </Card>
              <Card className="text-center border-t-4 border-t-[#25A7A1] hover:shadow-lg transition-shadow">
                <CardContent className="pt-8">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#25A7A1]/10 flex items-center justify-center">
                    <Heart className="w-7 h-7 text-[#25A7A1]" />
                  </div>
                  <h3 className="font-serif font-bold text-xl mb-2">180,000+ ETB</h3>
                  <p className="text-muted-foreground text-sm">Distributed in 2024 (Eid al-Adha + Eid al-Fitr programs)</p>
                </CardContent>
              </Card>
              <Card className="text-center border-t-4 border-t-[#25A7A1] hover:shadow-lg transition-shadow">
                <CardContent className="pt-8">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#25A7A1]/10 flex items-center justify-center">
                    <Award className="w-7 h-7 text-[#25A7A1]" />
                  </div>
                  <h3 className="font-serif font-bold text-xl mb-2">500+ Reached</h3>
                  <p className="text-muted-foreground text-sm">People reached through Dawa programs annually</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Sub-Sectors Grid */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Our Three Sub-Sectors
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The Social Affairs Sector operates through three specialized sub-sectors, each dedicated to a unique aspect of community service.
            </p>
          </div>

          <div className="space-y-12 max-w-6xl mx-auto">
            {sectors.map((sector, index) => (
              <Card
                key={sector.title}
                variant="elevated"
                className="group animate-fade-in-up overflow-hidden hover:shadow-xl transition-all duration-300"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className={`h-2 bg-gradient-to-r ${sector.color}`} />
                <div className="grid md:grid-cols-3 gap-0">
                  {/* Main Info */}
                  <div className="md:col-span-2 p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${sector.color} flex items-center justify-center flex-shrink-0`}>
                        <sector.icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl mb-2">{sector.title}</CardTitle>
                        <CardDescription className="text-base">{sector.description}</CardDescription>
                      </div>
                    </div>

                    {/* Abstract */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">About This Sub-Sector</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{sector.abstract}</p>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-3 mb-6">
                      {sector.stats.map((stat) => (
                        <span
                          key={stat}
                          className={`px-4 py-2 text-sm font-medium rounded-full bg-[#25A7A115] text-[#25A7A1]`}
                        >
                          {stat}
                        </span>
                      ))}
                    </div>

                    <Link to={sector.link}>
                      <Button className={`bg-gradient-to-r ${sector.color} text-white hover:opacity-90 transition-opacity`}>
                        Learn More & Register
                        <ArrowRight size={16} className="ml-2" />
                      </Button>
                    </Link>
                  </div>

                  {/* Leadership Info */}
                  <div className="bg-gray-50 p-8 flex flex-col justify-center border-l border-gray-100">
                    <h4 className="font-serif font-bold text-lg mb-4 text-gray-800">Sub-Sector Leadership</h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${sector.color} flex items-center justify-center flex-shrink-0`}>
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{sector.leadership.amir}</p>
                          <p className="text-xs text-gray-500">{sector.leadership.title}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 italic">{sector.leadership.year}</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone size={14} />
                          <span className="text-sm">{sector.leadership.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail size={14} />
                          <span className="text-sm">{sector.leadership.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Charity Funding Sources Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Charity Funding Sources
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our Charity Sub-Sector collects funds from three main sources to support the community.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#25A7A1]/10 flex items-center justify-center">
                  <Users className="w-8 h-8 text-[#25A7A1]" />
                </div>
                <CardTitle>Student Donations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Monthly voluntary donations from students according to their ability. Every contribution, no matter how small, helps support those in need.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#25A7A1]/10 flex items-center justify-center">
                  <Award className="w-8 h-8 text-[#25A7A1]" />
                </div>
                <CardTitle>Star-Shining Association</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  An association of Muslim students who previously studied at Haramaya University but have now graduated and are working in different parts of the country. They raise money and donate it to this sector.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#25A7A1]/10 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-[#25A7A1]" />
                </div>
                <CardTitle>Community Sponsors</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Generous sponsors from within and outside the university community who believe in supporting Islamic charitable initiatives.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 2024 Aid Distribution Summary */}
      <section className="py-16 bg-gradient-to-br from-[#29b6b0]/5 to-[#29b6b0]/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#29b6b0]/10 border border-[#29b6b0]/20 text-[#29b6b0] mb-4">
              <Calendar size={16} />
              <span className="text-sm font-medium">Year 2024</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Aid Distribution Summary
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Eid al-Adha */}
            <Card className="overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-[#29b6b0] to-[#239e99]" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🐑</span>
                  Eid al-Adha Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-[#25A7A1]">8</p>
                    <p className="text-xs text-gray-500">Elderly Individuals</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-[#25A7A1]">22</p>
                    <p className="text-xs text-gray-500">Orphan-Household Families</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-[#25A7A1]">15</p>
                    <p className="text-xs text-gray-500">Needy Students</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-[#25A7A1]">5</p>
                    <p className="text-xs text-gray-500">Students with Disabilities</p>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Estimated Budget:</span>
                    <span className="font-semibold">76,000 ETB</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-500">Actual Expenditure:</span>
                    <span className="font-bold text-[#25A7A1]">80,000 ETB</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Eid al-Fitr */}
            <Card className="overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-[#29b6b0] to-[#239e99]" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">👔</span>
                  Eid al-Fitr Clothing Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-6 bg-gray-50 rounded-lg text-center">
                  <p className="text-4xl font-bold text-[#25A7A1]">86</p>
                  <p className="text-sm text-gray-500 mt-1">Clothing Kits Distributed</p>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Complete clothing sets distributed to needy individuals and families during Eid al-Fitr celebrations.
                </p>
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Total Program Cost:</span>
                    <span className="font-bold text-[#25A7A1]">100,000 ETB</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Past Events Timeline */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#29b6b0]/10 border border-[#29b6b0]/20 text-[#29b6b0] mb-4">
              <Calendar size={16} />
              <span className="text-sm font-medium">Event History</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Past Years' Events
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A look back at the significant events and programs organized by our Social Affairs sector.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {pastEvents.map((yearData, yearIndex) => (
              <div key={yearData.year} className="mb-12 last:mb-0">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#25A7A1] to-[#0f4a47] flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{yearData.year}</span>
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-[#29b6b0] to-transparent" />
                </div>

                <div className="grid sm:grid-cols-2 gap-4 pl-4">
                  {yearData.events.map((event, eventIndex) => (
                    <Card
                      key={event.title}
                      className="hover:shadow-md transition-shadow animate-fade-in-up"
                      style={{ animationDelay: `${(yearIndex * 100) + (eventIndex * 50)}ms` }}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-sm">{event.title}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full bg-[#25A7A1]/10 text-[#25A7A1]`}>
                            {event.sector}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{event.date}</span>
                          <span>{event.participants} participants</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-[#29b6b0]/10 via-[#7c3aed]/5 to-[#f59e0b]/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            Want to Get Involved?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Your support makes a difference. Join us in serving the community through donations, volunteering,
            learning the Quran, or spreading Islamic awareness.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="hero" size="lg" className="bg-[#25A7A1] hover:bg-[#1F8B86]" onClick={() => openModal("donor", "charity")}>
              <Heart size={20} className="mr-2" />
              Donate Now
            </Button>
            <Button variant="outline" size="lg" className="border-[#25A7A1] text-[#25A7A1] hover:bg-[#25A7A1] hover:text-white" onClick={() => openModal("student", "qirat")}>
              <BookOpen size={20} className="mr-2" />
              Join Qirat Program
            </Button>
            <Button variant="outline" size="lg" className="border-[#25A7A1] text-[#25A7A1] hover:bg-[#25A7A1] hover:text-white" onClick={() => openModal("volunteer", "dawa")}>
              <Megaphone size={20} className="mr-2" />
              Volunteer for Dawa
            </Button>
          </div>
        </div>
      </section>

      <RegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={modalType}
        sector={modalSector}
      />
    </Layout>
  );
};

export default SocialAffairs;
