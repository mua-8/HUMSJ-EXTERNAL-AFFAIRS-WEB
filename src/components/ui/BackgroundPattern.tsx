interface BackgroundPatternProps {
  variant?: "light" | "teal" | "subtle";
  className?: string;
}

const BackgroundPattern = ({
  variant = "light",
  className = "",
}: BackgroundPatternProps) => {
  // Color based on variant
  const getSquareColor = () => {
    switch (variant) {
      case "teal":
        return "rgba(41, 182, 176, 0.04)";
      case "subtle":
        return "rgba(41, 182, 176, 0.025)";
      default:
        return "rgba(41, 182, 176, 0.03)";
    }
  };

  const squareColor = getSquareColor();

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Top-left corner squares */}
      <div
        className="absolute -top-8 -left-8 w-32 h-32 rounded-xl rotate-12 blur-[1px]"
        style={{ backgroundColor: squareColor }}
      />
      <div
        className="absolute top-20 left-16 w-16 h-16 rounded-lg rotate-6 blur-[0.5px]"
        style={{ backgroundColor: squareColor }}
      />

      {/* Top-right corner squares */}
      <div
        className="absolute -top-4 right-20 w-24 h-24 rounded-xl -rotate-12 blur-[1px]"
        style={{ backgroundColor: squareColor }}
      />
      <div
        className="absolute top-32 -right-6 w-20 h-20 rounded-lg rotate-45 blur-[0.5px]"
        style={{ backgroundColor: squareColor }}
      />

      {/* Bottom-left corner squares */}
      <div
        className="absolute bottom-16 -left-10 w-28 h-28 rounded-xl rotate-12 blur-[1px]"
        style={{ backgroundColor: squareColor }}
      />
      <div
        className="absolute -bottom-8 left-24 w-14 h-14 rounded-lg -rotate-6 blur-[0.5px]"
        style={{ backgroundColor: squareColor }}
      />

      {/* Bottom-right corner squares */}
      <div
        className="absolute -bottom-6 right-16 w-20 h-20 rounded-xl rotate-45 blur-[1px]"
        style={{ backgroundColor: squareColor }}
      />
      <div
        className="absolute bottom-24 -right-4 w-12 h-12 rounded-lg -rotate-12 blur-[0.5px]"
        style={{ backgroundColor: squareColor }}
      />
    </div>
  );
};

export default BackgroundPattern;
