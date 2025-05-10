import { useAuth } from "@/hooks/use-auth";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function MissionsPage() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  
  if (!isAuthenticated) return null;
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Daily Missions</h1>
            <p className="text-muted-foreground">
              Set your top priorities and track your progress
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Mission
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Your Missions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-dashed p-8 text-center">
              <h3 className="font-semibold mb-2">No missions created yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first mission to start tracking your daily progress.
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Mission
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}