import { useState } from "react";
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

type ActiveTab = "overview" | "students" | "activities" | "resources" | "competitions" | "reports";

// Types
interface QiratStudent {
  id: string;
  name: string;
  phone: string;
  level: "beginner" | "intermediate" | "advanced" | "hafiz";
  class: string;
  instructor: string;
  juzCompleted: number;
  enrollmentDate: string;
  status: "active" | "graduated" | "on_hold";
  progress: number;
}

interface Activity {
  id: string;
  title: string;
  type: "recitation" | "competition" | "exam" | "event";
  date: string;
  participants: number;
  status: "upcoming" | "ongoing" | "completed";
  description: string;
}

interface Resource {
  id: string;
  title: string;
  type: "audio" | "video" | "document" | "book";
  category: string;
  downloads: number;
  uploadDate: string;
}

interface Competition {
  id: string;
  title: string;
  date: string;
  participants: number;
  status: "upcoming" | "ongoing" | "completed";
  prize: string;
  category: string;
}

// Sample data
const sampleStudents: QiratStudent[] = [
  { id: "1", name: "Abdullah Hassan", phone: "+251911234567", level: "advanced", class: "Hifz Program", instructor: "Hafiz Mohammed", juzCompleted: 15, enrollmentDate: "2024-01-15", status: "active", progress: 50 },
  { id: "2", name: "Khadija Omar", phone: "+251912345678", level: "intermediate", class: "Tajweed Basics", instructor: "Qari Abdulrahman", juzCompleted: 3, enrollmentDate: "2024-06-01", status: "active", progress: 30 },
  { id: "3", name: "Bilal Ahmed", phone: "+251913456789", level: "beginner", class: "Tarteel Class", instructor: "Qari Yusuf", juzCompleted: 1, enrollmentDate: "2024-09-01", status: "active", progress: 10 },
  { id: "4", name: "Amina Ibrahim", phone: "+251914567890", level: "hafiz", class: "Qirat Styles", instructor: "Qari Ibrahim", juzCompleted: 30, enrollmentDate: "2023-01-01", status: "graduated", progress: 100 },
  { id: "5", name: "Yusuf Mohammed", phone: "+251915678901", level: "advanced", class: "Hifz Program", instructor: "Hafiz Mohammed", juzCompleted: 22, enrollmentDate: "2023-06-01", status: "active", progress: 73 },
];

const sampleActivities: Activity[] = [
  { id: "1", title: "Weekly Quran Circle", type: "recitation", date: "Every Friday", participants: 45, status: "ongoing", description: "Community Quran recitation and reflection" },
  { id: "2", title: "Ramadan Quran Competition", type: "competition", date: "2025-03-15", participants: 120, status: "upcoming", description: "Annual Quran competition during Ramadan" },
  { id: "3", title: "Tajweed Exam Level 2", type: "exam", date: "2025-01-20", participants: 35, status: "upcoming", description: "Intermediate level Tajweed assessment" },
  { id: "4", title: "Hifz Graduation Ceremony", type: "event", date: "2024-12-15", participants: 200, status: "completed", description: "Graduation ceremony for Hafiz students" },
];

const sampleResources: Resource[] = [
  { id: "1", title: "Tajweed Rules - Complete Guide", type: "document", category: "Tajweed", downloads: 245, uploadDate: "2024-06-15" },
  { id: "2", title: "Surah Al-Baqarah - Mishary Rashid", type: "audio", category: "Recitation", downloads: 532, uploadDate: "2024-07-01" },
  { id: "3", title: "Makharij Al-Huruf Video Course", type: "video", category: "Tajweed", downloads: 189, uploadDate: "2024-08-10" },
  { id: "4", title: "Hifz Schedule Template", type: "document", category: "Memorization", downloads: 156, uploadDate: "2024-09-01" },
  { id: "5", title: "Qirat Styles - Hafs & Warsh", type: "audio", category: "Qirat", downloads: 89, uploadDate: "2024-10-15" },
];

const sampleCompetitions: Competition[] = [
  { id: "1", title: "Annual Quran Competition", date: "2025-02-15", participants: 85, status: "upcoming", prize: "10,000 ETB", category: "Hifz" },
  { id: "2", title: "Tajweed Excellence Award", date: "2025-03-01", participants: 45, status: "upcoming", prize: "5,000 ETB", category: "Tajweed" },
  { id: "3", title: "Youth Qirat Contest", date: "2025-04-10", participants: 60, status: "upcoming", prize: "7,500 ETB", category: "Recitation" },
  { id: "4", title: "Ramadan Qirat Contest 2024", date: "2024-04-10", participants: 120, status: "completed", prize: "15,000 ETB", category: "Recitation" },
];

