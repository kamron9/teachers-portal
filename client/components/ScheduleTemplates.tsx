import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit3, Trash2, Copy, Star, Clock, Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ScheduleTemplate {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  rules: Array<{
    id: string;
    type: 'recurring' | 'one_off';
    weekday?: number;
    date?: string;
    startTime: string;
    endTime: string;
    isOpen: boolean;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface ScheduleTemplatesProps {
  templates: ScheduleTemplate[];
  onCreateTemplate: (template: Omit<ScheduleTemplate, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onUpdateTemplate: (id: string, template: Partial<ScheduleTemplate>) => Promise<void>;
  onDeleteTemplate: (id: string) => Promise<void>;
  onApplyTemplate: (template: ScheduleTemplate) => Promise<void>;
}

export default function ScheduleTemplates({
  templates,
  onCreateTemplate,
  onUpdateTemplate,
  onDeleteTemplate,
  onApplyTemplate
}: ScheduleTemplatesProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ScheduleTemplate | null>(null);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    isDefault: false,
    rules: [] as any[]
  });

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const defaultTemplates = [
    {
      name: "Standard Working Hours",
      description: "Monday to Friday, 9 AM to 5 PM",
      rules: [
        { type: 'recurring', weekday: 1, startTime: '09:00', endTime: '17:00', isOpen: true },
        { type: 'recurring', weekday: 2, startTime: '09:00', endTime: '17:00', isOpen: true },
        { type: 'recurring', weekday: 3, startTime: '09:00', endTime: '17:00', isOpen: true },
        { type: 'recurring', weekday: 4, startTime: '09:00', endTime: '17:00', isOpen: true },
        { type: 'recurring', weekday: 5, startTime: '09:00', endTime: '17:00', isOpen: true },
      ]
    },
    {
      name: "Extended Hours",
      description: "Monday to Saturday, 8 AM to 8 PM",
      rules: [
        { type: 'recurring', weekday: 1, startTime: '08:00', endTime: '20:00', isOpen: true },
        { type: 'recurring', weekday: 2, startTime: '08:00', endTime: '20:00', isOpen: true },
        { type: 'recurring', weekday: 3, startTime: '08:00', endTime: '20:00', isOpen: true },
        { type: 'recurring', weekday: 4, startTime: '08:00', endTime: '20:00', isOpen: true },
        { type: 'recurring', weekday: 5, startTime: '08:00', endTime: '20:00', isOpen: true },
        { type: 'recurring', weekday: 6, startTime: '10:00', endTime: '18:00', isOpen: true },
      ]
    },
    {
      name: "Evening Classes",
      description: "Weekday evenings and weekends",
      rules: [
        { type: 'recurring', weekday: 1, startTime: '18:00', endTime: '22:00', isOpen: true },
        { type: 'recurring', weekday: 2, startTime: '18:00', endTime: '22:00', isOpen: true },
        { type: 'recurring', weekday: 3, startTime: '18:00', endTime: '22:00', isOpen: true },
        { type: 'recurring', weekday: 4, startTime: '18:00', endTime: '22:00', isOpen: true },
        { type: 'recurring', weekday: 5, startTime: '18:00', endTime: '22:00', isOpen: true },
        { type: 'recurring', weekday: 6, startTime: '09:00', endTime: '17:00', isOpen: true },
        { type: 'recurring', weekday: 0, startTime: '09:00', endTime: '17:00', isOpen: true },
      ]
    }
  ];

  const createTemplate = async () => {
    if (!newTemplate.name) {
      toast({
        title: "Error",
        description: "Template name is required",
        variant: "destructive"
      });
      return;
    }

    try {
      await onCreateTemplate(newTemplate);
      setNewTemplate({ name: '', description: '', isDefault: false, rules: [] });
      setIsCreateModalOpen(false);
      toast({
        title: "Success",
        description: "Schedule template created successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create template",
        variant: "destructive"
      });
    }
  };

  const applyTemplate = async (template: ScheduleTemplate | { name: string; description: string; rules: any[] }) => {
    try {
      if ('id' in template) {
        await onApplyTemplate(template);
      } else {
        // Apply default template
        const mockTemplate: ScheduleTemplate = {
          id: 'default-' + Date.now(),
          name: template.name,
          description: template.description,
          isDefault: false,
          rules: template.rules.map((rule, index) => ({ ...rule, id: index.toString() })),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await onApplyTemplate(mockTemplate);
      }
      
      toast({
        title: "Success",
        description: "Schedule template applied successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to apply template",
        variant: "destructive"
      });
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      await onDeleteTemplate(id);
      toast({
        title: "Success",
        description: "Template deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete template",
        variant: "destructive"
      });
    }
  };

  const setAsDefault = async (template: ScheduleTemplate) => {
    try {
      // First, remove default from all templates
      for (const t of templates) {
        if (t.isDefault && t.id !== template.id) {
          await onUpdateTemplate(t.id, { isDefault: false });
        }
      }
      
      // Set this template as default
      await onUpdateTemplate(template.id, { isDefault: true });
      
      toast({
        title: "Success",
        description: "Default template updated"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update default template",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Schedule Templates</h3>
          <p className="text-sm text-gray-600">
            Save and reuse common availability patterns
          </p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Schedule Template</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="templateName">Template Name</Label>
                <Input
                  id="templateName"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Morning Hours, Weekend Classes"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="templateDescription">Description (Optional)</Label>
                <Textarea
                  id="templateDescription"
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe when this template should be used"
                  rows={2}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={newTemplate.isDefault}
                  onCheckedChange={(checked) => setNewTemplate(prev => ({ ...prev, isDefault: checked }))}
                />
                <Label>Set as default template</Label>
              </div>
              
              <div className="text-sm text-gray-600">
                This template will be created from your current availability rules.
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createTemplate}>
                Create Template
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Default Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Start Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {defaultTemplates.map((template, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div>
                  <div className="font-medium">{template.name}</div>
                  <div className="text-sm text-gray-600">{template.description}</div>
                </div>
                
                <div className="space-y-1">
                  {template.rules.slice(0, 3).map((rule, ruleIndex) => (
                    <div key={ruleIndex} className="text-xs bg-gray-50 p-2 rounded">
                      {daysOfWeek[rule.weekday! - 1]}: {rule.startTime} - {rule.endTime}
                    </div>
                  ))}
                  {template.rules.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{template.rules.length - 3} more
                    </div>
                  )}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyTemplate(template)}
                  className="w-full"
                >
                  <Copy className="h-3 w-3 mr-2" />
                  Apply Template
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">My Templates</CardTitle>
        </CardHeader>
        <CardContent>
          {templates.length > 0 ? (
            <div className="space-y-4">
              {templates.map((template) => (
                <div key={template.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{template.name}</h4>
                        {template.isDefault && (
                          <Badge variant="secondary">
                            <Star className="h-3 w-3 mr-1" />
                            Default
                          </Badge>
                        )}
                      </div>
                      
                      {template.description && (
                        <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                      )}
                      
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {template.rules.length} rules
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Created {new Date(template.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => applyTemplate(template)}
                      >
                        <Copy className="h-3 w-3 mr-2" />
                        Apply
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAsDefault(template)}
                        disabled={template.isDefault}
                      >
                        <Star className="h-3 w-3" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingTemplate(template)}
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTemplate(template.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
                    {template.rules.slice(0, 8).map((rule) => (
                      <div key={rule.id} className="text-xs bg-gray-50 p-2 rounded">
                        {rule.type === 'recurring' 
                          ? daysOfWeek[rule.weekday! - 1]
                          : new Date(rule.date!).toLocaleDateString()
                        }: {rule.startTime} - {rule.endTime}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p>No custom templates yet</p>
              <p className="text-sm">Create templates from your current schedule</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
