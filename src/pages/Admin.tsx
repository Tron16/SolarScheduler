
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Users, Mail, Database, Settings } from "lucide-react";
import NavigationBar from "@/components/NavigationBar";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminMessages from "@/components/admin/AdminMessages";
import AdminModels from "@/components/admin/AdminModels";
import AdminEmails from "@/components/admin/AdminEmails";

const Admin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("users");
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/admin/${value === 'users' ? '' : value}`);
  };
  
  // Set the active tab based on URL
  useEffect(() => {
    const path = location.pathname.split('/').pop();
    if (path === 'admin' || path === '') {
      setActiveTab('users');
    } else if (path) {
      setActiveTab(path);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-blue-gradient flex flex-col">
      <NavigationBar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-light text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage users, messages, ML models, and email templates.</p>
          </div>
          
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Administration</CardTitle>
              <CardDescription>
                Manage all aspects of your Solar Scheduler application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="users" value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="grid grid-cols-4 mb-8">
                  <TabsTrigger value="users" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="hidden sm:inline">Users</span>
                  </TabsTrigger>
                  <TabsTrigger value="messages" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span className="hidden sm:inline">Messages</span>
                  </TabsTrigger>
                  <TabsTrigger value="models" className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    <span className="hidden sm:inline">ML Models</span>
                  </TabsTrigger>
                  <TabsTrigger value="emails" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span className="hidden sm:inline">Email Templates</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="users">
                  <AdminUsers />
                </TabsContent>
                <TabsContent value="messages">
                  <AdminMessages />
                </TabsContent>
                <TabsContent value="models">
                  <AdminModels />
                </TabsContent>
                <TabsContent value="emails">
                  <AdminEmails />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Admin;
