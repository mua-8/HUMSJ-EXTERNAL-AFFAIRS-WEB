import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  DollarSign,
  Users,
  TrendingUp,
  Check,
  X,
  Eye,
  Trash2,
  LogOut,
  Filter,
  Phone,
  MessageCircle,
  Download,
  FileText,
  Calendar,
  CreditCard,
  BarChart3,
  PieChart,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  Donation,
  subscribeToDonations,
  updateDonationStatus,
  deleteDonation,
} from "@/lib/donations";
import humjsLogo from "@/assets/humjs-logo.png";

type ActiveTab = "donations" | "reports" | "payment-methods";

const CharityDashboard = () => {
  const { toast } = useToast();
  const { signOut, user } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>("donations");
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [reportPeriod, setReportPeriod] = useState<"monthly" | "yearly">("monthly");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const unsubscribe = subscribeToDonations((data) => {
      setDonations(data);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleConfirm = async (id: string) => {
    try {
      await updateDonationStatus(id, "confirmed");
      toast({ title: "Donation Confirmed", description: "The donation has been confirmed." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to confirm donation.", variant: "destructive" });
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateDonationStatus(id, "rejected");
      toast({ title: "Donation Rejected", description: "The donation has been rejected.", variant: "destructive" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to reject donation.", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDonation(id);
      toast({ title: "Deleted", description: "The donation record has been deleted." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete donation.", variant: "destructive" });
    }
  };

  const handleViewDetails = (donation: Donation) => {
    setSelectedDonation(donation);
    setResponseMessage("");
    setIsViewModalOpen(true);
  };

  const handleSendSMS = () => {
    if (!selectedDonation) return;
    const message = responseMessage || `Jazakallahu Khairan ${selectedDonation.fullName}! Your donation of ${selectedDonation.amount} ETB has been received. May Allah bless you.`;
    window.open(`sms:${selectedDonation.phone}?body=${encodeURIComponent(message)}`);
    toast({ title: "SMS App Opened", description: "Complete sending the message in your SMS app." });
  };

  const handleCallDonor = () => {
    if (!selectedDonation) return;
    window.open(`tel:${selectedDonation.phone}`);
  };

  const handleWhatsApp = () => {
    if (!selectedDonation) return;
    const message = responseMessage || `Jazakallahu Khairan ${selectedDonation.fullName}! Your donation of ${selectedDonation.amount} ETB has been received. May Allah bless you.`;
    const phone = selectedDonation.phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);
  };

  const handleTelegram = () => {
    if (!selectedDonation) return;
    const message = responseMessage || `Jazakallahu Khairan ${selectedDonation.fullName}! Your donation of ${selectedDonation.amount} ETB has been received. May Allah bless you.`;
    window.open(`https://t.me/share/url?text=${encodeURIComponent(message)}`);
  };

  // Export functions
  const exportToCSV = (data: Donation[], filename: string) => {
    const headers = ["Name", "Phone", "ID/Email", "Department", "Year", "Amount", "Payment Method", "Type", "Status", "Start Month", "Date"];
    const csvContent = [
      headers.join(","),
      ...data.map(d => [
        `"${d.fullName}"`,
        `"${d.phone}"`,
        `"${d.idNumber}"`,
        `"${d.department}"`,
        d.year,
        d.amount,
        `"${d.paymentMethod}"`,
        d.donationType,
        d.status,
        `"${d.startMonth}"`,
        d.createdAt ? new Date(d.createdAt.toDate()).toLocaleDateString() : ""
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    link.click();
    toast({ title: "Export Successful", description: `Data exported to ${filename}.csv` });
  };

  const exportToPDF = (data: Donation[], title: string) => {
    // Create a printable HTML content
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #0f4a47; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
          th { background-color: #0f4a47; color: white; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .summary { margin-top: 20px; padding: 15px; background: #f0f9ff; border-radius: 8px; }
          .total { font-size: 18px; font-weight: bold; color: #0f4a47; }
        </style>
      </head>
      <body>
        <h1>HUMSJ Charity Sector - ${title}</h1>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        <div class="summary">
          <p><strong>Total Records:</strong> ${data.length}</p>
          <p><strong>Confirmed Donations:</strong> ${data.filter(d => d.status === "confirmed").length}</p>
          <p class="total">Total Amount (Confirmed): ${data.filter(d => d.status === "confirmed").reduce((sum, d) => sum + d.amount, 0).toLocaleString()} ETB</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Department</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(d => `
              <tr>
                <td>${d.fullName}</td>
                <td>${d.phone}</td>
                <td>${d.department}</td>
                <td>${d.amount} ETB</td>
                <td>${d.paymentMethod}</td>
                <td>${d.donationType === "star_shining" ? "Star-Shining" : "Student"}</td>
                <td>${d.status}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
    toast({ title: "PDF Ready", description: "Print dialog opened for PDF export." });
  };

  const filteredDonations = donations.filter((d) => {
    const matchesSearch =
      d.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.idNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter donations by period for reports
  const getFilteredByPeriod = () => {
    return donations.filter(d => {
      if (!d.createdAt) return false;
      const date = d.createdAt.toDate();
      if (reportPeriod === "monthly") {
        return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
      } else {
        return date.getFullYear() === selectedYear;
      }
    });
  };

  const periodDonations = getFilteredByPeriod();

  const stats = {
    total: donations.length,
    confirmed: donations.filter((d) => d.status === "confirmed").length,
    pending: donations.filter((d) => d.status === "pending").length,
    totalAmount: donations
      .filter((d) => d.status === "confirmed")
      .reduce((sum, d) => sum + d.amount, 0),
  };

  // Payment methods breakdown
  const paymentMethodStats = donations.reduce((acc, d) => {
    if (d.status === "confirmed") {
      acc[d.paymentMethod] = (acc[d.paymentMethod] || 0) + d.amount;
    }
    return acc;
  }, {} as Record<string, number>);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-[#25A7A1] to-[#1F8B86] p-6 hidden lg:flex flex-col shadow-xl">
        <div className="flex items-center gap-3 mb-8">
          <img src={humjsLogo} alt="HUMSJ" className="h-10 w-auto" />
          <div>
            <h2 className="font-serif font-bold text-white">HUMSJ</h2>
            <p className="text-xs text-white/80">🟢 Charity Sector</p>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          <button
            onClick={() => setActiveTab("donations")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === "donations"
              ? "bg-white/20 text-white shadow-lg"
              : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
          >
            <Heart size={18} />
            Donations
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === "reports"
              ? "bg-white/20 text-white shadow-lg"
              : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
          >
            <BarChart3 size={18} />
            Reports
          </button>
          <button
            onClick={() => setActiveTab("payment-methods")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === "payment-methods"
              ? "bg-white/20 text-white shadow-lg"
              : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
          >
            <CreditCard size={18} />
            Payment Methods
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10 space-y-2">
          <p className="text-xs text-white/50 px-2">{user?.email}</p>
          <Link to="/">
            <Button variant="outline" className="w-full border-white/20 text-white/70 hover:bg-white/10 hover:text-white mb-2">
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
      <main className="lg:ml-64 p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#1e293b]">
            🟢 Charity Sector Dashboard
          </h1>
          <p className="text-[#64748b]">Manage student Sadaqah and donations</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-[#25A7A1] hover:shadow-lg transition-shadow">
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="w-12 h-12 rounded-xl bg-[#25A7A1]/10 flex items-center justify-center">
                <Users size={24} className="text-[#25A7A1]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1e293b]">{stats.total}</p>
                <p className="text-sm text-[#64748b]">Total Pledges</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-[#25A7A1] hover:shadow-lg transition-shadow">
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="w-12 h-12 rounded-xl bg-[#25A7A1]/10 flex items-center justify-center">
                <Check size={24} className="text-[#25A7A1]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1e293b]">{stats.confirmed}</p>
                <p className="text-sm text-[#64748b]">Confirmed</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-[#25A7A1] hover:shadow-lg transition-shadow">
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="w-12 h-12 rounded-xl bg-[#25A7A1]/10 flex items-center justify-center">
                <TrendingUp size={24} className="text-[#25A7A1]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1e293b]">{stats.pending}</p>
                <p className="text-sm text-[#64748b]">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-[#25A7A1] hover:shadow-lg transition-shadow">
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="w-12 h-12 rounded-xl bg-[#25A7A1]/10 flex items-center justify-center">
                <DollarSign size={24} className="text-[#25A7A1]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1e293b]">{stats.totalAmount.toLocaleString()} ETB</p>
                <p className="text-sm text-[#64748b]">Total Confirmed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Donations Tab */}
        {activeTab === "donations" && (
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle>Student Sadaqah Pledges</CardTitle>
                <div className="flex flex-wrap gap-3">
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-48"
                  />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-36">
                      <Filter size={16} className="mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    onClick={() => exportToCSV(filteredDonations, "donations_export")}
                    className="flex items-center gap-2"
                  >
                    <Download size={16} />
                    Export CSV
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-[#64748b]">Loading donations...</div>
              ) : filteredDonations.length === 0 ? (
                <div className="text-center py-8 text-[#64748b]">No donations found</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>ID/Email</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDonations.map((donation) => (
                        <TableRow key={donation.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">{donation.fullName}</TableCell>
                          <TableCell>{donation.phone}</TableCell>
                          <TableCell>{donation.idNumber}</TableCell>
                          <TableCell>{donation.department}</TableCell>
                          <TableCell className="font-semibold text-[#25A7A1]">{donation.amount} ETB</TableCell>
                          <TableCell>
                            <Badge className={donation.donationType === "star_shining" ? "bg-[#d4af37]/10 text-[#d4af37] border-0" : "bg-[#25A7A1]/10 text-[#25A7A1] border-0"}>
                              {donation.donationType === "star_shining" ? "Star-Shining" : "Student"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                donation.status === "confirmed"
                                  ? "bg-green-500/10 text-green-500 border-0"
                                  : donation.status === "rejected"
                                    ? "bg-red-500/10 text-red-500 border-0"
                                    : "bg-amber-500/10 text-amber-500 border-0"
                              }
                            >
                              {donation.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleViewDetails(donation)}
                                className="text-[#25A7A1] hover:bg-[#25A7A1]/10 h-8 w-8"
                                title="View & Respond"
                              >
                                <Eye size={16} />
                              </Button>
                              {donation.status === "pending" && (
                                <>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleConfirm(donation.id!)}
                                    className="text-green-500 hover:bg-green-500/10 h-8 w-8"
                                    title="Confirm"
                                  >
                                    <Check size={16} />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleReject(donation.id!)}
                                    className="text-red-500 hover:bg-red-500/10 h-8 w-8"
                                    title="Reject"
                                  >
                                    <X size={16} />
                                  </Button>
                                </>
                              )}
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDelete(donation.id!)}
                                className="text-red-500 hover:bg-red-500/10 h-8 w-8"
                                title="Delete"
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
              )}
            </CardContent>
          </Card>
        )}

        {/* Reports Tab */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 size={20} />
                    Donation Reports
                  </CardTitle>
                  <div className="flex flex-wrap gap-3">
                    <Tabs value={reportPeriod} onValueChange={(v) => setReportPeriod(v as "monthly" | "yearly")}>
                      <TabsList>
                        <TabsTrigger value="monthly">Monthly</TabsTrigger>
                        <TabsTrigger value="yearly">Yearly</TabsTrigger>
                      </TabsList>
                    </Tabs>
                    {reportPeriod === "monthly" && (
                      <Select value={selectedMonth.toString()} onValueChange={(v) => setSelectedMonth(parseInt(v))}>
                        <SelectTrigger className="w-36">
                          <Calendar size={16} className="mr-2" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((month, index) => (
                            <SelectItem key={index} value={index.toString()}>{month}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(parseInt(v))}>
                      <SelectTrigger className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[2024, 2025, 2026].map(year => (
                          <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="p-4 bg-gradient-to-br from-[#25A7A1]/10 to-[#25A7A1]/5 rounded-xl">
                    <p className="text-sm text-gray-500">Total Donations</p>
                    <p className="text-2xl font-bold text-[#25A7A1]">{periodDonations.length}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl">
                    <p className="text-sm text-gray-500">Confirmed</p>
                    <p className="text-2xl font-bold text-green-600">
                      {periodDonations.filter(d => d.status === "confirmed").length}
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-[#d4af37]/10 to-[#d4af37]/5 rounded-xl">
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-2xl font-bold text-[#d4af37]">
                      {periodDonations.filter(d => d.status === "confirmed").reduce((sum, d) => sum + d.amount, 0).toLocaleString()} ETB
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 mb-6">
                  <Button
                    onClick={() => exportToCSV(periodDonations, `donations_${reportPeriod}_${selectedYear}`)}
                    className="bg-[#25A7A1] hover:bg-[#1F8B86]"
                  >
                    <Download size={16} className="mr-2" />
                    Export to Excel (CSV)
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => exportToPDF(periodDonations, `${reportPeriod === "monthly" ? months[selectedMonth] : ""} ${selectedYear} Report`)}
                  >
                    <FileText size={16} className="mr-2" />
                    Export to PDF
                  </Button>
                </div>

                {periodDonations.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Payment Method</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {periodDonations.map((donation) => (
                          <TableRow key={donation.id}>
                            <TableCell className="font-medium">{donation.fullName}</TableCell>
                            <TableCell>{donation.department}</TableCell>
                            <TableCell className="font-semibold">{donation.amount} ETB</TableCell>
                            <TableCell className="capitalize">{donation.paymentMethod}</TableCell>
                            <TableCell>
                              <Badge className={donation.status === "confirmed" ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"}>
                                {donation.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No donations found for this period
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Payment Methods Tab */}
        {activeTab === "payment-methods" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart size={20} />
                Payment Methods Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(paymentMethodStats).length > 0 ? (
                  Object.entries(paymentMethodStats).map(([method, amount]) => (
                    <Card key={method} className="border-2 hover:border-[#25A7A1] transition-colors">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-[#25A7A1]/10 flex items-center justify-center">
                            <CreditCard size={24} className="text-[#25A7A1]" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 capitalize">{method.replace(/_/g, " ")}</p>
                            <p className="text-xl font-bold text-[#1e293b]">{amount.toLocaleString()} ETB</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    No confirmed payments yet
                  </div>
                )}
              </div>

              {Object.entries(paymentMethodStats).length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Payment Distribution</h3>
                  <div className="space-y-4">
                    {Object.entries(paymentMethodStats).map(([method, amount]) => {
                      const percentage = (amount / stats.totalAmount) * 100;
                      return (
                        <div key={method}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="capitalize">{method.replace(/_/g, " ")}</span>
                            <span className="font-medium">{percentage.toFixed(1)}%</span>
                          </div>
                          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#25A7A1] to-[#0f4a47] rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>

      {/* View & Respond Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#1e293b]">Donor Details & Response</DialogTitle>
          </DialogHeader>

          {selectedDonation && (
            <div className="space-y-4">
              {/* Donor Info */}
              <div className="bg-[#f8fafc] rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Name:</span>
                  <span className="font-medium">{selectedDonation.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Phone:</span>
                  <span className="font-medium">{selectedDonation.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">ID/Email:</span>
                  <span className="font-medium">{selectedDonation.idNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Department:</span>
                  <span className="font-medium">{selectedDonation.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Year:</span>
                  <span className="font-medium">{selectedDonation.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Amount:</span>
                  <span className="font-bold text-[#25A7A1]">{selectedDonation.amount} ETB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Payment Method:</span>
                  <span className="font-medium capitalize">{selectedDonation.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Start Month:</span>
                  <span className="font-medium">{selectedDonation.startMonth}</span>
                </div>
                {selectedDonation.idea && (
                  <div>
                    <span className="text-sm text-gray-500">Message/Idea:</span>
                    <p className="mt-1 text-sm bg-white p-2 rounded border">{selectedDonation.idea}</p>
                  </div>
                )}
              </div>

              {/* Response Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Response Message (Optional)
                </label>
                <Textarea
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  placeholder={`Jazakallahu Khairan ${selectedDonation.fullName}! Your donation of ${selectedDonation.amount} ETB has been received. May Allah bless you.`}
                  rows={3}
                />
              </div>

              {/* Contact Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={handleCallDonor} variant="outline" className="flex items-center gap-2">
                  <Phone size={16} />
                  Call
                </Button>
                <Button onClick={handleSendSMS} variant="outline" className="flex items-center gap-2">
                  <MessageCircle size={16} />
                  SMS
                </Button>
                <Button onClick={handleWhatsApp} className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </Button>
                <Button onClick={handleTelegram} className="flex items-center gap-2 bg-[#0088cc] hover:bg-[#0077b5] text-white">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                  Telegram
                </Button>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CharityDashboard;
