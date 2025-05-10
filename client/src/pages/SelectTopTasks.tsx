import { TaskSelector } from "@/components/tasks/TaskSelector";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function SelectTopTasks() {
  const [, setLocation] = useLocation();

  return (
    <div className="container py-8 max-w-5xl">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Select Your Top 5 Daily Tasks</h1>
          <p className="text-muted-foreground mt-2">
            Choose the 5 most important tasks that align with your goals. These will be your top priorities for today.
          </p>
        </div>

        <TaskSelector />

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => setLocation("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>

          <Button
            onClick={() => setLocation("/missions")}
            className="flex items-center gap-2"
          >
            Continue to Missions
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}