import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, getCurrentUser, signUp as sbSignUp, signIn as sbSignIn, signOut as sbSignOut } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  username?: string;
  avatar_url?: string;
  level?: number;
  onboarded?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Check for user on initial load
  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true);
        
        // Get current auth user
        const currentUser = await getCurrentUser();
        
        if (currentUser) {
          // Get additional user data from database
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', currentUser.id)
            .single();
          
          if (userError && userError.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
            throw userError;
          }
          
          // Merge auth data with database profile
          setUser({
            id: currentUser.id,
            email: currentUser.email || '',
            username: userData?.username || currentUser.user_metadata?.username,
            avatar_url: userData?.avatar_url,
            level: userData?.level || 1,
            onboarded: userData?.onboarded || false,
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error loading user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    
    loadUser();
    
    // Set up auth listener
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadUser();
      } else {
        setUser(null);
      }
    });
    
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, username: string) => {
    try {
      const { user } = await sbSignUp(email, password, username);
      
      if (user) {
        toast({
          title: "Account created successfully",
          description: "Welcome to SoloAscend!",
        });
      }
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await sbSignIn(email, password);
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await sbSignOut();
      setUser(null);
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };
  
  const updateUserProfile = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
