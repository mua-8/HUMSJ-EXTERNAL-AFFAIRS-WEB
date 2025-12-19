import { Target, Eye, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const MissionSection = () => {
  const items = [
    {
      icon: Target,
      title: "Our Mission",
      description:
        "To nurture Islamic values, promote academic excellence, and develop responsible Muslim leaders who serve their community and society.",
    },
    {
      icon: Eye,
      title: "Our Vision",
      description:
        "A united and spiritually empowered Muslim student community that excels in both religious and academic pursuits while contributing positively to society.",
    },
    {
      icon: Heart,
      title: "Our Values",
      description:
        "Faith (Iman), Knowledge (Ilm), Unity (Ittihad), Service (Khidmah), and Excellence (Ihsan) guide everything we do as a community.",
    },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            Guided by Faith, Driven by Purpose
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our organization is built on strong Islamic principles and a commitment to 
            serving our members and the broader community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <Card
              key={item.title}
              variant="elevated"
              className="text-center animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <item.icon size={32} className="text-primary" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-foreground mb-4">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
