import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase';
import { generateMissions as generateMissionsUtil } from '@/lib/missionEngine';
import type { Mission, Progress } from '@shared/schema';

interface MissionContextType {
  dailyMissions: Mission[];
  completedMissions: Progress[];
  isLoading: boolean;
  generateMissions: (params: {
    userId: string;
    energy: number;
    mood: 'focused' | 'motivated' | 'drained';
    timeAvailable: number;
  }) => Promise<void>;
  updateMissionStatus: (params: {
    user_id: string;
    mission_id: number;
    status: string;
    mood?: string;
    energy_level?: number;
  }) => Promise<void>;
  refreshMissions: () => Promise<void>;
}

const MissionContext = createContext<MissionContextType | undefined>(undefined);

export function MissionProvider({ children }: { children: ReactNode }) {
  const [dailyMissions, setDailyMissions] = useState<Mission[]>([]);
  const [completedMissions, setCompletedMissions] = useState<Progress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchMissions();
    }
  }, [user]);

  const fetchMissions = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Fetch all user missions
      const { data: missionsData, error: missionsError } = await supabase
        .from('missions')
        .select('*, projects(name)')
        .eq('user_id', user.id);
      
      if (missionsError) throw missionsError;
      
      // Fetch completed missions for today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data: progressData, error: progressError } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', today.toISOString());
      
      if (progressError) throw progressError;
      
      // Process missions data to add project_name if project_id exists
      const processedMissions = missionsData.map((mission: any) => ({
        ...mission,
        project_name: mission.projects?.name || null
      }));
      
      setDailyMissions(processedMissions);
      setCompletedMissions(progressData);
    } catch (error) {
      console.error('Error fetching missions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMissions = async (params: {
    userId: string;
    energy: number;
    mood: 'focused' | 'motivated' | 'drained';
    timeAvailable: number;
  }) => {
    setIsLoading(true);
    try {
      const generatedMissions = await generateMissionsUtil(params);
      await fetchMissions(); // Refresh missions after generation
      return generatedMissions;
    } catch (error) {
      console.error('Error generating missions:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateMissionStatus = async (params: {
    user_id: string;
    mission_id: number;
    status: string;
    mood?: string;
    energy_level?: number;
  }) => {
    try {
      const { data, error } = await supabase
        .from('progress')
        .insert(params)
        .select()
        .single();
      
      if (error) throw error;
      
      // Refresh missions after update
      await fetchMissions();
      
      return data;
    } catch (error) {
      console.error('Error updating mission status:', error);
      throw error;
    }
  };

  const refreshMissions = async () => {
    await fetchMissions();
  };

  return (
    <MissionContext.Provider
      value={{
        dailyMissions,
        completedMissions,
        isLoading,
        generateMissions,
        updateMissionStatus,
        refreshMissions,
      }}
    >
      {children}
    </MissionContext.Provider>
  );
}

export function useMissions() {
  const context = useContext(MissionContext);
  if (context === undefined) {
    throw new Error('useMissions must be used within a MissionProvider');
  }
  return context;
}
