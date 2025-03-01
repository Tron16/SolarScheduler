
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sun, Loader2, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { resetPassword, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Validate that we have a token in the URL
    const hash = window.location.hash;
    if (!hash || !hash.includes('type=recovery')) {
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    try {
      await resetPassword(password);
      navigate('/login');
    } catch (error: any) {
      console.error("Password reset failed:", error);
      setError(error.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-blue-gradient flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-solar-highlight/20 rounded-full blur-3xl"></div>
        <div className="absolute top-[30%] -left-40 w-80 h-80 bg-solar-accent/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 left-[40%] w-80 h-80 bg-blue-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container max-w-md z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass-panel">
            <CardHeader className="space-y-1 flex flex-col items-center">
              <div className="w-20 h-20 relative mb-4">
                <motion.div
                  className="absolute inset-0 bg-yellow-300 rounded-full blur-lg opacity-40"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                ></motion.div>
                <Sun className="w-full h-full text-yellow-400 absolute inset-0 animate-spin-slow" />
              </div>
              <CardTitle className="text-3xl font-light text-center">Create New Password</CardTitle>
              <CardDescription className="text-center">Enter a new password for your account</CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
                
                {error && (
                  <div className="text-sm text-red-500 p-2 bg-red-50 rounded">
                    {error}
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  type="submit" 
                  className="glass-button w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <span className="flex items-center">
                      <ShieldCheck className="w-4 h-4 mr-2" />
                      Update Password
                    </span>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
