import { createClient } from '@supabase/supabase-js';
import type { User, Mission, Project, Quote, UserSettings } from '@shared/schema';

// Get Supabase URL and Anon Key from environment variables
// For this application, we're using a in-memory mock for Supabase
// So these values don't need to be real
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mock-supabase-url.com';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-anon-key';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  }
});

// Auth functions
export async function signUp(email: string, password: string, username: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
    },
  });
  
  if (error) throw error;
  
  // Create user profile in database
  if (data.user) {
    await supabase.from('users').insert({
      id: data.user.id,
      email: data.user.email,
      username,
    });
  }
  
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
  
  return data.user;
}

// Mission functions
export async function getMissions(userId: string) {
  const { data, error } = await supabase
    .from('missions')
    .select('*, projects(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as (Mission & { projects: Project | null })[];
}

export async function createMission(mission: Omit<Mission, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('missions')
    .insert(mission)
    .select()
    .single();
  
  if (error) throw error;
  return data as Mission;
}

export async function updateMissionStatus(progressData: {
  user_id: string;
  mission_id: number;
  status: string;
  mood?: string;
  energy_level?: number;
}) {
  const { data, error } = await supabase
    .from('progress')
    .insert(progressData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Project functions
export async function getProjects(userId: string) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('start_date', { ascending: false });
  
  if (error) throw error;
  return data as Project[];
}

export async function createProject(project: Omit<Project, 'id'>) {
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single();
  
  if (error) throw error;
  return data as Project;
}

// Quote functions
export async function getRandomQuote() {
  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .order('id', { ascending: false })
    .limit(10);
  
  if (error) throw error;
  
  // Get a random quote from the results
  const randomIndex = Math.floor(Math.random() * data.length);
  return data[randomIndex] as Quote;
}

// User settings functions
export async function getUserSettings(userId: string) {
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
    throw error;
  }
  
  // If no settings found, create default settings
  if (!data) {
    const defaultSettings = {
      user_id: userId,
      quote_frequency: 'daily',
      voice_volume: 80,
      preferred_focus_hours: '9-17',
      theme: 'dark',
    };
    
    const { data: newData, error: insertError } = await supabase
      .from('user_settings')
      .insert(defaultSettings)
      .select()
      .single();
    
    if (insertError) throw insertError;
    return newData;
  }
  
  return data;
}

export async function updateUserSettings(userId: string, settings: Partial<UserSettings>) {
  const { data, error } = await supabase
    .from('user_settings')
    .update(settings)
    .eq('user_id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Progress functions
export async function getUserProgress(userId: string) {
  const { data, error } = await supabase
    .from('progress')
    .select('*, missions(*)')
    .eq('user_id', userId)
    .order('date', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function getStreakData(userId: string) {
  const { data, error } = await supabase.rpc('get_user_streak', { 
    user_id_param: userId 
  });
  
  if (error) throw error;
  return data as { streak: number, total_completed: number };
}

export async function getWeeklyPerformance(userId: string) {
  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);
  
  const { data, error } = await supabase
    .from('progress')
    .select('date, status')
    .eq('user_id', userId)
    .eq('status', 'completed')
    .gte('date', sevenDaysAgo.toISOString())
    .lte('date', now.toISOString());
  
  if (error) throw error;
  
  // Process data to get daily counts
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dailyCounts = Array(7).fill(0);
  
  data.forEach(item => {
    const date = new Date(item.date);
    const dayIndex = date.getDay();
    dailyCounts[dayIndex]++;
  });
  
  // Reorder to start from Monday
  const mondayFirst = [...dailyCounts.slice(1), dailyCounts[0]];
  
  return weekDays.map((day, index) => ({
    day,
    count: mondayFirst[index]
  }));
}
