import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/*
  HUMSJ Humanitarian Card System
  ==============================
  Clean white cards with soft shadows
  Warm, professional, faith-based design
  Primary: Teal (#29b6b0) - HUMSJ brand color
*/

const cardVariants = cva(
  "rounded-[12px] transition-all duration-300 relative overflow-hidden",
  {
    variants: {
      variant: {
        // Default - Clean white card
        default:
          "bg-white border border-[#e5e7eb] shadow-[0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.03)]",
        // With teal top accent bar
        accent:
          "bg-white border border-[#e5e7eb] shadow-[0_1px_3px_rgba(0,0,0,0.05)] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-[#29b6b0]",
        // Interactive/hoverable card
        interactive:
          "bg-white border border-[#e5e7eb] shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:border-[#29b6b0] hover:-translate-y-1 cursor-pointer",
        // White card (same as default)
        white:
          "bg-white border border-[#e5e7eb] shadow-[0_1px_3px_rgba(0,0,0,0.05)]",
        // Elevated card with stronger shadow
        elevated:
          "bg-white border border-[#e5e7eb] shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)]",
        // Glass effect
        glass:
          "backdrop-blur-md bg-white/90 border border-[#e5e7eb]/50 shadow-[0_1px_3px_rgba(0,0,0,0.05)]",
        // Gradient - subtle warm tint
        gradient:
          "bg-gradient-to-br from-white to-[#f8fafc] border border-[#e5e7eb] shadow-[0_1px_3px_rgba(0,0,0,0.05)]",
        // Teal tinted card
        teal:
          "bg-[#e6f7f6] border border-[#29b6b0]/20 shadow-[0_1px_3px_rgba(0,0,0,0.05)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// Subtle pattern overlay
const CardPattern = () => (
  <div 
    className="absolute inset-0 pointer-events-none opacity-50"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2329b6b0' fill-opacity='0.03'%3E%3Cpath d='M20 18v-8h-2v8h-8v2h8v8h2v-8h8v-2h-8z'/%3E%3C/g%3E%3C/svg%3E")`,
    }}
  />
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  showPattern?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, showPattern = false, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, className }))}
      {...props}
    >
      {showPattern && <CardPattern />}
      <div className="relative z-10">{children}</div>
    </div>
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-xl font-semibold leading-tight tracking-tight font-serif text-[#1f2937]",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-[#4b5563] leading-relaxed", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  cardVariants,
  CardPattern,
};
