
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Edit, Trash2, Database } from "lucide-react";

interface MLModel {
  id: string;
  name: string;
  description: string;
  api_endpoint: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const AdminModels = () => {
  const [models, setModels] = useState<MLModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentModel, setCurrentModel] = useState<MLModel | null>(null);
  
  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [apiEndpoint, setApiEndpoint] = useState("");
  const [isActive, setIsActive] = useState(true);
  
  const { toast } = useToast();

  // Function to fetch models
  const fetchModels = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('ml_models')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      // Format the models for display
      const formattedModels = data.map((model) => ({
        ...model,
        created_at: new Date(model.created_at).toLocaleDateString(),
        updated_at: new Date(model.updated_at).toLocaleDateString(),
      }));
      
      setModels(formattedModels);
    } catch (error: any) {
      console.error("Error fetching ML models:", error);
      toast({
        title: "Error fetching models",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchModels();
  }, []);

  // Reset form
  const resetForm = () => {
    setName("");
    setDescription("");
    setApiEndpoint("");
    setIsActive(true);
    setCurrentModel(null);
    setIsEditMode(false);
  };

  // Open add model modal
  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  // Open edit model modal
  const openEditModal = (model: MLModel) => {
    setCurrentModel(model);
    setName(model.name);
    setDescription(model.description);
    setApiEndpoint(model.api_endpoint);
    setIsActive(model.is_active);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const modelData = {
        name,
        description,
        api_endpoint: apiEndpoint,
        is_active: isActive,
        updated_at: new Date().toISOString(),
      };
      
      if (isEditMode && currentModel) {
        // Update existing model
        const { error } = await supabase
          .from('ml_models')
          .update(modelData)
          .eq('id', currentModel.id);
        
        if (error) throw error;
        
        toast({
          title: "Model updated",
          description: "The ML model has been updated successfully",
        });
      } else {
        // Add new model
        const { error } = await supabase
          .from('ml_models')
          .insert([modelData]);
        
        if (error) throw error;
        
        toast({
          title: "Model added",
          description: "The ML model has been added successfully",
        });
      }
      
      // Close modal and refresh models
      setIsModalOpen(false);
      resetForm();
      fetchModels();
    } catch (error: any) {
      console.error("Error saving model:", error);
      toast({
        title: "Error saving model",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Toggle model active status
  const toggleModelStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('ml_models')
        .update({ 
          is_active: !currentStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setModels(models.map(model => 
        model.id === id ? { ...model, is_active: !currentStatus } : model
      ));
      
      toast({
        title: "Model status updated",
        description: `Model is now ${!currentStatus ? 'active' : 'inactive'}`,
      });
    } catch (error: any) {
      console.error("Error updating model status:", error);
      toast({
        title: "Error updating model",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Delete model
  const deleteModel = async (id: string) => {
    if (!confirm("Are you sure you want to delete this model?")) return;
    
    try {
      const { error } = await supabase
        .from('ml_models')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setModels(models.filter(model => model.id !== id));
      
      toast({
        title: "Model deleted",
        description: "The ML model has been deleted successfully",
      });
    } catch (error: any) {
      console.error("Error deleting model:", error);
      toast({
        title: "Error deleting model",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">ML Models</h2>
        <Button onClick={openAddModal}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Model
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>API Endpoint</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                    <span className="ml-2">Loading models...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : models.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <Database className="h-8 w-8 text-gray-400" />
                    <div className="text-gray-500">No ML models configured yet</div>
                    <Button variant="outline" onClick={openAddModal}>
                      Add Your First Model
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              models.map((model) => (
                <TableRow key={model.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{model.name}</div>
                      {model.description && (
                        <div className="text-sm text-gray-500 truncate max-w-md">
                          {model.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm truncate max-w-md">
                    {model.api_endpoint}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={model.is_active}
                        onCheckedChange={() => toggleModelStatus(model.id, model.is_active)}
                      />
                      <span className={model.is_active ? "text-green-600" : "text-gray-500"}>
                        {model.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{model.updated_at}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(model)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteModel(model.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Model Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit ML Model" : "Add ML Model"}</DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update the details of your machine learning model"
                : "Configure a new machine learning model for your application"}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Model Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="OpenAI GPT-4"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of what this model does"
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="apiEndpoint">API Endpoint</Label>
                <Input
                  id="apiEndpoint"
                  value={apiEndpoint}
                  onChange={(e) => setApiEndpoint(e.target.value)}
                  placeholder="https://api.example.com/v1/completion"
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  Active
                </Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditMode ? "Update Model" : "Add Model"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminModels;
