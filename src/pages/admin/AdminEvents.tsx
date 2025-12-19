import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { Check, X, Edit, Trash2, Plus } from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: string;
  category: string;
  submittedBy: string;
  status: "pending" | "approved" | "rejected";
}

const initialEvents: Event[] = [
  {
    id: "1",
    title: "Islamic Art Exhibition",
    date: "2025-12-28",
    category: "Community",
    submittedBy: "External Affairs",
    status: "pending",
  },
  {
    id: "2",
    title: "Quran Study Session",
    date: "2025-12-30",
    category: "Education",
    submittedBy: "External Affairs",
    status: "pending",
  },
  {
    id: "3",
    title: "New Year Islamic Program",
    date: "2026-01-01",
    category: "Community",
    submittedBy: "External Affairs",
    status: "approved",
  },
];

const AdminEvents = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApprove = (id: string) => {
    setEvents(
      events.map((event) =>
        event.id === id ? { ...event, status: "approved" as const } : event
      )
    );
    toast({
      title: "Event Approved",
      description: "The event has been published.",
    });
  };

  const handleReject = (id: string) => {
    setEvents(
      events.map((event) =>
        event.id === id ? { ...event, status: "rejected" as const } : event
      )
    );
    toast({
      title: "Event Rejected",
      description: "The event has been rejected.",
      variant: "destructive",
    });
  };

  const handleDelete = (id: string) => {
    setEvents(events.filter((event) => event.id !== id));
    toast({
      title: "Event Deleted",
      description: "The event has been removed.",
    });
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Event Management</h1>
          <Button className="bg-[#29b6b0] hover:bg-[#239e99] text-white">
            <Plus size={18} />
            Add Event
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Events</CardTitle>
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Submitted By</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell>
                      {new Date(event.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{event.category}</Badge>
                    </TableCell>
                    <TableCell>{event.submittedBy}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          event.status === "approved"
                            ? "bg-green-500/10 text-green-500"
                            : event.status === "rejected"
                              ? "bg-red-500/10 text-red-500"
                              : "bg-amber-500/10 text-amber-500"
                        }
                      >
                        {event.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {event.status === "pending" && (
                          <>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleApprove(event.id)}
                              className="text-green-500 hover:bg-green-500/10"
                            >
                              <Check size={16} />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleReject(event.id)}
                              className="text-red-500 hover:bg-red-500/10"
                            >
                              <X size={16} />
                            </Button>
                          </>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-gray-500"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(event.id)}
                          className="text-red-500 hover:bg-red-500/10"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminEvents;
