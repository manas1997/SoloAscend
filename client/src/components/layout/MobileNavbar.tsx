import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

interface MobileNavbarProps {
  toggleMenu: () => void;
}

export function MobileNavbar({ toggleMenu }: MobileNavbarProps) {
  const { user } = useAuth();
  
  return (
    <div className="md:hidden fixed top-0 w-full bg-sidebar border-b border-border z-10">
      <div className="flex items-center justify-between h-16 px-4">
        <h1 className="text-xl font-bold font-poppins text-sidebar-foreground flex items-center">
          <span className="text-primary mr-2">Solo</span>Ascend
        </h1>
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center glow-effect">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={toggleMenu}
            className="text-gray-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="sr-only">Open menu</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
