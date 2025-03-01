
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
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Edit, Trash2, Mail } from "lucide-react";
import type { EmailTemplate } from "@/types/database";

const AdminEmails = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<EmailTemplate | null>(null);
  
  // Form state
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isActive, setIsActive] = useState(true);
  
  const { toast } = useToast();

  // Function to fetch templates
  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      setTemplates(data || []);
    } catch (error: any) {
      console.error("Error fetching email templates:", error);
      toast({
        title: "Error fetching templates",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchTemplates();
  }, []);

  // Reset form
  const resetForm = () => {
    setName("");
    setSubject("");
    setBody("");
    setIsActive(true);
    setCurrentTemplate(null);
    setIsEditMode(false);
  };

  // Open add template modal
  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  // Open edit template modal
  const openEditModal = (template: EmailTemplate) => {
    setCurrentTemplate(template);
    setName(template.name);
    setSubject(template.subject);
    setBody(template.body);
    setIsActive(template.is_active);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const templateData = {
        name,
        subject,
        body,
        is_active: isActive,
        updated_at: new Date().toISOString(),
      };
      
      if (isEditMode && currentTemplate) {
        // Update existing template
        const { error } = await supabase
          .from('email_templates')
          .update(templateData)
          .eq('id', currentTemplate.id);
        
        if (error) throw error;
        
        toast({
          title: "Template updated",
          description: "The email template has been updated successfully",
        });
      } else {
        // Add new template
        const { error } = await supabase
          .from('email_templates')
          .insert([templateData]);
        
        if (error) throw error;
        
        toast({
          title: "Template added",
          description: "The email template has been added successfully",
        });
      }
      
      // Close modal and refresh templates
      setIsModalOpen(false);
      resetForm();
      fetchTemplates();
    } catch (error: any) {
      console.error("Error saving template:", error);
      toast({
        title: "Error saving template",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Toggle template active status
  const toggleTemplateStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('email_templates')
        .update({ 
          is_active: !currentStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setTemplates(templates.map(template => 
        template.id === id ? { ...template, is_active: !currentStatus } : template
      ));
      
      toast({
        title: "Template status updated",
        description: `Template is now ${!currentStatus ? 'active' : 'inactive'}`,
      });
    } catch (error: any) {
      console.error("Error updating template status:", error);
      toast({
        title: "Error updating template",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Delete template
  const deleteTemplate = async (id: string) => {
    if (!confirm("Are you sure you want to delete this template?")) return;
    
    try {
      const { error } = await supabase
        .from('email_templates')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setTemplates(templates.filter(template => template.id !== id));
      
      toast({
        title: "Template deleted",
        description: "The email template has been deleted successfully",
      });
    } catch (error: any) {
      console.error("Error deleting template:", error);
      toast({
        title: "Error deleting template",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Email Templates</h2>
        <Button onClick={openAddModal}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Template
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                    <span className="ml-2">Loading templates...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : templates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <Mail className="h-8 w-8 text-gray-400" />
                    <div className="text-gray-500">No email templates configured yet</div>
                    <Button variant="outline" onClick={openAddModal}>
                      Add Your First Template
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              templates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell className="font-medium">{template.name}</TableCell>
                  <TableCell>{template.subject}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={template.is_active}
                        onCheckedChange={() => toggleTemplateStatus(template.id, template.is_active)}
                      />
                      <span className={template.is_active ? "text-green-600" : "text-gray-500"}>
                        {template.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(template)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteTemplate(template.id)}
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

      {/* Add/Edit Template Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Email Template" : "Add Email Template"}</DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update the details of your email template"
                : "Configure a new email template for your application"}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Welcome Email"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Email Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Welcome to Solar Scheduler!"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="body">Email Body</Label>
                <Textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Dear {{name}}, Welcome to Solar Scheduler..."
                  rows={5}
                  required
                />
                <p className="text-xs text-gray-500">
                  You can use {{name}} as a placeholder for the recipient's name.
                </p>
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
                {isEditMode ? "Update Template" : "Add Template"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminEmails;
