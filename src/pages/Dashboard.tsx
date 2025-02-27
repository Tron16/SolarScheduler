
import { useState } from "react";
import NavigationBar from "@/components/NavigationBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Sun, LineChart } from "lucide-react";

const Dashboard = () => {
  const [inputData, setInputData] = useState("");
  const [prediction, setPrediction] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputData.trim()) {
      toast({
        title: "Input required",
        description: "Please enter data for prediction",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setPrediction(null);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Generate a random prediction
      const predictionValue = Math.floor(Math.random() * 100);
      const efficiency = Math.floor(Math.random() * 30) + 70; // 70-100%
      
      setPrediction(`Based on your input "${inputData}", the predicted solar energy output is ${predictionValue} kWh/day with ${efficiency}% efficiency.`);
      
      toast({
        title: "Prediction complete",
        description: "Your solar energy prediction is ready",
      });
    } catch (error) {
      toast({
        title: "Error generating prediction",
        description: "There was a problem with your request",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={item} className="mb-8">
            <h1 className="heading-text mb-2">Solar Energy Predictor</h1>
            <p className="subheading-text">
              Enter location and system data to get solar energy production predictions
            </p>
          </motion.div>
          
          <motion.div variants={item}>
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sun className="h-5 w-5 text-yellow-500" />
                  Enter data for prediction
                </CardTitle>
                <CardDescription>
                  Provide details about your solar panel system and location
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    className="input-field"
                    placeholder="Location, panel type, system size, etc."
                    value={inputData}
                    onChange={(e) => setInputData(e.target.value)}
                  />
                  
                  <Button 
                    type="submit" 
                    className="glass-button"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing
                      </div>
                    ) : (
                      <div className="flex items-center">
                        Submit to model
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
          
          {prediction && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8"
            >
              <Card className="glass-panel border-l-4 border-l-solar-accent">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5 text-solar-accent" />
                    Prediction Result
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p>{prediction}</p>
                  
                  <div className="mt-4 h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500 text-sm">Visualization chart would appear here</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
