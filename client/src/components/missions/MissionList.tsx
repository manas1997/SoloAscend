import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MissionCard } from "./MissionCard";
import { useMissions } from "@/hooks/useMissions";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import type { Mission } from "@shared/schema";
import { useProjects } from "@/hooks/useProjects";

const missionSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().optional(),
  category: z.string().min(1, { message: "Please select a category" }),
  difficulty: z.string().min(1, { message: "Please select a difficulty level" }),
  time_required: z.coerce.number().min(1, { message: "Time must be at least 1 minute" }),
  project_id: z.string().optional(),
});

type MissionFormValues = z.infer<typeof missionSchema>;

export function MissionList() {
  const { missions, isLoading, createMission, refetchMissions } = useMissions();
  const { projects } = useProjects();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState<string>("all"); // 'all', 'easy', 'medium', 'hard'
  const [sortBy, setSortBy] = useState<string>("recent"); // 'recent', 'time', 'difficulty'
  const { user } = useAuth();
  const { toast } = useToast();
  
  const form = useForm<MissionFormValues>({
    resolver: zodResolver(missionSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      difficulty: "",
      time_required: 30,
      project_id: "",
    },
  });
  
  const onSubmit = async (data: MissionFormValues) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      await createMission({
        title: data.title,
        description: data.description || "",
        category: data.category,
        difficulty: data.difficulty,
        time_required: data.time_required,
        project_id: data.project_id ? parseInt(data.project_id) : null,
        user_id: user.id,
      });
      
      toast({
        title: "Mission created",
        description: "Your new mission has been created successfully.",
      });
      
      setIsFormOpen(false);
      form.reset();
      refetchMissions();
    } catch (error) {
      toast({
        title: "Failed to create mission",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Filter and sort missions
  const filteredAndSortedMissions = missions
    ?.filter((mission: Mission) => {
      if (filter === "all") return true;
      return mission.difficulty.toLowerCase() === filter.toLowerCase();
    })
    .sort((a: Mission, b: Mission) => {
      switch (sortBy) {
        case "time":
          return a.time_required - b.time_required;
        case "difficulty":
          const difficultyOrder: Record<string, number> = { "Easy": 1, "Medium": 2, "Hard": 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        case "recent":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold font-poppins">Today's Missions</h3>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilter("all")}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("easy")}>Easy</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("medium")}>Medium</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("hard")}>Hard</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy("recent")}>Most Recent</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("time")}>Time Required</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("difficulty")}>Difficulty</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button onClick={() => setIsFormOpen(true)} className="h-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-48 w-full" />
          ))}
        </div>
      ) : filteredAndSortedMissions.length === 0 ? (
        <div className="bg-card p-8 rounded-lg text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-muted-foreground mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="text-lg font-medium mb-2">No missions found</h3>
          <p className="text-muted-foreground mb-4">Create your first mission to get started</p>
          <Button onClick={() => setIsFormOpen(true)}>Create Mission</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedMissions.map((mission: Mission) => (
            <MissionCard key={mission.id} mission={mission} />
          ))}
        </div>
      )}
      
      {/* Create Mission Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Mission</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mission Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter mission title" {...field} />
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
                      <Textarea placeholder="Mission description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Development">Development</SelectItem>
                          <SelectItem value="Business">Business</SelectItem>
                          <SelectItem value="Wellness">Wellness</SelectItem>
                          <SelectItem value="Learning">Learning</SelectItem>
                          <SelectItem value="Personal">Personal</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Easy">Easy</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="time_required"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Required (minutes)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="project_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Related Project (optional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select project" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {projects.map((project) => (
                            <SelectItem key={project.id} value={project.id.toString()}>
                              {project.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
                    "Create Mission"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
