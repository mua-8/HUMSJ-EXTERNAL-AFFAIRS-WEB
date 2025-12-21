import { useState } from "react";
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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import humjsLogo from "@/assets/humjs-logo.png";

// Sample data - in production, this would come from Firebase
const studyCircles = [
  { id: "1", name: "Tafsir Al-Quran", instructor: "Uztaz Ahmed", students: 45, day: "Monday", time: "4:00 PM", status: "active" },
  { id: "2", name: "Hadith Studies", instructor: "Uztaz Ibrahim", students: 32, day: "Wednesday", time: "5:00 PM", status: "active" },
  { id: "3", name: "Fiqh Basics", instructor: "Uztaz Yusuf", students: 28, day: "Thursday", time: "4:30 PM", status: "active" },
  { id: "4", name: "Seerah", instructor: "Uztaz Mohammed", students: 38, day: "Saturday", time: "10:00 AM", status: "active" },
];

const workshops = [
  { id: "1", title: "Islamic Finance Workshop", date: "2025-01-15", participants: 65, status: "upcoming" },
  { id: "2", title: "Time Management in Islam", date: "2025-01-22", participants: 45, status: "upcoming" },
  { id: "3", title: "Da'wah Training", date: "2024-12-10", participants: 52, status: "completed" },
];

const AcademicDashboard = () => {
  const { signOut, user } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "circles" | "workshops" | "reports">("overview");

  const stats = {
    totalStudents: 250,
    activeCircles: studyCircles.length,
    totalWorkshops: workshops.length,
    completedWorkshops: workshops.filter(w => w.status === "completed").length,
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#1e40af] p-6 hidden lg:flex flex-col z-50">
        <div className="flex items-center gap-3 mb-8">
          <img src={humjsLogo} alt="HUMSJ" className="h-10 w-auto" />
          <div>
            <h2 className="font-serif font-bold text-white">HUMSJ</h2>
            <p className="text-xs text-blue-300">Academic Sector</p>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          {[
            { icon: BookOpen, label: "Overview", tab: "overview" as const },
            { icon: Users, label: "Study Circles", tab: "circles" as const },
            { icon: GraduationCap, label: "Workshops", tab: "workshops" as const },
            { icon: FileText, label: "Reports", tab: "reports" as const },
          ].map((item) => (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === item.tab
                  ? "bg-blue-500 text-white"
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
            {activeTab === "overview" && "Academic Sector Dashboard"}
            {activeTab === "circles" && "Study Circles"}
            {activeTab === "workshops" && "Workshops & Programs"}
            {activeTab === "reports" && "Reports & Analytics"}
          </h1>
          <p className="text-[#64748b]">Manage Islamic education programs</p>
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Users size={24} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.totalStudents}</p>
                    <p className="text-sm text-gray-500">Total Students</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <BookOpen size={24} className="text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.activeCircles}</p>
                    <p className="text-sm text-gray-500">Active Circles</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <GraduationCap size={24} className="text-purple-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.totalWorkshops}</p>
                    <p className="text-sm text-gray-500">Workshops</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-amber-500">
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <TrendingUp size={24} className="text-amber-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.completedWorkshops}</p>
                    <p className="text-sm text-gray-500">Completed</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Active Study Circles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {studyCircles.map((circle) => (
                      <div key={circle.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{circle.name}</p>
                          <p className="text-sm text-gray-500">{circle.instructor} • {circle.day} {circle.time}</p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-600">{circle.students} students</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Workshops</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {workshops.filter(w => w.status === "upcoming").map((workshop) => (
                      <div key={workshop.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{workshop.title}</p>
                          <p className="text-sm text-gray-500">{new Date(workshop.date).toLocaleDateString()}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-600">{workshop.participants} registered</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Study Circles */}
        {activeTab === "circles" && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Study Circles</CardTitle>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus size={16} className="mr-2" />
                  Add Circle
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Instructor</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studyCircles.map((circle) => (
                    <TableRow key={circle.id}>
                      <TableCell className="font-medium">{circle.name}</TableCell>
                      <TableCell>{circle.instructor}</TableCell>
                      <TableCell>{circle.day} {circle.time}</TableCell>
                      <TableCell>{circle.students}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-600">{circle.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Workshops */}
        {activeTab === "workshops" && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Workshops</CardTitle>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus size={16} className="mr-2" />
                  Add Workshop
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workshops.map((workshop) => (
                    <TableRow key={workshop.id}>
                      <TableCell className="font-medium">{workshop.title}</TableCell>
                      <TableCell>{new Date(workshop.date).toLocaleDateString()}</TableCell>
                      <TableCell>{workshop.participants}</TableCell>
                      <TableCell>
                        <Badge className={workshop.status === "upcoming" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"}>
                          {workshop.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Reports */}
        {activeTab === "reports" && (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Reports & Analytics</h3>
              <p className="text-gray-500">Generate and export academic reports.</p>
              <p className="text-sm text-blue-500 mt-4">Coming Soon</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default AcademicDashboard;
