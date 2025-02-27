
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-blue-gradient flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-solar-highlight/20 rounded-full blur-3xl"></div>
        <div className="absolute top-[30%] -left-40 w-80 h-80 bg-solar-accent/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 left-[40%] w-80 h-80 bg-blue-300/20 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-panel p-8 max-w-md w-full z-10 text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="relative">
            <AlertTriangle className="w-20 h-20 text-solar-accent" />
            <div className="absolute inset-0 blur-sm bg-solar-accent/30 rounded-full -z-10"></div>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
        
        <Link to="/">
          <Button className="glass-button">
            <Home className="w-4 h-4 mr-2" />
            Return to Dashboard
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
