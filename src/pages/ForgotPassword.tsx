
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sun, Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const { forgotPassword, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      await forgotPassword(email);
      setIsSubmitted(true);
    } catch (error: any) {
      console.error("Password reset request failed:", error);
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
              <CardTitle className="text-3xl font-light text-center">Reset Password</CardTitle>
              <CardDescription className="text-center">Enter your email to receive a password reset link</CardDescription>
            </CardHeader>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                        Sending...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>

                  <div className="flex justify-center w-full">
                    <Button variant="link" size="sm" className="p-0" onClick={() => navigate('/login')}>
                      <ArrowLeft className="w-4 h-4 mr-1" />
                      Back to Login
                    </Button>
                  </div>
                </CardFooter>
              </form>
            ) : (
              <CardContent className="flex flex-col items-center space-y-4 py-6">
                <CheckCircle className="w-16 h-16 text-green-500" />
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-medium">Check Your Email</h3>
                  <p className="text-gray-500">
                    We've sent a password reset link to <span className="font-medium">{email}</span>
                  </p>
                </div>
                <Button 
                  className="mt-4" 
                  variant="outline" 
                  onClick={() => navigate('/login')}
                >
                  Return to Login
                </Button>
              </CardContent>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
