import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const { user } = useAuth();
  
  // Load theme preference from user settings on initial load
  useEffect(() => {
    async function loadThemePreference() {
      if (!user) {
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('user_settings')
          .select('theme')
          .eq('user_id', user.id)
          .single();
        
        if (error) {
          if (error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
            console.error('Error loading theme preference:', error);
          }
          return;
        }
        
        if (data?.theme) {
          setThemeState(data.theme as Theme);
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
      }
    }
    
    loadThemePreference();
  }, [user]);
  
  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);
  
  // Save theme preference when it changes
  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    
    if (user) {
      try {
        const { error } = await supabase
          .from('user_settings')
          .upsert({
            user_id: user.id,
            theme: newTheme
          })
          .select()
          .single();
        
        if (error) {
          console.error('Error saving theme preference:', error);
        }
      } catch (error) {
        console.error('Error saving theme preference:', error);
      }
    }
  };
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
