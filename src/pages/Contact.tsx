
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Send, Loader2, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import NavigationBar from "@/components/NavigationBar";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Store the contact message in the database
      const { error } = await supabase
        .from('contact_messages')
        .insert([{ name, email, message }]);
      
      if (error) throw error;
      
      // Optional: Call a serverless function to send an email notification
      // await supabase.functions.invoke('send-contact-notification', {
      //   body: { name, email, message }
      // });
      
      // Success!
      setIsSubmitted(true);
      
      toast({
        title: "Message sent successfully!",
        description: "We will get back to you as soon as possible.",
      });
    } catch (error: any) {
      console.error("Contact form submission failed:", error);
      
      toast({
        title: "Failed to send message",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setMessage("");
    setIsSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-blue-gradient flex flex-col">
      <NavigationBar />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div className="space-y-8">
            <div>
              <motion.h1 
                className="text-4xl font-light text-gray-900"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Get in Touch
              </motion.h1>
              <motion.p 
                className="mt-4 text-lg text-gray-600"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Have questions about Solar Scheduler? We're here to help you make the most of solar energy.
              </motion.p>
            </div>
            
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="flex items-start space-x-4">
                <Mail className="w-6 h-6 text-solar-accent mt-1" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Email Us</h3>
                  <p className="text-gray-600">Our team will get back to you within 24 hours</p>
                </div>
              </div>
            </motion.div>
          </div>
          
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
              <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
            </CardHeader>
            
            {!isSubmitted ? (
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can we help you?"
                      rows={5}
                      required
                    />
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="glass-button w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            ) : (
              <CardContent className="flex flex-col items-center space-y-4 py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 260,
                    damping: 20 
                  }}
                >
                  <CheckCircle className="w-16 h-16 text-green-500" />
                </motion.div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-medium">Thank you!</h3>
                  <p className="text-gray-500">
                    Your message has been sent successfully. We'll get back to you soon.
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={resetForm}
                  className="mt-4"
                >
                  Send Another Message
                </Button>
              </CardContent>
            )}
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Contact;
