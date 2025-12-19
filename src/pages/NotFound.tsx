import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center py-20 bg-[#f0fafa]">
        <div className="text-center px-4">
          <h1 className="text-8xl md:text-9xl font-serif font-bold text-[#29b6b0] mb-4">
            404
          </h1>
          <p className="text-2xl md:text-3xl font-serif text-[#1f2937] mb-4">
            Page Not Found
          </p>
          <p className="text-gray-600 max-w-md mx-auto mb-8">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track.
          </p>
          <Link to="/">
            <Button variant="hero" size="lg">
              <Home size={18} />
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
