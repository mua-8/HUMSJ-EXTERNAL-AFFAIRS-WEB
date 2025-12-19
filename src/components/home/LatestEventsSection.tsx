import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import EventCard, { Event } from "@/components/events/EventCard";

// Sample events data (in a real app, this would come from a database)
const sampleEvents: Event[] = [
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
];

const LatestEventsSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
              Upcoming Events
            </h2>
            <p className="text-muted-foreground">
              Join us in our upcoming programs and activities
            </p>
          </div>
          <Link to="/events" className="mt-4 sm:mt-0">
            <Button variant="outline">
              View All Events
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleEvents.map((event, index) => (
            <div
              key={event.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <EventCard event={event} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestEventsSection;
