import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/*
  HUMSJ Humanitarian Button System
  =================================
  Primary: Teal (#29b6b0) - HUMSJ brand color
  Secondary: Outline teal
  Gold: For donations (#d4af37)
*/

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary - HUMSJ Teal
        default: 
          "bg-[#29b6b0] text-white hover:bg-[#239e99] shadow-sm hover:shadow-md",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        // Outline - Teal border
        outline:
          "border-2 border-[#29b6b0] bg-transparent text-[#29b6b0] hover:bg-[#29b6b0] hover:text-white",
        // Secondary - Light gray
        secondary:
          "bg-[#f3f4f6] text-[#374151] hover:bg-[#e5e7eb]",
        ghost: 
          "hover:bg-[#f3f4f6] hover:text-[#374151]",
        link: 
          "text-[#29b6b0] underline-offset-4 hover:underline hover:text-[#239e99]",
        // Hero - Primary with more presence
        hero: 
          "bg-[#29b6b0] text-white font-semibold hover:bg-[#239e99] shadow-md hover:shadow-lg",
        // Gold - For donations
        gold: 
          "bg-[#d4af37] text-white font-semibold hover:bg-[#b8972e] shadow-md hover:shadow-lg",
        // Glass effect
        glass: 
          "backdrop-blur-md bg-white/80 border border-[#e5e7eb] text-[#374151] hover:bg-white/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
