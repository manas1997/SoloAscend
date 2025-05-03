import { Button } from "@/components/ui/button";
import { useMissions } from "@/hooks/useMissions";
import { getDifficultyColor } from "@/lib/missionEngine";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import type { Mission } from "@shared/schema";

interface MissionCardProps {
  mission: Mission;
}

export function MissionCard({ mission }: MissionCardProps) {
  const { updateMissionStatus } = useMissions();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const handleCompleteMission = async () => {
    if (!user) return;
    
    try {
      await updateMissionStatus({
        user_id: user.id,
        mission_id: mission.id,
        status: "completed"
      });
      
      toast({
        title: "Mission completed",
        description: "Good job! Your progress has been saved.",
      });
    } catch (error) {
      toast({
        title: "Failed to complete mission",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };
  
  const handleSkipMission = async () => {
    if (!user) return;
    
    try {
      await updateMissionStatus({
        user_id: user.id,
        mission_id: mission.id,
        status: "skipped"
      });
      
      toast({
        title: "Mission skipped",
        description: "The mission has been skipped.",
      });
    } catch (error) {
      toast({
        title: "Failed to skip mission",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };
  
  const handleDelayMission = async () => {
    if (!user) return;
    
    try {
      await updateMissionStatus({
        user_id: user.id,
        mission_id: mission.id,
        status: "delayed"
      });
      
      toast({
        title: "Mission delayed",
        description: "The mission has been delayed.",
      });
    } catch (error) {
      toast({
        title: "Failed to delay mission",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };
  
  const difficultyColor = getDifficultyColor(mission.difficulty);
  
  return (
    <div className="bg-card rounded-lg shadow-lg border border-border overflow-hidden">
      <div className={`px-4 py-3 ${
        mission.difficulty.toLowerCase() === 'hard' 
          ? 'bg-primary bg-opacity-10'
          : mission.difficulty.toLowerCase() === 'medium'
            ? 'bg-secondary bg-opacity-10'
            : 'bg-muted'
      } border-b border-border flex justify-between items-center`}>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${difficultyColor}`}>
          {mission.difficulty}
        </span>
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs text-muted-foreground">{mission.time_required} min</span>
        </div>
      </div>
      <div className="p-4">
        <h4 className="text-foreground font-medium mb-2">{mission.title}</h4>
        <p className="text-sm text-muted-foreground mb-4">{mission.description}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="inline-block w-2 h-2 bg-primary rounded-full mr-2"></span>
            <span className="text-xs text-muted-foreground">
              {mission.project_id 
                ? `Project: ${mission.project_name || 'Unknown'}`
                : `Category: ${mission.category}`
              }
            </span>
          </div>
          <div className="flex space-x-2">
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={handleDelayMission}
              className="text-muted-foreground hover:text-foreground"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="sr-only">Delay</span>
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={handleSkipMission}
              className="text-muted-foreground hover:text-foreground"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="sr-only">Skip</span>
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={handleCompleteMission}
              className="text-green-500 hover:text-green-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="sr-only">Complete</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
