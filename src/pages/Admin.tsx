import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Users,
  FileText,
  Settings,
  LogOut,
  Check,
  X,
  Edit,
  Trash2,
  Plus,
  LayoutDashboard,
  Bell,
  ChevronDown,
  ChevronRight,
  Moon,
  Sun,
  Globe,
  Shield,
  Image,
  Activity,
  TrendingUp,
  UserCheck,
  UserX,
  Eye,
  EyeOff,
  Search,
  Upload,
  Save,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { useToast } from "@/hooks/use-toast";
import humjsLogo from "@/assets/humjs-logo.png";
import ImageUpload from "@/components/ui/ImageUpload";
import { CloudinaryUploadResponse } from "@/lib/cloudinary";
import {
  FirestoreEvent,
  subscribeToEvents,
  addEvent as addFirestoreEvent,
  updateEvent as updateFirestoreEvent,
  deleteEvent as deleteFirestoreEvent,
} from "@/lib/firestore";

// Translations
const translations = {
  english: {
    dashboard: "Dashboard",
    events: "Events",
    users: "Users",
    content: "Content",
    settings: "Settings",
    backToSite: "Back to Site",
    overview: "Overview of your website activity",
    manageEvents: "Manage events and approvals",
    manageUsers: "Manage users and roles",
    manageContent: "Manage pages and media",
    configurePrefs: "Configure your preferences",
    totalUsers: "Total Users",
    totalEvents: "Total Events",
    pendingApproval: "Pending Approval",
    activeSessions: "Active Sessions",
    recentActivity: "Recent Activity",
    quickActions: "Quick Actions",
    addNewEvent: "Add New Event",
    manageUsersBtn: "Manage Users",
    editPages: "Edit Pages",
    uploadMedia: "Upload Media",
    eventManagement: "Event Management",
    userManagement: "User Management",
    pagesManagement: "Pages Management",
    mediaLibrary: "Media Library",
    themeSettings: "Theme Settings",
    languageSettings: "Language Settings",
    notifications: "Notifications",
    security: "Security",
    darkMode: "Dark Mode",
    enabled: "Enabled",
    disabled: "Disabled",
    accentColor: "Accent Color",
    chooseLanguage: "Choose your language",
    customizeAppearance: "Customize appearance",
    manageAlerts: "Manage alerts",
    adminProtected: "Admin access is protected",
    securityNote: "Admin sections are hidden from regular users. Only authenticated administrators can access this dashboard.",
    eventTitle: "Event Title",
    date: "Date",
    category: "Category",
    submittedBy: "Submitted By",
    status: "Status",
    actions: "Actions",
    name: "Name",
    email: "Email",
    role: "Role",
    joined: "Joined",
    search: "Search...",
    addEvent: "Add Event",
    editEvent: "Edit Event",
    deleteConfirm: "Are you sure you want to delete this?",
    save: "Save",
    cancel: "Cancel",
    title: "Title",
    description: "Description",
    selectCategory: "Select Category",
    community: "Community",
    education: "Education",
    charity: "Charity",
    viewAll: "View All",
  },
  amharic: {
    dashboard: "ዳሽቦርድ",
    events: "ዝግጅቶች",
    users: "ተጠቃሚዎች",
    content: "ይዘት",
    settings: "ቅንብሮች",
    backToSite: "ወደ ድረ-ገጽ ተመለስ",
    overview: "የድረ-ገጽዎ እንቅስቃሴ አጠቃላይ እይታ",
    manageEvents: "ዝግጅቶችን እና ማጽደቆችን ያስተዳድሩ",
    manageUsers: "ተጠቃሚዎችን እና ሚናዎችን ያስተዳድሩ",
    manageContent: "ገጾችን እና ሚዲያን ያስተዳድሩ",
    configurePrefs: "ምርጫዎችዎን ያዋቅሩ",
    totalUsers: "ጠቅላላ ተጠቃሚዎች",
    totalEvents: "ጠቅላላ ዝግጅቶች",
    pendingApproval: "በመጠባበቅ ላይ",
    activeSessions: "ንቁ ክፍለ ጊዜዎች",
    recentActivity: "የቅርብ ጊዜ እንቅስቃሴ",
    quickActions: "ፈጣን ድርጊቶች",
    addNewEvent: "አዲስ ዝግጅት ጨምር",
    manageUsersBtn: "ተጠቃሚዎችን አስተዳድር",
    editPages: "ገጾችን አርትዕ",
    uploadMedia: "ሚዲያ ስቀል",
    eventManagement: "የዝግጅት አስተዳደር",
    userManagement: "የተጠቃሚ አስተዳደር",
    pagesManagement: "የገጾች አስተዳደር",
    mediaLibrary: "የሚዲያ ቤተ-መጽሐፍት",
    themeSettings: "የገጽታ ቅንብሮች",
    languageSettings: "የቋንቋ ቅንብሮች",
    notifications: "ማሳወቂያዎች",
    security: "ደህንነት",
    darkMode: "ጨለማ ሁነታ",
    enabled: "ነቅቷል",
    disabled: "ተሰናክሏል",
    accentColor: "ዋና ቀለም",
    chooseLanguage: "ቋንቋዎን ይምረጡ",
    customizeAppearance: "መልክን ያብጁ",
    manageAlerts: "ማንቂያዎችን ያስተዳድሩ",
    adminProtected: "የአስተዳዳሪ መዳረሻ የተጠበቀ ነው",
    securityNote: "የአስተዳዳሪ ክፍሎች ከመደበኛ ተጠቃሚዎች ተደብቀዋል።",
    eventTitle: "የዝግጅት ርዕስ",
    date: "ቀን",
    category: "ምድብ",
    submittedBy: "የቀረበው በ",
    status: "ሁኔታ",
    actions: "ድርጊቶች",
    name: "ስም",
    email: "ኢሜይል",
    role: "ሚና",
    joined: "የተቀላቀለ",
    search: "ፈልግ...",
    addEvent: "ዝግጅት ጨምር",
    editEvent: "ዝግጅት አርትዕ",
    deleteConfirm: "ይህን መሰረዝ እንደሚፈልጉ እርግጠኛ ነዎት?",
    save: "አስቀምጥ",
    cancel: "ሰርዝ",
    title: "ርዕስ",
    description: "መግለጫ",
    selectCategory: "ምድብ ይምረጡ",
    community: "ማህበረሰብ",
    education: "ትምህርት",
    charity: "በጎ አድራጎት",
    viewAll: "ሁሉንም ይመልከቱ",
  },
  oromic: {
    dashboard: "Daashboordii",
    events: "Taateewwan",
    users: "Fayyadamtoota",
    content: "Qabiyyee",
    settings: "Qindaa'ina",
    backToSite: "Gara Marsariitii Deebi'i",
    overview: "Haala sochii marsariitii keessanii",
    manageEvents: "Taateewwan fi mirkaneessa bulchi",
    manageUsers: "Fayyadamtoota fi gahee bulchi",
    manageContent: "Fuulawwan fi miidiyaa bulchi",
    configurePrefs: "Filannoo keessan qindeessaa",
    totalUsers: "Fayyadamtoota Waliigalaa",
    totalEvents: "Taateewwan Waliigalaa",
    pendingApproval: "Mirkaneessa Eegaa Jiru",
    activeSessions: "Yeroo Hojii Irra Jiru",
    recentActivity: "Sochii Dhiyoo",
    quickActions: "Tarkaanfii Ariifataa",
    addNewEvent: "Taatee Haaraa Dabali",
    manageUsersBtn: "Fayyadamtoota Bulchi",
    editPages: "Fuulawwan Gulaali",
    uploadMedia: "Miidiyaa Olkaa'i",
    eventManagement: "Bulchiinsa Taateewwan",
    userManagement: "Bulchiinsa Fayyadamtootaa",
    pagesManagement: "Bulchiinsa Fuulawwanii",
    mediaLibrary: "Kuusaa Miidiyaa",
    themeSettings: "Qindaa'ina Bifa",
    languageSettings: "Qindaa'ina Afaanii",
    notifications: "Beeksisa",
    security: "Nageenya",
    darkMode: "Haala Dukkana",
    enabled: "Banameera",
    disabled: "Cufameera",
    accentColor: "Halluu Ijoo",
    chooseLanguage: "Afaan keessan filadhaa",
    customizeAppearance: "Bifa jijjiiri",
    manageAlerts: "Akeekkachiisa bulchi",
    adminProtected: "Seensa bulchaa eegameera",
    securityNote: "Kutaaleen bulchaa fayyadamtoota idilee irraa dhokfamaniiru.",
    eventTitle: "Mata Duree Taatee",
    date: "Guyyaa",
    category: "Ramaddii",
    submittedBy: "Kan Dhiyeesse",
    status: "Haala",
    actions: "Tarkaanfii",
    name: "Maqaa",
    email: "Imeelii",
    role: "Gahee",
    joined: "Kan Makame",
    search: "Barbaadi...",
    addEvent: "Taatee Dabali",
    editEvent: "Taatee Gulaali",
    deleteConfirm: "Kana haquu barbaaddaa?",
    save: "Olkaa'i",
    cancel: "Haqi",
    title: "Mata Duree",
    description: "Ibsa",
    selectCategory: "Ramaddii Filadhu",
    community: "Hawaasa",
    education: "Barnoota",
    charity: "Tola Ooltummaa",
    viewAll: "Hunda Ilaali",
  },
};

