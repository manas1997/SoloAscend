import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { getProjects, createProject as createProjectApi } from '@/lib/supabase';
import type { Project, InsertProject } from '@shared/schema';
import { useMemo } from 'react';

export function useProjects() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  // Fetch projects
  const { data: projects = [], isLoading, refetch: refetchProjects } = useQuery({
    queryKey: ['/api/projects', user?.id],
    queryFn: async () => {
      if (!user) return [];
      return await getProjects(user.id);
    },
    enabled: !!user,
  });
  
  // Create project
  const { mutateAsync: createProject } = useMutation({
    mutationFn: async (project: Omit<Project, 'id'>) => {
      return await createProjectApi(project);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', user?.id] });
    },
  });
  
  // Extract the main project (billionaire goal)
  const mainProject = useMemo(() => {
    if (!projects || projects.length === 0) return null;
    
    // Look for a project with "billionaire" in the name or description
    const billionaireProject = projects.find(project => 
      project.name.toLowerCase().includes('billionaire') || 
      (project.description && project.description.toLowerCase().includes('billionaire'))
    );
    
    // If not found, return the first project
    return billionaireProject || projects[0];
  }, [projects]);
  
  // Filter active projects (excluding main project)
  const activeProjects = useMemo(() => {
    if (!projects || projects.length === 0) return [];
    if (!mainProject) return projects.filter(project => project.status === 'active');
    
    return projects.filter(project => 
      project.id !== mainProject.id && 
      (project.status === 'active' || project.status === 'planning')
    );
  }, [projects, mainProject]);
  
  return {
    projects,
    isLoading,
    createProject,
    refetchProjects,
    mainProject,
    activeProjects,
  };
}
