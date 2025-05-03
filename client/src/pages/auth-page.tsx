import { AuthForm } from "@/components/auth/AuthForm";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useLocation } from "wouter";

// Component using auth hooks, wrapped with auth provider
function AuthPageContent() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  
  // Redirect to dashboard if user is already authenticated
  useEffect(() => {
    if (user && !isLoading) {
      setLocation("/");
    }
  }, [user, isLoading, setLocation]);
  
  return (
    <div className="flex min-h-screen bg-background">
      {/* Form Column */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold font-poppins text-foreground flex items-center justify-center">
              <span className="text-primary mr-2">Solo</span>Ascend
            </h1>
            <p className="text-muted-foreground mt-2">Level up your productivity journey</p>
          </div>
          
          <AuthForm />
        </div>
      </div>
      
      {/* Hero Column */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/80 to-primary/50 flex-col items-center justify-center p-12 text-white">
        <div className="max-w-xl space-y-8">
          <div className="flex items-center justify-center mb-6">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="h-24 w-24 opacity-90">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold text-center">Your Productivity Journey Begins</h2>
          
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold text-xl mb-2">Set Missions & Goals</h3>
              <p>Complete daily missions and long-term projects tailored to your energy levels and availability.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold text-xl mb-2">Track Your Progress</h3>
              <p>Watch as you level up with each completed task, building momentum and unlocking your potential.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold text-xl mb-2">Stay Motivated</h3>
              <p>Draw inspiration from quotes and visualize your growth with detailed progress tracking.</p>
            </div>
          </div>
          
          <p className="text-center font-medium text-white/80 pt-4">
            Inspired by Solo Leveling.<br />
            Your journey to becoming a productivity master starts here.
          </p>
        </div>
      </div>
    </div>
  );
}

// Export with AuthProvider wrapper
export default function AuthPage() {
  return (
    <AuthProvider>
      <AuthPageContent />
    </AuthProvider>
  );
}