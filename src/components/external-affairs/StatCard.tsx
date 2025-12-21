import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  subLabel?: string;
  variant?: "primary" | "teal" | "gold" | "amber";
  delay?: number;
}

const StatCard = ({ icon: Icon, value, label, subLabel, variant = "primary", delay = 0 }: StatCardProps) => {
  const gradientClasses = {
    primary: "from-[#29b6b0]/20 to-[#e6f7f6]/50",
    teal: "from-[#29b6b0]/20 to-[#e6f7f6]/50",
    gold: "from-[#d4af37]/20 to-[#fef9c3]/50",
    amber: "from-[#29b6b0]/20 to-[#e6f7f6]/50",
  };

  const iconClasses = {
    primary: "text-[#29b6b0]",
    teal: "text-[#29b6b0]",
    gold: "text-[#d4af37]",
    amber: "text-[#29b6b0]",
  };

  return (
    <Card
      variant="elevated"
      className="animate-fade-in-up text-center"
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardContent className="pt-6">
        <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${gradientClasses[variant]} flex items-center justify-center`}>
          <Icon className={`w-7 h-7 ${iconClasses[variant]}`} />
        </div>
        <p className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-1">
          {value}
        </p>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {subLabel && (
          <p className="text-xs text-muted-foreground/70 mt-1">{subLabel}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
