import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useQuery } from '@tanstack/react-query';
import { getStreakData, getWeeklyPerformance, getUserProgress } from '@/lib/supabase';

export function useProgress() {
  const { user } = useAuth();
  
  // Get streak data
  const { data: streakData, isLoading: isStreakLoading } = useQuery({
    queryKey: ['/api/progress/streak', user?.id],
    queryFn: async () => {
      if (!user) return { streak: 0, total_completed: 0 };
      return await getStreakData(user.id);
    },
    enabled: !!user,
  });
  
  // Get weekly performance
  const { data: weeklyData, isLoading: isWeeklyLoading } = useQuery({
    queryKey: ['/api/progress/weekly', user?.id],
    queryFn: async () => {
      if (!user) return [];
      return await getWeeklyPerformance(user.id);
    },
    enabled: !!user,
  });
  
  // Get all progress data
  const { data: progressData, isLoading: isProgressLoading } = useQuery({
    queryKey: ['/api/progress', user?.id],
    queryFn: async () => {
      if (!user) return [];
      return await getUserProgress(user.id);
    },
    enabled: !!user,
  });
  
  // Default structured weekly data
  const defaultWeeklyData = [
    { day: 'Mon', count: 0 },
    { day: 'Tue', count: 0 },
    { day: 'Wed', count: 0 },
    { day: 'Thu', count: 0 },
    { day: 'Fri', count: 0 },
    { day: 'Sat', count: 0 },
    { day: 'Sun', count: 0 },
  ];
  
  // Return structured data
  return {
    streak: streakData?.streak || 0,
    totalCompleted: streakData?.total_completed || 0,
    weeklyPerformance: weeklyData || defaultWeeklyData,
    progressData: progressData || [],
    isLoading: isStreakLoading || isWeeklyLoading || isProgressLoading,
  };
}
