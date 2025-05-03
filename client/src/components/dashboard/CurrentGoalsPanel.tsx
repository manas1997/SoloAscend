import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useProjects } from "@/hooks/useProjects";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const projectSchema = z.object({
  name: z.string().min(3, { message: "Project name must be at least 3 characters" }),
  description: z.string().optional(),
  endDate: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export function CurrentGoalsPanel() {
  const { mainProject, activeProjects, isLoading, createProject, refetchProjects } = useProjects();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      endDate: "",
    },
  });
  
  const onSubmit = async (data: ProjectFormValues) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      await createProject({
        name: data.name,
        description: data.description || "",
        status: "active",
        end_date: data.endDate ? new Date(data.endDate).toISOString() : null,
        user_id: user.id,
        start_date: new Date().toISOString(),
      });
      
      toast({
        title: "Project created",
        description: "Your new project has been created successfully.",
      });
      
      setIsFormOpen(false);
      form.reset();
      refetchProjects();
    } catch (error) {
      toast({
        title: "Failed to create project",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Parse progress and financial goal from main project description
  const parseProgressFromDescription = (description?: string) => {
    if (!description) return { current: 250, target: 1000, percent: 25 };
    
    const moneyMatch = description.match(/Target: \$(\d+(?:,\d+)*)/);
    if (moneyMatch) {
      const target = parseInt(moneyMatch[1].replace(/,/g, ''));
      // For demo, we'll use a fixed current value
      const current = 250000000; // $250M
      return {
        current,
        target,
        percent: Math.min(100, Math.round((current / target) * 100))
      };
    }
    
    return { current: 250, target: 1000, percent: 25 };
  };
  
  // Calculate days remaining
  const getDaysRemaining = (endDate?: string) => {
    if (!endDate) return 0;
    
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  };
  
  const getProjectProgress = (project: any) => {
    // This is placeholder logic. In a real app, you'd calculate this based on completed subtasks
    if (project.status === "planning") return 15;
    if (project.status === "active") return 65;
    if (project.status === "completed") return 100;
    return 40;
  };
  
  // Project data for main goal
  const mainGoalData = mainProject 
    ? parseProgressFromDescription(mainProject.description)
    : { current: 250, target: 1000, percent: 25 };
  
  const mainGoalDaysRemaining = mainProject
    ? getDaysRemaining(mainProject.end_date)
    : 610;
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Current Goals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Main Goal */}
          {isLoading ? (
            <Skeleton className="h-36 w-full" />
          ) : (
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <h4 className="text-foreground font-medium">{mainProject?.name || "Become a billionaire by 2025"}</h4>
                <Badge variant="secondary">Main Goal</Badge>
              </div>
              <div className="mt-3 w-full">
                <Progress value={mainGoalData.percent} className="h-2" />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">
                  ${(mainGoalData.current / 1000000).toFixed(0)}M / ${(mainGoalData.target / 1000000).toFixed(0)}M
                </span>
                <span className="text-xs text-muted-foreground">{mainGoalData.percent}%</span>
              </div>
              <div className="mt-3 flex items-center text-xs text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {mainGoalDaysRemaining} days remaining
              </div>
            </div>
          )}
          
          {/* Active Projects */}
          {isLoading ? (
            <Skeleton className="h-36 w-full" />
          ) : (
            activeProjects.slice(0, 2).map((project) => (
              <div key={project.id} className="bg-muted p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <h4 className="text-foreground font-medium">{project.name}</h4>
                  <Badge variant="outline" className="bg-primary-foreground bg-opacity-20 text-primary">
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </Badge>
                </div>
                <div className="mt-3 w-full">
                  <Progress value={getProjectProgress(project)} className="h-2" />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-muted-foreground">13/20 tasks</span>
                  <span className="text-xs text-muted-foreground">{getProjectProgress(project)}%</span>
                </div>
                <div className="mt-3 flex items-center text-xs text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {project.end_date ? `${getDaysRemaining(project.end_date)} days remaining` : "Ongoing"}
                </div>
              </div>
            ))
          )}
          
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setIsFormOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Goal
          </Button>
        </CardContent>
      </Card>
      
      {/* Add New Project Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter project name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Project description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="glow-effect" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white mr-2"></div>
                      Creating...
                    </div>
                  ) : (
                    "Create Project"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
