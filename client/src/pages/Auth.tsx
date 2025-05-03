import { AuthForm } from "@/components/auth/AuthForm";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Auth() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  
  // Redirect to dashboard if user is already authenticated
  useEffect(() => {
    if (user && !isLoading) {
      setLocation("/");
    }
  }, [user, isLoading, setLocation]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-poppins text-foreground flex items-center justify-center">
            <span className="text-primary mr-2">Solo</span>Ascend
          </h1>
          <p className="text-muted-foreground mt-2">Level up your productivity journey</p>
        </div>
        
        <AuthForm />
        
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center mb-4 opacity-70">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary h-12 w-12">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <p className="text-sm text-muted-foreground">
            Inspired by Solo Leveling. <br />
            Your journey to becoming a billionaire by 2025 starts here.
          </p>
        </div>
      </div>
    </div>
  );
}
