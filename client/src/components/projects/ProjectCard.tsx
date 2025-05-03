import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useProjects } from "@/hooks/useProjects";
import type { Project } from "@shared/schema";
import { Link } from "wouter";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const getProjectProgress = (project: Project) => {
    // This is placeholder logic. In a real app, you'd calculate this based on completed subtasks
    if (project.status === "planning") return 15;
    if (project.status === "active") return 65;
    if (project.status === "completed") return 100;
    if (project.status === "paused") return 40;
    return 0;
  };
  
  const progress = getProjectProgress(project);
  
  // Format status for display
  const formattedStatus = project.status.charAt(0).toUpperCase() + project.status.slice(1);
  
  // Calculate days remaining
  const getDaysRemaining = (endDate?: string) => {
    if (!endDate) return "Ongoing";
    
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays <= 0 ? "Overdue" : `${diffDays} days left`;
  };
  
  const timeStatus = project.end_date ? getDaysRemaining(project.end_date) : "Ongoing";
  
  // Status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-primary bg-opacity-20 text-primary';
      case 'planning':
        return 'bg-orange-500 bg-opacity-20 text-orange-500';
      case 'completed':
        return 'bg-green-500 bg-opacity-20 text-green-500';
      case 'paused':
        return 'bg-gray-500 bg-opacity-20 text-gray-400';
      default:
        return 'bg-secondary bg-opacity-20 text-secondary';
    }
  };
  
  const statusColor = getStatusColor(project.status);
  
  return (
    <div className="bg-card rounded-lg shadow-lg border border-border overflow-hidden transition-transform hover:scale-[1.02]">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h4 className="text-foreground font-medium">{project.name}</h4>
          <Badge className={statusColor}>{formattedStatus}</Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full mb-4">
          <Progress value={progress} className="h-1.5" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {timeStatus}
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            13/20 tasks
          </div>
        </div>
      </div>
      <div className="bg-muted p-3 flex justify-between items-center">
        <div className="flex">
          <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center border border-border">
            U
          </div>
        </div>
        <Link href={`/projects/${project.id}`}>
          <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="sr-only">View project</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
