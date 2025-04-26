import { useState } from "react";
import NavigationBar from "@/components/NavigationBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowRight, 
  Sun, 
  LineChart,
  Search
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Variables with their default values
const variableDefaults = {
  "Drive Time": "26.32",
  "Tilt (Roof Pitch)": "25.59",
  "Azimuth (Roof Orientation)": "176.19",
  "Panel Quantity": "21.37",
  "System Rating (kW DC)": "8.56",
  "Inverter Manufacturer": "Enphase",
  "Array Type": "Roof Mount",
  "Squirrel Screen Installation": "No",
  "Consumption Monitoring": "Yes",
  "Truss vs. Rafter Construction": "Truss",
  "Reinforcements Requirement": "No",
  "Rough Electrical Inspection": "No",
  "Interconnection Type": "A1",
  "Module Length": "72.42",
  "Module Width": "41.12",
  "Module Weight": "46.55",
  "Number of Arrays": "1.79",
  "Number of Circuits": "1",
  "Number of Reinforcements": "1.49",
  "Roof Type": "Asphalt Shingles",
  "Attachment Type": "Flashfoot 2",
  "Portrait vs. Landscape Panel Orientation": "Portrait",
  "Number of Stories": "1",
  "Install Season": "Summer",
  "Total Direct Time for Hourly Employees (Including Drive Time)": "46.04",
  "Total Number of Days on Site": "1.96",
  "Total Number of Hourly Employees on Site": "3.60",
  "Estimated Number of Salaried Employees on Site": "0.88",
  "Estimated Salary Hours": "12.38",
  "Estimated Total Direct Time": "58.43",
  "Estimated Total Number of People on Site": "4.48",
  "Weather Conditions": "Sunny",
  "Additional Uncaptured Electrical Work": "No",
  "Trenching and Detached Buildings": "No",
  "Tightly Packed Roof System": "No",
  "New Construction Projects": "No"
};

// Variables with predefined value options
const variableValueOptions = {
  "Inverter Manufacturer": ["SolarEdge", "Enphase", "SMA", "GoodWe"],
  "Array Type": ["Roof Mount", "Ground Mount"],
  "Squirrel Screen Installation": ["Yes", "No"],
  "Consumption Monitoring": ["Yes", "No"],
  "Truss vs. Rafter Construction": ["Truss", "Rafter"],
  "Reinforcements Requirement": ["Yes", "No"],
  "Rough Electrical Inspection": ["Required", "Not Required"],
  "Interconnection Type": ["A1", "A3", "C2", "B2", "A2", "C*", "C3", "C1", "B*", "A*", "B1", "A4"],
  "Roof Type": ["Asphalt Shingles", "Standing Seam Metal Roof", "Ag Metal", "EPDM (Flat Roof)", "Ground Mount", "Metal Shingles"],
  "Attachment Type": ["Flashfoot 2", "Unknown", "S-5!", "Ejot", "Flashloc RM", "Ground Mount", "Metal Shingle Attachments", "RT Mini", "Flashview", "Hugs"],
  "Portrait vs. Landscape Panel Orientation": ["Portrait", "Both", "Landscape"],
  "Install Season": ["Spring", "Summer", "Fall", "Winter"],
  "Number of Stories": ["0", "1", "2", "3"],
  "Weather Conditions": ["Clear", "Cloudy", "Light Rain", "Heavy Rain", "Snow"],
  "Trenching and Detached Buildings": ["Yes", "No"],
  "Tightly Packed Roof System": ["Yes", "No"],
  "New Construction Projects": ["Yes", "No"]
};

// Check if a variable has predefined options
const hasValueOptions = (variable) => {
  return variableValueOptions[variable] !== undefined;
};

const Dashboard = () => {
  // Store all variables with their current values
  const [variableValues, setVariableValues] = useState({...variableDefaults});
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const handleValueChange = (variable, value) => {
    setVariableValues(prev => ({
      ...prev,
      [variable]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsLoading(true);
    setPrediction(null);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Generate a random prediction
      const predictionValue = Math.floor(Math.random() * 100);
      const efficiency = Math.floor(Math.random() * 30) + 70; // 70-100%
      
      setPrediction(`Based on your inputs, the predicted solar installation time is ${predictionValue} hours with ${efficiency}% certainty.`);
      
      toast({
        title: "Prediction complete",
        description: "Your solar installation time prediction is ready",
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
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  // Filter variables based on search term
  const filteredVariables = Object.keys(variableDefaults).filter(
    variable => variable.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={item} className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Solar Installation Time Predictor</h1>
            <p className="text-lg text-gray-600">
              Adjust the parameters below to predict installation time for solar panels
            </p>
          </motion.div>
          
          <motion.div variants={item}>
            <Card className="shadow-lg border-t-4 border-t-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sun className="h-5 w-5 text-yellow-500" />
                  Installation Parameters
                </CardTitle>
                <CardDescription>
                  All parameters are pre-filled with default values. Update any parameters you want to change.
                </CardDescription>
                
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    className="pl-10" 
                    placeholder="Search parameters..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredVariables.map((variable) => (
                      <motion.div 
                        key={variable} 
                        variants={item}
                        className="p-3 bg-white rounded-md shadow-sm border"
                      >
                        <label className="block font-medium text-sm mb-2 text-gray-700">{variable}</label>
                        {hasValueOptions(variable) ? (
                          <Select
                            value={variableValues[variable]}
                            onValueChange={(value) => handleValueChange(variable, value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {variableValueOptions[variable].map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            value={variableValues[variable]}
                            onChange={(e) => handleValueChange(variable, e.target.value)}
                            className="w-full"
                          />
                        )}
                      </motion.div>
                    ))}
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
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
                        Generate Prediction
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
              <Card className="shadow-lg border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5 text-green-500" />
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