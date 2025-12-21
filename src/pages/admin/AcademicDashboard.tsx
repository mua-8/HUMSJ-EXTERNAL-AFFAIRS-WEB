import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Users,
  GraduationCap,
  Calendar,
  FileText,
  LogOut,
  Plus,
  TrendingUp,
  Search,
  Edit,
  Trash2,
  Eye,
  Download,
  BarChart3,
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
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import humjsLogo from "@/assets/humjs-logo.png";

type ActiveTab = "overview" | "students" | "programs" | "reports";

// Types
interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  program: string;
  enrollmentDate: string;
  status: "active" | "graduated" | "inactive";
}

interface Program {
  id: string;
  name: string;
  instructor: string;
  students: number;
  day: string;
  time: string;
  status: "active" | "completed" | "upcoming";
  type: "study_circle" | "workshop" | "course";
}


// Sample data
const sampleStudents: Student[] = [
  { id: "1", name: "Ahmed Mohammed", email: "ahmed@example.com", phone: "+251911234567", program: "Tafsir Al-Quran", enrollmentDate: "2024-09-01", status: "active" },
  { id: "2", name: "Fatima Ibrahim", email: "fatima@example.com", phone: "+251912345678", program: "Hadith Studies", enrollmentDate: "2024-09-15", status: "active" },
  { id: "3", name: "Yusuf Ali", email: "yusuf@example.com", phone: "+251913456789", program: "Fiqh Basics", enrollmentDate: "2024-08-01", status: "active" },
  { id: "4", name: "Mariam Hassan", email: "mariam@example.com", phone: "+251914567890", program: "Seerah", enrollmentDate: "2024-10-01", status: "active" },
  { id: "5", name: "Omar Abdullah", email: "omar@example.com", phone: "+251915678901", program: "Islamic Finance Workshop", enrollmentDate: "2024-07-01", status: "graduated" },
];

const samplePrograms: Program[] = [
  { id: "1", name: "Tafsir Al-Quran", instructor: "Uztaz Ahmed", students: 45, day: "Monday", time: "4:00 PM", status: "active", type: "study_circle" },
  { id: "2", name: "Hadith Studies", instructor: "Uztaz Ibrahim", students: 32, day: "Wednesday", time: "5:00 PM", status: "active", type: "study_circle" },
  { id: "3", name: "Fiqh Basics", instructor: "Uztaz Yusuf", students: 28, day: "Thursday", time: "4:30 PM", status: "active", type: "study_circle" },
  { id: "4", name: "Seerah", instructor: "Uztaz Mohammed", students: 38, day: "Saturday", time: "10:00 AM", status: "active", type: "study_circle" },
  { id: "5", name: "Islamic Finance Workshop", instructor: "Dr. Khalid", students: 65, day: "One-time", time: "Jan 15, 2025", status: "upcoming", type: "workshop" },
  { id: "6", name: "Time Management in Islam", instructor: "Uztaz Bilal", students: 45, day: "One-time", time: "Jan 22, 2025", status: "upcoming", type: "workshop" },
  { id: "7", name: "Da'wah Training", instructor: "Uztaz Hamza", students: 52, day: "Completed", time: "Dec 10, 2024", status: "completed", type: "workshop" },
];


