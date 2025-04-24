import { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendEmailVerification, updateProfile } from "firebase/auth";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string, masterKey: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  getIdToken: () => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const auth = getAuth();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      if (!result.user.emailVerified) {
        await signOut(auth);
        toast({
          title: "Email not verified",
          description: "Please verify your email before logging in",
          variant: "destructive",
        });
        throw new Error("Email not verified");
      }

      setUser({
        id: result.user.uid,
        email: result.user.email!,
        name: result.user.displayName || result.user.email!.split('@')[0]
      });

      toast({
        title: "Login successful",
        description: "Welcome back to Solar Scheduler",
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string, masterKey: string) => {
    setIsLoading(true);
    try {
      if (masterKey !== "UVA-SOLARSCHEDULER2368^&") {
        toast({
          title: "Invalid master key",
          description: "Please provide the correct master key to sign up",
          variant: "destructive",
        });
        throw new Error("Invalid master key");
      }

      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, {
        displayName: `${firstName} ${lastName}`
      });
      const actionCodeSettings = {
        url: window.location.origin + '/login',
        handleCodeInApp: true
      };
      
      // Force token refresh to ensure fast email delivery
      await result.user.getIdToken(true);
      await sendEmailVerification(result.user, actionCodeSettings);

      toast({
        title: "Verification email sent",
        description: "Please check your email (including spam folder) and click the verification link. You may need to refresh the page after verifying.",
        duration: 10000,
      });
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getIdToken = async (): Promise<string> => {
    try {
      const idToken = await auth.currentUser?.getIdToken();
      return idToken || "";
    } catch (error) {
      console.error('Error getting token:', error);
      return '';
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      signup,
      logout,
      isAuthenticated: !!user,
      getIdToken
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}