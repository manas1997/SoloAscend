import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProgress } from "@/hooks/useProgress";
import { Skeleton } from "@/components/ui/skeleton";

export function ProgressStats() {
  const { streak, totalCompleted, weeklyPerformance, isLoading } = useProgress();
  
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Your Progress</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-xs text-muted-foreground uppercase font-medium">Daily Streak</p>
            {isLoading ? (
              <Skeleton className="h-8 w-16 mt-1" />
            ) : (
              <p className="text-2xl font-bold text-foreground mt-1">{streak} days</p>
            )}
          </div>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-xs text-muted-foreground uppercase font-medium">Completed</p>
            {isLoading ? (
              <Skeleton className="h-8 w-20 mt-1" />
            ) : (
              <p className="text-2xl font-bold text-foreground mt-1">{totalCompleted} tasks</p>
            )}
          </div>
        </div>
        
        <div className="flex-grow">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Weekly Performance</h4>
          {isLoading ? (
            <div className="h-32 flex items-end space-x-2">
              {Array(7).fill(0).map((_, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <Skeleton className="w-full h-20 rounded-t-sm" />
                  <Skeleton className="w-3 h-3 mt-1" />
                </div>
              ))}
            </div>
          ) : (
            <div className="h-32 flex items-end space-x-2">
              {weeklyPerformance.map((day, index) => {
                // Calculate height based on max value
                const maxCount = Math.max(...weeklyPerformance.map(d => d.count));
                const heightPercentage = maxCount > 0 ? (day.count / maxCount) * 90 : 0;
                
                // Today's index
                const today = new Date().getDay();
                const adjustedToday = today === 0 ? 6 : today - 1; // Adjust to match our array (Monday=0, Sunday=6)
                const isToday = index === adjustedToday;
                
                return (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div 
                      className={`w-full ${
                        isToday 
                          ? 'bg-primary glow-effect' 
                          : 'bg-primary bg-opacity-30'
                      } rounded-t-sm`} 
                      style={{ 
                        height: `${heightPercentage || 10}%`,
                        minHeight: '10%' // Always show a little bit of the bar
                      }}
                    ></div>
                    <span className={`text-xs ${isToday ? 'text-foreground font-medium' : 'text-muted-foreground'} mt-1`}>
                      {day.day.charAt(0)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
