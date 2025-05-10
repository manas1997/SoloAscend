import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Target, 
  TrendingUp, 
  FolderKanban, 
  LogOut,
  Menu, 
  X,
  Flame
} from "lucide-react";
import { useState } from "react";

export function Navigation() {
  const { isAuthenticated, logoutMutation } = useAuth();
  const [, navigate] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  if (!isAuthenticated) return null;
  
  const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Missions", href: "/missions", icon: Target },
    { name: "Progress", href: "/progress", icon: TrendingUp },
    { name: "Projects", href: "/projects", icon: FolderKanban },
    { name: "Anime Surge", href: "/anime-surge", icon: Flame },
  ];
  
  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate("/");
      }
    });
  };
  
  // Desktop sidebar navigation
  const DesktopNav = () => (
    <div className="hidden lg:flex flex-col h-full bg-card border-r p-4 w-64">
      <div className="mb-8 px-2">
        <h1 className="text-2xl font-bold">SoloAscend</h1>
        <p className="text-sm text-muted-foreground">Level up your productivity</p>
      </div>
      
      <nav className="space-y-1 flex-1">
        {navigationItems.map((item) => (
          <Link 
            key={item.name} 
            href={item.href}
            className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground"
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </Link>
        ))}
      </nav>
      
      <div className="mt-auto">
        <Button 
          variant="ghost" 
          className="w-full justify-start" 
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Log out
        </Button>
      </div>
    </div>
  );
  
  // Mobile top navigation
  const MobileNav = () => (
    <div className="lg:hidden bg-card border-b p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">SoloAscend</h1>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>
      
      {isMobileMenuOpen && (
        <div className="mt-4 pb-3 pt-2 space-y-1">
          {navigationItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center px-2 py-2 text-base font-medium rounded-md hover:bg-accent hover:text-accent-foreground"
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          ))}
          
          <Button 
            variant="ghost" 
            className="w-full justify-start mt-2" 
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Log out
          </Button>
        </div>
      )}
    </div>
  );
  
  return (
    <>
      <DesktopNav />
      <MobileNav />
    </>
  );
}