import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20" />
      <div className="absolute inset-0 islamic-pattern opacity-30" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
            Join Our Community Today
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Whether you're looking to deepen your faith, connect with fellow Muslim students, 
            or contribute to meaningful causes, HUMJS welcomes you with open arms.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/events">
              <Button variant="hero" size="lg">
                Explore Events
                <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="gold" size="lg">
                Get In Touch
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
