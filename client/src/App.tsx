import { Route, Switch, useLocation } from "wouter";
import { AuthProvider, useAuth } from "./hooks/use-auth";
import { useState } from "react";
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

// Home page that shows user info if logged in
function HomePage() {
  const { user, isLoading, isAuthenticated, logoutMutation } = useAuth();
  const [, navigate] = useLocation();
  
  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate("/login");
      }
    });
  };
  
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
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">SoloAscend</CardTitle>
          <CardDescription>Your productivity journey begins here</CardDescription>
        </CardHeader>
        
        <CardContent>
          {isAuthenticated ? (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-medium mb-2">Welcome back, {user?.username}!</h3>
                <p className="text-sm text-muted-foreground">User ID: {user?.id}</p>
                <p className="text-sm text-muted-foreground">Email: {user?.email}</p>
                <p className="text-sm text-muted-foreground">Level: {user?.level}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                You are now logged in. From here you can view your dashboard, manage missions,
                and track your progress.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p>
                You are not currently logged in. Please log in to access your personalized
                dashboard and continue your productivity journey.
              </p>
              <Button 
                className="w-full" 
                onClick={() => navigate("/login")}
              >
                Go to Login
              </Button>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          {isAuthenticated && (
            <Button 
              variant="outline" 
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging out...
                </>
              ) : (
                "Log out"
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

// Login page with form
function LoginPage() {
  const { loginMutation, registerMutation, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  
  // Redirect to home if already authenticated
  if (isAuthenticated) {
    navigate("/");
    return null;
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      loginMutation.mutate({
        username: formData.username,
        password: formData.password
      }, {
        onSuccess: () => {
          navigate("/");
        }
      });
    } else {
      registerMutation.mutate({
        username: formData.username,
        email: formData.email,
        password: formData.password
      }, {
        onSuccess: () => {
          navigate("/");
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md">
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
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/login" component={LoginPage} />
      </Switch>
    </AuthProvider>
  );
}

export default App;
