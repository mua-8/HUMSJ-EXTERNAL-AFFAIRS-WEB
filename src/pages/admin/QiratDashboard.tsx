import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Mic,
  Users,
  Award,
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
  Clock,
  Target,
  Trophy,
  UserPlus,
  Check,
  X,
  UserCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import humjsLogo from "@/assets/humjs-logo.png";
import {
  subscribeToRegistrations,
  updateRegistration,
  deleteRegistration,
  FirestoreRegistration,
  subscribeToStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  subscribeToPrograms,
  addProgram,
  updateProgram,
  deleteProgram,
  subscribeToResources,
  addResource,
  updateResource,
  deleteResource,
  subscribeToCompetitions,
  addCompetition,
  updateCompetition,
  deleteCompetition,
  FirestoreStudent as QiratStudent,
  FirestoreProgram as Activity,
  FirestoreResource as Resource,
  FirestoreCompetition as Competition
} from "@/lib/firestore";
import EventsManager from "@/components/admin/EventsManager";
import { Label } from "@/components/ui/label";

type ActiveTab = "overview" | "students" | "enrollments" | "activities" | "events" | "resources" | "competitions" | "reports";

// Types
// Sample data removed for live implementation

const QiratDashboard = () => {
  const { toast } = useToast();
  const { signOut, user } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [students, setStudents] = useState<QiratStudent[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [registrations, setRegistrations] = useState<FirestoreRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [isAddResourceOpen, setIsAddResourceOpen] = useState(false);
  const [isAddCompetitionOpen, setIsAddCompetitionOpen] = useState(false);
  const [isEditStudentOpen, setIsEditStudentOpen] = useState(false);
  const [isEditActivityOpen, setIsEditActivityOpen] = useState(false);
  const [isEditResourceOpen, setIsEditResourceOpen] = useState(false);
  const [isEditCompetitionOpen, setIsEditCompetitionOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<QiratStudent | null>(null);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [editingCompetition, setEditingCompetition] = useState<Competition | null>(null);

  // Form states
  const [studentForm, setStudentForm] = useState({ name: "", phone: "", level: "beginner" as const, program: "Hifz Program", instructor: "", juzCompleted: 0, status: "active" as const });
  const [activityForm, setActivityForm] = useState({ name: "", type: "recitation", day: "", time: "", status: "upcoming" as const, description: "" });
  const [resourceForm, setResourceForm] = useState({ title: "", type: "document" as const, category: "Tajweed" });
  const [competitionForm, setCompetitionForm] = useState({ title: "", date: "", prize: "", category: "Hifz", status: "upcoming" as const });

  useEffect(() => {
    const unsubReg = subscribeToRegistrations((data) => {
      setRegistrations(data.filter(r => r.sector === "qirat" && r.type === "student"));
    });

    const unsubStudents = subscribeToStudents((data) => {
      setStudents(data.filter(s => s.sector === "qirat") as any);
      setIsLoading(false);
    });

    const unsubPrograms = subscribeToPrograms((data) => {
      setActivities(data.filter(p => p.sector === "qirat") as any);
    });

    const unsubResources = subscribeToResources((data) => {
      setResources(data.filter(r => r.sector === "qirat") as any);
    });

    const unsubCompetitions = subscribeToCompetitions((data) => {
      setCompetitions(data);
    });

    return () => {
      unsubReg();
      unsubStudents();
      unsubPrograms();
      unsubResources();
      unsubCompetitions();
    };
  }, []);

  // CRUD Handlers
  const handleAddStudent = async () => {
    try {
      await addStudent({
        ...studentForm,
        sector: "qirat",
        progress: (studentForm.juzCompleted / 30) * 100,
        enrollmentDate: new Date().toISOString(),
      } as any);
      toast({ title: "Student Added", description: "Student enrolled in Qirat program." });
      setIsAddStudentOpen(false);
      setStudentForm({ name: "", phone: "", level: "beginner", program: "Hifz Program", instructor: "", juzCompleted: 0, status: "active" });
    } catch (e) {
      toast({ title: "Error", description: "Failed to add student.", variant: "destructive" });
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (!confirm("Delete student record?")) return;
    await deleteStudent(id);
    toast({ title: "Deleted", description: "Student record removed." });
  };

  const handleAddActivity = async () => {
    try {
      await addProgram({
        ...activityForm,
        sector: "qirat",
        students: 0,
      } as any);
      toast({ title: "Activity Added", description: "New Qirat activity created." });
      setIsAddActivityOpen(false);
    } catch (e) {
      toast({ title: "Error", description: "Failed to add activity.", variant: "destructive" });
    }
  };

  const handleDeleteActivity = async (id: string) => {
    if (!confirm("Delete activity?")) return;
    await deleteProgram(id);
  };

  const handleAddResource = async () => {
    try {
      await addResource({
        ...resourceForm,
        sector: "qirat",
        downloads: 0,
        uploadDate: new Date().toISOString(),
      } as any);
      toast({ title: "Resource Uploaded", description: "New material added to Qirat library." });
      setIsAddResourceOpen(false);
    } catch (e) {
      toast({ title: "Error", description: "Failed to upload resource.", variant: "destructive" });
    }
  };

  const handleDeleteResource = async (id: string) => {
    if (!confirm("Delete resource?")) return;
    await deleteResource(id);
  };

  const handleAddCompetition = async () => {
    try {
      await addCompetition({
        ...competitionForm,
        participants: 0,
      } as any);
      toast({ title: "Competition Added", description: "New competition scheduled." });
      setIsAddCompetitionOpen(false);
    } catch (e) {
      toast({ title: "Error", description: "Failed to schedule competition.", variant: "destructive" });
    }
  };

  const handleDeleteCompetition = async (id: string) => {
    if (!confirm("Delete competition?")) return;
    await deleteCompetition(id);
  };

  // Edit Handlers
  const handleEditStudent = (student: QiratStudent) => {
    setEditingStudent(student);
    setStudentForm({
      name: student.name,
      phone: student.phone,
      level: student.level as any,
      program: student.program,
      instructor: student.instructor,
      juzCompleted: student.juzCompleted || 0,
      status: student.status as any
    });
    setIsEditStudentOpen(true);
  };

  const handleUpdateStudent = async () => {
    if (!editingStudent?.id) return;
    try {
      await updateStudent(editingStudent.id, {
        name: studentForm.name,
        phone: studentForm.phone,
        level: studentForm.level,
        program: studentForm.program,
        instructor: studentForm.instructor,
        juzCompleted: studentForm.juzCompleted,
        progress: (studentForm.juzCompleted / 30) * 100,
        status: studentForm.status
      });
      toast({ title: "Student Updated", description: "Student information has been updated." });
      setIsEditStudentOpen(false);
      setEditingStudent(null);
      setStudentForm({ name: "", phone: "", level: "beginner", program: "Hifz Program", instructor: "", juzCompleted: 0, status: "active" });
    } catch (e) {
      toast({ title: "Error", description: "Failed to update student.", variant: "destructive" });
    }
  };

  const handleEditActivity = (activity: Activity) => {
    setEditingActivity(activity);
    setActivityForm({
      name: activity.name,
      type: activity.type,
      day: activity.day,
      time: activity.time,
      status: activity.status as any,
      description: activity.description || ""
    });
    setIsEditActivityOpen(true);
  };

  const handleUpdateActivity = async () => {
    if (!editingActivity?.id) return;
    try {
      await updateProgram(editingActivity.id, {
        name: activityForm.name,
        type: activityForm.type,
        day: activityForm.day,
        time: activityForm.time,
        status: activityForm.status,
        description: activityForm.description
      });
      toast({ title: "Activity Updated", description: "Activity has been updated." });
      setIsEditActivityOpen(false);
      setEditingActivity(null);
      setActivityForm({ name: "", type: "recitation", day: "", time: "", status: "upcoming", description: "" });
    } catch (e) {
      toast({ title: "Error", description: "Failed to update activity.", variant: "destructive" });
    }
  };

  const handleEditResource = (resource: Resource) => {
    setEditingResource(resource);
    setResourceForm({
      title: resource.title,
      type: resource.type as any,
      category: resource.category
    });
    setIsEditResourceOpen(true);
  };

  const handleUpdateResource = async () => {
    if (!editingResource?.id) return;
    try {
      await updateResource(editingResource.id, {
        title: resourceForm.title,
        type: resourceForm.type,
        category: resourceForm.category
      });
      toast({ title: "Resource Updated", description: "Resource has been updated." });
      setIsEditResourceOpen(false);
      setEditingResource(null);
      setResourceForm({ title: "", type: "document", category: "Tajweed" });
    } catch (e) {
      toast({ title: "Error", description: "Failed to update resource.", variant: "destructive" });
    }
  };

  const handleEditCompetition = (competition: Competition) => {
    setEditingCompetition(competition);
    setCompetitionForm({
      title: competition.title,
      date: competition.date,
      prize: competition.prize,
      category: competition.category,
      status: competition.status as any
    });
    setIsEditCompetitionOpen(true);
  };

  const handleUpdateCompetition = async () => {
    if (!editingCompetition?.id) return;
    try {
      await updateCompetition(editingCompetition.id, {
        title: competitionForm.title,
        date: competitionForm.date,
        prize: competitionForm.prize,
        category: competitionForm.category,
        status: competitionForm.status
      });
      toast({ title: "Competition Updated", description: "Competition has been updated." });
      setIsEditCompetitionOpen(false);
      setEditingCompetition(null);
      setCompetitionForm({ title: "", date: "", prize: "", category: "Hifz", status: "upcoming" });
    } catch (e) {
      toast({ title: "Error", description: "Failed to update competition.", variant: "destructive" });
    }
  };

  const [isRegLoading, setIsRegLoading] = useState(true);

  useEffect(() => {
    if (registrations) {
      setIsRegLoading(false);
    }
  }, [registrations]);

  const handleApproveRegistration = async (id: string) => {
    try {
      await updateRegistration(id, { status: "approved" });
      toast({ title: "Registration Approved", description: "Student has been approved." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to approve registration.", variant: "destructive" });
    }
  };

  const handleDeleteRegistration = async (id: string) => {
    if (!confirm("Are you sure you want to delete this registration?")) return;
    try {
      await deleteRegistration(id);
      toast({ title: "Registration Deleted", description: "The registration has been removed." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete registration.", variant: "destructive" });
    }
  };

  const stats = {
    totalStudents: students.length,
    activeStudents: students.filter(s => s.status === "active").length,
    hafizStudents: students.filter(s => s.level === "hafiz" || s.status === "graduated").length,
    totalActivities: activities.length,
    upcomingCompetitions: competitions.filter(c => c.status === "upcoming").length,
    totalResources: resources.length,
    totalDownloads: resources.reduce((sum, r) => sum + r.downloads, 0),
    pendingRegistrations: registrations.filter(r => r.status === "pending").length,
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.program.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.instructor.toLowerCase().includes(searchQuery.toLowerCase())
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

  const navItems = [
    { icon: Mic, label: "Overview", tab: "overview" as const },
    { icon: Users, label: "Students", tab: "students" as const },
    { icon: Calendar, label: "Activities", tab: "activities" as const },
    { icon: Calendar, label: "Events", tab: "events" as const },
    { icon: BookOpen, label: "Resources", tab: "resources" as const },
    { icon: Trophy, label: "Competitions", tab: "competitions" as const },
    { icon: UserCheck, label: "Enrollments", tab: "enrollments" as const, badge: stats.pendingRegistrations > 0 ? stats.pendingRegistrations : undefined },
    { icon: BarChart3, label: "Reports", tab: "reports" as const },
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner": return "bg-green-100 text-green-600";
      case "intermediate": return "bg-blue-100 text-blue-600";
      case "advanced": return "bg-[#25A7A1]/20 text-[#25A7A1]";
      case "hafiz": return "bg-amber-100 text-amber-600";
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
            <p className="text-xs text-white/80">🟢 Qirat Sector</p>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          {navItems.map((item) => (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === item.tab
                ? "bg-white/20 text-white shadow-lg"
                : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} />
                {item.label}
              </div>
              {item.badge !== undefined && (
                <span className="bg-white text-[#25A7A1] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                  {item.badge}
                </span>
              )}
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
            🟢 Qirat Sector Dashboard
          </h1>
          <p className="text-[#64748b]">Manage Quran recitation programs</p>
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
                    <p className="text-2xl font-bold">{stats.totalStudents}</p>
                    <p className="text-sm text-gray-500">Total Students</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-[#25A7A1] hover:shadow-lg transition-shadow">
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="w-12 h-12 rounded-xl bg-[#25A7A1]/10 flex items-center justify-center">
                    <BookOpen size={24} className="text-[#25A7A1]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.activeStudents}</p>
                    <p className="text-sm text-gray-500">Currently Active</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-[#25A7A1] hover:shadow-lg transition-shadow">
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="w-12 h-12 rounded-xl bg-[#25A7A1]/10 flex items-center justify-center">
                    <Star size={24} className="text-[#25A7A1]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.hafizStudents}</p>
                    <p className="text-sm text-gray-500">Hafiz Students</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-amber-500 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("enrollments")}>
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <UserPlus size={24} className="text-amber-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.pendingRegistrations}</p>
                    <p className="text-sm text-gray-500">Pending Enrollments</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mic size={20} className="text-[#25A7A1]" />
                    Active Quran Classes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {["Hifz Program", "Tajweed Basics", "Qirat Styles", "Tarteel Class"].map((cls, index) => {
                      const count = students.filter(s => s.program === cls && s.status === "active").length;
                      return (
                        <div key={cls} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#25A7A1] flex items-center justify-center text-white font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium">{cls}</p>
                              <p className="text-sm text-gray-500">{count} active students</p>
                            </div>
                          </div>
                          <Badge className="bg-[#25A7A1]/10 text-[#25A7A1]">Active</Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy size={20} className="text-amber-500" />
                    Upcoming Competitions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {competitions.filter(c => c.status === "upcoming").map((comp) => (
                      <div key={comp.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div>
                          <p className="font-medium">{comp.title}</p>
                          <p className="text-sm text-gray-500">{new Date(comp.date).toLocaleDateString()} • {comp.category}</p>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-amber-100 text-amber-600">{comp.prize}</Badge>
                          <p className="text-xs text-gray-400 mt-1">{comp.participants} registered</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target size={20} className="text-green-500" />
                  Student Progress Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students.filter(s => s.status === "active").slice(0, 5).map((student) => (
                    <div key={student.id} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#25A7A1] flex items-center justify-center text-white font-bold">
                        {student.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">{student.name}</span>
                          <span className="text-sm text-gray-500">{student.juzCompleted}/30 Juz</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#25A7A1] to-[#1F8B86] rounded-full transition-all duration-500"
                            style={{ width: `${student.progress}%` }}
                          />
                        </div>
                      </div>
                      <Badge className={getLevelColor(student.level)}>{student.level}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Students Tab */}
        {activeTab === "students" && (
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle>Qirat Students</CardTitle>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <Input
                      placeholder="Search students..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 w-64"
                    />
                  </div>
                  <Button className="bg-[#25A7A1] hover:bg-[#1F8B86]" onClick={() => setIsAddStudentOpen(true)}>
                    <UserPlus size={16} className="mr-2" />
                    Register Student
                  </Button>
                  <Button variant="outline" onClick={() => exportToCSV(students, "qirat_students")}>
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
                      <TableHead>Class</TableHead>
                      <TableHead>Instructor</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Loading qirat students...</TableCell>
                      </TableRow>
                    ) : filteredStudents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No students found.</TableCell>
                      </TableRow>
                    ) : (
                      filteredStudents.map((student) => (
                        <TableRow key={student.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-[#25A7A1] flex items-center justify-center text-white text-sm font-bold">
                                {student.name.charAt(0)}
                              </div>
                              {student.name}
                            </div>
                          </TableCell>
                          <TableCell>{student.phone}</TableCell>
                          <TableCell>{student.program}</TableCell>
                          <TableCell>{student.instructor}</TableCell>
                          <TableCell>
                            <Badge className={getLevelColor(student.level as any)}>{student.level}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-[#25A7A1] rounded-full"
                                  style={{ width: `${student.progress}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-500">{student.juzCompleted}/30</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={
                              student.status === "active" ? "bg-[#25A7A1]/10 text-[#25A7A1] border-[#25A7A1]/20" :
                                student.status === "graduated" ? "bg-amber-100 text-amber-600" :
                                  "bg-gray-100 text-gray-600"
                            }>
                              {student.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button size="icon" variant="ghost" className="h-8 w-8 text-[#25A7A1]">
                                <Eye size={16} />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-8 w-8 text-gray-500"
                                onClick={() => handleEditStudent(student)}
                              >
                                <Edit size={16} />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-red-500 hover:bg-red-50"
                                onClick={() => handleDeleteStudent(student.id!)}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enrollments Tab */}
        {activeTab === "enrollments" && (
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>New Student Enrollments</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Review and manage incoming student applications</p>
                </div>
                <Button variant="outline" onClick={() => exportToCSV(registrations, "qirat_enrollments")} disabled={registrations.length === 0}>
                  <Download size={16} className="mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Details</TableHead>
                      <TableHead>Program/Level</TableHead>
                      <TableHead>Department/Year</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date Received</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isRegLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          Loading enrollments...
                        </TableCell>
                      </TableRow>
                    ) : registrations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No new enrollments found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      registrations.map((reg) => (
                        <TableRow key={reg.id} className="hover:bg-gray-50">
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-900">{reg.name}</span>
                              <span className="text-xs text-gray-500">{reg.phone}</span>
                              {reg.email && <span className="text-[10px] text-gray-400">{reg.email}</span>}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-sm border-l-2 border-[#25A7A1] pl-2 capitalize">{reg.program || "General"}</span>
                              <span className="text-xs text-gray-500 pl-2">{reg.interest || "No specified level"}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col text-sm">
                              <span>{reg.department || "N/A"}</span>
                              <span className="text-[10px] text-gray-400">{reg.year || ""}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={
                              reg.status === "pending" ? "bg-amber-100 text-amber-600 border-amber-200" :
                                reg.status === "approved" ? "bg-green-100 text-green-600 border-green-200" :
                                  "bg-gray-100 text-gray-600 border-gray-200"
                            }>
                              {reg.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-gray-500 font-mono">
                            {reg.createdAt?.toDate().toLocaleDateString() || "N/A"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {reg.status === "pending" && (
                                <Button
                                  size="sm"
                                  className="h-8 bg-[#25A7A1] hover:bg-[#1F8B86] text-white gap-1"
                                  onClick={() => handleApproveRegistration(reg.id!)}
                                >
                                  <Check size={14} />
                                  Approve
                                </Button>
                              )}
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-700"
                                onClick={() => handleDeleteRegistration(reg.id!)}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Activities Tab */}
        {activeTab === "activities" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Activities & Events</CardTitle>
                  <Button className="bg-[#25A7A1] hover:bg-[#1F8B86]" onClick={() => setIsAddActivityOpen(true)}>
                    <Plus size={16} className="mr-2" />
                    Add Activity
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Participants</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading activities...</TableCell>
                      </TableRow>
                    ) : activities.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No activities found.</TableCell>
                      </TableRow>
                    ) : (
                      activities.map((activity) => (
                        <TableRow key={activity.id} className="hover:bg-gray-50">
                          <TableCell>
                            <div>
                              <p className="font-medium">{activity.name}</p>
                              <p className="text-xs text-gray-500">{activity.description}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">{activity.type}</Badge>
                          </TableCell>
                          <TableCell>{activity.day} {activity.time}</TableCell>
                          <TableCell>{activity.students}</TableCell>
                          <TableCell>
                            <Badge className={
                              activity.status === "upcoming" ? "bg-blue-100 text-blue-600" :
                                activity.status === "active" ? "bg-green-100 text-green-600" :
                                  "bg-gray-100 text-gray-600"
                            }>
                              {activity.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button size="icon" variant="ghost" className="h-8 w-8 text-[#25A7A1]">
                                <Eye size={16} />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-gray-500"
                                onClick={() => handleEditActivity(activity)}
                              >
                                <Edit size={16} />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-red-500 hover:bg-red-50"
                                onClick={() => handleDeleteActivity(activity.id!)}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === "events" && (
          <EventsManager sector="qirat" title="Qirat Events" />
        )}

        {/* Resources Tab */}
        {activeTab === "resources" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-[#25A7A1] to-[#1F8B86] text-white">
                <CardContent className="pt-6">
                  <p className="text-white/80">Total Resources</p>
                  <p className="text-3xl font-bold">{stats.totalResources}</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardContent className="pt-6">
                  <p className="text-blue-100">Total Downloads</p>
                  <p className="text-3xl font-bold">{stats.totalDownloads}</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardContent className="pt-6">
                  <p className="text-green-100">Audio Files</p>
                  <p className="text-3xl font-bold">{resources.filter(r => r.type === "audio").length}</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
                <CardContent className="pt-6">
                  <p className="text-amber-100">Documents</p>
                  <p className="text-3xl font-bold">{resources.filter(r => r.type === "document").length}</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Learning Resources</CardTitle>
                  <Button className="bg-[#25A7A1] hover:bg-[#1F8B86]" onClick={() => setIsAddResourceOpen(true)}>
                    <Plus size={16} className="mr-2" />
                    Upload Resource
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Downloads</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading resources...</TableCell>
                      </TableRow>
                    ) : resources.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No resources found.</TableCell>
                      </TableRow>
                    ) : (
                      resources.map((resource) => (
                        <TableRow key={resource.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">{resource.title}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">{resource.type}</Badge>
                          </TableCell>
                          <TableCell>{resource.category}</TableCell>
                          <TableCell>{resource.downloads}</TableCell>
                          <TableCell>{new Date(resource.uploadDate).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button size="icon" variant="ghost" className="h-8 w-8 text-[#25A7A1]">
                                <Download size={16} />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-gray-500"
                                onClick={() => handleEditResource(resource)}
                              >
                                <Edit size={16} />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-red-500 hover:bg-red-50"
                                onClick={() => handleDeleteResource(resource.id!)}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Competitions Tab */}
        {activeTab === "competitions" && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Quran Competitions</CardTitle>
                <Button className="bg-[#25A7A1] hover:bg-[#1F8B86]" onClick={() => setIsAddCompetitionOpen(true)}>
                  <Plus size={16} className="mr-2" />
                  Add Competition
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>Prize</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {competitions.map((comp) => (
                    <TableRow key={comp.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{comp.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{comp.category}</Badge>
                      </TableCell>
                      <TableCell>{new Date(comp.date).toLocaleDateString()}</TableCell>
                      <TableCell>{comp.participants}</TableCell>
                      <TableCell className="font-semibold text-amber-600">{comp.prize}</TableCell>
                      <TableCell>
                        <Badge className={comp.status === "upcoming" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"}>
                          {comp.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-[#25A7A1]">
                            <Eye size={16} />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 text-gray-500"
                            onClick={() => handleEditCompetition(comp)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-red-500 hover:bg-red-50"
                            onClick={() => handleDeleteCompetition(comp.id!)}
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
        )}

        {/* Reports Tab */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 size={20} />
                  Qirat Sector Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="p-4 bg-gradient-to-br from-[#25A7A1]/10 to-[#25A7A1]/20 rounded-xl border border-[#25A7A1]/20">
                    <p className="text-sm text-[#25A7A1]">Total Students</p>
                    <p className="text-2xl font-bold text-[#25A7A1]">{stats.totalStudents}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                    <p className="text-sm text-green-600">Active Students</p>
                    <p className="text-2xl font-bold text-green-700">{stats.activeStudents}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl">
                    <p className="text-sm text-amber-600">Hafiz Graduates</p>
                    <p className="text-2xl font-bold text-amber-700">{stats.hafizStudents}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl border-l-4 border-[#25A7A1]">
                    <p className="text-sm text-gray-500">This Month</p>
                    <p className="text-2xl font-bold text-[#25A7A1]">92%</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button onClick={() => exportToCSV(students, "qirat_students_report")} className="bg-[#25A7A1] hover:bg-[#1F8B86]">
                    <Download size={16} className="mr-2" />
                    Export Students Report
                  </Button>
                  <Button onClick={() => exportToCSV(activities, "activities_report")} variant="outline">
                    <Download size={16} className="mr-2" />
                    Export Activities Report
                  </Button>
                  <Button onClick={() => exportToCSV(competitions, "competitions_report")} variant="outline">
                    <Download size={16} className="mr-2" />
                    Export Competitions Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Student Level Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["beginner", "intermediate", "advanced", "hafiz"].map((level) => {
                    const count = students.filter(s => s.level === level).length;
                    const percentage = (count / students.length) * 100;
                    return (
                      <div key={level}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize">{level}</span>
                          <span className="font-medium">{count} students ({percentage.toFixed(0)}%)</span>
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

        {/* Add Student Dialog */}
        <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Qirat Student</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  placeholder="Full Name"
                  value={studentForm.name}
                  onChange={(e) => setStudentForm((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  placeholder="Phone Number"
                  value={studentForm.phone}
                  onChange={(e) => setStudentForm((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Class/Program</Label>
                <Select
                  value={studentForm.program}
                  onValueChange={(value) => setStudentForm((prev) => ({ ...prev, program: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hifz Program">Hifz Program</SelectItem>
                    <SelectItem value="Tajweed Basics">Tajweed Basics</SelectItem>
                    <SelectItem value="Qirat Styles">Qirat Styles</SelectItem>
                    <SelectItem value="Tarteel Class">Tarteel Class</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Level</Label>
                  <Select
                    value={studentForm.level}
                    onValueChange={(value: any) => setStudentForm((prev) => ({ ...prev, level: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="hafiz">Hafiz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Juz Completed</Label>
                  <Input
                    type="number"
                    min="0"
                    max="30"
                    value={studentForm.juzCompleted}
                    onChange={(e) => setStudentForm((prev) => ({ ...prev, juzCompleted: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Instructor (Optional)</Label>
                <Input
                  placeholder="Instructor Name"
                  value={studentForm.instructor}
                  onChange={(e) => setStudentForm((prev) => ({ ...prev, instructor: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddStudentOpen(false)}>Cancel</Button>
              <Button
                className="bg-[#25A7A1] hover:bg-[#1F8B86] text-white"
                onClick={handleAddStudent}
                disabled={!studentForm.name || !studentForm.phone}
              >
                Add Student
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Activity Dialog */}
        <Dialog open={isAddActivityOpen} onOpenChange={setIsAddActivityOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Activity</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Activity Title</Label>
                <Input
                  placeholder="Activity Title"
                  value={activityForm.name}
                  onChange={(e) => setActivityForm((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={activityForm.type}
                    onValueChange={(value: any) => setActivityForm((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recitation">Recitation Circle</SelectItem>
                      <SelectItem value="competition">Competition</SelectItem>
                      <SelectItem value="exam">Exam</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={activityForm.status}
                    onValueChange={(value: any) => setActivityForm((prev) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="active">Active/Ongoing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Day/Date</Label>
                  <Input
                    placeholder="e.g., Every Friday"
                    value={activityForm.day}
                    onChange={(e) => setActivityForm((prev) => ({ ...prev, day: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input
                    placeholder="e.g., 4:00 PM"
                    value={activityForm.time}
                    onChange={(e) => setActivityForm((prev) => ({ ...prev, time: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Activity details..."
                  value={activityForm.description}
                  onChange={(e) => setActivityForm((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddActivityOpen(false)}>Cancel</Button>
              <Button
                className="bg-[#25A7A1] hover:bg-[#1F8B86] text-white"
                onClick={handleAddActivity}
                disabled={!activityForm.name}
              >
                Create Activity
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Resource Dialog */}
        <Dialog open={isAddResourceOpen} onOpenChange={setIsAddResourceOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload New Resource</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Resource Title</Label>
                <Input
                  placeholder="e.g., Tajweed Rules PDF"
                  value={resourceForm.title}
                  onChange={(e) => setResourceForm((prev) => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={resourceForm.type}
                    onValueChange={(value: any) => setResourceForm((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="audio">Audio</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="document">Document</SelectItem>
                      <SelectItem value="book">Book</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={resourceForm.category}
                    onValueChange={(value: any) => setResourceForm((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tajweed">Tajweed</SelectItem>
                      <SelectItem value="Recitation">Recitation</SelectItem>
                      <SelectItem value="Memorization">Memorization</SelectItem>
                      <SelectItem value="Qirat">Qirat Styles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Input type="file" className="cursor-pointer" />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddResourceOpen(false)}>Cancel</Button>
              <Button
                className="bg-[#25A7A1] hover:bg-[#1F8B86] text-white"
                onClick={handleAddResource}
                disabled={!resourceForm.title}
              >
                Upload Resource
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Competition Dialog */}
        <Dialog open={isAddCompetitionOpen} onOpenChange={setIsAddCompetitionOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule New Competition</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Competition Title</Label>
                <Input
                  placeholder="e.g., Ramadan Quran Contest"
                  value={competitionForm.title}
                  onChange={(e) => setCompetitionForm((prev) => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={competitionForm.date}
                    onChange={(e) => setCompetitionForm((prev) => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={competitionForm.category}
                    onValueChange={(value) => setCompetitionForm((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hifz">Hifz</SelectItem>
                      <SelectItem value="Tajweed">Tajweed</SelectItem>
                      <SelectItem value="Recitation">Recitation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Prize Details</Label>
                <Input
                  placeholder="e.g., 10,000 ETB + Trophy"
                  value={competitionForm.prize}
                  onChange={(e) => setCompetitionForm((prev) => ({ ...prev, prize: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddCompetitionOpen(false)}>Cancel</Button>
              <Button
                className="bg-[#25A7A1] hover:bg-[#1F8B86] text-white"
                onClick={handleAddCompetition}
                disabled={!competitionForm.title || !competitionForm.date}
              >
                Schedule Competition
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Student Dialog */}
        <Dialog open={isEditStudentOpen} onOpenChange={setIsEditStudentOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Qirat Student</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  placeholder="Full Name"
                  value={studentForm.name}
                  onChange={(e) => setStudentForm((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  placeholder="Phone Number"
                  value={studentForm.phone}
                  onChange={(e) => setStudentForm((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Class/Program</Label>
                <Select
                  value={studentForm.program}
                  onValueChange={(value) => setStudentForm((prev) => ({ ...prev, program: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hifz Program">Hifz Program</SelectItem>
                    <SelectItem value="Tajweed Basics">Tajweed Basics</SelectItem>
                    <SelectItem value="Qirat Styles">Qirat Styles</SelectItem>
                    <SelectItem value="Tarteel Class">Tarteel Class</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Level</Label>
                  <Select
                    value={studentForm.level}
                    onValueChange={(value: any) => setStudentForm((prev) => ({ ...prev, level: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="hafiz">Hafiz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Juz Completed</Label>
                  <Input
                    type="number"
                    min="0"
                    max="30"
                    value={studentForm.juzCompleted}
                    onChange={(e) => setStudentForm((prev) => ({ ...prev, juzCompleted: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={studentForm.status}
                  onValueChange={(value: any) => setStudentForm((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="graduated">Graduated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Instructor</Label>
                <Input
                  placeholder="Instructor Name"
                  value={studentForm.instructor}
                  onChange={(e) => setStudentForm((prev) => ({ ...prev, instructor: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditStudentOpen(false)}>Cancel</Button>
              <Button
                className="bg-[#25A7A1] hover:bg-[#1F8B86] text-white"
                onClick={handleUpdateStudent}
                disabled={!studentForm.name || !studentForm.phone}
              >
                Update Student
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Activity Dialog */}
        <Dialog open={isEditActivityOpen} onOpenChange={setIsEditActivityOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Activity</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Activity Title</Label>
                <Input
                  placeholder="Activity Title"
                  value={activityForm.name}
                  onChange={(e) => setActivityForm((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={activityForm.type}
                    onValueChange={(value: any) => setActivityForm((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recitation">Recitation Circle</SelectItem>
                      <SelectItem value="competition">Competition</SelectItem>
                      <SelectItem value="exam">Exam</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={activityForm.status}
                    onValueChange={(value: any) => setActivityForm((prev) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="active">Active/Ongoing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Day/Date</Label>
                  <Input
                    placeholder="e.g., Every Friday"
                    value={activityForm.day}
                    onChange={(e) => setActivityForm((prev) => ({ ...prev, day: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input
                    placeholder="e.g., 4:00 PM"
                    value={activityForm.time}
                    onChange={(e) => setActivityForm((prev) => ({ ...prev, time: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Activity details..."
                  value={activityForm.description}
                  onChange={(e) => setActivityForm((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditActivityOpen(false)}>Cancel</Button>
              <Button
                className="bg-[#25A7A1] hover:bg-[#1F8B86] text-white"
                onClick={handleUpdateActivity}
                disabled={!activityForm.name}
              >
                Update Activity
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Resource Dialog */}
        <Dialog open={isEditResourceOpen} onOpenChange={setIsEditResourceOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Resource</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Resource Title</Label>
                <Input
                  placeholder="e.g., Tajweed Rules PDF"
                  value={resourceForm.title}
                  onChange={(e) => setResourceForm((prev) => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={resourceForm.type}
                    onValueChange={(value: any) => setResourceForm((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="audio">Audio</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="document">Document</SelectItem>
                      <SelectItem value="book">Book</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={resourceForm.category}
                    onValueChange={(value: any) => setResourceForm((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tajweed">Tajweed</SelectItem>
                      <SelectItem value="Recitation">Recitation</SelectItem>
                      <SelectItem value="Memorization">Memorization</SelectItem>
                      <SelectItem value="Qirat">Qirat Styles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditResourceOpen(false)}>Cancel</Button>
              <Button
                className="bg-[#25A7A1] hover:bg-[#1F8B86] text-white"
                onClick={handleUpdateResource}
                disabled={!resourceForm.title}
              >
                Update Resource
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Competition Dialog */}
        <Dialog open={isEditCompetitionOpen} onOpenChange={setIsEditCompetitionOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Competition</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Competition Title</Label>
                <Input
                  placeholder="e.g., Ramadan Quran Contest"
                  value={competitionForm.title}
                  onChange={(e) => setCompetitionForm((prev) => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={competitionForm.date}
                    onChange={(e) => setCompetitionForm((prev) => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={competitionForm.category}
                    onValueChange={(value) => setCompetitionForm((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hifz">Hifz</SelectItem>
                      <SelectItem value="Tajweed">Tajweed</SelectItem>
                      <SelectItem value="Recitation">Recitation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={competitionForm.status}
                  onValueChange={(value: any) => setCompetitionForm((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Prize Details</Label>
                <Input
                  placeholder="e.g., 10,000 ETB + Trophy"
                  value={competitionForm.prize}
                  onChange={(e) => setCompetitionForm((prev) => ({ ...prev, prize: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditCompetitionOpen(false)}>Cancel</Button>
              <Button
                className="bg-[#25A7A1] hover:bg-[#1F8B86] text-white"
                onClick={handleUpdateCompetition}
                disabled={!competitionForm.title || !competitionForm.date}
              >
                Update Competition
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default QiratDashboard;