const QiratDashboard = () => {
  const { toast } = useToast();
  const { signOut, user } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [students, setStudents] = useState<QiratStudent[]>(sampleStudents);
  const [activities, setActivities] = useState<Activity[]>(sampleActivities);
  const [resources, setResources] = useState<Resource[]>(sampleResources);
  const [competitions, setCompetitions] = useState<Competition[]>(sampleCompetitions);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [isAddResourceOpen, setIsAddResourceOpen] = useState(false);

  const stats = {
    totalStudents: students.length,
    activeStudents: students.filter(s => s.status === "active").length,
    hafizStudents: students.filter(s => s.level === "hafiz" || s.status === "graduated").length,
    totalActivities: activities.length,
    upcomingCompetitions: competitions.filter(c => c.status === "upcoming").length,
    totalResources: resources.length,
    totalDownloads: resources.reduce((sum, r) => sum + r.downloads, 0),
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
    { icon: BookOpen, label: "Resources", tab: "resources" as const },
    { icon: Trophy, label: "Competitions", tab: "competitions" as const },
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
              <Card className="border-l-4 border-l-[#25A7A1] hover:shadow-lg transition-shadow">
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="w-12 h-12 rounded-xl bg-[#25A7A1]/10 flex items-center justify-center">
                    <Award size={24} className="text-[#25A7A1]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">92%</p>
                    <p className="text-sm text-gray-500">Attendance Rate</p>
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
                      const count = students.filter(s => s.class === cls && s.status === "active").length;
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
                    {filteredStudents.map((student) => (
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
                        <TableCell>{student.class}</TableCell>
                        <TableCell>{student.instructor}</TableCell>
                        <TableCell>
                          <Badge className={getLevelColor(student.level)}>{student.level}</Badge>
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
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-500">
                              <Edit size={16} />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500">
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
                    {activities.map((activity) => (
                      <TableRow key={activity.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div>
                            <p className="font-medium">{activity.title}</p>
                            <p className="text-xs text-gray-500">{activity.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">{activity.type}</Badge>
                        </TableCell>
                        <TableCell>{activity.date}</TableCell>
                        <TableCell>{activity.participants}</TableCell>
                        <TableCell>
                          <Badge className={
                            activity.status === "upcoming" ? "bg-blue-100 text-blue-600" :
                              activity.status === "ongoing" ? "bg-green-100 text-green-600" :
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
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-500">
                              <Edit size={16} />
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
                    {resources.map((resource) => (
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
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-500">
                              <Edit size={16} />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500">
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

        {/* Competitions Tab */}
        {activeTab === "competitions" && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Quran Competitions</CardTitle>
                <Button className="bg-[#25A7A1] hover:bg-[#1F8B86]">
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
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-500">
                            <Edit size={16} />
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
              <Input placeholder="Full Name" />
              <Input placeholder="Phone Number" />
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hifz">Hifz Program</SelectItem>
                  <SelectItem value="tajweed">Tajweed Basics</SelectItem>
                  <SelectItem value="qirat">Qirat Styles</SelectItem>
                  <SelectItem value="tarteel">Tarteel Class</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddStudentOpen(false)}>Cancel</Button>
              <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => {
                toast({ title: "Student Added", description: "New Qirat student has been enrolled." });
                setIsAddStudentOpen(false);
              }}>
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
              <Input placeholder="Activity Title" />
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Activity Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recitation">Recitation Circle</SelectItem>
                  <SelectItem value="competition">Competition</SelectItem>
                  <SelectItem value="exam">Exam</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                </SelectContent>
              </Select>
              <Input type="date" />
              <Textarea placeholder="Description" />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddActivityOpen(false)}>Cancel</Button>
              <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => {
                toast({ title: "Activity Added", description: "New activity has been created." });
                setIsAddActivityOpen(false);
              }}>
                Add Activity
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
              <Input placeholder="Resource Title" />
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Resource Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="book">Book</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Category (e.g., Tajweed, Recitation)" />
              <Input type="file" />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddResourceOpen(false)}>Cancel</Button>
              <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => {
                toast({ title: "Resource Uploaded", description: "New resource has been added." });
                setIsAddResourceOpen(false);
              }}>
                Upload
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default QiratDashboard;
