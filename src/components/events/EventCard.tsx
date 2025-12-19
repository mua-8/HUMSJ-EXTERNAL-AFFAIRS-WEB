import { Calendar, MapPin, Users } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image: string;
  attendees?: number;
}

interface EventCardProps {
  event: Event;
  onViewDetails?: (event: Event) => void;
}

const EventCard = ({ event, onViewDetails }: EventCardProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card variant="interactive" className="overflow-hidden group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
        <Badge className="absolute top-4 left-4 bg-primary/90 text-primary-foreground">
          {event.category}
        </Badge>
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar size={16} className="text-primary" />
            <span>
              {formatDate(event.date)} at {event.time}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin size={16} className="text-primary" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          {event.attendees && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users size={16} className="text-primary" />
              <span>{event.attendees} attending</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onViewDetails?.(event)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
