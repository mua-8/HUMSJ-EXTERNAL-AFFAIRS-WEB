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
  Mail,
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
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  Donation,
  subscribeToDonations,
  updateDonationStatus,
  deleteDonation,
} from "@/lib/donations";
import humjsLogo from "@/assets/humjs-logo.png";

const CharityDashboard = () => {
  const { toast } = useToast();
  const { signOut } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

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
    // Open SMS app with pre-filled message
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

  const filteredDonations = donations.filter((d) => {
    const matchesSearch =
      d.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.idNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: donations.length,
    confirmed: donations.filter((d) => d.status === "confirmed").length,
    pending: donations.filter((d) => d.status === "pending").length,
    totalAmount: donations
      .filter((d) => d.status === "confirmed")
      .reduce((sum, d) => sum + d.amount, 0),
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#0f4a47] p-6 hidden lg:flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <img src={humjsLogo} alt="HUMSJ" className="h-10 w-auto" />
          <div>
            <h2 className="font-serif font-bold text-white">HUMSJ</h2>
            <p className="text-xs text-[#29b6b0]">Charity Sector</p>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          <div className="px-4 py-3 rounded-lg bg-[#29b6b0] text-white text-sm font-medium flex items-center gap-3">
            <Heart size={18} />
            Donations
          </div>
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10">
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
            Charity Sector Dashboard
          </h1>
          <p className="text-[#64748b]">Manage student Sadaqah and donations</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="w-12 h-12 rounded-xl bg-[#29b6b0]/10 flex items-center justify-center">
                <Users size={24} className="text-[#29b6b0]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1e293b]">{stats.total}</p>
                <p className="text-sm text-[#64748b]">Total Pledges</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Check size={24} className="text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1e293b]">{stats.confirmed}</p>
                <p className="text-sm text-[#64748b]">Confirmed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <TrendingUp size={24} className="text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1e293b]">{stats.pending}</p>
                <p className="text-sm text-[#64748b]">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 flex items-center justify-center">
                <DollarSign size={24} className="text-[#d4af37]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1e293b]">{stats.totalAmount.toLocaleString()} ETB</p>
                <p className="text-sm text-[#64748b]">Total Confirmed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Donations Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle>Student Sadaqah Pledges</CardTitle>
              <div className="flex gap-3">
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
                      <TableRow key={donation.id}>
                        <TableCell className="font-medium">{donation.fullName}</TableCell>
                        <TableCell>{donation.phone}</TableCell>
                        <TableCell>{donation.idNumber}</TableCell>
                        <TableCell>{donation.department}</TableCell>
                        <TableCell className="font-semibold text-[#29b6b0]">{donation.amount} ETB</TableCell>
                        <TableCell>
                          <Badge className={donation.donationType === "star_shining" ? "bg-[#d4af37]/10 text-[#d4af37] border-0" : "bg-[#29b6b0]/10 text-[#29b6b0] border-0"}>
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
                              className="text-[#29b6b0] hover:bg-[#29b6b0]/10 h-8 w-8"
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
                  <span className="font-bold text-[#29b6b0]">{selectedDonation.amount} ETB</span>
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
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </Button>
                <Button onClick={handleTelegram} className="flex items-center gap-2 bg-[#0088cc] hover:bg-[#0077b5] text-white">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
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
