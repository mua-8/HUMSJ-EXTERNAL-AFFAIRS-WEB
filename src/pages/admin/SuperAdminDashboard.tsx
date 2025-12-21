import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Heart,
  BookOpen,
  Mic,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  Settings,
  LogOut,
  ChevronRight,
  Eye,
  Check,
  X,
  Trash2,
  Filter,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  Donation,
  subscribeToDonations,
  updateDonationStatus,
  deleteDonation,
} from "@/lib/donations";
import {
  FirestoreEvent,
  subscribeToEvents,
} from "@/lib/firestore";
import humjsLogo from "@/assets/humjs-logo.png";

type ActiveSection = "overview" | "charity" | "academic" | "qirat" | "events" | "settings";

const SuperAdminDashboard = () => {
  const { toast } = useToast();
  const { signOut, user } = useAuth();
  const [activeSection, setActiveSection] = useState<ActiveSection>("overview");
  const [donations, setDonations] = useState<Donation[]>([]);
  const [events, setEvents] = useState<FirestoreEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const unsubDonations = subscribeToDonations((data) => {
      setDonations(data);
      setIsLoading(false);
    });

    const unsubEvents = subscribeToEvents((data) => {
      setEvents(data);
    });

    return () => {
      unsubDonations();
      unsubEvents();
    };
  }, []);

  const handleConfirmDonation = async (id: string) => {
    try {
      await updateDonationStatus(id, "confirmed");
      toast({ title: "Donation Confirmed" });
    } catch (error) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const handleRejectDonation = async (id: string) => {
    try {
      await updateDonationStatus(id, "rejected");
      toast({ title: "Donation Rejected", variant: "destructive" });
    } catch (error) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const handleDeleteDonation = async (id: string) => {
    try {
      await deleteDonation(id);
      toast({ title: "Deleted" });
    } catch (error) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  // Stats
  const stats = {
    totalDonations: donations.length,
    confirmedDonations: donations.filter((d) => d.status === "confirmed").length,
    pendingDonations: donations.filter((d) => d.status === "pending").length,
    totalAmount: donations.filter((d) => d.status === "confirmed").reduce((sum, d) => sum + d.amount, 0),
    studentDonations: donations.filter((d) => d.donationType === "student_sadaqah").length,
    starShiningDonations: donations.filter((d) => d.donationType === "star_shining").length,
    totalEvents: events.length,
    approvedEvents: events.filter((e) => e.status === "approved").length,
  };

  const filteredDonations = donations.filter((d) => {
    const matchesSearch = d.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.idNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const navItems = [
    { icon: LayoutDashboard, label: "Overview", section: "overview" as const },
    { icon: Heart, label: "Charity Sector", section: "charity" as const },
    { icon: BookOpen, label: "Academic Sector", section: "academic" as const },
    { icon: Mic, label: "Qirat Sector", section: "qirat" as const },
    { icon: Calendar, label: "Events", section: "events" as const },
    { icon: Settings, label: "Settings", section: "settings" as const },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#0f4a47] p-6 hidden lg:flex flex-col z-50">
        <div className="flex items-center gap-3 mb-8">
          <img src={humjsLogo} alt="HUMSJ" className="h-10 w-auto" />
          <div>
            <h2 className="font-serif font-bold text-white">HUMSJ</h2>
            <p className="text-xs text-[#29b6b0]">Super Admin</p>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          {navItems.map((item) => (
            <button
              key={item.section}
              onClick={() => setActiveSection(item.section)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeSection === item.section
                  ? "bg-[#29b6b0] text-white"
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
          <Button
            variant="outline"
            className="w-full border-white/20 text-white/70 hover:bg-white/10 hover:text-white"
            onClick={signOut}
          >
            <LogOut size={16} className="mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 flex-1 p-6 lg:p-8">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <img src={humjsLogo} alt="HUMSJ" className="h-8 w-auto" />
            <span className="font-serif font-bold text-[#1e293b]">Super Admin</span>
          </div>
        </div>

        {/* Overview Section */}
        {activeSection === "overview" && (
          <>
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#1e293b]">Dashboard Overview</h1>
              <p className="text-[#64748b]">Welcome back! Here's what's happening across all sectors.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border-l-4 border-l-[#29b6b0]">
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="w-12 h-12 rounded-xl bg-[#29b6b0]/10 flex items-center justify-center">
                    <DollarSign size={24} className="text-[#29b6b0]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#1e293b]">{stats.totalAmount.toLocaleString()} ETB</p>
                    <p className="text-sm text-[#64748b]">Total Donations</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <Check size={24} className="text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#1e293b]">{stats.confirmedDonations}</p>
                    <p className="text-sm text-[#64748b]">Confirmed Donations</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-amber-500">
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <TrendingUp size={24} className="text-amber-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#1e293b]">{stats.pendingDonations}</p>
                    <p className="text-sm text-[#64748b]">Pending Approval</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <Calendar size={24} className="text-purple-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#1e293b]">{stats.totalEvents}</p>
                    <p className="text-sm text-[#64748b]">Total Events</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sector Cards */}
            <h2 className="text-xl font-serif font-bold text-[#1e293b] mb-4">Sector Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveSection("charity")}>
                <CardHeader className="bg-[#29b6b0] text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Heart size={20} />
                    Charity Sector
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Student Sadaqah</span>
                      <span className="font-semibold">{stats.studentDonations}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Star-Shining</span>
                      <span className="font-semibold">{stats.starShiningDonations}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Total Amount</span>
                      <span className="font-semibold text-[#29b6b0]">{stats.totalAmount.toLocaleString()} ETB</span>
                    </div>
                  </div>
                  <Button variant="ghost" className="w-full mt-4 text-[#29b6b0]">
                    View Details <ChevronRight size={16} />
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveSection("academic")}>
                <CardHeader className="bg-[#29b6b0] text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen size={20} />
                    Academic Sector
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Study Circles</span>
                      <span className="font-semibold">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Workshops</span>
                      <span className="font-semibold">5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Students Enrolled</span>
                      <span className="font-semibold">250+</span>
                    </div>
                  </div>
                  <Button variant="ghost" className="w-full mt-4 text-[#29b6b0]">
                    View Details <ChevronRight size={16} />
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveSection("qirat")}>
                <CardHeader className="bg-[#29b6b0] text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Mic size={20} />
                    Qirat Sector
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Quran Classes</span>
                      <span className="font-semibold">8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Competitions</span>
                      <span className="font-semibold">3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Participants</span>
                      <span className="font-semibold">150+</span>
                    </div>
                  </div>
                  <Button variant="ghost" className="w-full mt-4 text-[#29b6b0]">
                    View Details <ChevronRight size={16} />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Donations */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Donations</CardTitle>
              </CardHeader>
              <CardContent>
                {donations.slice(0, 5).length === 0 ? (
                  <p className="text-center py-4 text-gray-500">No donations yet</p>
                ) : (
                  <div className="space-y-3">
                    {donations.slice(0, 5).map((d) => (
                      <div key={d.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{d.fullName}</p>
                          <p className="text-sm text-gray-500">{d.department} • {d.donationType === "star_shining" ? "Star-Shining" : "Student"}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-[#29b6b0]">{d.amount} ETB</p>
                          <Badge className={d.status === "confirmed" ? "bg-green-100 text-green-600" : d.status === "pending" ? "bg-amber-100 text-amber-600" : "bg-red-100 text-red-600"}>
                            {d.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Charity Section */}
        {activeSection === "charity" && (
          <>
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#1e293b]">Charity Sector</h1>
              <p className="text-[#64748b]">Manage all donations and Sadaqah pledges</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="w-12 h-12 rounded-xl bg-[#29b6b0]/10 flex items-center justify-center">
                    <Users size={24} className="text-[#29b6b0]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.studentDonations}</p>
                    <p className="text-sm text-gray-500">Student Sadaqah</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 flex items-center justify-center">
                    <Users size={24} className="text-[#d4af37]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.starShiningDonations}</p>
                    <p className="text-sm text-gray-500">Star-Shining</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <DollarSign size={24} className="text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.totalAmount.toLocaleString()} ETB</p>
                    <p className="text-sm text-gray-500">Total Confirmed</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <CardTitle>All Donations</CardTitle>
                  <div className="flex gap-3">
                    <Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-48" />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-36"><Filter size={16} className="mr-2" /><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p className="text-center py-8 text-gray-500">Loading...</p>
                ) : filteredDonations.length === 0 ? (
                  <p className="text-center py-8 text-gray-500">No donations found</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredDonations.map((d) => (
                          <TableRow key={d.id}>
                            <TableCell className="font-medium">{d.fullName}</TableCell>
                            <TableCell>{d.phone}</TableCell>
                            <TableCell>
                              <Badge className={d.donationType === "star_shining" ? "bg-[#d4af37]/10 text-[#d4af37]" : "bg-[#29b6b0]/10 text-[#29b6b0]"}>
                                {d.donationType === "star_shining" ? "Star-Shining" : "Student"}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-semibold">{d.amount} ETB</TableCell>
                            <TableCell>
                              <Badge className={d.status === "confirmed" ? "bg-green-100 text-green-600" : d.status === "pending" ? "bg-amber-100 text-amber-600" : "bg-red-100 text-red-600"}>
                                {d.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                {d.status === "pending" && (
                                  <>
                                    <Button size="icon" variant="ghost" onClick={() => handleConfirmDonation(d.id!)} className="text-green-500 h-8 w-8"><Check size={16} /></Button>
                                    <Button size="icon" variant="ghost" onClick={() => handleRejectDonation(d.id!)} className="text-red-500 h-8 w-8"><X size={16} /></Button>
                                  </>
                                )}
                                <Button size="icon" variant="ghost" onClick={() => handleDeleteDonation(d.id!)} className="text-red-500 h-8 w-8"><Trash2 size={16} /></Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Academic Section */}
        {activeSection === "academic" && (
          <>
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#1e293b]">Academic Sector</h1>
              <p className="text-[#64748b]">Manage Islamic education programs and study circles</p>
            </div>
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Academic Sector Management</h3>
                <p className="text-gray-500">Study circles, workshops, and educational programs will be managed here.</p>
                <p className="text-sm text-[#29b6b0] mt-4">Coming Soon</p>
              </CardContent>
            </Card>
          </>
        )}

        {/* Qirat Section */}
        {activeSection === "qirat" && (
          <>
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#1e293b]">Qirat Sector</h1>
              <p className="text-[#64748b]">Manage Quran recitation programs and competitions</p>
            </div>
            <Card>
              <CardContent className="py-12 text-center">
                <Mic size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Qirat Sector Management</h3>
                <p className="text-gray-500">Quran classes, recitation competitions, and Tajweed programs will be managed here.</p>
                <p className="text-sm text-[#29b6b0] mt-4">Coming Soon</p>
              </CardContent>
            </Card>
          </>
        )}

        {/* Events Section */}
        {activeSection === "events" && (
          <>
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#1e293b]">Events Management</h1>
              <p className="text-[#64748b]">Manage all HUMSJ events across sectors</p>
            </div>
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Events from all sectors</h3>
                <p className="text-gray-500">{stats.totalEvents} events • {stats.approvedEvents} approved</p>
                <Link to="/admin">
                  <Button className="mt-4 bg-[#29b6b0] hover:bg-[#239e99]">Go to Events Dashboard</Button>
                </Link>
              </CardContent>
            </Card>
          </>
        )}

        {/* Settings Section */}
        {activeSection === "settings" && (
          <>
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#1e293b]">Settings</h1>
              <p className="text-[#64748b]">Configure dashboard and system settings</p>
            </div>
            <Card>
              <CardContent className="py-12 text-center">
                <Settings size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">System Settings</h3>
                <p className="text-gray-500">User roles, permissions, and system configuration.</p>
                <p className="text-sm text-[#29b6b0] mt-4">Coming Soon</p>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
};

export default SuperAdminDashboard;
