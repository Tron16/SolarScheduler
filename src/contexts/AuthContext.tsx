
// Add this to the signUp method for debugging
const signUp = async (email: string, password: string, fullName?: string) => {
  try {
    console.log("Signing up with:", { email, fullName });
    const metadata = fullName ? { full_name: fullName } : undefined;
    console.log("Metadata being sent:", metadata);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    
    console.log("Sign up response:", data);
    
    if (error) {
      console.error("Sign up error:", error);
      throw error;
    }
    
    toast.success("Account created successfully!", {
      description: "Please check your email for verification instructions."
    });
    
    navigate("/login");
  } catch (error: any) {
    console.error("Sign up caught error:", error);
    toast.error("Sign up failed", {
      description: error.message
    });
    throw error;
  }
};
