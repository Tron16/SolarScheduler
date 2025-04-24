import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sun, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import {
  getAuth,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [masterKey, setMasterKey] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const { login, signup, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSignup) {
        if (masterKey !== "UVA-SOLARSCHEDULER2368^&") {
          alert("Incorrect master key");
          return;
        }
        await signup(email, password, firstName, lastName, masterKey);
      } else {
        await login(email, password);
      }
      navigate("/");
    } catch (error) {
      console.error("Authentication failed:", error);
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
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                ></motion.div>
                <Sun className="w-full h-full text-yellow-400 absolute inset-0 animate-spin-slow" />
              </div>
              <CardTitle className="text-3xl font-light text-center">
                Solar Scheduler
              </CardTitle>
              <CardDescription className="text-center">
                {isSignup ? "Create a new account" : "Sign in to your account"}
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {isSignup && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="John"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="input-field"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Doe"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="input-field"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="masterKey">Master Key</Label>
                        <Input
                          id="masterKey"
                          type="password"
                          placeholder="Enter master key"
                          value={masterKey}
                          onChange={(e) => setMasterKey(e.target.value)}
                          className="input-field"
                          required
                        />
                      </div>
                    </>
                  )}
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
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      {!isSignup && (
                        <a
                          href="#"
                          className="text-sm text-solar-accent hover:underline"
                        >
                          Forgot password?
                        </a>
                      )}
                    </div>
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
                </div>
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
                      {isSignup ? "Creating account..." : "Signing in..."}
                    </>
                  ) : isSignup ? (
                    "Sign Up"
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <div className="text-sm text-center text-gray-500">
                  {!isSignup && (
                    <button
                      type="button"
                      className="text-solar-accent hover:underline block w-full mb-2"
                      onClick={async () => {
                        if (!email) {
                          toast({
                            title: "Email required",
                            description: "Please enter your email address",
                            variant: "destructive",
                          });
                          return;
                        }
                        try {
                          const credential = await signInWithEmailAndPassword(
                            getAuth(),
                            email,
                            password
                          );
                          await sendEmailVerification(credential.user);
                          toast({
                            title: "Verification email sent",
                            description: "Please check your inbox",
                          });
                        } catch (error: unknown) {
                          if (error instanceof FirebaseError) {
                            toast({
                              title: "Error",
                              description: error.message,
                              variant: "destructive",
                            });
                          } else {
                            toast({
                              title: "Error",
                              description: "An unexpected error occurred",
                              variant: "destructive",
                            });
                          }
                        }
                      }}
                    >
                      Resend verification email
                    </button>
                  )}
                  {isSignup
                    ? "Already have an account?"
                    : "Don't have an account?"}{" "}
                  <button
                    type="button"
                    className="text-solar-accent hover:underline"
                    onClick={() => setIsSignup(!isSignup)}
                  >
                    {isSignup ? "Sign in" : "Sign up"}
                  </button>
                </div>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
