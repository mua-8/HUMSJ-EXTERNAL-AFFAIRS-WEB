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
import {
  subscribeToStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  subscribeToPrograms,
  addProgram,
  updateProgram,
  deleteProgram,
  FirestoreStudent as Student,
  FirestoreProgram as Program
} from "@/lib/firestore";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import EventsManager from "@/components/admin/EventsManager";

type ActiveTab = "overview" | "students" | "programs" | "events" | "reports";

// Sample data removed for live implementation


const AcademicDashboard = () => {
  const { toast } = useToast();
  const { signOut, user } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [students, setStudents] = useState<Student[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isAddProgramOpen, setIsAddProgramOpen] = useState(false);
  const [isEditStudentOpen, setIsEditStudentOpen] = useState(false);
  const [isEditProgramOpen, setIsEditProgramOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);

  // Form states
  const [studentForm, setStudentForm] = useState({ name: "", email: "", phone: "", program: "", status: "active" as const });
  const [programForm, setProgramForm] = useState({ name: "", instructor: "", type: "study_circle", day: "", time: "", status: "active" as const, description: "" });

  useEffect(() => {
    const unsubStudents = subscribeToStudents((data) => {
      setStudents(data.filter(s => s.sector === "academic"));
      setIsLoading(false);
    });

    const unsubPrograms = subscribeToPrograms((data) => {
      setPrograms(data.filter(p => p.sector === "academic"));
    });

    return () => {
      unsubStudents();
      unsubPrograms();
    };
  }, []);

  const handleAddStudent = async () => {
    try {
      await addStudent({
        ...studentForm,
        sector: "academic",
        enrollmentDate: new Date().toISOString(),
      });
      toast({ title: "Student Added", description: "New student has been enrolled successfully." });
      setIsAddStudentOpen(false);
      setStudentForm({ name: "", email: "", phone: "", program: "", status: "active" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to add student.", variant: "destructive" });
    }
  };

  const handleAddProgram = async () => {
    try {
      await addProgram({
        ...programForm,
        sector: "academic",
        students: 0,
      });
      toast({ title: "Program Created", description: "New academic program has been created." });
      setIsAddProgramOpen(false);
      setProgramForm({ name: "", instructor: "", type: "study_circle", day: "", time: "", status: "active", description: "" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to create program.", variant: "destructive" });
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    try {
      await deleteStudent(id);
      toast({ title: "Student Deleted", description: "Student record removed." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete student.", variant: "destructive" });
    }
  };

  const handleDeleteProgram = async (id: string) => {
    if (!confirm("Are you sure you want to delete this program?")) return;
    try {
      await deleteProgram(id);
      toast({ title: "Program Deleted", description: "Program record removed." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete program.", variant: "destructive" });
    }
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setStudentForm({
      name: student.name,
      email: student.email,
      phone: student.phone,
      program: student.program,
      status: student.status as "active"
    });
    setIsEditStudentOpen(true);
  };

  const handleUpdateStudent = async () => {
    if (!editingStudent?.id) return;
    try {
      await updateStudent(editingStudent.id, {
        name: studentForm.name,
        email: studentForm.email,
        phone: studentForm.phone,
        program: studentForm.program,
        status: studentForm.status
      });
      toast({ title: "Student Updated", description: "Student information has been updated." });
      setIsEditStudentOpen(false);
      setEditingStudent(null);
      setStudentForm({ name: "", email: "", phone: "", program: "", status: "active" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update student.", variant: "destructive" });
    }
  };

  const handleEditProgram = (program: Program) => {
    setEditingProgram(program);
    setProgramForm({
      name: program.name,
      instructor: program.instructor,
      type: program.type,
      day: program.day,
      time: program.time,
      status: program.status as "active",
      description: program.description || ""
    });
    setIsEditProgramOpen(true);
  };

  const handleUpdateProgram = async () => {
    if (!editingProgram?.id) return;
    try {
      await updateProgram(editingProgram.id, {
        name: programForm.name,
        instructor: programForm.instructor,
        type: programForm.type,
        day: programForm.day,
        time: programForm.time,
        status: programForm.status,
        description: programForm.description
      });
      toast({ title: "Program Updated", description: "Program information has been updated." });
      setIsEditProgramOpen(false);
      setEditingProgram(null);
      setProgramForm({ name: "", instructor: "", type: "study_circle", day: "", time: "", status: "active", description: "" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update program.", variant: "destructive" });
    }
  };

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
    { icon: Calendar, label: "Events", tab: "events" as const },
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
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Loading students...</TableCell>
                      </TableRow>
                    ) : filteredStudents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No students found.</TableCell>
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
                          <TableCell>{student.email || student.phone}</TableCell>
                          <TableCell>{student.phone}</TableCell>
                          <TableCell>{student.program}</TableCell>
                          <TableCell>{new Date(student.enrollmentDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge className={
                              student.status === "active" ? "bg-[#25A7A1]/10 text-[#25A7A1] border-[#25A7A1]/20" :
                                student.status === "graduated" ? "bg-green-100 text-green-600" :
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
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Loading programs...</TableCell>
                    </TableRow>
                  ) : programs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No programs found.</TableCell>
                    </TableRow>
                  ) : (
                    programs.map((program) => (
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
                              program.status === "upcoming" ? "bg-amber-100 text-amber-600 font-medium" :
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
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8 text-gray-500"
                              onClick={() => handleEditProgram(program)}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-red-500 hover:bg-red-50"
                              onClick={() => handleDeleteProgram(program.id!)}
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
        )}

        {/* Events Tab */}
        {activeTab === "events" && (
          <EventsManager sector="academic" title="Academic Events" />
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
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  placeholder="Full Name"
                  value={studentForm.name}
                  onChange={(e) => setStudentForm((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  placeholder="Email"
                  type="email"
                  value={studentForm.email}
                  onChange={(e) => setStudentForm((prev) => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  placeholder="Phone"
                  value={studentForm.phone}
                  onChange={(e) => setStudentForm((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Program</Label>
                <Select
                  value={studentForm.program}
                  onValueChange={(value) => setStudentForm((prev) => ({ ...prev, program: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Program" />
                  </SelectTrigger>
                  <SelectContent>
                    {programs.length > 0 ? (
                      programs.map(p => (
                        <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                      ))
                    ) : (
                      <>
                        <SelectItem value="Islamic Studies">Islamic Studies</SelectItem>
                        <SelectItem value="Arabic Language">Arabic Language</SelectItem>
                        <SelectItem value="Fiqh & Jurisprudence">Fiqh & Jurisprudence</SelectItem>
                        <SelectItem value="Hadith Studies">Hadith Studies</SelectItem>
                        <SelectItem value="Tafsir Studies">Tafsir Studies</SelectItem>
                        <SelectItem value="Aqeedah">Aqeedah</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddStudentOpen(false)}>Cancel</Button>
              <Button
                className="bg-[#25A7A1] hover:bg-[#1F8B86]"
                onClick={handleAddStudent}
                disabled={!studentForm.name || !studentForm.program}
              >
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
            <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="space-y-2">
                <Label>Program Name</Label>
                <Input
                  placeholder="Program Name"
                  value={programForm.name}
                  onChange={(e) => setProgramForm((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Instructor</Label>
                <Input
                  placeholder="Instructor"
                  value={programForm.instructor}
                  onChange={(e) => setProgramForm((prev) => ({ ...prev, instructor: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Program Type</Label>
                <Select
                  value={programForm.type}
                  onValueChange={(value: any) => setProgramForm((prev) => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Program Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="study_circle">Study Circle</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="course">Course</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Day</Label>
                  <Input
                    placeholder="e.g., Monday"
                    value={programForm.day}
                    onChange={(e) => setProgramForm((prev) => ({ ...prev, day: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input
                    placeholder="e.g., 4:00 PM"
                    value={programForm.time}
                    onChange={(e) => setProgramForm((prev) => ({ ...prev, time: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Program details..."
                  value={programForm.description}
                  onChange={(e) => setProgramForm((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddProgramOpen(false)}>Cancel</Button>
              <Button
                className="bg-[#25A7A1] hover:bg-[#1F8B86]"
                onClick={handleAddProgram}
                disabled={!programForm.name || !programForm.instructor}
              >
                Create Program
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Student Dialog */}
        <Dialog open={isEditStudentOpen} onOpenChange={setIsEditStudentOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Student</DialogTitle>
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
                <Label>Email</Label>
                <Input
                  placeholder="Email"
                  type="email"
                  value={studentForm.email}
                  onChange={(e) => setStudentForm((prev) => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  placeholder="Phone"
                  value={studentForm.phone}
                  onChange={(e) => setStudentForm((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Program</Label>
                <Select
                  value={studentForm.program}
                  onValueChange={(value) => setStudentForm((prev) => ({ ...prev, program: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Program" />
                  </SelectTrigger>
                  <SelectContent>
                    {programs.length > 0 ? (
                      programs.map(p => (
                        <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                      ))
                    ) : (
                      <>
                        <SelectItem value="Islamic Studies">Islamic Studies</SelectItem>
                        <SelectItem value="Arabic Language">Arabic Language</SelectItem>
                        <SelectItem value="Fiqh & Jurisprudence">Fiqh & Jurisprudence</SelectItem>
                        <SelectItem value="Hadith Studies">Hadith Studies</SelectItem>
                        <SelectItem value="Tafsir Studies">Tafsir Studies</SelectItem>
                        <SelectItem value="Aqeedah">Aqeedah</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
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
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditStudentOpen(false)}>Cancel</Button>
              <Button
                className="bg-[#25A7A1] hover:bg-[#1F8B86]"
                onClick={handleUpdateStudent}
                disabled={!studentForm.name || !studentForm.program}
              >
                Update Student
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Program Dialog */}
        <Dialog open={isEditProgramOpen} onOpenChange={setIsEditProgramOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Program</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="space-y-2">
                <Label>Program Name</Label>
                <Input
                  placeholder="Program Name"
                  value={programForm.name}
                  onChange={(e) => setProgramForm((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Instructor</Label>
                <Input
                  placeholder="Instructor"
                  value={programForm.instructor}
                  onChange={(e) => setProgramForm((prev) => ({ ...prev, instructor: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Program Type</Label>
                <Select
                  value={programForm.type}
                  onValueChange={(value: any) => setProgramForm((prev) => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Program Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="study_circle">Study Circle</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="course">Course</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Day</Label>
                  <Input
                    placeholder="e.g., Monday"
                    value={programForm.day}
                    onChange={(e) => setProgramForm((prev) => ({ ...prev, day: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input
                    placeholder="e.g., 4:00 PM"
                    value={programForm.time}
                    onChange={(e) => setProgramForm((prev) => ({ ...prev, time: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={programForm.status}
                  onValueChange={(value: any) => setProgramForm((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Program details..."
                  value={programForm.description}
                  onChange={(e) => setProgramForm((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditProgramOpen(false)}>Cancel</Button>
              <Button
                className="bg-[#25A7A1] hover:bg-[#1F8B86]"
                onClick={handleUpdateProgram}
                disabled={!programForm.name || !programForm.instructor}
              >
                Update Program
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default AcademicDashboard;
