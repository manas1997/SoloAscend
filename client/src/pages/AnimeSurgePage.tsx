import { useAuth } from "@/hooks/use-auth";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { AnimeSurge } from "@/components/anime/AnimeSurge";
import { Flame } from "lucide-react";

export default function AnimeSurgePage() {
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
          <h1 className="text-3xl font-bold tracking-tight">Anime Surge</h1>
          <p className="text-muted-foreground">
            Get motivated with inspirational anime clips and quotes
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Motivational Anime</CardTitle>
              <CardDescription>Watch motivational clips from famous anime series</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Press the button below to launch a fullscreen motivational anime experience. 
                Each clip comes with an inspirational quote to boost your determination.
              </p>
              <div className="flex justify-center">
                <AnimeSurge />
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>About Anime Surge</CardTitle>
              <CardDescription>How it helps your productivity journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Anime Surge is designed to provide quick motivation boosts through powerful scenes
                  and quotes from anime that embody determination, perseverance, and growth.
                </p>
                
                <div>
                  <h3 className="font-medium mb-2 flex items-center">
                    <Flame className="h-4 w-4 mr-2 text-primary" /> Featured Anime Series
                  </h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground pl-2 space-y-1">
                    <li>Solo Leveling</li>
                    <li>Naruto</li>
                    <li>Blue Lock</li>
                    <li>Black Clover</li>
                    <li>Dragon Ball</li>
                  </ul>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  Use Anime Surge whenever you feel stuck, unmotivated, or need a quick burst of 
                  energy to push through a challenging task. The motivational clips are selected 
                  to inspire the same fighting spirit in your personal growth journey.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}