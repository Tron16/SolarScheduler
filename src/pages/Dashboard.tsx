
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
  ChevronDown,
  X,
  Plus
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Variable options with their possible values
const variableOptions = [
  "Drive Time",
  "Tilt (Roof Pitch)",
  "Azimuth (Roof Orientation)",
  "Panel Quantity",
  "System Rating (kW DC)",
  "Inverter Manufacturer",
  "Array Type",
  "Squirrel Screen Installation",
  "Consumption Monitoring",
  "Truss vs. Rafter Construction",
  "Reinforcements Requirement",
  "Rough Electrical Inspection",
  "Interconnection Type",
  "Module Length",
  "Module Width",
  "Module Weight",
  "Number of Arrays",
  "Number of Circuits",
  "Number of Reinforcements",
  "Roof Type",
  "Attachment Type",
  "Portrait vs. Landscape Panel Orientation",
  "Number of Stories",
  "Install Season",
  "Total Direct Time for Hourly Employees (Including Drive Time)",
  "Total Number of Days on Site",
  "Total Number of Hourly Employees on Site",
  "Estimated Number of Salaried Employees on Site",
  "Estimated Salary Hours",
  "Estimated Total Direct Time",
  "Estimated Total Number of People on Site",
  "Weather Conditions",
  "Additional Uncaptured Electrical Work",
  "Trenching and Detached Buildings",
  "Tightly Packed Roof System",
  "New Construction Projects"
];

// Variables with predefined value options
const variableValueOptions = {
  "Inverter Manufacturer": ["SolarEdge", "Enphase", "SMA", "GoodWe"],
  "Array Type": ["Roof Mount", "Ground Mount"],
  "Squirrel Screen Installation": ["Yes", "No"],
  "Interconnection Type": ["A1", "A3", "C2", "B2", "A2", "C*", "C3", "C1", "B*", "A*", "B1", "A4"],
  "Roof Type": ["Asphalt Shingles", "Standing Seam Metal Roof", "Ag Metal", "EPDM (Flat Roof)", "Ground Mount", "Metal Shingles"],
  "Attachment Type": ["Flashfoot 2", "Unknown", "S-5!", "Ejot", "Flashloc RM", "Ground Mount", "Metal Shingle Attachments", "RT Mini", "Flashview", "Hugs"],
  "Portrait vs. Landscape Panel Orientation": ["Portrait", "Both", "Landscape"],
  "Install Season": ["Spring", "Summer", "Fall", "Winter"],
  "Number of Stories": ["0", "1", "2", "3"]
};

// Check if a variable has predefined options
const hasValueOptions = (variable) => {
  return variableValueOptions[variable] !== undefined;
};

const Dashboard = () => {
  const [selectedVariables, setSelectedVariables] = useState([]);
  const [variableValues, setVariableValues] = useState({});
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAddVariable = (variable) => {
    if (!selectedVariables.includes(variable)) {
      const newSelectedVariables = [...selectedVariables, variable];
      setSelectedVariables(newSelectedVariables);
      
      // Initialize with default value if it has predefined options
      if (hasValueOptions(variable)) {
        setVariableValues(prev => ({
          ...prev,
          [variable]: variableValueOptions[variable][0]
        }));
      } else {
        setVariableValues(prev => ({
          ...prev,
          [variable]: ""
        }));
      }
    }
  };

  const handleRemoveVariable = (variable) => {
    setSelectedVariables(selectedVariables.filter(v => v !== variable));
    setVariableValues(prev => {
      const newValues = { ...prev };
      delete newValues[variable];
      return newValues;
    });
  };

  const handleValueChange = (variable, value) => {
    setVariableValues(prev => ({
      ...prev,
      [variable]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedVariables.length === 0) {
      toast({
        title: "No variables selected",
        description: "Please select at least one variable for prediction",
        variant: "destructive",
      });
      return;
    }

    // Check if all variables have values
    const missingValues = selectedVariables.filter(variable => !variableValues[variable]);
    if (missingValues.length > 0) {
      toast({
        title: "Missing values",
        description: `Please provide values for: ${missingValues.join(", ")}`,
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
      
      setPrediction(`Based on your selected variables, the predicted solar installation time is ${predictionValue} hours with ${efficiency}% certainty.`);
      
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
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Filter out variables that have already been selected
  const availableVariables = variableOptions.filter(
    variable => !selectedVariables.includes(variable)
  );

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
            <h1 className="text-3xl font-bold mb-2">Midwest Solar Power - Installation Time Predictor</h1>
            <p className="text-lg text-gray-600">
              Select variables to predict installation time for solar panels
            </p>
          </motion.div>
          
          <motion.div variants={item}>
            <Card className="shadow-lg border-t-4 border-t-solar-accent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <img 
                    src="/lovable-uploads/498f44c5-20d5-491c-9b33-48c15965342c.png" 
                    alt="Midwest Solar Power" 
                    className="h-6"
                  />
                  Select Variables for Prediction
                </CardTitle>
                <CardDescription>
                  Choose the factors that affect solar installation time
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="mb-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-2">
                          <Plus className="h-4 w-4" />
                          Add Variable
                          <ChevronDown className="h-4 w-4 ml-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-72 max-h-80 overflow-y-auto">
                        <DropdownMenuGroup>
                          {availableVariables.length > 0 ? (
                            availableVariables.map((variable) => (
                              <DropdownMenuItem 
                                key={variable}
                                onClick={() => handleAddVariable(variable)}
                              >
                                {variable}
                              </DropdownMenuItem>
                            ))
                          ) : (
                            <DropdownMenuItem disabled>
                              All variables added
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  {selectedVariables.length > 0 && (
                    <div className="space-y-4 border rounded-md p-4 bg-gray-50">
                      <h3 className="font-medium text-gray-700">Selected Variables:</h3>
                      <div className="space-y-3">
                        {selectedVariables.map((variable) => (
                          <div key={variable} className="flex items-start gap-2 p-3 bg-white rounded-md shadow-sm">
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <p className="font-medium">{variable}</p>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveVariable(variable)}
                                  className="h-6 w-6"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              
                              <div className="mt-2">
                                {hasValueOptions(variable) ? (
                                  <Select
                                    value={variableValues[variable]}
                                    onValueChange={(value) => handleValueChange(variable, value)}
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder={`Select ${variable}`} />
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
                                    placeholder={`Enter value for ${variable}`}
                                    value={variableValues[variable]}
                                    onChange={(e) => handleValueChange(variable, e.target.value)}
                                    className="w-full"
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isLoading || selectedVariables.length === 0}
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
              <Card className="shadow-lg border-l-4 border-l-solar-accent">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5 text-solar-accent" />
                    Midwest Solar Power - Prediction Result
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
