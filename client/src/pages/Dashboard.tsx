import { Button } from "@/components/ui/button";
import { MotivationalQuote } from "@/components/dashboard/MotivationalQuote";
import { UserStateForm } from "@/components/dashboard/UserStateForm";
import { ProgressStats } from "@/components/dashboard/ProgressStats";
import { CurrentGoalsPanel } from "@/components/dashboard/CurrentGoalsPanel";
import { MissionList } from "@/components/missions/MissionList";
import { ProjectList } from "@/components/projects/ProjectList";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";

export default function Dashboard() {
  const { user } = useAuth();
  
  // Calculate journey day (days since registration)
  const calculateJourneyDay = () => {
    if (!user) return 0;
    
    const registrationDate = new Date();
    registrationDate.setDate(registrationDate.getDate() - 143); // Mock for demo
    
    const diffTime = Math.abs(new Date().getTime() - registrationDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      {/* Dashboard Header */}
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-foreground sm:text-3xl sm:truncate font-poppins">
            Dashboard
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            <span className="font-medium text-primary">{format(new Date(), 'EEEE, MMMM d, yyyy')}</span> • Day {calculateJourneyDay()} of your journey
          </p>
        </div>
        
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          <Button variant="default" className="glow-effect" asChild>
            <a href="/missions">
              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Mission
            </a>
          </Button>
          <Button variant="outline">
            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
            More
          </Button>
        </div>
      </div>
      
      {/* Motivational Quote */}
      <MotivationalQuote />
      
      {/* States Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <UserStateForm />
        <ProgressStats />
        <CurrentGoalsPanel />
      </div>
      
      {/* Daily Missions Section */}
      <div className="mb-8">
        <MissionList />
      </div>
      
      {/* Projects Section */}
      <div>
        <ProjectList />
      </div>
    </div>
  );
}
