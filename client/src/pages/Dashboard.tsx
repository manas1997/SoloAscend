import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { format } from "date-fns";

export default function Dashboard() {
  const { user, isLoading, refetch } = useAuth();
  
  console.log("Dashboard rendering - User:", user, "Loading:", isLoading);
  
  // Track refresh attempts
  const [refreshAttempts, setRefreshAttempts] = useState(0);
  
  // Auto-refresh user data every 2 seconds up to 5 times if loading
  useEffect(() => {
    let interval: number | undefined;
    
    if (isLoading && refreshAttempts < 5) {
      interval = window.setInterval(() => {
        console.log(`Auto-refreshing auth data, attempt ${refreshAttempts + 1}`);
        refetch();
        setRefreshAttempts(prev => prev + 1);
      }, 2000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading, refreshAttempts, refetch]);
  
  // Calculate journey day (days since registration)
  const calculateJourneyDay = () => {
    if (!user) return 0;
    
    const registrationDate = new Date();
    registrationDate.setDate(registrationDate.getDate() - 7); // Mock 1 week for new users
    
    const diffTime = Math.abs(new Date().getTime() - registrationDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  // Show loading state if user data is still loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }
  
  // Handle no user case - show a simple login button
  if (!user) {
    console.log("No user data available for dashboard, showing login option");
    
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6 max-w-md">
          <h1 className="text-2xl font-bold mb-4">Welcome to SoloAscend</h1>
          <p className="mb-6">To start your productivity journey, please log in or create an account.</p>
          <div className="flex justify-center space-x-4">
            <a 
              href="/auth" 
              className="px-6 py-3 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors"
            >
              Log In / Sign Up
            </a>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-secondary text-white rounded-md font-medium hover:bg-secondary/90 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  try {
    console.log("Rendering Dashboard component with user:", user);
    
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
              <a href="/select-tasks">
                <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Select Tasks
              </a>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-card rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Your Daily Missions</h2>
            <p className="text-muted-foreground mb-4">
              Select and prioritize your top 5 tasks for today to maximize your productivity
            </p>
            <div className="mt-4">
              <a href="/select-tasks" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90">
                Select Tasks
              </a>
            </div>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
            <p className="text-muted-foreground mb-4">
              Track your journey to becoming successful
            </p>
            <div className="w-full bg-background rounded-full h-2.5 mb-4">
              <div className="bg-primary h-2.5 rounded-full" style={{ width: '25%' }}></div>
            </div>
            <p className="text-sm text-muted-foreground">25% complete</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card rounded-lg p-6 shadow-md md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Motivational Quote</h2>
            <blockquote className="p-4 bg-background rounded-lg">
              <p className="text-lg font-medium text-foreground leading-relaxed font-poppins">
                "I don't have colleagues. Perhaps all hunters are meant to be alone."
              </p>
              <footer className="mt-2">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full border-2 border-primary overflow-hidden">
                    <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary">
                      SJ
                    </div>
                  </div>
                  <cite className="ml-3 not-italic">
                    <span className="text-sm font-semibold text-foreground">Sung Jin-Woo</span>
                    <span className="block text-xs text-muted-foreground">Solo Leveling</span>
                  </cite>
                </div>
              </footer>
            </blockquote>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Anime Surge</h2>
            <p className="text-muted-foreground mb-4">
              Get motivated with anime content
            </p>
            <div className="mt-4">
              <a href="/anime-surge" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90">
                View Anime Content
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error rendering Dashboard:", error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Dashboard Error</h1>
          <p className="text-muted-foreground">An error occurred while loading the dashboard.</p>
          <pre className="bg-card p-4 rounded mt-4 text-sm overflow-auto max-w-2xl">
            {error instanceof Error ? error.message : 'Unknown error'}
          </pre>
        </div>
        <div className="mt-4">
          <Button 
            variant="default" 
            onClick={() => window.location.reload()}
          >
            Reload Page
          </Button>
        </div>
      </div>
    );
  }
}
