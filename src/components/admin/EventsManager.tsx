import { useState, useEffect, useRef } from "react";
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Download,
  MapPin,
  Users,
  Clock,
  Check,
  X,
  Loader2,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import {
  subscribeToEvents,
  addEvent,
  updateEvent,
  deleteEvent,
  FirestoreEvent,
} from "@/lib/firestore";

// Cloudinary config
const CLOUDINARY_CLOUD_NAME = "dxvfnj1ja";
const CLOUDINARY_UPLOAD_PRESET = "humsj.islam";

interface EventsManagerProps {
  sector: "academic" | "qirat" | "charity" | "dawa" | "all";
  title?: string;
  showSectorFilter?: boolean;
}

const categories = ["Prayer", "Education", "Community", "Workshop", "Competition", "Charity", "Dawa", "Academic", "Qirat"];

const EventsManager = ({ sector, title = "Events Management", showSectorFilter = false }: EventsManagerProps) => {
  const { toast } = useToast();
  const [events, setEvents] = useState<FirestoreEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isEditEventOpen, setIsEditEventOpen] = useState(false);
  const [isViewEventOpen, setIsViewEventOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<FirestoreEvent | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    venue: "",
    category: "Education",
    type: "event",
    speaker: "",
    expectedParticipants: 0,
    image: "",
    sector: sector === "all" ? "academic" : sector,
    status: "upcoming" as const,
  });

  useEffect(() => {
    const unsubscribe = subscribeToEvents((data) => {
      if (sector === "all") {
        setEvents(data);
      } else {
        setEvents(data.filter((e) => e.sector === sector));
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [sector]);

  const resetForm = () => {
    setEventForm({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      venue: "",
      category: "Education",
      type: "event",
      speaker: "",
      expectedParticipants: 0,
      image: "",
      sector: sector === "all" ? "academic" : sector,
      status: "upcoming",
    });
    setImagePreview("");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid File", description: "Please select an image file.", variant: "destructive" });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File Too Large", description: "Image must be less than 10MB.", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    try {
      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      formData.append("folder", "events");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      const downloadURL = data.secure_url;

      // Update form and preview
      setEventForm((prev) => ({ ...prev, image: downloadURL }));
      setImagePreview(downloadURL);

      toast({ title: "Image Uploaded", description: "Image uploaded successfully." });
    } catch (error: any) {
      console.error("Image upload error:", error);
      toast({ title: "Upload Failed", description: error?.message || "Failed to upload image.", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddEvent = async () => {
    if (!eventForm.title || !eventForm.date) {
      toast({ title: "Validation Error", description: "Title and Date are required.", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    try {
      await addEvent({
        ...eventForm,
        status: "approved",
        sector: sector === "all" ? (eventForm.sector as any) : sector,
      });
      toast({ title: "Event Created", description: "The event has been added successfully." });
      setIsAddEventOpen(false);
      resetForm();
    } catch (error: any) {
      console.error("Add event error:", error);
      toast({ title: "Error", description: error?.message || "Failed to create event. Check console for details.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditEvent = async () => {
    if (!selectedEvent?.id) return;

    setIsSaving(true);
    try {
      await updateEvent(selectedEvent.id, eventForm);
      toast({ title: "Event Updated", description: "The event has been updated successfully." });
      setIsEditEventOpen(false);
      setSelectedEvent(null);
      resetForm();
    } catch (error: any) {
      console.error("Update event error:", error);
      toast({ title: "Error", description: error?.message || "Failed to update event. Check console for details.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      await deleteEvent(id);
      toast({ title: "Event Deleted", description: "The event has been removed." });
    } catch (error: any) {
      console.error("Delete event error:", error);
      toast({ title: "Error", description: error?.message || "Failed to delete event. Check console for details.", variant: "destructive" });
    }
  };

  const handleApproveEvent = async (id: string) => {
    try {
      await updateEvent(id, { status: "approved" });
      toast({ title: "Event Approved", description: "The event is now visible to users." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to approve event.", variant: "destructive" });
    }
  };

  const handleRejectEvent = async (id: string) => {
    try {
      await updateEvent(id, { status: "rejected" });
      toast({ title: "Event Rejected", variant: "destructive" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to reject event.", variant: "destructive" });
    }
  };

  const openEditModal = (event: FirestoreEvent) => {
    setSelectedEvent(event);
    setEventForm({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time || "",
      location: event.location || "",
      venue: event.venue || "",
      category: event.category,
      type: event.type || "event",
      speaker: event.speaker || "",
      expectedParticipants: event.expectedParticipants || 0,
      image: event.image || "",
      sector: event.sector || (sector === "all" ? "academic" : sector),
      status: event.status as any,
    });
    setImagePreview(event.image || "");
    setIsEditEventOpen(true);
  };

  const openViewModal = (event: FirestoreEvent) => {
    setSelectedEvent(event);
    setIsViewEventOpen(true);
  };

  const exportToCSV = () => {
    if (filteredEvents.length === 0) {
      toast({ title: "No Data", description: "No events to export.", variant: "destructive" });
      return;
    }

    const headers = ["Title", "Date", "Time", "Location", "Category", "Status", "Expected Participants"];
    const csvContent = [
      headers.join(","),
      ...filteredEvents.map((e) =>
        [
          `"${e.title}"`,
          e.date,
          e.time || "TBA",
          `"${e.location || e.venue || "TBA"}"`,
          e.category,
          e.status,
          e.expectedParticipants || 0,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${sector}_events_export.csv`;
    link.click();
    toast({ title: "Export Successful", description: "Events exported to CSV." });
  };

  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.location || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-600";
      case "pending":
        return "bg-amber-100 text-amber-600";
      case "rejected":
        return "bg-red-100 text-red-600";
      case "upcoming":
        return "bg-blue-100 text-blue-600";
      case "ongoing":
        return "bg-purple-100 text-purple-600";
      case "completed":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const EventFormFields = (
    <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label>Event Title *</Label>
          <Input
            placeholder="Enter event title"
            value={eventForm.title}
            onChange={(e) => setEventForm((prev) => ({ ...prev, title: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label>Date *</Label>
          <Input
            type="date"
            value={eventForm.date}
            onChange={(e) => setEventForm((prev) => ({ ...prev, date: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label>Time</Label>
          <Input
            type="time"
            value={eventForm.time}
            onChange={(e) => setEventForm((prev) => ({ ...prev, time: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label>Location/Venue</Label>
          <Input
            placeholder="e.g., University Mosque"
            value={eventForm.location}
            onChange={(e) => setEventForm((prev) => ({ ...prev, location: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={eventForm.category}
            onValueChange={(value) => setEventForm((prev) => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {showSectorFilter && (
          <div className="space-y-2">
            <Label>Sector</Label>
            <Select
              value={eventForm.sector}
              onValueChange={(value) => setEventForm((prev) => ({ ...prev, sector: value as any }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="qirat">Qirat</SelectItem>
                <SelectItem value="charity">Charity</SelectItem>
                <SelectItem value="dawa">Dawa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label>Speaker/Instructor</Label>
          <Input
            placeholder="Speaker name"
            value={eventForm.speaker}
            onChange={(e) => setEventForm((prev) => ({ ...prev, speaker: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label>Expected Participants</Label>
          <Input
            type="number"
            placeholder="0"
            value={eventForm.expectedParticipants || ""}
            onChange={(e) => setEventForm((prev) => ({ ...prev, expectedParticipants: parseInt(e.target.value) || 0 }))}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Event Image</Label>
          <div className="space-y-3">
            {/* Image Preview */}
            {(imagePreview || eventForm.image) && (
              <div className="relative w-full h-40 rounded-lg overflow-hidden border">
                <img
                  src={imagePreview || eventForm.image}
                  alt="Event preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setEventForm((prev) => ({ ...prev, image: "" }));
                    setImagePreview("");
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            
            {/* Upload Button */}
            <div className="flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex-1"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={16} className="mr-2" />
                    Upload Image
                  </>
                )}
              </Button>
            </div>
            
            {/* Or use URL */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">or paste URL</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <Input
              placeholder="https://example.com/image.jpg"
              value={eventForm.image}
              onChange={(e) => {
                setEventForm((prev) => ({ ...prev, image: e.target.value }));
                setImagePreview(e.target.value);
              }}
            />
          </div>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Description</Label>
          <Textarea
            placeholder="Event description..."
            rows={3}
            value={eventForm.description}
            onChange={(e) => setEventForm((prev) => ({ ...prev, description: e.target.value }))}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Calendar size={20} className="text-[#25A7A1]" />
              {title}
            </CardTitle>
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-48"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Button
                className="bg-[#25A7A1] hover:bg-[#1F8B86]"
                onClick={() => {
                  resetForm();
                  setIsAddEventOpen(true);
                }}
              >
                <Plus size={16} className="mr-2" />
                Add Event
              </Button>
              <Button variant="outline" onClick={exportToCSV}>
                <Download size={16} className="mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#25A7A1]" />
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No events found</p>
              <p className="text-sm">Create your first event to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.map((event) => (
                    <TableRow key={event.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {event.image && (
                            <img
                              src={event.image}
                              alt={event.title}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium">{event.title}</p>
                            <p className="text-xs text-gray-500 line-clamp-1">{event.description}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">{new Date(event.date).toLocaleDateString()}</span>
                          <span className="text-xs text-gray-500">{event.time || "TBA"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin size={14} className="text-gray-400" />
                          {event.location || event.venue || "TBA"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{event.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(event.status)}>{event.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {event.status === "pending" && (
                            <>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleApproveEvent(event.id!)}
                                className="h-8 w-8 text-green-500 hover:bg-green-50"
                                title="Approve"
                              >
                                <Check size={16} />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleRejectEvent(event.id!)}
                                className="h-8 w-8 text-red-500 hover:bg-red-50"
                                title="Reject"
                              >
                                <X size={16} />
                              </Button>
                            </>
                          )}
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => openViewModal(event)}
                            className="h-8 w-8 text-[#25A7A1]"
                            title="View"
                          >
                            <Eye size={16} />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => openEditModal(event)}
                            className="h-8 w-8 text-gray-500"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDeleteEvent(event.id!)}
                            className="h-8 w-8 text-red-500 hover:bg-red-50"
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

      {/* Add Event Dialog */}
      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
          </DialogHeader>
          {EventFormFields}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddEventOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-[#25A7A1] hover:bg-[#1F8B86]" onClick={handleAddEvent} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={isEditEventOpen} onOpenChange={setIsEditEventOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          {EventFormFields}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditEventOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-[#25A7A1] hover:bg-[#1F8B86]" onClick={handleEditEvent} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Event Dialog */}
      <Dialog open={isViewEventOpen} onOpenChange={setIsViewEventOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              {selectedEvent.image && (
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
              <div>
                <h3 className="text-xl font-semibold">{selectedEvent.title}</h3>
                <Badge className={`mt-2 ${getStatusBadge(selectedEvent.status)}`}>{selectedEvent.status}</Badge>
              </div>
              <p className="text-gray-600">{selectedEvent.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-[#25A7A1]" />
                  <span>{new Date(selectedEvent.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-[#25A7A1]" />
                  <span>{selectedEvent.time || "TBA"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-[#25A7A1]" />
                  <span>{selectedEvent.location || selectedEvent.venue || "TBA"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-[#25A7A1]" />
                  <span>{selectedEvent.expectedParticipants || 0} expected</span>
                </div>
              </div>
              {selectedEvent.speaker && (
                <div className="pt-2 border-t">
                  <p className="text-sm text-gray-500">Speaker: {selectedEvent.speaker}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewEventOpen(false)}>
              Close
            </Button>
            <Button
              className="bg-[#25A7A1] hover:bg-[#1F8B86]"
              onClick={() => {
                setIsViewEventOpen(false);
                if (selectedEvent) openEditModal(selectedEvent);
              }}
            >
              <Edit size={16} className="mr-2" />
              Edit Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventsManager;
