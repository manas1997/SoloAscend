import { ProjectList } from "@/components/projects/ProjectList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useProjects } from "@/hooks/useProjects";
import { Skeleton } from "@/components/ui/skeleton";
import { calculateGoalProgress } from "@/lib/missionEngine";

export default function ProjectsPage() {
  const { mainProject, isLoading } = useProjects();
  
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
  
  // Project data for main goal
  const mainGoalData = mainProject 
    ? parseProgressFromDescription(mainProject.description)
    : { current: 250, target: 1000, percent: 25 };
  
  const mainGoalDaysRemaining = mainProject
    ? getDaysRemaining(mainProject.end_date)
    : 610;
  
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-foreground sm:text-3xl sm:truncate font-poppins">
            Project Arena
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your projects and track your progress toward becoming a billionaire
          </p>
        </div>
      </div>
      
      {/* Main Goal Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Main Goal Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-36 w-full" />
          ) : (
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-foreground">{mainProject?.name || "Become a billionaire by 2025"}</h3>
                  <span className="text-xs font-medium px-2 py-1 bg-primary bg-opacity-20 text-primary rounded-full">
                    {mainGoalDaysRemaining} days remaining
                  </span>
                </div>
                <p className="text-muted-foreground mb-4">{mainProject?.description || "Target: $1,000,000,000 by 2025-12"}</p>
              </div>
              
              <div>
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Current Progress:</span>
                  <span>${(mainGoalData.current / 1000000).toFixed(0)}M / ${(mainGoalData.target / 1000000).toFixed(0)}M</span>
                </div>
                <Progress value={mainGoalData.percent} className="h-3 mb-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>{mainGoalData.percent}%</span>
                  <span>100%</span>
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-md">
                <h4 className="text-sm font-medium mb-2">Key Milestones</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>First $100M</span>
                    <span className="text-green-500">✓ Completed</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Reach $500M</span>
                    <span>In Progress - {Math.round((mainGoalData.current / 500000000) * 100)}%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Become a Billionaire</span>
                    <span>{mainGoalData.percent}% Complete</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Projects List */}
      <ProjectList />
    </div>
  );
}
