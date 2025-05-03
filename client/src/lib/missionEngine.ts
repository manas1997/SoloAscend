import type { Mission } from '@shared/schema';
import { supabase } from './supabase';

type MissionGeneratorParams = {
  userId: string;
  energy: number; // 1-5
  mood: 'focused' | 'motivated' | 'drained';
  timeAvailable: number; // minutes
};

export async function generateMissions({ 
  userId, 
  energy, 
  mood, 
  timeAvailable 
}: MissionGeneratorParams): Promise<Mission[]> {
  // Define difficulty level based on energy and mood
  let difficultyLevel: string;
  
  if (energy >= 4 && (mood === 'focused' || mood === 'motivated')) {
    difficultyLevel = 'Hard';
  } else if ((energy >= 3 && mood === 'motivated') || (energy >= 3 && mood === 'focused')) {
    difficultyLevel = 'Medium';
  } else {
    difficultyLevel = 'Easy';
  }
  
  // Query missions based on parameters
  let query = supabase
    .from('missions')
    .select('*')
    .lte('time_required', timeAvailable)
    .eq('user_id', userId);
  
  // Add difficulty filter if energy level is not "drained"
  if (mood !== 'drained') {
    query = query.eq('difficulty', difficultyLevel);
  }
  
  // Limit and order
  query = query.limit(3).order('created_at', { ascending: false });
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error generating missions:', error);
    throw error;
  }
  
  // If no suitable missions are found, get fallback missions
  if (!data || data.length === 0) {
    return getFallbackMissions(userId, timeAvailable);
  }
  
  return data as Mission[];
}

async function getFallbackMissions(userId: string, timeAvailable: number): Promise<Mission[]> {
  // Get any missions that fit within the time constraint
  const { data, error } = await supabase
    .from('missions')
    .select('*')
    .lte('time_required', timeAvailable)
    .eq('user_id', userId)
    .limit(3)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching fallback missions:', error);
    throw error;
  }
  
  // If still no missions, return a placeholder "create new missions" task
  if (!data || data.length === 0) {
    const placeholder: Mission = {
      id: -1,
      title: "Create your first mission",
      description: "Get started by creating your first mission task",
      category: "System",
      difficulty: "Easy",
      time_required: 10,
      project_id: null,
      created_at: new Date().toISOString(),
      user_id: userId
    };
    
    return [placeholder];
  }
  
  return data as Mission[];
}

export function evaluateMissionsProgress(completedMissions: number, totalMissions: number): string {
  const ratio = completedMissions / (totalMissions || 1);
  
  if (ratio >= 0.9) {
    return "You're a true S-rank hunter! Exceptional progress.";
  } else if (ratio >= 0.7) {
    return "A-rank hunter material. Solid work, keep improving.";
  } else if (ratio >= 0.5) {
    return "B-rank hunter. Making good progress, but more awaits.";
  } else if (ratio >= 0.3) {
    return "C-rank hunter. Keep pushing your limits.";
  } else {
    return "E-rank hunter. Your journey is just beginning.";
  }
}

export function calculateGoalProgress(current: number, target: number): number {
  return Math.min(100, Math.round((current / target) * 100));
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case 'hard':
      return 'bg-primary bg-opacity-10 border-primary-light text-primary-light';
    case 'medium':
      return 'bg-secondary bg-opacity-10 border-secondary text-secondary';
    case 'easy':
    default:
      return 'bg-gray-700 bg-opacity-50 border-gray-600 text-gray-300';
  }
}
