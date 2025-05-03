import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProgress } from "@/hooks/useProgress";
import { format, parseISO, subDays } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from "recharts";

export default function ProgressPage() {
  const { streak, totalCompleted, weeklyPerformance, progressData, isLoading } = useProgress();
  
  // Process data for monthly chart
  const getMonthlyData = () => {
    // Create data for the last 30 days
    const today = new Date();
    const data = [];
    
    for (let i = 29; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      // Count completed missions for this date
      const completed = progressData.filter(
        (p: any) => p.status === 'completed' && p.date.includes(dateStr)
      ).length;
      
      data.push({
        date: format(date, 'MMM dd'),
        completed,
      });
    }
    
    return data;
  };
  
  // Get completion rate by difficulty
  const getCompletionByDifficulty = () => {
    const difficulties = ['Easy', 'Medium', 'Hard'];
    const data = difficulties.map(difficulty => {
      // Filter missions by difficulty and count completed vs total
      const missionsOfDifficulty = progressData.filter((p: any) => 
        p.missions && p.missions.difficulty === difficulty
      );
      
      const completed = missionsOfDifficulty.filter((p: any) => p.status === 'completed').length;
      const total = missionsOfDifficulty.length || 1; // Avoid division by zero
      
      return {
        difficulty,
        completed,
        total,
        rate: Math.round((completed / total) * 100)
      };
    });
    
    return data;
  };
  
  const monthlyData = getMonthlyData();
  const difficultyData = getCompletionByDifficulty();
  
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-foreground sm:text-3xl sm:truncate font-poppins">
            Progress Tracker
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor your journey and track your progress over time
          </p>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-sm font-medium text-muted-foreground uppercase">Current Streak</h3>
              {isLoading ? (
                <Skeleton className="h-12 w-20 mx-auto mt-2" />
              ) : (
                <p className="text-3xl font-bold text-foreground mt-2">{streak} days</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-sm font-medium text-muted-foreground uppercase">Total Completed</h3>
              {isLoading ? (
                <Skeleton className="h-12 w-20 mx-auto mt-2" />
              ) : (
                <p className="text-3xl font-bold text-foreground mt-2">{totalCompleted}</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-sm font-medium text-muted-foreground uppercase">Completion Rate</h3>
              {isLoading ? (
                <Skeleton className="h-12 w-20 mx-auto mt-2" />
              ) : (
                <p className="text-3xl font-bold text-foreground mt-2">
                  {totalCompleted > 0 ? Math.round((totalCompleted / (totalCompleted + 5)) * 100) : 0}%
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-sm font-medium text-muted-foreground uppercase">Current Level</h3>
              {isLoading ? (
                <Skeleton className="h-12 w-20 mx-auto mt-2" />
              ) : (
                <p className="text-3xl font-bold text-foreground mt-2">Level 7</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Weekly Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Progress</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="completed" 
                      name="Completed Missions" 
                      stroke="hsl(var(--primary))" 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Completion by Difficulty */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Completion by Difficulty</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={difficultyData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="difficulty" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="rate" name="Completion Rate (%)" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Current Level Progress</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <div className="space-y-8 p-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-lg font-medium">Level 7 Hunter</span>
                    <span className="text-lg font-medium">65%</span>
                  </div>
                  <Progress value={65} className="h-4" />
                  <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                    <span>0 XP</span>
                    <span>650/1000 XP</span>
                    <span>1000 XP</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Level Benefits</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Access to Hard Missions</span>
                    </li>
                    <li className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Mission Chaining (Combo Bonus)</span>
                    </li>
                    <li className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Enhanced Motivational Quotes</span>
                    </li>
                    <li className="flex items-center opacity-50">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span>S-Rank Missions (Unlock at Level 10)</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
