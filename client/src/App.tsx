import { Route, Switch, useLocation } from "wouter";
import { AuthProvider, useAuth } from "./hooks/use-auth";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

// Import pages
import DashboardPage from "./pages/DashboardPage";
import MissionsPage from "./pages/MissionsPage";
import ProgressPage from "./pages/ProgressPage";
import ProjectsPage from "./pages/ProjectsPage";
import AnimeSurgePage from "./pages/AnimeSurgePage";

// We'll define the LoginPage component directly in this file for simplicity

// Welcome page that redirects to dashboard if authenticated
function WelcomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [, navigate] = useLocation();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight mb-4">SoloAscend</h1>
        <p className="text-xl mb-8">
          Transform your productivity journey into a personal adventure
        </p>
        <p className="mb-8 text-muted-foreground">
          SoloAscend helps you track goals, complete missions, manage projects, and stay motivated
          through a unique blend of productivity tools and gamification elements.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" onClick={() => navigate("/login")}>
            Get Started
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/login")}>
            Log In
          </Button>
        </div>
      </div>
    </div>
  );
}

// Login page component
function LoginPage() {
  const { loginMutation, registerMutation, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  
  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      loginMutation.mutate({
        username: formData.username,
        password: formData.password
      }, {
        onSuccess: () => {
          navigate("/dashboard");
        }
      });
    } else {
      registerMutation.mutate({
        username: formData.username,
        email: formData.email,
        password: formData.password
      }, {
        onSuccess: () => {
          navigate("/dashboard");
        }
      });
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-screen-lg grid md:grid-cols-2 gap-8 items-center">
        {/* Left side - Form */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{isLogin ? "Log in" : "Create account"}</CardTitle>
            <CardDescription>
              {isLogin 
                ? "Enter your credentials to access your account" 
                : "Fill out the form below to create a new account"
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required={!isLogin}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={loginMutation.isPending || registerMutation.isPending}
                >
                  {(loginMutation.isPending || registerMutation.isPending) ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isLogin ? "Logging in..." : "Creating account..."}
                    </>
                  ) : (
                    isLogin ? "Log in" : "Create account"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
          
          <CardFooter>
            <Button 
              variant="link" 
              className="w-full" 
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin 
                ? "Don't have an account? Create one" 
                : "Already have an account? Log in"
              }
            </Button>
          </CardFooter>
        </Card>
        
        {/* Right side - Hero section */}
        <div className="hidden md:block p-6">
          <h2 className="text-3xl font-bold mb-4">Level Up Your Productivity</h2>
          <p className="text-muted-foreground mb-6">
            Join SoloAscend and transform your productivity journey into an epic adventure.
          </p>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">✓</span>
              <span>Track daily missions and conquer your goals</span>
            </li>
            <li className="flex items-start">
              <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">✓</span>
              <span>Level up as you complete challenges</span>
            </li>
            <li className="flex items-start">
              <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">✓</span>
              <span>Stay motivated with gamification elements</span>
            </li>
            <li className="flex items-start">
              <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">✓</span>
              <span>Organize projects for long-term goals</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Switch>
        <Route path="/" component={WelcomePage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/dashboard" component={DashboardPage} />
        <Route path="/missions" component={MissionsPage} />
        <Route path="/progress" component={ProgressPage} />
        <Route path="/projects" component={ProjectsPage} />
        <Route path="/anime-surge" component={AnimeSurgePage} />
      </Switch>
    </AuthProvider>
  );
}

export default App;
