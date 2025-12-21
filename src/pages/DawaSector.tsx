import { Link } from "react-router-dom";
import {
    Megaphone,
    Users,
    Calendar,
    BookOpen,
    ArrowLeft,
    Heart,
    Lightbulb,
    MessageCircle,
    Target,
    Star,
    GraduationCap,
    Globe,
    Phone,
    Mail,
    MapPin,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StatCard from "@/components/external-affairs/StatCard";
import EventGallery from "@/components/ui/EventGallery";
import RegistrationModal, { RegistrationType } from "@/components/external-affairs/RegistrationModal";
import { useState } from "react";

// Dawa event images - add images to public/images/events/dawa/
const dawaEventImages = [
    { src: "/images/events/dawa/dawa1.jpg", alt: "Islamic awareness seminar" },
    { src: "/images/events/dawa/dawa2.jpg", alt: "Community lecture event" },
    { src: "/images/events/dawa/dawa3.jpg", alt: "Youth mentorship program" },
];

// Leadership
const leadership = {
    amir: "Ramadan Aliyi",
    title: "Head of Dawa Sub-Sector",
    year: "3rd Year Computer Science Student",
    phone: "+251 91 XXX XXXX",
    email: "dawa@humsj.org",
};

// Stats
const dawaStats = [
    { icon: Megaphone, value: 15, label: "Events/Year", variant: "teal" as const },
    { icon: Users, value: 500, label: "People Reached", variant: "teal" as const },
    { icon: Heart, value: 30, label: "New Muslim Support", variant: "teal" as const },
    { icon: GraduationCap, value: 12, label: "Youth Mentored", variant: "teal" as const },
];

// Programs
const programs = [
    {
        icon: BookOpen,
        title: "Islamic Awareness Campaigns",
        description: "Regular campaigns to educate the community about fundamental Islamic principles and practices.",
        activities: [
            "Weekly Islamic lectures on campus",
            "Distribution of Islamic literature",
            "Social media awareness programs",
            "Interactive Q&A sessions",
        ],
    },
    {
        icon: Users,
        title: "Youth Mentorship Program",
        description: "Structured mentorship for Muslim youth to develop their Islamic identity and leadership skills.",
        activities: [
            "One-on-one mentorship sessions",
            "Leadership development workshops",
            "Career guidance with Islamic perspective",
            "Peer support groups",
        ],
    },
    {
        icon: Heart,
        title: "New Muslim Support",
        description: "Comprehensive support system for those who have newly embraced Islam.",
        activities: [
            "Welcome orientation sessions",
            "Basic Islamic education courses",
            "Community integration support",
            "Ongoing spiritual guidance",
        ],
    },
    {
        icon: MessageCircle,
        title: "Interfaith Dialogue",
        description: "Building bridges and promoting understanding between different faith communities.",
        activities: [
            "Interfaith discussion forums",
            "Joint community service projects",
            "Cultural exchange events",
            "Common ground workshops",
        ],
    },
];

// Past events
const pastEvents = [
    { title: "Islamic Awareness Week 2024", date: "March 2024", participants: 500, status: "completed" },
    { title: "Youth Leadership Conference", date: "January 2024", participants: 120, status: "completed" },
    { title: "New Muslim Welcome Ceremony", date: "October 2023", participants: 30, status: "completed" },
    { title: "Community Iftar Dialogue", date: "Ramadan 2024", participants: 250, status: "completed" },
    { title: "Campus Da'wah Training", date: "Coming Feb 2025", participants: 0, status: "upcoming" },
];

const DawaSector = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<RegistrationType>("volunteer");

    const openModal = (type: RegistrationType) => {
        setModalType(type);
        setIsModalOpen(true);
    };
    return (
        <Layout>
            {/* Hero Section */}
            <section className="relative min-h-[45vh] flex items-center overflow-hidden bg-gradient-to-br from-[#f0fafa] to-[#e6f7f6]">
                {/* Subtle pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #29b6b0 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                </div>
                {/* Decorative elements */}
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
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#29b6b0] to-[#239e99] flex items-center justify-center">
                            <Megaphone className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1f2937]">
                                Dawa Sub-Sector
                            </h1>
                            <p className="text-gray-500">Social Affairs Sector - HUMSJ</p>
                        </div>
                    </div>

                    <p className="text-lg text-gray-600 max-w-3xl">
                        Works on preparation and compilation of all Dawa programs, spreading Islamic
                        knowledge and strengthening the relationship between HUMSJ and the society.
                    </p>
                </div>
            </section>

            {/* Leadership Section */}
            <section className="py-12 bg-white border-b">
                <div className="container mx-auto px-4">
                    <Card className="max-w-2xl mx-auto border-l-4 border-l-[#29b6b0]">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#29b6b0] to-[#239e99] flex items-center justify-center">
                                    <Star className="w-10 h-10 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-1">Head of Dawa Sub-Sector</h3>
                                    <p className="text-xl font-serif font-bold text-gray-800">{leadership.amir}</p>
                                    <p className="text-sm text-[#29b6b0] font-medium">{leadership.year}</p>
                                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                                        <span className="flex items-center gap-1">
                                            <Phone size={14} />
                                            {leadership.phone}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Mail size={14} />
                                            {leadership.email}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-gradient-to-b from-white to-[#f0fafa]">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#29b6b0]/10 border border-[#29b6b0]/20 text-[#29b6b0] mb-4">
                            <Target size={16} />
                            <span className="text-sm font-medium">Our Impact</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
                            Spreading Knowledge
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Our Dawa activities reach hundreds of people each year through various programs and initiatives.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                        {dawaStats.map((stat, index) => (
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
                </div>
            </section>

            {/* Programs Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#29b6b0]/10 border border-[#29b6b0]/20 text-[#29b6b0] mb-4">
                            <Lightbulb size={16} />
                            <span className="text-sm font-medium">Our Programs</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
                            Dawa Initiatives
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Comprehensive programs designed to educate, inspire, and build community.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {programs.map((program, index) => (
                            <Card
                                key={program.title}
                                variant="elevated"
                                className="animate-fade-in-up hover:shadow-lg transition-shadow"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-[#29b6b0]/10 flex items-center justify-center">
                                            <program.icon size={24} className="text-[#29b6b0]" />
                                        </div>
                                        <CardTitle className="text-lg">{program.title}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-muted-foreground text-sm">{program.description}</p>
                                    <ul className="space-y-2">
                                        {program.activities.map((activity) => (
                                            <li key={activity} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#29b6b0]" />
                                                {activity}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Past Events Section */}
            <section className="py-16 bg-[#f0fafa]">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#29b6b0]/10 border border-[#29b6b0]/20 text-[#29b6b0] mb-4">
                            <Calendar size={16} />
                            <span className="text-sm font-medium">Event History</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
                            Past & Upcoming Events
                        </h2>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        <div className="space-y-4">
                            {pastEvents.map((event, index) => (
                                <Card
                                    key={event.title}
                                    className="hover:shadow-md transition-shadow animate-fade-in-up"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${event.status === "upcoming" ? "bg-blue-100" : "bg-[#29b6b0]/10"
                                                    }`}>
                                                    <Calendar size={20} className={event.status === "upcoming" ? "text-blue-600" : "text-[#29b6b0]"} />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold">{event.title}</h4>
                                                    <p className="text-sm text-gray-500">{event.date}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <Badge className={
                                                    event.status === "upcoming"
                                                        ? "bg-blue-100 text-blue-600"
                                                        : "bg-green-100 text-green-600"
                                                }>
                                                    {event.status}
                                                </Badge>
                                                {event.participants > 0 && (
                                                    <p className="text-xs text-gray-500 mt-1">{event.participants} participants</p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Event Gallery Section */}
            <EventGallery
                title="Our Activities"
                subtitle="Highlights from our Dawa programs and community events"
                images={dawaEventImages}
                accentColor="#29b6b0"
            />

            {/* Registration CTA Section */}
            <section className="py-20 bg-gradient-to-br from-[#29b6b0]/5 to-[#239e99]/5">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
                        Join Our Dawa Programs
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                        Whether you want to deepen your Islamic knowledge, mentor youth, support new Muslims,
                        or participate in community outreach, there's a place for you in our Dawa sector.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button
                            className="bg-gradient-to-r from-[#29b6b0] to-[#239e99] text-white hover:opacity-90"
                            size="lg"
                            onClick={() => openModal("volunteer")}
                        >
                            <Users size={20} className="mr-2" />
                            Get Involved
                        </Button>
                        <Link to="/external-affairs">
                            <Button variant="outline" size="lg" className="border-[#29b6b0] text-[#29b6b0] hover:bg-[#29b6b0] hover:text-white">
                                <Globe size={20} className="mr-2" />
                                Explore Other Sectors
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <RegistrationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                type={modalType}
                sector="dawa"
            />
        </Layout >
    );
};

export default DawaSector;
