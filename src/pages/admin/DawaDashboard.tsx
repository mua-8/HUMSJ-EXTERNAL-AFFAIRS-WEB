import { useState } from "react";
import { Link } from "react-router-dom";
import {
    Megaphone,
    Users,
    Calendar,
    FileText,
    LogOut,
    Plus,
    BookOpen,
    Edit,
    Trash2,
    Eye,
    Download,
    Search,
    BarChart3,
    Star,
    Target,
    MessageCircle,
    Heart,
    UserPlus,
    Check,
    X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import humjsLogo from "@/assets/humjs-logo.png";

type ActiveTab = "overview" | "participants" | "events" | "new-muslims" | "reports";

// Types
interface DawaParticipant {
    id: string;
    name: string;
    phone: string;
    email: string;
    program: "awareness" | "mentorship" | "interfaith" | "new_muslim";
    role: "participant" | "volunteer" | "speaker";
    registrationDate: string;
    status: "active" | "inactive" | "pending";
    notes: string;
}

interface DawaEvent {
    id: string;
    title: string;
    type: "lecture" | "seminar" | "workshop" | "campaign" | "dialogue";
    date: string;
    venue: string;
    expectedParticipants: number;
    actualParticipants: number;
    status: "upcoming" | "ongoing" | "completed" | "cancelled";
    description: string;
    speaker: string;
}

interface NewMuslim {
    id: string;
    name: string;
    phone: string;
    email: string;
    shahadadDate: string;
    mentor: string;
    progress: number;
    coursesCompleted: string[];
    status: "active" | "graduated" | "needs_support";
    notes: string;
}

// Sample data
const sampleParticipants: DawaParticipant[] = [
    { id: "1", name: "Hassan Omar", phone: "+251911234567", email: "hassan@email.com", program: "mentorship", role: "volunteer", registrationDate: "2024-01-15", status: "active", notes: "Experienced mentor" },
    { id: "2", name: "Fatima Ahmed", phone: "+251912345678", email: "fatima@email.com", program: "awareness", role: "participant", registrationDate: "2024-06-01", status: "active", notes: "" },
    { id: "3", name: "Ibrahim Hassan", phone: "+251913456789", email: "ibrahim@email.com", program: "interfaith", role: "speaker", registrationDate: "2024-03-15", status: "active", notes: "Islamic studies background" },
    { id: "4", name: "Aisha Mohammed", phone: "+251914567890", email: "aisha@email.com", program: "new_muslim", role: "volunteer", registrationDate: "2024-08-01", status: "active", notes: "Supports new Muslims" },
];

const sampleEvents: DawaEvent[] = [
    { id: "1", title: "Islamic Awareness Week", type: "campaign", date: "2025-03-01", venue: "University Campus", expectedParticipants: 500, actualParticipants: 0, status: "upcoming", description: "Week-long awareness program", speaker: "Multiple" },
    { id: "2", title: "Youth Leadership Seminar", type: "seminar", date: "2025-02-15", venue: "Main Hall", expectedParticipants: 100, actualParticipants: 0, status: "upcoming", description: "Leadership development for Muslim youth", speaker: "Ustaz Abdulrahman" },
    { id: "3", title: "Foundations of Islam Workshop", type: "workshop", date: "2024-11-20", venue: "Prayer Hall", expectedParticipants: 50, actualParticipants: 45, status: "completed", description: "Basics of Islamic belief and practice", speaker: "Ustaz Mohammed" },
    { id: "4", title: "Interfaith Dialogue Forum", type: "dialogue", date: "2024-10-15", venue: "Conference Room", expectedParticipants: 80, actualParticipants: 75, status: "completed", description: "Building understanding between faiths", speaker: "Panel Discussion" },
];

const sampleNewMuslims: NewMuslim[] = [
    { id: "1", name: "Ahmed (formerly John)", phone: "+251915678901", email: "ahmed@email.com", shahadadDate: "2024-06-15", mentor: "Hassan Omar", progress: 75, coursesCompleted: ["Shahada Basics", "Prayer", "Fasting"], status: "active", notes: "Making great progress" },
    { id: "2", name: "Maryam (formerly Sarah)", phone: "+251916789012", email: "maryam@email.com", shahadadDate: "2024-09-01", mentor: "Aisha Mohammed", progress: 40, coursesCompleted: ["Shahada Basics"], status: "active", notes: "Needs additional support" },
    { id: "3", name: "Yusuf (formerly David)", phone: "+251917890123", email: "yusuf@email.com", shahadadDate: "2023-12-01", mentor: "Ibrahim Hassan", progress: 100, coursesCompleted: ["Shahada Basics", "Prayer", "Fasting", "Quran Reading", "Islamic History"], status: "graduated", notes: "Now helps other new Muslims" },
];

const DawaDashboard = () => {
    const { toast } = useToast();
    const { signOut, user } = useAuth();
    const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
    const [participants, setParticipants] = useState<DawaParticipant[]>(sampleParticipants);
    const [events, setEvents] = useState<DawaEvent[]>(sampleEvents);
    const [newMuslims, setNewMuslims] = useState<NewMuslim[]>(sampleNewMuslims);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddParticipantOpen, setIsAddParticipantOpen] = useState(false);
    const [isAddEventOpen, setIsAddEventOpen] = useState(false);
    const [isAddNewMuslimOpen, setIsAddNewMuslimOpen] = useState(false);

    // Registration form states
    const [regName, setRegName] = useState("");
    const [regPhone, setRegPhone] = useState("");
    const [regEmail, setRegEmail] = useState("");
    const [regProgram, setRegProgram] = useState("");
    const [regRole, setRegRole] = useState("");
    const [regNotes, setRegNotes] = useState("");

    const stats = {
        totalParticipants: participants.length,
        activeParticipants: participants.filter(p => p.status === "active").length,
        totalEvents: events.length,
        upcomingEvents: events.filter(e => e.status === "upcoming").length,
        completedEvents: events.filter(e => e.status === "completed").length,
        newMuslimsSupported: newMuslims.length,
        activeNewMuslims: newMuslims.filter(n => n.status === "active").length,
        graduatedNewMuslims: newMuslims.filter(n => n.status === "graduated").length,
        totalReached: events.filter(e => e.status === "completed").reduce((sum, e) => sum + e.actualParticipants, 0),
    };

    const filteredParticipants = participants.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.program.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const exportToCSV = (data: any[], filename: string) => {
        const headers = Object.keys(data[0]).join(",");
        const rows = data.map(item => Object.values(item).join(",")).join("\n");
        const csvContent = `${headers}\n${rows}`;

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${filename}.csv`;
        link.click();
        toast({ title: "Export Successful", description: `Data exported to ${filename}.csv` });
    };

    const handleAddParticipant = () => {
        if (!regName || !regPhone || !regProgram) {
            toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
            return;
        }

        const newParticipant: DawaParticipant = {
            id: Date.now().toString(),
            name: regName,
            phone: regPhone,
            email: regEmail,
            program: regProgram as DawaParticipant["program"],
            role: (regRole || "participant") as DawaParticipant["role"],
            registrationDate: new Date().toISOString().split("T")[0],
            status: "pending",
            notes: regNotes,
        };

        setParticipants([...participants, newParticipant]);
        toast({ title: "Success", description: "Participant registered successfully" });
        setIsAddParticipantOpen(false);
        resetRegForm();
    };

    const resetRegForm = () => {
        setRegName("");
        setRegPhone("");
        setRegEmail("");
        setRegProgram("");
        setRegRole("");
        setRegNotes("");
    };

    const handleApprove = (id: string) => {
        setParticipants(participants.map(p =>
            p.id === id ? { ...p, status: "active" } : p
        ));
        toast({ title: "Approved", description: "Participant has been approved" });
    };

    const handleReject = (id: string) => {
        setParticipants(participants.map(p =>
            p.id === id ? { ...p, status: "inactive" } : p
        ));
        toast({ title: "Rejected", description: "Participant has been rejected", variant: "destructive" });
    };

    const handleDelete = (id: string, type: "participant" | "event" | "newMuslim") => {
        if (type === "participant") {
            setParticipants(participants.filter(p => p.id !== id));
        } else if (type === "event") {
            setEvents(events.filter(e => e.id !== id));
        } else {
            setNewMuslims(newMuslims.filter(n => n.id !== id));
        }
        toast({ title: "Deleted", description: "Record has been deleted" });
    };

    const navItems = [
        { icon: Megaphone, label: "Overview", tab: "overview" as const },
        { icon: Users, label: "Participants", tab: "participants" as const },
        { icon: Calendar, label: "Events", tab: "events" as const },
        { icon: Heart, label: "New Muslims", tab: "new-muslims" as const },
        { icon: BarChart3, label: "Reports", tab: "reports" as const },
    ];

    const getProgramColor = (program: string) => {
        switch (program) {
            case "awareness": return "bg-blue-100 text-blue-600";
            case "mentorship": return "bg-purple-100 text-purple-600";
            case "interfaith": return "bg-green-100 text-green-600";
            case "new_muslim": return "bg-amber-100 text-amber-600";
            default: return "bg-gray-100 text-gray-600";
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] flex">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-[#29b6b0] to-[#239e99] p-6 hidden lg:flex flex-col z-50 shadow-xl">
                <div className="flex items-center gap-3 mb-8">
                    <img src={humjsLogo} alt="HUMSJ" className="h-10 w-auto" />
                    <div>
                        <h2 className="font-serif font-bold text-white">HUMSJ</h2>
                        <p className="text-xs text-white/80">🟡 Dawa Sector</p>
                    </div>
                </div>

                <nav className="space-y-2 flex-1">
                    {navItems.map((item) => (
                        <button
                            key={item.tab}
                            onClick={() => setActiveTab(item.tab)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === item.tab
                                ? "bg-white/20 text-white shadow-lg"
                                : "text-white/70 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            <item.icon size={18} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="mt-auto pt-6 border-t border-white/10 space-y-2">
                    <p className="text-xs text-white/50 px-2">{user?.email}</p>
                    <Link to="/">
                        <Button variant="outline" className="w-full border-white/20 text-white/70 hover:bg-white/10 hover:text-white">
                            Back to Site
                        </Button>
                    </Link>
                    <Button variant="outline" className="w-full border-white/20 text-white/70 hover:bg-white/10 hover:text-white" onClick={signOut}>
                        <LogOut size={16} className="mr-2" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="lg:ml-64 flex-1 p-6 lg:p-8">
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#1e293b]">
                        🟡 Dawa Sector Dashboard
                    </h1>
                    <p className="text-[#64748b]">Manage Islamic awareness and outreach programs</p>
                </div>

                {/* Overview */}
                {activeTab === "overview" && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <Card className="border-l-4 border-l-[#29b6b0] hover:shadow-lg transition-shadow">
                                <CardContent className="flex items-center gap-4 pt-6">
                                    <div className="w-12 h-12 rounded-xl bg-[#29b6b0]/10 flex items-center justify-center">
                                        <Users size={24} className="text-[#29b6b0]" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{stats.totalParticipants}</p>
                                        <p className="text-sm text-gray-500">Total Participants</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
                                <CardContent className="flex items-center gap-4 pt-6">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                        <Calendar size={24} className="text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{stats.upcomingEvents}</p>
                                        <p className="text-sm text-gray-500">Upcoming Events</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
                                <CardContent className="flex items-center gap-4 pt-6">
                                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                                        <Target size={24} className="text-green-500" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{stats.totalReached}</p>
                                        <p className="text-sm text-gray-500">People Reached</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
                                <CardContent className="flex items-center gap-4 pt-6">
                                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                        <Heart size={24} className="text-purple-500" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{stats.newMuslimsSupported}</p>
                                        <p className="text-sm text-gray-500">New Muslims Supported</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar size={20} className="text-[#29b6b0]" />
                                        Upcoming Events
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {events.filter(e => e.status === "upcoming").slice(0, 4).map((event) => (
                                            <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                <div>
                                                    <p className="font-medium">{event.title}</p>
                                                    <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()} • {event.venue}</p>
                                                </div>
                                                <Badge className="bg-blue-100 text-blue-600">{event.type}</Badge>
                                            </div>
                                        ))}
                                        {events.filter(e => e.status === "upcoming").length === 0 && (
                                            <p className="text-center text-gray-500 py-4">No upcoming events</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Heart size={20} className="text-purple-500" />
                                        New Muslims Progress
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {newMuslims.filter(n => n.status === "active").map((muslim) => (
                                            <div key={muslim.id} className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-[#29b6b0] flex items-center justify-center text-white font-bold">
                                                    {muslim.name.charAt(0)}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between mb-1">
                                                        <span className="font-medium text-sm">{muslim.name}</span>
                                                        <span className="text-xs text-gray-500">{muslim.coursesCompleted.length} courses</span>
                                                    </div>
                                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-[#29b6b0] to-[#239e99] rounded-full transition-all duration-500"
                                                            style={{ width: `${muslim.progress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                                <span className="text-xs text-gray-500">{muslim.progress}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Program Distribution */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Megaphone size={20} className="text-[#f59e0b]" />
                                    Program Participation
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {["awareness", "mentorship", "interfaith", "new_muslim"].map((program) => {
                                        const count = participants.filter(p => p.program === program).length;
                                        return (
                                            <div key={program} className="text-center p-4 bg-gray-50 rounded-xl">
                                                <p className="text-2xl font-bold text-[#f59e0b]">{count}</p>
                                                <p className="text-sm text-gray-500 capitalize">{program.replace("_", " ")}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </>
                )}

                {/* Participants Tab */}
                {activeTab === "participants" && (
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <CardTitle>Program Participants</CardTitle>
                                <div className="flex gap-3">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                        <Input
                                            placeholder="Search participants..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-9 w-64"
                                        />
                                    </div>
                                    <Button className="bg-[#29b6b0] hover:bg-[#239e99]" onClick={() => setIsAddParticipantOpen(true)}>
                                        <UserPlus size={16} className="mr-2" />
                                        Register Participant
                                    </Button>
                                    <Button variant="outline" onClick={() => exportToCSV(participants, "dawa_participants")}>
                                        <Download size={16} className="mr-2" />
                                        Export
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Phone</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Program</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredParticipants.map((participant) => (
                                            <TableRow key={participant.id} className="hover:bg-gray-50">
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-[#f59e0b] flex items-center justify-center text-white text-sm font-bold">
                                                            {participant.name.charAt(0)}
                                                        </div>
                                                        {participant.name}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{participant.phone}</TableCell>
                                                <TableCell>{participant.email}</TableCell>
                                                <TableCell>
                                                    <Badge className={getProgramColor(participant.program)}>
                                                        {participant.program.replace("_", " ")}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="capitalize">{participant.role}</TableCell>
                                                <TableCell>
                                                    <Badge className={
                                                        participant.status === "active" ? "bg-green-100 text-green-600" :
                                                            participant.status === "pending" ? "bg-amber-100 text-amber-600" :
                                                                "bg-gray-100 text-gray-600"
                                                    }>
                                                        {participant.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1">
                                                        {participant.status === "pending" && (
                                                            <>
                                                                <Button
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    onClick={() => handleApprove(participant.id)}
                                                                    className="h-8 w-8 text-green-500 hover:bg-green-100"
                                                                    title="Approve"
                                                                >
                                                                    <Check size={16} />
                                                                </Button>
                                                                <Button
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    onClick={() => handleReject(participant.id)}
                                                                    className="h-8 w-8 text-red-500 hover:bg-red-100"
                                                                    title="Reject"
                                                                >
                                                                    <X size={16} />
                                                                </Button>
                                                            </>
                                                        )}
                                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-[#f59e0b]">
                                                            <Eye size={16} />
                                                        </Button>
                                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-500">
                                                            <Edit size={16} />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-8 w-8 text-red-500"
                                                            onClick={() => handleDelete(participant.id, "participant")}
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Events Tab */}
                {activeTab === "events" && (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Dawa Events</CardTitle>
                                    <Button className="bg-[#29b6b0] hover:bg-[#239e99]" onClick={() => setIsAddEventOpen(true)}>
                                        <Plus size={16} className="mr-2" />
                                        Add Event
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Event</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Venue</TableHead>
                                            <TableHead>Participants</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {events.map((event) => (
                                            <TableRow key={event.id} className="hover:bg-gray-50">
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium">{event.title}</p>
                                                        <p className="text-xs text-gray-500">{event.speaker}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="capitalize">{event.type}</Badge>
                                                </TableCell>
                                                <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                                                <TableCell>{event.venue}</TableCell>
                                                <TableCell>
                                                    {event.status === "completed"
                                                        ? `${event.actualParticipants}/${event.expectedParticipants}`
                                                        : `Expected: ${event.expectedParticipants}`
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={
                                                        event.status === "upcoming" ? "bg-blue-100 text-blue-600" :
                                                            event.status === "ongoing" ? "bg-amber-100 text-amber-600" :
                                                                event.status === "completed" ? "bg-green-100 text-green-600" :
                                                                    "bg-red-100 text-red-600"
                                                    }>
                                                        {event.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-[#f59e0b]">
                                                            <Eye size={16} />
                                                        </Button>
                                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-500">
                                                            <Edit size={16} />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-8 w-8 text-red-500"
                                                            onClick={() => handleDelete(event.id, "event")}
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* New Muslims Tab */}
                {activeTab === "new-muslims" && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="bg-gradient-to-br from-[#f59e0b] to-[#d97706] text-white">
                                <CardContent className="pt-6">
                                    <p className="text-amber-100">Total Supported</p>
                                    <p className="text-3xl font-bold">{stats.newMuslimsSupported}</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                                <CardContent className="pt-6">
                                    <p className="text-green-100">Currently Active</p>
                                    <p className="text-3xl font-bold">{stats.activeNewMuslims}</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                                <CardContent className="pt-6">
                                    <p className="text-purple-100">Graduated</p>
                                    <p className="text-3xl font-bold">{stats.graduatedNewMuslims}</p>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>New Muslim Support Registry</CardTitle>
                                    <Button className="bg-[#29b6b0] hover:bg-[#239e99]" onClick={() => setIsAddNewMuslimOpen(true)}>
                                        <Heart size={16} className="mr-2" />
                                        Register New Muslim
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Shahadah Date</TableHead>
                                            <TableHead>Mentor</TableHead>
                                            <TableHead>Progress</TableHead>
                                            <TableHead>Courses</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {newMuslims.map((muslim) => (
                                            <TableRow key={muslim.id} className="hover:bg-gray-50">
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-[#f59e0b] flex items-center justify-center text-white text-sm font-bold">
                                                            {muslim.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p>{muslim.name}</p>
                                                            <p className="text-xs text-gray-500">{muslim.phone}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{new Date(muslim.shahadadDate).toLocaleDateString()}</TableCell>
                                                <TableCell>{muslim.mentor}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-[#f59e0b] rounded-full"
                                                                style={{ width: `${muslim.progress}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs text-gray-500">{muslim.progress}%</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-sm">{muslim.coursesCompleted.length} completed</span>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={
                                                        muslim.status === "active" ? "bg-green-100 text-green-600" :
                                                            muslim.status === "graduated" ? "bg-purple-100 text-purple-600" :
                                                                "bg-amber-100 text-amber-600"
                                                    }>
                                                        {muslim.status.replace("_", " ")}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-[#f59e0b]">
                                                            <Eye size={16} />
                                                        </Button>
                                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-500">
                                                            <Edit size={16} />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-8 w-8 text-red-500"
                                                            onClick={() => handleDelete(muslim.id, "newMuslim")}
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Reports Tab */}
                {activeTab === "reports" && (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 size={20} />
                                    Dawa Sector Reports
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                    <div className="p-4 bg-gradient-to-br from-[#f59e0b]/10 to-[#f59e0b]/5 rounded-xl">
                                        <p className="text-sm text-[#f59e0b]">Total Participants</p>
                                        <p className="text-2xl font-bold text-[#d97706]">{stats.totalParticipants}</p>
                                    </div>
                                    <div className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl">
                                        <p className="text-sm text-blue-600">Events Completed</p>
                                        <p className="text-2xl font-bold text-blue-700">{stats.completedEvents}</p>
                                    </div>
                                    <div className="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl">
                                        <p className="text-sm text-green-600">People Reached</p>
                                        <p className="text-2xl font-bold text-green-700">{stats.totalReached}</p>
                                    </div>
                                    <div className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-xl">
                                        <p className="text-sm text-purple-600">New Muslims</p>
                                        <p className="text-2xl font-bold text-purple-700">{stats.newMuslimsSupported}</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <Button onClick={() => exportToCSV(participants, "dawa_participants_report")} className="bg-[#29b6b0] hover:bg-[#239e99]">
                                        <Download size={16} className="mr-2" />
                                        Export Participants Report
                                    </Button>
                                    <Button onClick={() => exportToCSV(events, "dawa_events_report")} variant="outline">
                                        <Download size={16} className="mr-2" />
                                        Export Events Report
                                    </Button>
                                    <Button onClick={() => exportToCSV(newMuslims, "new_muslims_report")} variant="outline">
                                        <Download size={16} className="mr-2" />
                                        Export New Muslims Report
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Program Distribution</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {["awareness", "mentorship", "interfaith", "new_muslim"].map((program) => {
                                        const count = participants.filter(p => p.program === program).length;
                                        const percentage = stats.totalParticipants > 0 ? (count / stats.totalParticipants) * 100 : 0;
                                        return (
                                            <div key={program}>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="capitalize">{program.replace("_", " ")}</span>
                                                    <span className="font-medium">{count} participants ({percentage.toFixed(0)}%)</span>
                                                </div>
                                                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-[#f59e0b] to-[#d97706] rounded-full transition-all duration-500"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Add Participant Dialog */}
                <Dialog open={isAddParticipantOpen} onOpenChange={setIsAddParticipantOpen}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Register New Participant</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div>
                                <Label htmlFor="name">Full Name *</Label>
                                <Input
                                    id="name"
                                    placeholder="Enter full name"
                                    value={regName}
                                    onChange={(e) => setRegName(e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="phone">Phone Number *</Label>
                                <Input
                                    id="phone"
                                    placeholder="+251 9XX XXX XXX"
                                    value={regPhone}
                                    onChange={(e) => setRegPhone(e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="email@example.com"
                                    value={regEmail}
                                    onChange={(e) => setRegEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="program">Program *</Label>
                                <Select value={regProgram} onValueChange={setRegProgram}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select program" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="awareness">Islamic Awareness</SelectItem>
                                        <SelectItem value="mentorship">Youth Mentorship</SelectItem>
                                        <SelectItem value="interfaith">Interfaith Dialogue</SelectItem>
                                        <SelectItem value="new_muslim">New Muslim Support</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="role">Role</Label>
                                <Select value={regRole} onValueChange={setRegRole}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="participant">Participant</SelectItem>
                                        <SelectItem value="volunteer">Volunteer</SelectItem>
                                        <SelectItem value="speaker">Speaker</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                    id="notes"
                                    placeholder="Any additional notes..."
                                    value={regNotes}
                                    onChange={(e) => setRegNotes(e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddParticipantOpen(false)}>Cancel</Button>
                            <Button className="bg-[#f59e0b] hover:bg-[#d97706]" onClick={handleAddParticipant}>
                                Register Participant
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    );
};

export default DawaDashboard;
