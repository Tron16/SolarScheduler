import { useState } from "react";
import NavigationBar from "@/components/NavigationBar";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Sun, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Default values for all variables
const defaultValues = {
  "Drive Time": "30",
  "Tilt (Roof Pitch)": "25",
  "Azimuth (Roof Orientation)": "180",
  "Panel Quantity": "12",
  "System Rating (kW DC)": "4.8",
  "Inverter Manufacturer": "SolarEdge",
  "Array Type": "Roof Mount",
  "Squirrel Screen Installation": "No",
  "Consumption Monitoring": "Yes",
  "Truss vs. Rafter Construction": "Truss",
  "Reinforcements Requirement": "2",
  "Rough Electrical Inspection": "Yes",
  "Interconnection Type": "A1",
  "Module Length": "65",
  "Module Width": "39",
  "Module Weight": "40",
  "Number of Arrays": "1",
  "Number of Circuits": "1",
  "Number of Reinforcements": "2",
  "Roof Type": "Asphalt Shingles",
  "Attachment Type": "Flashfoot 2",
  "Portrait vs. Landscape Panel Orientation": "Portrait",
  "Number of Stories": "1",
  "Install Season": "Summer",
};

// Variables with predefined value options (same as before)
const variableValueOptions = {
  "Inverter Manufacturer": ["SolarEdge", "Enphase", "SMA", "GoodWe"],
  "Array Type": ["Roof Mount", "Ground Mount"],
  "Squirrel Screen Installation": ["Yes", "No"],
  "Consumption Monitoring": ["Yes", "No"],
  "Truss vs. Rafter Construction": ["Truss", "Rafter"],
  "Rough Electrical Inspection": ["Yes", "No"],
  "Interconnection Type": [
    "A1",
    "A3",
    "C2",
    "B2",
    "A2",
    "C*",
    "C3",
    "C1",
    "B*",
    "A*",
    "B1",
    "A4",
  ],
  "Roof Type": [
    "Asphalt Shingles",
    "Standing Seam Metal Roof",
    "Ag Metal",
    "EPDM (Flat Roof)",
    "Ground Mount",
    "Metal Shingles",
  ],
  "Attachment Type": [
    "Flashfoot 2",
    "Unknown",
    "S-5!",
    "Ejot",
    "Flashloc RM",
    "Ground Mount",
    "Metal Shingle Attachments",
    "RT Mini",
    "Flashview",
    "Hugs",
  ],
  "Portrait vs. Landscape Panel Orientation": ["Portrait", "Both", "Landscape"],
  "Install Season": ["Spring", "Summer", "Fall", "Winter"],
  "Number of Stories": ["0", "1", "2", "3"],
};

// Check if a variable has predefined options
const hasValueOptions = (variable) => {
  return variableValueOptions[variable] !== undefined;
};

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [variableValues, setVariableValues] = useState(defaultValues);
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleValueChange = (variable, value) => {
    setVariableValues((prev) => ({
      ...prev,
      [variable]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setPrediction(null);

    try {
      // Convert frontend variable names to backend feature names and values
      const features = {};
      Object.entries(variableValues).forEach(([variable, value]) => {
        let processedValue = value;
        if (hasValueOptions(variable)) {
          const options = variableValueOptions[variable];
          processedValue = options.indexOf(value) + 1; // Convert to 1-based index
        }
        features[variable] = parseFloat(processedValue);
      });

      // Make API call to backend
      const response = await fetch("http://localhost:8000/api/predict/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ features }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPrediction(Math.round(data.prediction));

      toast({
        title: "Prediction complete",
        description: "Your solar installation time prediction is ready",
      });
    } catch (error) {
      console.error("Prediction error:", error);
      toast({
        title: "Error generating prediction",
        description: error.message || "There was a problem with your request",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter variables based on search query
  const filteredVariables = Object.keys(defaultValues).filter((variable) =>
    variable.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Sun className="h-6 w-6 text-yellow-500" />
              <h1 className="text-2xl font-bold">Installation Parameters</h1>
            </div>
            <p className="text-gray-600">
              All parameters are pre-filled with default values. Update any
              parameters you want to change.
            </p>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search parameters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {filteredVariables.map((variable) => (
                <div
                  key={variable}
                  className="bg-white rounded-lg border p-4 shadow-sm"
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {variable}
                  </label>
                  {hasValueOptions(variable) ? (
                    <Select
                      value={variableValues[variable]}
                      onValueChange={(value) =>
                        handleValueChange(variable, value)
                      }
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
                      value={variableValues[variable]}
                      onChange={(e) =>
                        handleValueChange(variable, e.target.value)
                      }
                      className="w-full"
                    />
                  )}
                </div>
              ))}
            </div>

            <Button
              type="submit"
              className="w-full md:w-auto"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
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

          {prediction && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8"
            >
              <Card className="shadow-lg border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle>Prediction Result</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg">
                    Based on your parameters, the predicted solar installation
                    time is{" "}
                    <strong>{(prediction / 60).toFixed(2)} hours</strong>
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
