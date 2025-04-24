
import NavigationBar from "@/components/NavigationBar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { Info, HelpCircle, BookOpen, FileText, Settings } from "lucide-react";

const HowTo = () => {
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
            <h1 className="heading-text mb-2">How to Use Solar Scheduler</h1>
            <p className="subheading-text">
              Learn how to make the most of our solar energy prediction tools
            </p>
          </motion.div>
          
          <motion.div variants={item}>
            <Card className="glass-panel mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-solar-accent" />
                  Getting Started
                </CardTitle>
                <CardDescription>
                  Essential information to help you use Solar Scheduler effectively
                </CardDescription>
              </CardHeader>
              
              <CardContent className="prose max-w-none">
                <p>
                  Welcome to Solar Scheduler! This guide will help you understand how to use our
                  platform to predict solar energy production for your system.
                </p>
                
                <div className="my-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h3 className="text-lg font-medium text-blue-800 mb-2 flex items-center">
                    <HelpCircle className="h-5 w-5 mr-2" />
                    Quick Start
                  </h3>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Enter your location and system details in the input field</li>
                    <li>Click "Submit to model" to generate a prediction</li>
                    <li>Review your solar energy production prediction</li>
                    <li>Use the results to optimize your solar panel setup</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={item}>
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-solar-accent" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>How accurate are the predictions?</AccordionTrigger>
                    <AccordionContent>
                      Our prediction model takes into account historical weather data, solar panel 
                      specifications, and location-specific factors to provide estimates with 
                      approximately 85-90% accuracy in most regions.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2">
                    <AccordionTrigger>What information should I include in my input?</AccordionTrigger>
                    <AccordionContent>
                      For the most accurate predictions, include your location (city or ZIP code), 
                      solar panel type, system capacity (kW), tilt angle, azimuth, and any shading 
                      factors that might affect production.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Can I save my prediction results?</AccordionTrigger>
                    <AccordionContent>
                      Yes, once you've generated a prediction, you can save or export the results
                      by clicking the "Save Results" button that appears with your prediction.
                      This feature will be available in the next update.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-4">
                    <AccordionTrigger>How do I interpret the prediction results?</AccordionTrigger>
                    <AccordionContent>
                      The prediction shows estimated daily energy production in kilowatt-hours (kWh) 
                      along with efficiency percentage. This helps you understand how well your system 
                      is expected to perform based on the provided conditions.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div 
            variants={item}
            className="mt-8 text-center text-sm text-gray-500"
          >
            <p>This content is placeholder text. You can customize this page with your specific instructions later.</p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default HowTo;
