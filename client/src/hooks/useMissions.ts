import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest } from '@/lib/queryClient';
import { getMissions, createMission as createMissionApi, updateMissionStatus as updateMissionStatusApi } from '@/lib/supabase';
import { generateMissions as generateMissionsUtil } from '@/lib/missionEngine';
import type { Mission, InsertMission } from '@shared/schema';

export function useMissions() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  // Fetch missions
  const { data: missions = [], isLoading, refetch: refetchMissions } = useQuery({
    queryKey: ['/api/missions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      return await getMissions(user.id);
    },
    enabled: !!user,
  });
  
  // Generate missions
  const generateMissions = async (params: {
    userId: string;
    energy: number;
    mood: 'focused' | 'motivated' | 'drained';
    timeAvailable: number;
  }) => {
    if (!user) throw new Error('User not authenticated');
    
    const generatedMissions = await generateMissionsUtil(params);
    await queryClient.invalidateQueries({ queryKey: ['/api/missions', user.id] });
    return generatedMissions;
  };
  
  // Create mission
  const { mutateAsync: createMission } = useMutation({
    mutationFn: async (mission: InsertMission) => {
      return await createMissionApi(mission as any);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/missions', user?.id] });
    },
  });
  
  // Update mission status
  const { mutateAsync: updateMissionStatus } = useMutation({
    mutationFn: async (params: {
      user_id: string;
      mission_id: number;
      status: string;
      mood?: string;
      energy_level?: number;
    }) => {
      return await updateMissionStatusApi(params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/missions', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['/api/progress', user?.id] });
    },
  });
  
  return {
    missions,
    isLoading,
    generateMissions,
    createMission,
    updateMissionStatus,
    refetchMissions,
  };
}
