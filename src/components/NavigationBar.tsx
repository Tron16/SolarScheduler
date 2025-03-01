
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Sun, Info, LogOut, Mail, Shield } from "lucide-react";
import { motion } from "framer-motion";

const NavigationBar = () => {
  const { signOut, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    signOut();
  };

  return (
    <motion.header 
      className="w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm sticky top-0 z-50"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="relative">
              <Sun className="w-8 h-8 text-yellow-400 animate-spin-slow" />
              <div className="absolute inset-0 bg-yellow-300 rounded-full blur-sm opacity-30 animate-pulse"></div>
            </div>
            <span className="text-xl font-semibold text-gray-900">Solar Scheduler</span>
          </Link>
          
          <nav className="flex items-center space-x-4">
            {user && (
              <>
                <Link 
                  to="/" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === "/" 
                      ? "text-solar-accent border-b-2 border-solar-accent" 
                      : "text-gray-600 hover:text-solar-accent"
                  }`}
                >
                  Dashboard
                </Link>
                
                <Link 
                  to="/how-to" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === "/how-to" 
                      ? "text-solar-accent border-b-2 border-solar-accent" 
                      : "text-gray-600 hover:text-solar-accent"
                  }`}
                >
                  <span className="flex items-center">
                    <Info className="w-4 h-4 mr-1" />
                    How To
                  </span>
                </Link>

                <Link 
                  to="/contact" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === "/contact" 
                      ? "text-solar-accent border-b-2 border-solar-accent" 
                      : "text-gray-600 hover:text-solar-accent"
                  }`}
                >
                  <span className="flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    Contact
                  </span>
                </Link>

                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname.startsWith("/admin") 
                        ? "text-solar-accent border-b-2 border-solar-accent" 
                        : "text-gray-600 hover:text-solar-accent"
                    }`}
                  >
                    <span className="flex items-center">
                      <Shield className="w-4 h-4 mr-1" />
                      Admin
                    </span>
                  </Link>
                )}
                
                <div className="border-l border-gray-200 h-6 mx-2"></div>
                
                <Button 
                  variant="ghost" 
                  className="flex items-center text-gray-600 hover:text-solar-accent"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  <span className="text-sm">Logout</span>
                </Button>
              </>
            )}

            {!user && (
              <>
                <Link 
                  to="/contact" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === "/contact" 
                      ? "text-solar-accent border-b-2 border-solar-accent" 
                      : "text-gray-600 hover:text-solar-accent"
                  }`}
                >
                  <span className="flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    Contact
                  </span>
                </Link>
                
                <Link 
                  to="/login" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === "/login" 
                      ? "text-solar-accent border-b-2 border-solar-accent" 
                      : "text-gray-600 hover:text-solar-accent"
                  }`}
                >
                  Login
                </Link>
                
                <Button 
                  variant="default" 
                  className="glass-button"
                  onClick={() => navigate('/signup')}
                >
                  Sign Up
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </motion.header>
  );
};

export default NavigationBar;
