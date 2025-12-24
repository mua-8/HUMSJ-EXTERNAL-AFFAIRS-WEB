import { Users, Target, Award, BookOpen, User } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import humjsLogo from "@/assets/humjs-logo.png";

const leadershipTeam = [
  {
    name: "Musab Abdurahman",
    role: "General Amir (President)",
    image: "/images/leadership/musab.png",
  },
  {
    name: "Uztaz Yuusuf",
    role: "Vice President",
    image: "/images/leadership/yuusuf.png",
  },
  {
    name: "Mehadi Jemal",
    role: "Head of External Affairs",
    image: "/images/leadership/mahadi.png",
  },
];

const objectives = [
  {
    icon: BookOpen,
    title: "Islamic Education",
    description:
      "Providing quality Islamic education through regular study circles, workshops, and seminars.",
  },
  {
    icon: Users,
    title: "Community Building",
    description:
      "Fostering a strong sense of brotherhood and sisterhood among Muslim students on campus.",
  },
  {
    icon: Target,
    title: "Dawah Activities",
    description:
      "Spreading the message of Islam through positive actions and respectful dialogue.",
  },
  {
    icon: Award,
    title: "Leadership Development",
    description:
      "Nurturing future Muslim leaders through training programs and practical experiences.",
  },
];

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-[#f0fafa] overflow-hidden">
        {/* Subtle pattern */}
        <div className="absolute inset-0 pattern-squares" />
        {/* Decorative elements */}
        <div className="absolute top-12 left-12 w-16 h-16 rounded-xl bg-[#29b6b0]/10 rotate-12" />
        <div className="absolute top-8 right-20 w-10 h-10 rounded-lg bg-[#29b6b0]/5 -rotate-6" />
        <div className="absolute bottom-12 right-16 w-14 h-14 rounded-lg bg-[#29b6b0]/8 rotate-6" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <img
              src={humjsLogo}
              alt="HUMSJ Logo"
              className="h-24 w-auto mx-auto mb-8 animate-fade-in"
            />
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1f2937] mb-6 animate-fade-in-up">
              About <span className="text-[#29b6b0]">HUMSJ</span>
            </h1>
            <p className="text-lg text-[#374151] animate-fade-in-up delay-100">
              Haramaya University Muslim Students Jema'a has been serving the
              spiritual, educational, and social needs of Muslim students since
              its establishment.
            </p>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="relative py-20 bg-[#f8fafc] overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <div className="h-1 w-16 bg-[#29b6b0] rounded-full mb-6" />
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1f2937] mb-6">
                Who We Are
              </h2>
              <div className="space-y-4 text-[#374151]">
                <p>
                  Haramaya University Muslim Students Jema'a (HUMSJ) is the
                  largest and most active Muslim student organization at
                  Haramaya University. Established over 15 years ago, we have
                  grown to become a vibrant community of over 2,000 members.
                </p>
                <p>
                  Our organization serves as a spiritual home for Muslim
                  students, providing a supportive environment for practicing
                  Islam, seeking knowledge, and building lifelong connections
                  with fellow believers.
                </p>
                <p>
                  We organize regular prayers, educational programs, community
                  service activities, and special events throughout the academic
                  year, ensuring that every Muslim student has the opportunity
                  to grow in their faith while excelling in their studies.
                </p>
              </div>
            </div>
            <div className="relative animate-fade-in-up delay-200">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800"
                  alt="Islamic mosque interior with beautiful architecture"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-[#29b6b0]/10 rounded-2xl -z-10" />
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#d4af37]/10 rounded-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="relative py-20 bg-[#f3f4f6] overflow-hidden">
        <div className="absolute inset-0 pattern-squares" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="h-1 w-16 bg-[#29b6b0] rounded-full mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1f2937] mb-4">
              Our Objectives
            </h2>
            <p className="text-[#4b5563] max-w-2xl mx-auto">
              We are committed to achieving these core objectives that guide our
              activities and programs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {objectives.map((obj, index) => (
              <Card
                key={obj.title}
                variant="interactive"
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="flex gap-5 pt-6">
                  <div className="w-14 h-14 rounded-xl bg-[#e6f7f6] flex items-center justify-center flex-shrink-0">
                    <obj.icon size={28} className="text-[#29b6b0]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-semibold text-[#1f2937] mb-2">
                      {obj.title}
                    </h3>
                    <p className="text-[#4b5563] text-sm">{obj.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-[#29b6b0]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block text-white/80 text-sm font-semibold tracking-wider uppercase mb-3">
              Our Leadership
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
              Meet the Team
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto">
              Dedicated individuals who lead and serve our community with
              integrity and vision.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {leadershipTeam.map((member, index) => (
              <div
                key={member.name}
                className="group text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Photo Container */}
                <div className="relative mx-auto mb-5 w-36 h-36">
                  <div className="absolute inset-0 rounded-full bg-white p-1">
                    <div className="w-full h-full rounded-full overflow-hidden bg-[#f0fafa]">
                      <img
                        src={member.image}
                        alt={`${member.name} - ${member.role} of HUMSJ`}
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.nextElementSibling?.classList.remove(
                            "hidden"
                          );
                        }}
                      />
                      <div className="hidden w-full h-full flex items-center justify-center bg-[#f0fafa]">
                        <User size={48} className="text-[#29b6b0]/50" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Name & Role */}
                <h3 className="text-xl font-serif font-bold text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-white/80 text-sm font-medium">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
