import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
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

export default function LoginPage() {
  const { loginMutation, registerMutation } = useAuth();
  const [, navigate] = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  
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