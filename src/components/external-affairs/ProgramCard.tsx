import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface ProgramStat {
  label: string;
  value: string | number;
}

interface ProgramCardProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  stats: ProgramStat[];
  totalCost?: string;
  variant?: "teal" | "gold";
  delay?: number;
}

const ProgramCard = ({ 
  icon: Icon, 
  title, 
  description, 
  stats, 
  totalCost, 
  variant = "teal",
  delay = 0 
}: ProgramCardProps) => {
  const accentClasses = {
    teal: "border-l-[#29b6b0]",
    gold: "border-l-[#d4af37]",
  };

  const iconBgClasses = {
    teal: "bg-[#29b6b0]/10 text-[#29b6b0]",
    gold: "bg-[#d4af37]/10 text-[#d4af37]",
  };

  return (
    <Card
      variant="elevated"
      className={`border-l-4 ${accentClasses[variant]} animate-fade-in-up`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-10 h-10 rounded-xl ${iconBgClasses[variant]} flex items-center justify-center`}>
            <Icon size={20} />
          </div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {stats.map((stat, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
              <span className="text-muted-foreground text-sm">{stat.label}</span>
              <span className="font-semibold text-foreground">{stat.value}</span>
            </div>
          ))}
          {totalCost && (
            <div className="flex justify-between items-center pt-2 mt-2 border-t border-border">
              <span className="font-medium text-foreground">Total Cost</span>
              <span className="text-lg font-bold text-primary">{totalCost}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgramCard;
