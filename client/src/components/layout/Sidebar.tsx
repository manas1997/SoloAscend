import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuth } from '@/context/AuthContext';
import { useMemo } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { calculateGoalProgress } from '@/lib/missionEngine';

export function Sidebar() {
  const [location] = useLocation();
  const { user, signOut } = useAuth();
  const { mainProject } = useProjects();
  
  const navItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      name: 'Select Tasks',
      href: '/select-tasks',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      name: 'Daily Missions',
      href: '/missions',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
    {
      name: 'Project Arena',
      href: '/projects',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      ),
    },
    {
      name: 'Progress Tracker',
      href: '/progress',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      name: 'Motivation Engine',
      href: '/motivation',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      name: 'Anime Surge',
      href: '/anime-surge',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];
  
  // Estimated progress to goalAmount
  const progress = useMemo(() => {
    if (!mainProject) return 25; // Default for demo purposes
    
    const goalText = mainProject.description || '';
    const match = goalText.match(/Target: \$(\d+(?:,\d+)*)/);
    
    if (match) {
      const goalAmount = parseInt(match[1].replace(/,/g, ''));
      // For demo, we'll use a fixed current value
      const currentAmount = 250000000; // $250M
      return calculateGoalProgress(currentAmount, goalAmount);
    }
    
    return 25;
  }, [mainProject]);
  
  // Calculate remaining days
  const daysRemaining = useMemo(() => {
    if (!mainProject || !mainProject.end_date) return 0;
    
    const endDate = new Date(mainProject.end_date);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  }, [mainProject]);
  
  return (
    <div className="flex flex-col w-64 border-r border-border">
      <div className="flex items-center justify-center h-16 bg-sidebar border-b border-border">
        <h1 className="text-xl font-bold font-poppins text-sidebar-foreground flex items-center">
          <span className="text-primary mr-2">Solo</span>Ascend
        </h1>
      </div>
      
      <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-sidebar">
        <div className="flex-grow flex flex-col">
          <nav className="flex-1 px-2 space-y-1">
            {navItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <a
                    className={`flex items-center px-2 py-3 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground'
                    } transition-colors group`}
                  >
                    <span className={`mr-3 ${isActive ? 'text-primary' : 'text-gray-400'}`}>
                      {item.icon}
                    </span>
                    {item.name}
                  </a>
                </Link>
              );
            })}
          </nav>
          
          <div className="px-3 mt-6">
            <div className="p-3 bg-sidebar-accent rounded-lg">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Current Goal
              </h3>
              <p className="mt-2 text-sm text-sidebar-foreground font-medium">
                {mainProject ? mainProject.name : "Become a billionaire by 2025"}
              </p>
              <div className="mt-2 w-full bg-background rounded-full h-2">
                <Progress value={progress} className="h-2" />
              </div>
              <p className="mt-1 text-xs text-gray-400">{progress}% complete</p>
              
              {daysRemaining > 0 && (
                <p className="mt-2 text-xs text-gray-400 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {daysRemaining} days remaining
                </p>
              )}
            </div>
            
            <div className="mt-2 p-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
        
        {/* User profile section */}
        <div className="flex-shrink-0 flex border-t border-border p-4">
          <div className="flex items-center w-full justify-between">
            <div className="flex items-center">
              <div>
                <div className="h-10 w-10 rounded-full bg-primary/20 text-primary flex items-center justify-center glow-effect">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-sidebar-foreground">
                  {user?.username || 'User'}
                </p>
                <p className="text-xs font-medium text-gray-400">Level 7 Hunter</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={signOut}
              className="text-gray-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
