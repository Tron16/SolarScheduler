// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { supabase } from "@/integrations/supabase/client";
import { EmailTemplate } from "@/types/database";

const AdminEmails = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [activeTemplate, setActiveTemplate] = useState<EmailTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast()

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching email templates:", error);
        toast({
          title: "Error",
          description: "Failed to fetch email templates.",
          variant: "destructive",
        })
      } else {
        setTemplates(data || []);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateUpdate = async (templateId: string, updates: Partial<EmailTemplate>) => {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .update(updates)
        .eq('id', templateId);

      if (error) {
        console.error("Error updating email template:", error);
        toast({
          title: "Error",
          description: "Failed to update email template.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Email template updated successfully.",
        })
        fetchTemplates(); // Refresh templates after update
      }
    } catch (error: any) {
      console.error("Error updating email template:", error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  };

  const handleTemplateCreate = async (newTemplate: Omit<EmailTemplate, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .insert([newTemplate]);

      if (error) {
        console.error("Error creating email template:", error);
        toast({
          title: "Error",
          description: "Failed to create email template.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Email template created successfully.",
        })
        fetchTemplates(); // Refresh templates after creation
      }
    } catch (error: any) {
      console.error("Error creating email template:", error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  };

  const handleTemplateDelete = async (templateId: string) => {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .delete()
        .eq('id', templateId);

      if (error) {
        console.error("Error deleting email template:", error);
        toast({
          title: "Error",
          description: "Failed to delete email template.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Email template deleted successfully.",
        })
        fetchTemplates(); // Refresh templates after deletion
      }
    } catch (error: any) {
      console.error("Error deleting email template:", error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  };

  const EmailTemplateSchema = z.object({
    name: z.string().min(2, {
      message: "Template name must be at least 2 characters.",
    }),
    subject: z.string().min(2, {
      message: "Subject must be at least 2 characters.",
    }),
    body: z.string().min(10, {
      message: "Body must be at least 10 characters.",
    }),
    is_active: z.boolean().default(false),
  })

  const CreateTemplateForm = () => {
    const form = useForm<z.infer<typeof EmailTemplateSchema>>({
      resolver: zodResolver(EmailTemplateSchema),
      defaultValues: {
        name: "",
        subject: "",
        body: "",
        is_active: false,
      },
    })

    function onSubmit(values: z.infer<typeof EmailTemplateSchema>) {
      handleTemplateCreate(values);
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Template Name</FormLabel>
                <FormControl>
                  <Input placeholder="Marketing Email" {...field} />
                </FormControl>
                <FormDescription>
                  This is the name of the template.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input placeholder="Subject of the email" {...field} />
                </FormControl>
                <FormDescription>
                  This is the subject of the email.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Body</FormLabel>
                <FormControl>
                  <Textarea placeholder="Email body" {...field} />
                </FormControl>
                <FormDescription>
                  This is the body of the email.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Active</FormLabel>
                  <FormDescription>
                    Whether the template is active and available for use.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit">Create</Button>
        </form>
      </Form>
    )
  }

  const renderTemplateCard = (template: EmailTemplate, isActive: boolean) => (
    <div 
      key={template.id}
      className={`p-4 border rounded-lg cursor-pointer transition-all ${
        isActive ? 'border-solar-accent bg-solar-accent/10' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => setActiveTemplate(template)}
    >
      <h3 className="font-medium">{template.name}</h3>
      <p className="text-sm text-gray-500 mt-1">{template.subject}</p>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Email Templates</h1>

      <div className="flex justify-between items-center mb-4">
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">Create Template</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Create Email Template</DrawerTitle>
              <DrawerDescription>
                Create a new email template to be used in the application.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerContent>
              <CreateTemplateForm />
            </DrawerContent>
            <DrawerFooter>
              <DrawerClose>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>

      {isLoading ? (
        <p>Loading templates...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map(template => renderTemplateCard(template, activeTemplate?.id === template.id))}
        </div>
      )}

      {activeTemplate && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Edit Template</h2>
          <Card>
            <CardHeader>
              <CardTitle>{activeTemplate.name}</CardTitle>
              <CardDescription>Edit the template details.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  defaultValue={activeTemplate.name}
                  className="col-span-3"
                  onChange={e => handleTemplateUpdate(activeTemplate.id, { name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  defaultValue={activeTemplate.subject}
                  className="col-span-3"
                  onChange={e => handleTemplateUpdate(activeTemplate.id, { subject: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="body">Body</Label>
                <Textarea
                  id="body"
                  defaultValue={activeTemplate.body}
                  className="col-span-3"
                  onChange={e => handleTemplateUpdate(activeTemplate.id, { body: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="active">Active</Label>
                <Switch
                  id="active"
                  checked={activeTemplate.is_active}
                  onCheckedChange={checked => handleTemplateUpdate(activeTemplate.id, { is_active: checked })}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleTemplateDelete(activeTemplate.id)} variant="destructive">Delete Template</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminEmails;
