import { createContext, useContext, useState, ReactNode } from 'react';
import type { Mission, Progress } from '@shared/schema';

// Create a minimal context
interface MissionContextType {
  dailyMissions: Mission[];
  completedMissions: Progress[];
  isLoading: boolean;
  setDailyMissions: (missions: Mission[]) => void;
  setCompletedMissions: (progress: Progress[]) => void;
  setIsLoading: (loading: boolean) => void;
}

const MissionContext = createContext<MissionContextType | undefined>(undefined);

export function MissionProvider({ children }: { children: ReactNode }) {
  const [dailyMissions, setDailyMissions] = useState<Mission[]>([]);
  const [completedMissions, setCompletedMissions] = useState<Progress[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <MissionContext.Provider
      value={{
        dailyMissions,
        completedMissions,
        isLoading,
        setDailyMissions,
        setCompletedMissions,
        setIsLoading,
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
