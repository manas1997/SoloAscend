import { useAuth } from "@/hooks/use-auth";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Clock, TrendingUp, Zap, Flame } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { MotivationMeteor } from "@/components/motivation/MotivationMeteor";
import { AnimeSurge } from "@/components/anime/AnimeSurge";

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  
  if (!isAuthenticated || !user) return null;
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.username}! Your productivity journey awaits.
          </p>
        </div>
        
        {/* User info card */}
        <Card>
          <CardHeader className="bg-primary/5 rounded-t-lg">
            <CardTitle>Player Stats</CardTitle>
            <CardDescription>Your current progress and achievements</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">Current Level</p>
                  <p className="text-2xl font-bold">{user.level || 1}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">Completed Missions</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">Time Invested</p>
                  <p className="text-2xl font-bold">0h</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">Streak</p>
                  <p className="text-2xl font-bold">0 days</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Quick actions */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Daily Missions</CardTitle>
              <CardDescription>Set your top priorities for today</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                You don't have any missions set for today. Create your mission list to start tracking progress.
              </p>
              <Button className="w-full" onClick={() => navigate("/missions")}>
                <Target className="mr-2 h-4 w-4" />
                Create Missions
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>Track your long-term projects</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                You haven't created any projects yet. Start organizing your work in projects.
              </p>
              <Button className="w-full" onClick={() => navigate("/projects")}>
                <TrendingUp className="mr-2 h-4 w-4" />
                Create Project
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Motivation Boost</CardTitle>
              <CardDescription>Need a quick energy boost?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="mb-2 text-sm text-muted-foreground">
                  Get a dose of inspirational anime quotes and micro-challenges.
                </p>
                <MotivationMeteor />
              </div>
              
              <div>
                <p className="mb-2 text-sm text-muted-foreground">
                  Watch motivational anime video clips with inspiring quotes.
                </p>
                <AnimeSurge />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}