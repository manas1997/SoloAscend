import { MissionList } from "@/components/missions/MissionList";
import { UserStateForm } from "@/components/dashboard/UserStateForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProgress } from "@/hooks/useProgress";
import { evaluateMissionsProgress } from "@/lib/missionEngine";

export default function MissionsPage() {
  const { totalCompleted } = useProgress();
  
  // Evaluate the user's progress with motivational feedback
  const progressEvaluation = evaluateMissionsProgress(totalCompleted, totalCompleted + 10); // +10 is a placeholder for total missions
  
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-foreground sm:text-3xl sm:truncate font-poppins">
            Daily Missions
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Complete your daily missions to level up and reach your goals
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <MissionList />
        </div>
        
        <div className="space-y-6">
          <UserStateForm />
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Hunter Evaluation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-md border border-border">
                <p className="text-sm italic text-card-foreground">{progressEvaluation}</p>
              </div>
              
              <div className="mt-4 bg-muted p-4 rounded-md border border-border">
                <div className="flex justify-between text-sm text-muted-foreground mb-1">
                  <span>Completed:</span>
                  <span>{totalCompleted} missions</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Hunter Rank:</span>
                  <span className="text-primary font-medium">C-Rank</span>
                </div>
              </div>
              
              <div className="mt-4 text-sm text-muted-foreground">
                <p>
                  <span className="text-primary font-semibold">Tip:</span> Complete harder missions to gain more experience and level up faster.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
