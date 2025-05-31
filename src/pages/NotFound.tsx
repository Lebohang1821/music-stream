import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white flex items-center justify-center">
      <div className="text-center p-8 max-w-md">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-3xl font-medium mb-6">Page Not Found</h2>
        <p className="text-lg text-white/70 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button
          size="lg"
          className="bg-white text-black hover:bg-white/90"
          onClick={() => navigate("/")}
        >
          <Home className="mr-2" size={18} />
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
