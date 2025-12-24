import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MessageCircle,
  Users,
  Calendar,
  LogOut,
  Plus,
  BookOpen,
  Edit,
  Trash2,
  Eye,
  Download,
  Search,
  BarChart3,
  UserPlus,
  Check,
  X,
  UserCheck,
  Settings,
  Heart,
  Globe,
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
  subscribeToPrograms,
  addProgram,
  updateProgram,
  deleteProgram,
  FirestoreProgram as Activity,
} from "@/lib/firestore";
import EventsManager from "@/components/admin/EventsManager";
import MobileNav from "@/components/admin/MobileNav";
import AdminSettings from "@/components/admin/AdminSettings";
import { Label } from "@/components/ui/label";

type ActiveTab = "overview" | "participants" | "enrollments" | "activities" | "events" | "reports" | "settings";

const DawaDashboard = () => {
  const { toast } = useToast();
  const { signOut, user } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [registrations, setRegistrations] = useState<FirestoreRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [isEditActivityOpen, setIsEditActivityOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const [activityForm, setActivityForm] = useState({ 
    name: "", 
    type: "awareness", 
    day: "", 
    time: "", 
    status: "upcoming" as const, 
    description: "" 
  });

  useEffect(() => {
    const unsubReg = subscribeToRegistrations((data) => {
      setRegistrations(data.filter(r => r.sector === "dawa"));
      setIsLoading(false);
    });

    const unsubPrograms = subscribeToPrograms((data) => {
      setActivities(data.filter(p => p.sector === "dawa"));
    });

    return () => {
      unsubReg();
      unsubPrograms();
    };
  }, []);

  const handleAddActivity = async () => {
    try {
      await addProgram({
        ...activityForm,
        sector: "dawa",
        students: 0,
        instructor: "",
      });
      toast({ title: "Activity Added", description: "New Dawa activity created." });
      setIsAddActivityOpen(false);
      setActivityForm({ name: "", type: "awareness", day: "", time: "", status: "upcoming", description: "" });
    } catch (e) {
      toast({ title: "Error", description: "Failed to add activity.", variant: "destructive" });
    }
  };

  const handleDeleteActivity = async (id: string) => {
    if (!confirm("Delete activity?")) return;
    await deleteProgram(id);
    toast({ title: "Deleted", description: "Activity removed." });
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
      await updateProgram(editingActivity.id, activityForm);
      toast({ title: "Activity Updated", description: "Activity has been updated." });
      setIsEditActivityOpen(false);
      setEditingActivity(null);
      setActivityForm({ name: "", type: "awareness", day: "", time: "", status: "upcoming", description: "" });
    } catch (e) {
      toast({ title: "Error", description: "Failed to update activity.", variant: "destructive" });
    }
  };

  const handleApproveRegistration = async (id: string) => {
    try {
      await updateRegistration(id, { status: "approved" });
      toast({ title: "Registration Approved", description: "Participant has been approved." });
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
    totalParticipants: registrations.length,
    approvedParticipants: registrations.filter(r => r.status === "approved").length,
    pendingRegistrations: registrations.filter(r => r.status === "pending").length,
    totalActivities: activities.length,
    upcomingActivities: activities.filter(a => a.status === "upcoming").length,
  };

  const navItems = [
    { icon: MessageCircle, label: "Overview", tab: "overview" as const },
    { icon: Users, label: "Participants", tab: "participants" as const },
    { icon: Calendar, label: "Activities", tab: "activities" as const },
    { icon: Calendar, label: "Events", tab: "events" as const },
    { icon: UserCheck, label: "Enrollments", tab: "enrollments" as const, badge: stats.pendingRegistrations > 0 ? stats.pendingRegistrations : undefined },
    { icon: BarChart3, label: "Reports", tab: "reports" as const },
    { icon: Settings, label: "Settings", tab: "settings" as const },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex">
      {/* Mobile Navigation */}
      <MobileNav
        title="Dawa Sector"
        navItems={navItems.map(item => ({ icon: item.icon, label: item.label, section: item.tab }))}
        activeSection={activeTab}
        onSectionChange={(section) => setActiveTab(section as ActiveTab)}
        onSignOut={signOut}
        userEmail={user?.email}
      />

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-[#25A7A1] to-[#1F8B86] p-6 hidden lg:flex flex-col z-50 shadow-xl">
        <div className="flex items-center gap-3 mb-8">
          <img src={humjsLogo} alt="HUMSJ" className="h-10 w-auto" />
          <div>
            <h2 className="font-serif font-bold text-white">HUMSJ</h2>
            <p className="text-xs text-white/80">🟠 Dawa Sector</p>
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
            🟠 Dawa Sector Dashboard
          </h1>
          <p className="text-[#64748b]">Manage Islamic outreach and awareness programs</p>
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
                    <p className="text-2xl font-bold">{stats.totalActivities}</p>
                    <p className="text-sm text-gray-500">Total Activities</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-[#25A7A1] hover:shadow-lg transition-shadow">
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="w-12 h-12 rounded-xl bg-[#25A7A1]/10 flex items-center justify-center">
                    <Globe size={24} className="text-[#25A7A1]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.upcomingActivities}</p>
                    <p className="text-sm text-gray-500">Upcoming Activities</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-[#25A7A1] hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("enrollments")}>
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="w-12 h-12 rounded-xl bg-[#25A7A1]/10 flex items-center justify-center">
                    <UserPlus size={24} className="text-[#25A7A1]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.pendingRegistrations}</p>
                    <p className="text-sm text-gray-500">Pending Enrollments</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle size={20} className="text-[#25A7A1]" />
                    Dawa Programs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {["Islamic Awareness", "Youth Mentorship", "New Muslim Support", "Interfaith Dialogue"].map((program, index) => (
                      <div key={program} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#25A7A1] flex items-center justify-center text-white font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{program}</p>
                            <p className="text-sm text-gray-500">Active program</p>
                          </div>
                        </div>
                        <Badge className="bg-[#25A7A1]/10 text-[#25A7A1]">Active</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar size={20} className="text-[#25A7A1]" />
                    Upcoming Activities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activities.filter(a => a.status === "upcoming").slice(0, 4).map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div>
                          <p className="font-medium">{activity.name}</p>
                          <p className="text-sm text-gray-500">{activity.day} {activity.time}</p>
                        </div>
                        <Badge className="bg-amber-100 text-amber-600">Upcoming</Badge>
                      </div>
                    ))}
                    {activities.filter(a => a.status === "upcoming").length === 0 && (
                      <p className="text-center text-gray-500 py-4">No upcoming activities</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Participants Tab */}
        {activeTab === "participants" && (
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle>Dawa Participants</CardTitle>
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
                      <TableHead>Program</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading participants...</TableCell>
                      </TableRow>
                    ) : registrations.filter(r => r.status === "approved").length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No participants found.</TableCell>
                      </TableRow>
                    ) : (
                      registrations.filter(r => r.status === "approved").map((reg) => (
                        <TableRow key={reg.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-[#25A7A1] flex items-center justify-center text-white text-sm font-bold">
                                {reg.name.charAt(0)}
                              </div>
                              {reg.name}
                            </div>
                          </TableCell>
                          <TableCell>{reg.phone}</TableCell>
                          <TableCell>{reg.program || "General"}</TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-600">Approved</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-red-500 hover:bg-red-50"
                              onClick={() => handleDeleteRegistration(reg.id!)}
                            >
                              <Trash2 size={16} />
                            </Button>
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
              <CardTitle>Pending Enrollments</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrations.filter(r => r.status === "pending").length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No pending enrollments.</TableCell>
                    </TableRow>
                  ) : (
                    registrations.filter(r => r.status === "pending").map((reg) => (
                      <TableRow key={reg.id}>
                        <TableCell className="font-medium">{reg.name}</TableCell>
                        <TableCell>{reg.phone}</TableCell>
                        <TableCell>{reg.program || "General"}</TableCell>
                        <TableCell>{reg.createdAt ? new Date(reg.createdAt.toDate()).toLocaleDateString() : "-"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-green-500" onClick={() => handleApproveRegistration(reg.id!)}>
                              <Check size={16} />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500" onClick={() => handleDeleteRegistration(reg.id!)}>
                              <X size={16} />
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

        {/* Activities Tab */}
        {activeTab === "activities" && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Dawa Activities</CardTitle>
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
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activities.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No activities found.</TableCell>
                    </TableRow>
                  ) : (
                    activities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell className="font-medium">{activity.name}</TableCell>
                        <TableCell><Badge variant="outline">{activity.type}</Badge></TableCell>
                        <TableCell>{activity.day} {activity.time}</TableCell>
                        <TableCell>
                          <Badge className={activity.status === "active" ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"}>
                            {activity.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleEditActivity(activity)}>
                              <Edit size={16} />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500" onClick={() => handleDeleteActivity(activity.id!)}>
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
          <EventsManager sector="dawa" title="Dawa Events" />
        )}

        {/* Reports Tab */}
        {activeTab === "reports" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 size={20} />
                Dawa Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-[#25A7A1]/10 rounded-xl border border-[#25A7A1]/20">
                  <p className="text-sm text-[#25A7A1]">Total Participants</p>
                  <p className="text-2xl font-bold text-[#25A7A1]">{stats.totalParticipants}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl">
                  <p className="text-sm text-green-600">Approved</p>
                  <p className="text-2xl font-bold text-green-700">{stats.approvedParticipants}</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-xl">
                  <p className="text-sm text-amber-600">Pending</p>
                  <p className="text-2xl font-bold text-amber-700">{stats.pendingRegistrations}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <AdminSettings sectorName="Dawa Sector" sectorColor="#25A7A1" />
        )}

        {/* Add Activity Dialog */}
        <Dialog open={isAddActivityOpen} onOpenChange={setIsAddActivityOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Activity</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Activity Name</Label>
                <Input value={activityForm.name} onChange={(e) => setActivityForm({...activityForm, name: e.target.value})} placeholder="e.g., Islamic Awareness Campaign" />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={activityForm.type} onValueChange={(v) => setActivityForm({...activityForm, type: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="awareness">Awareness Campaign</SelectItem>
                    <SelectItem value="mentorship">Mentorship</SelectItem>
                    <SelectItem value="lecture">Lecture</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="outreach">Outreach</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Day</Label>
                  <Input value={activityForm.day} onChange={(e) => setActivityForm({...activityForm, day: e.target.value})} placeholder="e.g., Saturday" />
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input value={activityForm.time} onChange={(e) => setActivityForm({...activityForm, time: e.target.value})} placeholder="e.g., 2:00 PM" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={activityForm.description} onChange={(e) => setActivityForm({...activityForm, description: e.target.value})} placeholder="Activity description..." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddActivityOpen(false)}>Cancel</Button>
              <Button className="bg-[#25A7A1] hover:bg-[#1F8B86]" onClick={handleAddActivity}>Add Activity</Button>
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
                <Label>Activity Name</Label>
                <Input value={activityForm.name} onChange={(e) => setActivityForm({...activityForm, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={activityForm.type} onValueChange={(v) => setActivityForm({...activityForm, type: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="awareness">Awareness Campaign</SelectItem>
                    <SelectItem value="mentorship">Mentorship</SelectItem>
                    <SelectItem value="lecture">Lecture</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="outreach">Outreach</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Day</Label>
                  <Input value={activityForm.day} onChange={(e) => setActivityForm({...activityForm, day: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input value={activityForm.time} onChange={(e) => setActivityForm({...activityForm, time: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={activityForm.status} onValueChange={(v: any) => setActivityForm({...activityForm, status: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={activityForm.description} onChange={(e) => setActivityForm({...activityForm, description: e.target.value})} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditActivityOpen(false)}>Cancel</Button>
              <Button className="bg-[#25A7A1] hover:bg-[#1F8B86]" onClick={handleUpdateActivity}>Update Activity</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default DawaDashboard;