const AcademicDashboard = () => {
  const { toast } = useToast();
  const { signOut, user } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [students, setStudents] = useState<Student[]>(sampleStudents);
  const [programs, setPrograms] = useState<Program[]>(samplePrograms);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isAddProgramOpen, setIsAddProgramOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const stats = {
    totalStudents: students.length,
    activeStudents: students.filter(s => s.status === "active").length,
    totalPrograms: programs.length,
    activePrograms: programs.filter(p => p.status === "active").length,
    upcomingWorkshops: programs.filter(p => p.status === "upcoming").length,
    totalInstructors: new Set(programs.map(p => p.instructor)).size,
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.program.toLowerCase().includes(searchQuery.toLowerCase())
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
    { icon: BookOpen, label: "Overview", tab: "overview" as const },
    { icon: Users, label: "Students", tab: "students" as const },
    { icon: GraduationCap, label: "Programs", tab: "programs" as const },
    { icon: BarChart3, label: "Reports", tab: "reports" as const },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-[#25A7A1] to-[#1F8B86] p-6 hidden lg:flex flex-col z-50 shadow-xl">
        <div className="flex items-center gap-3 mb-8">
          <img src={humjsLogo} alt="HUMSJ" className="h-10 w-auto" />
          <div>
            <h2 className="font-serif font-bold text-white">HUMSJ</h2>
            <p className="text-xs text-white/80">🟢 Academy Sector</p>
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
            🟢 Academy Sector Dashboard
          </h1>
          <p className="text-[#64748b]">Manage Islamic education programs</p>
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
                    <p className="text-2xl font-bold">{stats.activePrograms}</p>
                    <p className="text-sm text-gray-500">Active Programs</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-[#25A7A1] hover:shadow-lg transition-shadow">
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="w-12 h-12 rounded-xl bg-[#25A7A1]/10 flex items-center justify-center">
                    <GraduationCap size={24} className="text-[#25A7A1]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.upcomingWorkshops}</p>
                    <p className="text-sm text-gray-500">Upcoming Workshops</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-[#25A7A1] hover:shadow-lg transition-shadow">
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="w-12 h-12 rounded-xl bg-[#25A7A1]/10 flex items-center justify-center">
                    <Users size={24} className="text-[#25A7A1]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.totalInstructors}</p>
                    <p className="text-sm text-gray-500">Total Instructors</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen size={20} className="text-[#25A7A1]" />
                    Active Study Circles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {programs.filter(p => p.type === "study_circle" && p.status === "active").map((circle) => (
                      <div key={circle.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div>
                          <p className="font-medium">{circle.name}</p>
                          <p className="text-sm text-gray-500">{circle.instructor} • {circle.day} {circle.time}</p>
                        </div>
                        <Badge className="bg-[#25A7A1]/10 text-[#25A7A1] border-[#25A7A1]/20">{circle.students} students</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar size={20} className="text-[#25A7A1]" />
                    Upcoming Workshops
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {programs.filter(p => p.status === "upcoming").map((workshop) => (
                      <div key={workshop.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div>
                          <p className="font-medium">{workshop.name}</p>
                          <p className="text-sm text-gray-500">{workshop.instructor} • {workshop.time}</p>
                        </div>
                        <Badge className="bg-[#25A7A1]/10 text-[#25A7A1] border-[#25A7A1]/20">{workshop.students} registered</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp size={20} className="text-[#25A7A1]" />
                    Recent Enrollments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {students.slice(0, 5).map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#25A7A1] flex items-center justify-center text-white font-bold">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-gray-500">{student.program}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={student.status === "active" ? "bg-[#25A7A1]/10 text-[#25A7A1] border-[#25A7A1]/20" : "bg-gray-100 text-gray-600"}>
                            {student.status}
                          </Badge>
                          <p className="text-xs text-gray-400 mt-1">{new Date(student.enrollmentDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Students Tab */}
        {activeTab === "students" && (
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle>All Students</CardTitle>
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
                    <Plus size={16} className="mr-2" />
                    Add Student
                  </Button>
                  <Button variant="outline" onClick={() => exportToCSV(students, "students_export")}>
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
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Program</TableHead>
                      <TableHead>Enrolled</TableHead>
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
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.phone}</TableCell>
                        <TableCell>{student.program}</TableCell>
                        <TableCell>{new Date(student.enrollmentDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge className={
                            student.status === "active" ? "bg-[#25A7A1]/10 text-[#25A7A1] border-[#25A7A1]/20" :
                              student.status === "graduated" ? "bg-[#25A7A1]/20 text-[#25A7A1]" :
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

        {/* Programs Tab */}
        {activeTab === "programs" && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Programs & Workshops</CardTitle>
                <Button className="bg-[#25A7A1] hover:bg-[#1F8B86]" onClick={() => setIsAddProgramOpen(true)}>
                  <Plus size={16} className="mr-2" />
                  Add Program
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Instructor</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {programs.map((program) => (
                    <TableRow key={program.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{program.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {program.type.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>{program.instructor}</TableCell>
                      <TableCell>{program.day} {program.time}</TableCell>
                      <TableCell>{program.students}</TableCell>
                      <TableCell>
                        <Badge className={
                          program.status === "active" ? "bg-[#25A7A1]/10 text-[#25A7A1] border-[#25A7A1]/20" :
                            program.status === "upcoming" ? "bg-blue-100 text-blue-600" :
                              "bg-gray-100 text-gray-600"
                        }>
                          {program.status}
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
                  Academic Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="p-4 bg-[#25A7A1]/10 rounded-xl border border-[#25A7A1]/20">
                    <p className="text-sm text-[#25A7A1]">Total Enrollments</p>
                    <p className="text-2xl font-bold text-[#25A7A1]">{stats.totalStudents}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl">
                    <p className="text-sm text-green-600">Active Students</p>
                    <p className="text-2xl font-bold text-green-700">{stats.activeStudents}</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-xl">
                    <p className="text-sm text-purple-600">Active Programs</p>
                    <p className="text-2xl font-bold text-purple-700">{stats.activePrograms}</p>
                  </div>
                  <div className="p-4 bg-[#25A7A1]/10 rounded-xl border border-[#25A7A1]/20">
                    <p className="text-sm text-[#25A7A1]">Instructors</p>
                    <p className="text-2xl font-bold text-[#25A7A1]">{stats.totalInstructors}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button onClick={() => exportToCSV(students, "students_report")} className="bg-[#25A7A1] hover:bg-[#1F8B86]">
                    <Download size={16} className="mr-2" />
                    Export Students Report
                  </Button>
                  <Button onClick={() => exportToCSV(programs, "programs_report")} variant="outline">
                    <Download size={16} className="mr-2" />
                    Export Programs Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Program Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {programs.filter(p => p.status === "active").map((program) => (
                    <div key={program.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{program.name}</span>
                        <span className="font-medium">{program.students} students</span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#25A7A1] to-[#1F8B86] rounded-full transition-all duration-500"
                          style={{ width: `${(program.students / 50) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Add Student Dialog */}
        <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input placeholder="Full Name" />
              <Input placeholder="Email" type="email" />
              <Input placeholder="Phone" />
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Program" />
                </SelectTrigger>
                <SelectContent>
                  {programs.filter(p => p.status === "active").map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddStudentOpen(false)}>Cancel</Button>
              <Button className="bg-[#25A7A1] hover:bg-[#1F8B86]" onClick={() => {
                toast({ title: "Student Added", description: "New student has been enrolled." });
                setIsAddStudentOpen(false);
              }}>
                Add Student
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Program Dialog */}
        <Dialog open={isAddProgramOpen} onOpenChange={setIsAddProgramOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Program</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input placeholder="Program Name" />
              <Input placeholder="Instructor" />
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Program Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="study_circle">Study Circle</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="course">Course</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Day (e.g., Monday)" />
              <Input placeholder="Time (e.g., 4:00 PM)" />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddProgramOpen(false)}>Cancel</Button>
              <Button className="bg-[#25A7A1] hover:bg-[#1F8B86]" onClick={() => {
                toast({ title: "Program Added", description: "New program has been created." });
                setIsAddProgramOpen(false);
              }}>
                Add Program
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default AcademicDashboard;
