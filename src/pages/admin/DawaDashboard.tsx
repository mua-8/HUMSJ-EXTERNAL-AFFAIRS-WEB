import { useState, useEffect } from "react";
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
import {
    subscribeToStudents,
    addStudent,
    updateStudent,
    deleteStudent,
    subscribeToEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    subscribeToNewMuslims,
    addNewMuslim,
    deleteNewMuslim,
    FirestoreStudent,
    FirestoreEvent,
    FirestoreNewMuslim
} from "@/lib/firestore";
import EventsManager from "@/components/admin/EventsManager";

type ActiveTab = "overview" | "participants" | "events" | "new-muslims" | "reports";

const DawaDashboard = () => {
    const { toast } = useToast();
    const { signOut, user } = useAuth();
    const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
    const [participants, setParticipants] = useState<FirestoreStudent[]>([]);
    const [events, setEvents] = useState<FirestoreEvent[]>([]);
    const [newMuslims, setNewMuslims] = useState<FirestoreNewMuslim[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddParticipantOpen, setIsAddParticipantOpen] = useState(false);
    const [isAddEventOpen, setIsAddEventOpen] = useState(false);
    const [isAddNewMuslimOpen, setIsAddNewMuslimOpen] = useState(false);

    // Registration form states
    const [participantForm, setParticipantForm] = useState({ name: "", phone: "", email: "", program: "", level: "beginner", instructor: "", notes: "" });
    const [eventForm, setEventForm] = useState({ title: "", description: "", date: "", location: "", type: "lecture" as any });
    const [newMuslimForm, setNewMuslimForm] = useState({ name: "", phone: "", email: "", shahadaDate: "", mentor: "", status: "active" as any, progress: 0, notes: "" });

    useEffect(() => {
        const unsubStudents = subscribeToStudents((data) => {
            setParticipants(data.filter(s => s.sector === "dawa"));
            setIsLoading(false);
        });

        const unsubEvents = subscribeToEvents((data) => {
            setEvents(data.filter(e => e.sector === "dawa"));
        });

        const unsubNewMuslims = subscribeToNewMuslims((data) => {
            setNewMuslims(data);
        });

        return () => {
            unsubStudents();
            unsubEvents();
            unsubNewMuslims();
        };
    }, []);

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

    const handleAddParticipant = async () => {
        try {
            await addStudent({
                ...participantForm,
                sector: "dawa",
                enrollmentDate: new Date().toISOString().split("T")[0],
                status: "active"
            });
            toast({ title: "Success", description: "Participant registered successfully" });
            setIsAddParticipantOpen(false);
            setParticipantForm({ name: "", phone: "", email: "", program: "", level: "beginner", instructor: "", notes: "" });
        } catch (e) {
            toast({ title: "Error", description: "Failed to add participant", variant: "destructive" });
        }
    };

    const handleAddEvent = async () => {
        try {
            await addEvent({
                ...eventForm,
                sector: "dawa",
                status: "approved",
                category: "Dawa"
            } as any);
            toast({ title: "Success", description: "Event created successfully" });
            setIsAddEventOpen(false);
            setEventForm({ title: "", description: "", date: "", location: "", type: "lecture" });
        } catch (e) {
            toast({ title: "Error", description: "Failed to create event" });
        }
    };

    const handleAddNewMuslim = async () => {
        try {
            await addNewMuslim({
                ...newMuslimForm,
                coursesCompleted: []
            });
            toast({ title: "Success", description: "New Muslim record added" });
            setIsAddNewMuslimOpen(false);
            setNewMuslimForm({ name: "", phone: "", email: "", shahadaDate: "", mentor: "", status: "active", progress: 0, notes: "" });
        } catch (e) {
            toast({ title: "Error", description: "Failed to add record" });
        }
    };

    const handleApprove = async (id: string) => {
        await updateStudent(id, { status: "active" });
        toast({ title: "Approved", description: "Participant has been approved" });
    };

    const handleReject = async (id: string) => {
        await updateStudent(id, { status: "inactive" });
        toast({ title: "Rejected", description: "Participant has been rejected", variant: "destructive" });
    };

    const handleDelete = async (id: string, type: "participant" | "event" | "newMuslim") => {
        if (!confirm("Are you sure?")) return;
        try {
            if (type === "participant") await deleteStudent(id);
            else if (type === "event") await deleteEvent(id);
            else await deleteNewMuslim(id);
            toast({ title: "Deleted", description: "Record has been deleted" });
        } catch (e) {
            toast({ title: "Error", description: "Failed to delete" });
        }
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
            <aside className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-[#25A7A1] to-[#1F8B86] p-6 hidden lg:flex flex-col z-50 shadow-xl">
                <div className="flex items-center gap-3 mb-8">
                    <img src={humjsLogo} alt="HUMSJ" className="h-10 w-auto" />
                    <div>
                        <h2 className="font-serif font-bold text-white">HUMSJ</h2>
                        <p className="text-xs text-white/80">🔵 Dawa Sector</p>
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
                            <Card className="border-l-4 border-l-[#25A7A1] hover:shadow-lg transition-shadow">
                                <CardContent className="flex items-center gap-4 pt-6">
                                    <div className="w-12 h-12 rounded-xl bg-[#25A7A1]/10 flex items-center justify-center">
                                        <Users size={24} className="text-[#25A7A1]" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{stats.totalParticipants}</p>
                                        <p className="text-sm text-gray-500">Total Participants</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-l-4 border-l-[#25A7A1] hover:shadow-lg transition-shadow">
                                <CardContent className="flex items-center gap-4 pt-6">
                                    <div className="w-12 h-12 rounded-xl bg-[#25A7A1]/10 flex items-center justify-center">
                                        <Calendar size={24} className="text-[#25A7A1]" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{stats.upcomingEvents}</p>
                                        <p className="text-sm text-gray-500">Upcoming Events</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-l-4 border-l-[#25A7A1] hover:shadow-lg transition-shadow">
                                <CardContent className="flex items-center gap-4 pt-6">
                                    <div className="w-12 h-12 rounded-xl bg-[#25A7A1]/10 flex items-center justify-center">
                                        <Target size={24} className="text-[#25A7A1]" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{stats.totalReached}</p>
                                        <p className="text-sm text-gray-500">People Reached</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-l-4 border-l-[#25A7A1] hover:shadow-lg transition-shadow">
                                <CardContent className="flex items-center gap-4 pt-6">
                                    <div className="w-12 h-12 rounded-xl bg-[#25A7A1]/10 flex items-center justify-center">
                                        <Heart size={24} className="text-[#25A7A1]" />
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
                                        <Calendar size={20} className="text-[#25A7A1]" />
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
                                        <Heart size={20} className="text-[#25A7A1]" />
                                        New Muslims Progress
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {newMuslims.filter(n => n.status === "active").map((muslim) => (
                                            <div key={muslim.id} className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-[#25A7A1] flex items-center justify-center text-white font-bold">
                                                    {muslim.name.charAt(0)}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between mb-1">
                                                        <span className="font-medium text-sm">{muslim.name}</span>
                                                        <span className="text-xs text-gray-500">{muslim.coursesCompleted.length} courses</span>
                                                    </div>
                                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-[#25A7A1] to-[#1F8B86] rounded-full transition-all duration-500"
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
                                    <Megaphone size={20} className="text-[#25A7A1]" />
                                    Program Participation
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {["awareness", "mentorship", "interfaith", "new_muslim"].map((program) => {
                                        const count = participants.filter(p => p.program === program).length;
                                        return (
                                            <div key={program} className="text-center p-4 bg-[#25A7A1]/5 rounded-xl border border-[#25A7A1]/10">
                                                <p className="text-2xl font-bold text-[#25A7A1]">{count}</p>
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
                                    <Button className="bg-[#25A7A1] hover:bg-[#1F8B86]" onClick={() => setIsAddParticipantOpen(true)}>
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
                                                        <div className="w-8 h-8 rounded-full bg-[#25A7A1] flex items-center justify-center text-white text-sm font-bold">
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
                                                            (participant.status as string) === "pending" ? "bg-[#25A7A1]/10 text-[#25A7A1]" :
                                                                "bg-gray-100 text-gray-600"
                                                    }>
                                                        {participant.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1">
                                                        {(participant.status as string) === "pending" && (
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
                    <EventsManager sector="dawa" title="Dawa Events" />
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
                                    <Button className="bg-[#25A7A1] hover:bg-[#1F8B86]" onClick={() => setIsAddNewMuslimOpen(true)}>
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
                                                <TableCell>{new Date(muslim.shahadaDate).toLocaleDateString()}</TableCell>
                                                <TableCell>{muslim.mentor}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-[#25A7A1] rounded-full"
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
                                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-[#25A7A1]">
                                                            <Eye size={16} />
                                                        </Button>
                                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-500">
                                                            <Edit size={16} />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-8 w-8 text-red-500"
                                                            onClick={() => handleDelete(muslim.id!, "newMuslim")}
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
                                    <div className="p-4 bg-gradient-to-br from-[#25A7A1]/10 to-[#25A7A1]/5 rounded-xl">
                                        <p className="text-sm text-[#25A7A1]">People Reached</p>
                                        <p className="text-2xl font-bold text-[#25A7A1]">{stats.totalReached}</p>
                                    </div>
                                    <div className="p-4 bg-gradient-to-br from-[#25A7A1]/10 to-[#25A7A1]/5 rounded-xl">
                                        <p className="text-sm text-[#25A7A1]">New Muslims</p>
                                        <p className="text-2xl font-bold text-[#25A7A1]">{stats.newMuslimsSupported}</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <Button onClick={() => exportToCSV(participants, "dawa_participants_report")} className="bg-[#25A7A1] hover:bg-[#1F8B86]">
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
                                                        className="h-full bg-gradient-to-r from-[#25A7A1] to-[#1F8B86] rounded-full transition-all duration-500"
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
                                <Label>Full Name *</Label>
                                <Input
                                    placeholder="Enter full name"
                                    value={participantForm.name}
                                    onChange={(e) => setParticipantForm((prev) => ({ ...prev, name: e.target.value }))}
                                />
                            </div>
                            <div>
                                <Label>Phone Number *</Label>
                                <Input
                                    placeholder="+251 9XX XXX XXX"
                                    value={participantForm.phone}
                                    onChange={(e) => setParticipantForm((prev) => ({ ...prev, phone: e.target.value }))}
                                />
                            </div>
                            <div>
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    placeholder="email@example.com"
                                    value={participantForm.email}
                                    onChange={(e) => setParticipantForm((prev) => ({ ...prev, email: e.target.value }))}
                                />
                            </div>
                            <div>
                                <Label>Program *</Label>
                                <Select
                                    value={participantForm.program}
                                    onValueChange={(v) => setParticipantForm((prev) => ({ ...prev, program: v }))}
                                >
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
                                <Label>Notes</Label>
                                <Textarea
                                    placeholder="Any additional notes..."
                                    value={participantForm.notes}
                                    onChange={(e) => setParticipantForm((prev) => ({ ...prev, notes: e.target.value }))}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddParticipantOpen(false)}>Cancel</Button>
                            <Button
                                className="bg-[#25A7A1] hover:bg-[#1F8B86] text-white"
                                onClick={handleAddParticipant}
                                disabled={!participantForm.name || !participantForm.phone || !participantForm.program}
                            >
                                Register Participant
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Add Event Dialog */}
                <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create Dawa Event</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div>
                                <Label>Event Title</Label>
                                <Input
                                    placeholder="Event Name"
                                    value={eventForm.title}
                                    onChange={(e) => setEventForm((prev) => ({ ...prev, title: e.target.value }))}
                                />
                            </div>
                            <div>
                                <Label>Date</Label>
                                <Input
                                    type="date"
                                    value={eventForm.date}
                                    onChange={(e) => setEventForm((prev) => ({ ...prev, date: e.target.value }))}
                                />
                            </div>
                            <div>
                                <Label>Location</Label>
                                <Input
                                    placeholder="Venue"
                                    value={eventForm.location}
                                    onChange={(e) => setEventForm((prev) => ({ ...prev, location: e.target.value }))}
                                />
                            </div>
                            <div>
                                <Label>Description</Label>
                                <Textarea
                                    placeholder="Event Details"
                                    value={eventForm.description}
                                    onChange={(e) => setEventForm((prev) => ({ ...prev, description: e.target.value }))}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddEventOpen(false)}>Cancel</Button>
                            <Button
                                className="bg-[#25A7A1] hover:bg-[#1F8B86] text-white"
                                onClick={handleAddEvent}
                                disabled={!eventForm.title || !eventForm.date}
                            >
                                Create Event
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Add New Muslim Dialog */}
                <Dialog open={isAddNewMuslimOpen} onOpenChange={setIsAddNewMuslimOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Muslim Record</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Name</Label>
                                    <Input
                                        value={newMuslimForm.name}
                                        onChange={(e) => setNewMuslimForm((prev) => ({ ...prev, name: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <Label>Shahada Date</Label>
                                    <Input
                                        type="date"
                                        value={newMuslimForm.shahadaDate}
                                        onChange={(e) => setNewMuslimForm((prev) => ({ ...prev, shahadaDate: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div>
                                <Label>Mentor</Label>
                                <Input
                                    placeholder="Mentor Name"
                                    value={newMuslimForm.mentor}
                                    onChange={(e) => setNewMuslimForm((prev) => ({ ...prev, mentor: e.target.value }))}
                                />
                            </div>
                            <div>
                                <Label>Progress (0-100)</Label>
                                <Input
                                    type="number"
                                    value={newMuslimForm.progress}
                                    onChange={(e) => setNewMuslimForm((prev) => ({ ...prev, progress: parseInt(e.target.value) || 0 }))}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddNewMuslimOpen(false)}>Cancel</Button>
                            <Button
                                className="bg-[#25A7A1] hover:bg-[#1F8B86] text-white"
                                onClick={handleAddNewMuslim}
                                disabled={!newMuslimForm.name || !newMuslimForm.shahadaDate}
                            >
                                Save Record
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    );
};

export default DawaDashboard;
