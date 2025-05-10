import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { MobileNavbar } from './MobileNavbar';
import { useAuth } from '@/hooks/use-auth'; // Updated to use the correct auth hook
import { OnboardingForm } from '../auth/OnboardingForm';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { user, loading } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };
  
  // Close mobile menu when route changes or on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (showMobileMenu && !(e.target as Element).closest('.mobile-menu-container')) {
        setShowMobileMenu(false);
      }
    };
    
    document.addEventListener('click', handleOutsideClick);
    
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [showMobileMenu]);
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary loading-aura"></div>
      </div>
    );
  }
  
  // If user is authenticated but not onboarded, show onboarding
  if (user && !user.onboarded) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <main className="flex-1 p-4 md:p-8 flex items-center justify-center">
          <OnboardingForm />
        </main>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <Sidebar />
      </div>
      
      {/* Mobile Header */}
      <MobileNavbar toggleMenu={toggleMobileMenu} />
      
      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-40 md:hidden mobile-menu-container">
          <div className="fixed inset-0 bg-black bg-opacity-60" onClick={() => setShowMobileMenu(false)}></div>
          <div className="fixed inset-y-0 left-0 w-64 bg-background border-r border-border overflow-y-auto">
            <Sidebar />
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto pt-16 md:pt-0">
          {children}
        </main>
      </div>
    </div>
  );
}
