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

// Sample data
const quranClasses = [
  { id: "1", name: "Tajweed Basics", instructor: "Qari Abdulrahman", students: 35, level: "Beginner", day: "Sunday", time: "9:00 AM", status: "active" },
  { id: "2", name: "Hifz Program", instructor: "Hafiz Mohammed", students: 20, level: "Advanced", day: "Daily", time: "6:00 AM", status: "active" },
  { id: "3", name: "Qirat Styles", instructor: "Qari Ibrahim", students: 15, level: "Intermediate", day: "Friday", time: "3:00 PM", status: "active" },
  { id: "4", name: "Tarteel Class", instructor: "Qari Yusuf", students: 40, level: "Beginner", day: "Saturday", time: "10:00 AM", status: "active" },
];

const competitions = [
  { id: "1", title: "Annual Quran Competition", date: "2025-02-15", participants: 85, status: "upcoming", prize: "10,000 ETB" },
  { id: "2", title: "Tajweed Excellence Award", date: "2025-03-01", participants: 45, status: "upcoming", prize: "5,000 ETB" },
  { id: "3", title: "Ramadan Qirat Contest", date: "2024-04-10", participants: 120, status: "completed", prize: "15,000 ETB" },
];

const QiratDashboard = () => {
  const { signOut, user } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "classes" | "competitions" | "reports">("overview");

  const stats = {
    totalStudents: 150,
    activeClasses: quranClasses.length,
    totalCompetitions: competitions.length,
    upcomingCompetitions: competitions.filter(c => c.status === "upcoming").length,
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#7c3aed] p-6 hidden lg:flex flex-col z-50">
        <div className="flex items-center gap-3 mb-8">
          <img src={humjsLogo} alt="HUMSJ" className="h-10 w-auto" />
          <div>
            <h2 className="font-serif font-bold text-white">HUMSJ</h2>
            <p className="text-xs text-purple-200">Qirat Sector</p>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          {[
            { icon: Mic, label: "Overview", tab: "overview" as const },
            { icon: BookOpen, label: "Quran Classes", tab: "classes" as const },
            { icon: Award, label: "Competitions", tab: "competitions" as const },
            { icon: FileText, label: "Reports", tab: "reports" as const },
          ].map((item) => (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === item.tab
                  ? "bg-purple-500 text-white"
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
            {activeTab === "overview" && "Qirat Sector Dashboard"}
            {activeTab === "classes" && "Quran Classes"}
            {activeTab === "competitions" && "Competitions & Awards"}
            {activeTab === "reports" && "Reports & Analytics"}
          </h1>
          <p className="text-[#64748b]">Manage Quran recitation programs</p>
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <Users size={24} className="text-purple-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.totalStudents}</p>
                    <p className="text-sm text-gray-500">Qirat Students</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <BookOpen size={24} className="text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.activeClasses}</p>
                    <p className="text-sm text-gray-500">Active Classes</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-amber-500">
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Award size={24} className="text-amber-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.totalCompetitions}</p>
                    <p className="text-sm text-gray-500">Competitions</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Calendar size={24} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.upcomingCompetitions}</p>
                    <p className="text-sm text-gray-500">Upcoming</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Active Quran Classes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {quranClasses.map((cls) => (
                      <div key={cls.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{cls.name}</p>
                          <p className="text-sm text-gray-500">{cls.instructor} • {cls.day} {cls.time}</p>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-purple-100 text-purple-600">{cls.students} students</Badge>
                          <p className="text-xs text-gray-400 mt-1">{cls.level}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Competitions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {competitions.filter(c => c.status === "upcoming").map((comp) => (
                      <div key={comp.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{comp.title}</p>
                          <p className="text-sm text-gray-500">{new Date(comp.date).toLocaleDateString()}</p>
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
          </>
        )}

        {/* Quran Classes */}
        {activeTab === "classes" && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Quran Classes</CardTitle>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus size={16} className="mr-2" />
                  Add Class
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class Name</TableHead>
                    <TableHead>Instructor</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quranClasses.map((cls) => (
                    <TableRow key={cls.id}>
                      <TableCell className="font-medium">{cls.name}</TableCell>
                      <TableCell>{cls.instructor}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{cls.level}</Badge>
                      </TableCell>
                      <TableCell>{cls.day} {cls.time}</TableCell>
                      <TableCell>{cls.students}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-600">{cls.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Competitions */}
        {activeTab === "competitions" && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Competitions</CardTitle>
                <Button className="bg-purple-600 hover:bg-purple-700">
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
                    <TableHead>Date</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>Prize</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {competitions.map((comp) => (
                    <TableRow key={comp.id}>
                      <TableCell className="font-medium">{comp.title}</TableCell>
                      <TableCell>{new Date(comp.date).toLocaleDateString()}</TableCell>
                      <TableCell>{comp.participants}</TableCell>
                      <TableCell className="font-semibold text-amber-600">{comp.prize}</TableCell>
                      <TableCell>
                        <Badge className={comp.status === "upcoming" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"}>
                          {comp.status}
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
              <p className="text-gray-500">Generate and export Qirat sector reports.</p>
              <p className="text-sm text-purple-500 mt-4">Coming Soon</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default QiratDashboard;