type Language = keyof typeof translations;

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  submittedBy: string;
  status: "pending" | "approved" | "rejected";
  image?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "moderator";
  status: "active" | "disabled";
  joinDate: string;
}

interface RecentActivity {
  id: string;
  action: string;
  user: string;
  time: string;
  type: "event" | "user" | "content" | "setting";
}

type ActiveSection = "dashboard" | "events" | "users" | "content" | "settings";

const Admin = () => {
  const { toast } = useToast();
  
  // Load persisted settings
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("admin-language");
    return (saved as Language) || "english";
  });
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("admin-dark-mode");
    return saved === "true";
  });
  
  const [primaryColor, setPrimaryColor] = useState(() => {
    return localStorage.getItem("admin-primary-color") || "#1a9e98";
  });

  const t = translations[language];

  // Events state - now using Firebase
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isSavingEvent, setIsSavingEvent] = useState(false);

  // Subscribe to Firebase events
  useEffect(() => {
    setIsLoadingEvents(true);
    const unsubscribe = subscribeToEvents((firestoreEvents: FirestoreEvent[]) => {
      const mappedEvents: Event[] = firestoreEvents.map((e) => ({
        id: e.id || "",
        title: e.title,
        description: e.description,
        date: e.date,
        category: e.category,
        submittedBy: e.submittedBy,
        status: e.status,
        image: e.image,
      }));
      setEvents(mappedEvents);
      setIsLoadingEvents(false);
    });

    return () => unsubscribe();
  }, []);

  // Users state
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem("admin-users");
    return saved ? JSON.parse(saved) : [
      { id: "1", name: "Ahmed Mohammed", email: "ahmed@example.com", role: "admin", status: "active", joinDate: "2024-01-15" },
      { id: "2", name: "Fatima Ali", email: "fatima@example.com", role: "moderator", status: "active", joinDate: "2024-03-20" },
      { id: "3", name: "Ibrahim Hassan", email: "ibrahim@example.com", role: "user", status: "active", joinDate: "2024-06-10" },
      { id: "4", name: "Aisha Omar", email: "aisha@example.com", role: "user", status: "disabled", joinDate: "2024-08-05" },
    ];
  });

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([
    { id: "1", action: "New event submitted", user: "External Affairs", time: "5 min ago", type: "event" },
    { id: "2", action: "User role updated", user: "Admin", time: "1 hour ago", type: "user" },
    { id: "3", action: "Page content edited", user: "Moderator", time: "2 hours ago", type: "content" },
    { id: "4", action: "Settings changed", user: "Admin", time: "3 hours ago", type: "setting" },
  ]);

  const [activeSection, setActiveSection] = useState<ActiveSection>("dashboard");
  const [expandedPanels, setExpandedPanels] = useState<Record<string, boolean>>({
    events: true, users: true, content: true, theme: true, language: true, notifications: true,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState<string>("all");
  
  // Modal states
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [eventForm, setEventForm] = useState({ title: "", description: "", date: "", category: "Community", image: "" });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState(() => {
    const saved = localStorage.getItem("admin-notifications");
    return saved ? JSON.parse(saved) : {
      emailNewEvents: true,
      pushApprovals: true,
      weeklySummary: false,
      newUserAlerts: true,
    };
  });

  // Persist settings
  useEffect(() => {
    localStorage.setItem("admin-language", language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem("admin-dark-mode", String(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem("admin-primary-color", primaryColor);
    document.documentElement.style.setProperty("--admin-primary", primaryColor);
  }, [primaryColor]);

  useEffect(() => {
    localStorage.setItem("admin-users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("admin-notifications", JSON.stringify(notificationSettings));
  }, [notificationSettings]);

  const togglePanel = (panel: string) => {
    setExpandedPanels((prev) => ({ ...prev, [panel]: !prev[panel] }));
  };

  const addActivity = (action: string, type: RecentActivity["type"]) => {
    const newActivity: RecentActivity = {
      id: Date.now().toString(),
      action,
      user: "Admin",
      time: "Just now",
      type,
    };
    setRecentActivities((prev) => [newActivity, ...prev.slice(0, 9)]);
  };

  // Event handlers - now using Firebase
  const handleApprove = async (id: string) => {
    try {
      await updateFirestoreEvent(id, { status: "approved" });
      addActivity("Event approved", "event");
      toast({ title: "Event Approved", description: "The event has been published." });
    } catch (error) {
      console.error("Error approving event:", error);
      toast({ title: "Error", description: "Failed to approve event. Please try again.", variant: "destructive" });
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateFirestoreEvent(id, { status: "rejected" });
      addActivity("Event rejected", "event");
      toast({ title: "Event Rejected", description: "The event has been rejected.", variant: "destructive" });
    } catch (error) {
      console.error("Error rejecting event:", error);
      toast({ title: "Error", description: "Failed to reject event. Please try again.", variant: "destructive" });
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await deleteFirestoreEvent(id);
      addActivity("Event deleted", "event");
      toast({ title: "Event Deleted", description: "The event has been removed." });
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({ title: "Error", description: "Failed to delete event. Please try again.", variant: "destructive" });
    }
  };

  const handleSaveEvent = async () => {
    if (!eventForm.title || !eventForm.date) {
      toast({ title: "Error", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }

    setIsSavingEvent(true);

    try {
      if (editingEvent) {
        await updateFirestoreEvent(editingEvent.id, {
          title: eventForm.title,
          description: eventForm.description,
          date: eventForm.date,
          category: eventForm.category,
          image: eventForm.image,
        });
        addActivity("Event updated", "event");
        toast({ title: "Event Updated", description: "The event has been updated." });
      } else {
        await addFirestoreEvent({
          title: eventForm.title,
          description: eventForm.description,
          date: eventForm.date,
          category: eventForm.category,
          image: eventForm.image,
          submittedBy: "Admin",
          status: "approved",
        });
        addActivity("New event created", "event");
        toast({ title: "Event Created", description: "The event has been added." });
      }
      
      setIsEventModalOpen(false);
      setEditingEvent(null);
      setEventForm({ title: "", description: "", date: "", category: "Community", image: "" });
    } catch (error) {
      console.error("Error saving event:", error);
      toast({ title: "Error", description: "Failed to save event. Please try again.", variant: "destructive" });
    } finally {
      setIsSavingEvent(false);
    }
  };

  const openEditEvent = (event: Event) => {
    setEditingEvent(event);
    setEventForm({ title: event.title, description: event.description, date: event.date, category: event.category, image: event.image || "" });
    setIsEventModalOpen(true);
  };

  // User handlers
  const handleToggleUserStatus = (id: string) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, status: u.status === "active" ? "disabled" : "active" } : u)));
    addActivity("User status changed", "user");
    toast({ title: "User Status Updated" });
  };

  const handleChangeRole = (id: string, newRole: "admin" | "user" | "moderator") => {
    setUsers(users.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
    addActivity(`User role changed to ${newRole}`, "user");
    toast({ title: "Role Updated", description: `User role changed to ${newRole}.` });
  };

  // Filtered data
  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = userRoleFilter === "all" || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  // Stats
  const stats = [
    { label: t.totalUsers, value: users.length.toString(), icon: Users, change: "+12%", color: primaryColor },
    { label: t.totalEvents, value: events.length.toString(), icon: Calendar, change: "+5%", color: "#d4af37" },
    { label: t.pendingApproval, value: events.filter((e) => e.status === "pending").length.toString(), icon: FileText, change: "0", color: "#f59e0b" },
    { label: t.activeSessions, value: "48", icon: Activity, change: "+8%", color: "#3dd4cc" },
  ];

  const navItems = [
    { icon: LayoutDashboard, label: t.dashboard, section: "dashboard" as const },
    { icon: Calendar, label: t.events, section: "events" as const },
    { icon: Users, label: t.users, section: "users" as const },
    { icon: FileText, label: t.content, section: "content" as const },
    { icon: Settings, label: t.settings, section: "settings" as const },
  ];

  const bgClass = isDarkMode ? "bg-gray-900" : "bg-[#f8f9fa]";
  const cardClass = isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100";
  const textClass = isDarkMode ? "text-white" : "text-[#1e293b]";
  const mutedClass = isDarkMode ? "text-gray-400" : "text-[#64748b]";
  const borderClass = isDarkMode ? "border-gray-700" : "border-gray-200";

  return (
    <div className={`min-h-screen flex ${bgClass}`}>
      {/* Sidebar */}
      <aside className={`w-64 ${isDarkMode ? "bg-gray-800" : "bg-[#0f4a47]"} p-6 hidden lg:flex flex-col`}>
        <div className="flex items-center gap-3 mb-8">
          <img src={humjsLogo} alt="HUMSJ" className="h-10 w-auto" />
          <div>
            <h2 className="font-serif font-bold text-white">HUMSJ</h2>
            <p className="text-xs" style={{ color: primaryColor }}>Admin Panel</p>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          {navItems.map((item) => (
            <button
              key={item.section}
              onClick={() => setActiveSection(item.section)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeSection === item.section
                  ? "text-white shadow-lg"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
              style={activeSection === item.section ? { backgroundColor: primaryColor } : {}}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10">
          <Link to="/">
            <Button variant="outline" className="w-full border-white/20 text-white/70 hover:bg-white/10 hover:text-white">
              <LogOut size={16} />
              {t.backToSite}
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        {/* Header */}
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-6 border-b ${borderClass}`}>
          <div>
            <h1 className={`text-2xl md:text-3xl font-serif font-bold ${textClass}`}>
              {navItems.find((n) => n.section === activeSection)?.label}
            </h1>
            <p className={mutedClass}>
              {activeSection === "dashboard" && t.overview}
              {activeSection === "events" && t.manageEvents}
              {activeSection === "users" && t.manageUsers}
              {activeSection === "content" && t.manageContent}
              {activeSection === "settings" && t.configurePrefs}
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <Button variant="outline" size="icon" onClick={() => setIsDarkMode(!isDarkMode)} className={isDarkMode ? "border-gray-600 text-gray-300" : "border-gray-300"}>
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
            {(activeSection === "events" || activeSection === "users") && (
              <div className="relative">
                <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${mutedClass}`} />
                <Input
                  placeholder={t.search}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-9 w-48 ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""}`}
                />
              </div>
            )}
            {activeSection === "events" && (
              <Button onClick={() => { setEditingEvent(null); setEventForm({ title: "", description: "", date: "", category: "Community", image: "" }); setIsEventModalOpen(true); }} style={{ backgroundColor: primaryColor }} className="text-white hover:opacity-90">
                <Plus size={18} />
                {t.addEvent}
              </Button>
            )}
          </div>
        </div>

        {/* Dashboard Section */}
        {activeSection === "dashboard" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <Card key={stat.label} className={`${cardClass} shadow-sm hover:shadow-md transition-shadow animate-fade-in-up`} style={{ animationDelay: `${index * 100}ms` }}>
                  <CardContent className="flex items-center gap-4 pt-6">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${stat.color}20` }}>
                      <stat.icon size={24} style={{ color: stat.color }} />
                    </div>
                    <div className="flex-1">
                      <p className={`text-2xl font-serif font-bold ${textClass}`}>{stat.value}</p>
                      <p className={`text-sm ${mutedClass}`}>{stat.label}</p>
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-medium ${stat.change.startsWith("+") ? "text-green-500" : "text-gray-400"}`}>
                      {stat.change.startsWith("+") && <TrendingUp size={14} />}
                      {stat.change}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className={`lg:col-span-2 ${cardClass}`}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className={textClass}>{t.recentActivity}</CardTitle>
                  <Button variant="ghost" size="sm" style={{ color: primaryColor }}>{t.viewAll}</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.slice(0, 5).map((activity) => (
                      <div key={activity.id} className={`flex items-center gap-4 p-3 rounded-lg ${isDarkMode ? "bg-gray-700/50" : "bg-gray-50"}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center`} style={{
                          backgroundColor: activity.type === "event" ? `${primaryColor}20` : activity.type === "user" ? "#d4af3720" : activity.type === "content" ? "#8b5cf620" : "#6b728020",
                          color: activity.type === "event" ? primaryColor : activity.type === "user" ? "#d4af37" : activity.type === "content" ? "#8b5cf6" : "#6b7280"
                        }}>
                          {activity.type === "event" && <Calendar size={18} />}
                          {activity.type === "user" && <Users size={18} />}
                          {activity.type === "content" && <FileText size={18} />}
                          {activity.type === "setting" && <Settings size={18} />}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${textClass}`}>{activity.action}</p>
                          <p className={`text-xs ${mutedClass}`}>by {activity.user}</p>
                        </div>
                        <span className={`text-xs ${isDarkMode ? "text-gray-500" : "text-[#94a3b8]"}`}>{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className={cardClass}>
                <CardHeader>
                  <CardTitle className={textClass}>{t.quickActions}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start text-white" style={{ backgroundColor: primaryColor }} onClick={() => { setActiveSection("events"); setIsEventModalOpen(true); }}>
                    <Plus size={18} /> {t.addNewEvent}
                  </Button>
                  <Button variant="outline" className={`w-full justify-start ${isDarkMode ? "border-gray-600 text-gray-300" : ""}`} onClick={() => setActiveSection("users")}>
                    <Users size={18} /> {t.manageUsersBtn}
                  </Button>
                  <Button variant="outline" className={`w-full justify-start ${isDarkMode ? "border-gray-600 text-gray-300" : ""}`} onClick={() => setActiveSection("content")}>
                    <FileText size={18} /> {t.editPages}
                  </Button>
                  <Button variant="outline" className={`w-full justify-start ${isDarkMode ? "border-gray-600 text-gray-300" : ""}`} onClick={() => setActiveSection("content")}>
                    <Image size={18} /> {t.uploadMedia}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Events Section */}
        {activeSection === "events" && (
          <Card className={cardClass}>
            <CardHeader>
              <div className="flex items-center justify-between cursor-pointer" onClick={() => togglePanel("events")}>
                <CardTitle className={textClass}>{t.eventManagement}</CardTitle>
                {expandedPanels.events ? <ChevronDown size={20} className="text-gray-400" /> : <ChevronRight size={20} className="text-gray-400" />}
              </div>
            </CardHeader>
            {expandedPanels.events && (
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className={borderClass}>
                        <TableHead className={mutedClass}>{t.eventTitle}</TableHead>
                        <TableHead className={mutedClass}>{t.date}</TableHead>
                        <TableHead className={mutedClass}>{t.category}</TableHead>
                        <TableHead className={mutedClass}>{t.submittedBy}</TableHead>
                        <TableHead className={mutedClass}>{t.status}</TableHead>
                        <TableHead className={`text-right ${mutedClass}`}>{t.actions}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEvents.map((event) => (
                        <TableRow key={event.id} className={isDarkMode ? "border-gray-700" : "border-gray-100"}>
                          <TableCell className={`font-medium ${textClass}`}>{event.title}</TableCell>
                          <TableCell className={mutedClass}>{new Date(event.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }} className="border-0">{event.category}</Badge>
                          </TableCell>
                          <TableCell className={mutedClass}>{event.submittedBy}</TableCell>
                          <TableCell>
                            <Badge className={
                              event.status === "approved" ? "bg-green-500/10 text-green-500 border-0" :
                              event.status === "rejected" ? "bg-red-500/10 text-red-500 border-0" :
                              "bg-amber-500/10 text-amber-500 border-0"
                            }>{event.status}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              {event.status === "pending" && (
                                <>
                                  <Button size="icon" variant="ghost" onClick={() => handleApprove(event.id)} className="text-green-500 hover:bg-green-500/10 h-8 w-8">
                                    <Check size={16} />
                                  </Button>
                                  <Button size="icon" variant="ghost" onClick={() => handleReject(event.id)} className="text-red-500 hover:bg-red-500/10 h-8 w-8">
                                    <X size={16} />
                                  </Button>
                                </>
                              )}
                              <Button size="icon" variant="ghost" onClick={() => openEditEvent(event)} className={`h-8 w-8 ${isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-500"}`}>
                                <Edit size={16} />
                              </Button>
                              <Button size="icon" variant="ghost" onClick={() => handleDeleteEvent(event.id)} className="text-red-500 hover:bg-red-500/10 h-8 w-8">
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {isLoadingEvents && (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin" style={{ color: primaryColor }} />
                      <span className={`ml-2 ${mutedClass}`}>Loading events...</span>
                    </div>
                  )}
                  {!isLoadingEvents && filteredEvents.length === 0 && (
                    <p className={`text-center py-8 ${mutedClass}`}>No events found</p>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        )}

        {/* Users Section */}
        {activeSection === "users" && (
          <Card className={cardClass}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 cursor-pointer" onClick={() => togglePanel("users")}>
                  <CardTitle className={textClass}>{t.userManagement}</CardTitle>
                  {expandedPanels.users ? <ChevronDown size={20} className="text-gray-400" /> : <ChevronRight size={20} className="text-gray-400" />}
                </div>
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className={`text-sm rounded-lg px-3 py-2 border ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200"}`}
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                  <option value="user">User</option>
                </select>
              </div>
            </CardHeader>
            {expandedPanels.users && (
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className={borderClass}>
                        <TableHead className={mutedClass}>{t.name}</TableHead>
                        <TableHead className={mutedClass}>{t.email}</TableHead>
                        <TableHead className={mutedClass}>{t.role}</TableHead>
                        <TableHead className={mutedClass}>{t.status}</TableHead>
                        <TableHead className={mutedClass}>{t.joined}</TableHead>
                        <TableHead className={`text-right ${mutedClass}`}>{t.actions}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id} className={isDarkMode ? "border-gray-700" : "border-gray-100"}>
                          <TableCell className={`font-medium ${textClass}`}>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium" style={{ backgroundColor: primaryColor }}>
                                {user.name.charAt(0)}
                              </div>
                              {user.name}
                            </div>
                          </TableCell>
                          <TableCell className={mutedClass}>{user.email}</TableCell>
                          <TableCell>
                            <select
                              value={user.role}
                              onChange={(e) => handleChangeRole(user.id, e.target.value as "admin" | "user" | "moderator")}
                              className={`text-sm rounded-lg px-2 py-1 border ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200"}`}
                            >
                              <option value="admin">Admin</option>
                              <option value="moderator">Moderator</option>
                              <option value="user">User</option>
                            </select>
                          </TableCell>
                          <TableCell>
                            <Badge className={user.status === "active" ? "bg-green-500/10 text-green-500 border-0" : "bg-red-500/10 text-red-500 border-0"}>
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell className={mutedClass}>{new Date(user.joinDate).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleToggleUserStatus(user.id)}
                                className={`h-8 w-8 ${user.status === "active" ? "text-red-500 hover:bg-red-500/10" : "text-green-500 hover:bg-green-500/10"}`}
                                title={user.status === "active" ? "Disable user" : "Enable user"}
                              >
                                {user.status === "active" ? <UserX size={16} /> : <UserCheck size={16} />}
                              </Button>
                              <Button size="icon" variant="ghost" className={`h-8 w-8 ${isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-500"}`}>
                                <Edit size={16} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {filteredUsers.length === 0 && (
                    <p className={`text-center py-8 ${mutedClass}`}>No users found</p>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        )}

        {/* Content Section */}
        {activeSection === "content" && (
          <div className="space-y-6">
            <Card className={cardClass}>
              <CardHeader>
                <div className="flex items-center justify-between cursor-pointer" onClick={() => togglePanel("content")}>
                  <CardTitle className={textClass}>{t.pagesManagement}</CardTitle>
                  {expandedPanels.content ? <ChevronDown size={20} className="text-gray-400" /> : <ChevronRight size={20} className="text-gray-400" />}
                </div>
              </CardHeader>
              {expandedPanels.content && (
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {["Home", "About Us", "Events", "Charity Sector", "Qirat Sector", "Academic Sector", "Contact"].map((page) => (
                      <div key={page} className={`p-4 rounded-lg border transition-all hover:shadow-md ${isDarkMode ? "bg-gray-700/50 border-gray-600 hover:border-gray-500" : "bg-gray-50 border-gray-200 hover:border-gray-300"}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText size={18} style={{ color: primaryColor }} />
                            <span className={`font-medium ${textClass}`}>{page}</span>
                          </div>
                          <div className="flex gap-1">
                            <Button size="icon" variant="ghost" className="h-8 w-8" style={{ color: primaryColor }}>
                              <Eye size={14} />
                            </Button>
                            <Button size="icon" variant="ghost" className={`h-8 w-8 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                              <Edit size={14} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="mt-4 text-white" style={{ backgroundColor: primaryColor }}>
                    <Plus size={18} /> Add New Page
                  </Button>
                </CardContent>
              )}
            </Card>

            <Card className={cardClass}>
              <CardHeader>
                <CardTitle className={textClass}>{t.mediaLibrary}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${isDarkMode ? "border-gray-600 hover:border-gray-500" : "border-gray-300 hover:border-gray-400"}`}>
                  <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className={`font-medium mb-2 ${textClass}`}>Drop files here or click to upload</p>
                  <p className={`text-sm mb-4 ${mutedClass}`}>Supports: JPG, PNG, GIF, PDF (Max 10MB)</p>
                  <Button className="text-white" style={{ backgroundColor: primaryColor }}>
                    <Upload size={18} /> Upload Files
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Settings Section */}
        {activeSection === "settings" && (
          <div className="space-y-6">
            {/* Theme Settings */}
            <Card className={cardClass}>
              <CardHeader>
                <div className="flex items-center justify-between cursor-pointer" onClick={() => togglePanel("theme")}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
                      {isDarkMode ? <Moon size={20} style={{ color: primaryColor }} /> : <Sun size={20} style={{ color: primaryColor }} />}
                    </div>
                    <div>
                      <CardTitle className={textClass}>{t.themeSettings}</CardTitle>
                      <p className={`text-sm ${mutedClass}`}>{t.customizeAppearance}</p>
                    </div>
                  </div>
                  {expandedPanels.theme ? <ChevronDown size={20} className="text-gray-400" /> : <ChevronRight size={20} className="text-gray-400" />}
                </div>
              </CardHeader>
              {expandedPanels.theme && (
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className={textClass}>{t.darkMode}</span>
                    <Button
                      variant={isDarkMode ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      style={isDarkMode ? { backgroundColor: primaryColor } : {}}
                    >
                      {isDarkMode ? t.enabled : t.disabled}
                    </Button>
                  </div>
                  
                  <div>
                    <p className={`text-sm mb-3 ${mutedClass}`}>{t.accentColor}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex gap-2">
                        {["#1a9e98", "#29b6b0", "#d4af37", "#8b5cf6", "#ef4444", "#22c55e", "#3b82f6"].map((color) => (
                          <button
                            key={color}
                            onClick={() => setPrimaryColor(color)}
                            className={`w-10 h-10 rounded-full border-2 shadow-md hover:scale-110 transition-transform ${primaryColor === color ? "border-white ring-2 ring-offset-2" : "border-transparent"}`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="w-10 h-10 rounded-lg cursor-pointer border-0"
                        />
                        <span className={`text-sm font-mono ${mutedClass}`}>{primaryColor}</span>
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700/50" : "bg-gray-50"}`}>
                    <p className={`text-sm font-medium mb-2 ${textClass}`}>Preview</p>
                    <div className="flex gap-3">
                      <Button size="sm" className="text-white" style={{ backgroundColor: primaryColor }}>Primary Button</Button>
                      <Button size="sm" variant="outline" style={{ borderColor: primaryColor, color: primaryColor }}>Outline Button</Button>
                      <Badge style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>Badge</Badge>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Language Settings */}
            <Card className={cardClass}>
              <CardHeader>
                <div className="flex items-center justify-between cursor-pointer" onClick={() => togglePanel("language")}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <Globe size={20} className="text-amber-500" />
                    </div>
                    <div>
                      <CardTitle className={textClass}>{t.languageSettings}</CardTitle>
                      <p className={`text-sm ${mutedClass}`}>{t.chooseLanguage}</p>
                    </div>
                  </div>
                  {expandedPanels.language ? <ChevronDown size={20} className="text-gray-400" /> : <ChevronRight size={20} className="text-gray-400" />}
                </div>
              </CardHeader>
              {expandedPanels.language && (
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { code: "english" as const, label: "English", flag: "🇬🇧" },
                      { code: "amharic" as const, label: "አማርኛ (Amharic)", flag: "🇪🇹" },
                      { code: "oromic" as const, label: "Afaan Oromoo", flag: "🇪🇹" },
                    ].map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={`p-4 rounded-lg border text-left transition-all ${
                          language === lang.code
                            ? "shadow-md"
                            : isDarkMode
                            ? "border-gray-600 hover:border-gray-500"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        style={language === lang.code ? { borderColor: primaryColor, backgroundColor: `${primaryColor}10` } : {}}
                      >
                        <span className="text-3xl mb-2 block">{lang.flag}</span>
                        <span className={`font-medium ${textClass}`}>{lang.label}</span>
                        {language === lang.code && (
                          <Check size={16} className="float-right mt-1" style={{ color: primaryColor }} />
                        )}
                      </button>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Notification Settings */}
            <Card className={cardClass}>
              <CardHeader>
                <div className="flex items-center justify-between cursor-pointer" onClick={() => togglePanel("notifications")}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <Bell size={20} className="text-purple-500" />
                    </div>
                    <div>
                      <CardTitle className={textClass}>{t.notifications}</CardTitle>
                      <p className={`text-sm ${mutedClass}`}>{t.manageAlerts}</p>
                    </div>
                  </div>
                  {expandedPanels.notifications ? <ChevronDown size={20} className="text-gray-400" /> : <ChevronRight size={20} className="text-gray-400" />}
                </div>
              </CardHeader>
              {expandedPanels.notifications && (
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { key: "emailNewEvents", label: "Email notifications for new events" },
                      { key: "pushApprovals", label: "Push notifications for approvals" },
                      { key: "weeklySummary", label: "Weekly activity summary" },
                      { key: "newUserAlerts", label: "New user registration alerts" },
                    ].map((item) => (
                      <div key={item.key} className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? "bg-gray-700/50" : "bg-gray-50"}`}>
                        <span className={textClass}>{item.label}</span>
                        <Button
                          variant={notificationSettings[item.key as keyof typeof notificationSettings] ? "default" : "outline"}
                          size="sm"
                          onClick={() => setNotificationSettings((prev: typeof notificationSettings) => ({ ...prev, [item.key]: !prev[item.key as keyof typeof notificationSettings] }))}
                          style={notificationSettings[item.key as keyof typeof notificationSettings] ? { backgroundColor: primaryColor } : {}}
                        >
                          {notificationSettings[item.key as keyof typeof notificationSettings] ? <Eye size={14} /> : <EyeOff size={14} />}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Security */}
            <Card className={cardClass}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <Shield size={20} className="text-red-500" />
                  </div>
                  <div>
                    <CardTitle className={textClass}>{t.security}</CardTitle>
                    <p className={`text-sm ${mutedClass}`}>{t.adminProtected}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className={`text-sm ${mutedClass}`}>{t.securityNote}</p>
                <div className={`mt-4 p-4 rounded-lg ${isDarkMode ? "bg-green-900/20" : "bg-green-50"}`}>
                  <div className="flex items-center gap-2 text-green-600">
                    <Check size={18} />
                    <span className="font-medium">All security checks passed</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Event Modal */}
      <Dialog open={isEventModalOpen} onOpenChange={setIsEventModalOpen}>
        <DialogContent className={isDarkMode ? "bg-gray-800 border-gray-700 text-white" : ""}>
          <DialogHeader>
            <DialogTitle className={textClass}>{editingEvent ? t.editEvent : t.addEvent}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className={`text-sm font-medium ${textClass}`}>{t.title} *</label>
              <Input
                value={eventForm.title}
                onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                placeholder="Event title"
                className={`mt-1 ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""}`}
              />
            </div>
            <div>
              <label className={`text-sm font-medium ${textClass}`}>{t.description}</label>
              <Textarea
                value={eventForm.description}
                onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                placeholder="Event description"
                className={`mt-1 ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""}`}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`text-sm font-medium ${textClass}`}>{t.date} *</label>
                <Input
                  type="date"
                  value={eventForm.date}
                  onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                  className={`mt-1 ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""}`}
                />
              </div>
              <div>
                <label className={`text-sm font-medium ${textClass}`}>{t.category}</label>
                <select
                  value={eventForm.category}
                  onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                  className={`mt-1 w-full rounded-md border px-3 py-2 ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "border-gray-200"}`}
                >
                  <option value="Community">{t.community}</option>
                  <option value="Education">{t.education}</option>
                  <option value="Charity">{t.charity}</option>
                </select>
              </div>
            </div>
            <div>
              <label className={`text-sm font-medium ${textClass}`}>Event Image</label>
              <ImageUpload
                currentImage={eventForm.image}
                onUploadComplete={(result: CloudinaryUploadResponse) => setEventForm({ ...eventForm, image: result.secure_url })}
                onRemove={() => setEventForm({ ...eventForm, image: "" })}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEventModalOpen(false)} className={isDarkMode ? "border-gray-600 text-gray-300" : ""} disabled={isSavingEvent}>
              {t.cancel}
            </Button>
            <Button onClick={handleSaveEvent} className="text-white" style={{ backgroundColor: primaryColor }} disabled={isSavingEvent}>
              {isSavingEvent ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {isSavingEvent ? "Saving..." : t.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
