import { useState, useMemo, useEffect } from "react";
import { Search, Filter, Calendar, Loader2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import EventCard, { Event } from "@/components/events/EventCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { subscribeToEvents, FirestoreEvent } from "@/lib/firestore";

// Default sample events (shown when no Firebase events exist)
const defaultEvents: Event[] = [
  {
    id: "1",
    title: "Friday Jumu'ah Prayer & Khutbah",
    description: "Weekly congregational prayer with inspiring khutbah on contemporary Islamic topics.",
    date: "2025-12-13",
    time: "12:30 PM",
    location: "University Mosque",
    category: "Prayer",
    image: "https://images.unsplash.com/photo-1519817650390-64a93db51149?w=800",
    attendees: 500,
  },
  {
    id: "2",
    title: "Islamic Knowledge Circle",
    description: "Weekly halaqah covering Quranic tafsir and hadith studies with qualified instructors.",
    date: "2025-12-14",
    time: "4:00 PM",
    location: "Student Center, Room 204",
    category: "Education",
    image: "https://images.unsplash.com/photo-1585036156171-384164a8c675?w=800",
    attendees: 75,
  },
  {
    id: "3",
    title: "Community Iftar Gathering",
    description: "Come together for a blessed iftar meal, spiritual reflection, and community bonding.",
    date: "2025-12-15",
    time: "6:00 PM",
    location: "Campus Cafeteria",
    category: "Community",
    image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800",
    attendees: 200,
  },
  {
    id: "5",
    title: "Quran Memorization Competition",
    description: "Annual Quran memorization and recitation competition open to all students.",
    date: "2025-12-22",
    time: "10:00 AM",
    location: "University Mosque",
    category: "Competition",
    image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800",
    attendees: 150,
  },
];

const categories = ["All", "Prayer", "Education", "Community", "Workshop", "Competition", "Charity"];

const Events = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [allEvents, setAllEvents] = useState<Event[]>(defaultEvents);
  const [isLoading, setIsLoading] = useState(true);

  // Subscribe to Firebase events
  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = subscribeToEvents((firestoreEvents: FirestoreEvent[]) => {
      // Only show approved events on public page
      const approvedEvents = firestoreEvents.filter((e) => e.status === "approved");
      
      if (approvedEvents.length > 0) {
        const mappedEvents: Event[] = approvedEvents.map((e) => ({
          id: e.id || "",
          title: e.title,
          description: e.description,
          date: e.date,
          time: e.time || "TBA",
          location: e.location || e.venue || "HUMSJ Campus",
          category: e.category,
          image: e.image || "https://images.unsplash.com/photo-1519817650390-64a93db51149?w=800",
          attendees: e.expectedParticipants || 0,
        }));
        setAllEvents(mappedEvents);
      } else {
        // Use default events if no Firebase events
        setAllEvents(defaultEvents);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredEvents = useMemo(() => {
    let events = [...allEvents];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      events = events.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== "All") {
      events = events.filter((event) => event.category === selectedCategory);
    }

    // Sort by date
    events.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    return events;
  }, [searchQuery, selectedCategory, sortOrder, allEvents]);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-[#f0fafa] overflow-hidden">
        {/* Subtle pattern */}
        <div className="absolute inset-0 pattern-squares-teal" />
        {/* Decorative elements */}
        <div className="absolute top-12 left-12 w-16 h-16 rounded-xl bg-[#29b6b0]/[0.15] rotate-12" />
        <div className="absolute top-8 right-20 w-10 h-10 rounded-lg bg-[#29b6b0]/[0.10] -rotate-6" />
        <div className="absolute bottom-12 right-16 w-14 h-14 rounded-lg bg-[#29b6b0]/[0.12] rotate-6" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1f2937] mb-6 animate-fade-in-up">
              Events & <span className="text-[#29b6b0]">Programs</span>
            </h1>
            <p className="text-lg text-gray-600 animate-fade-in-up delay-100">
              Discover upcoming events, workshops, and programs organized by HUMSJ. 
              Join us in building a stronger Muslim community.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <Filter size={16} className="mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort Order */}
            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="w-full md:w-auto"
            >
              <Calendar size={16} className="mr-2" />
              {sortOrder === "asc" ? "Earliest First" : "Latest First"}
            </Button>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-[#29b6b0] mb-4" />
              <p className="text-muted-foreground">Loading events...</p>
            </div>
          ) : filteredEvents.length > 0 ? (
            <>
              <p className="text-muted-foreground mb-8">
                Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.map((event, index) => (
                  <div
                    key={event.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <EventCard event={event} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground mb-4">No events found</p>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Events;
