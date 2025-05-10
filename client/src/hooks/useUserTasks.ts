import { useQuery, useMutation } from "@tanstack/react-query";
import { TaskType, UserTask, InsertUserTask } from "@shared/schema";
import { queryClient, apiRequest } from "../lib/queryClient";
import { useToast } from "./use-toast";

export function useUserTasks() {
  const { toast } = useToast();

  // Fetch all task types
  const {
    data: taskTypes = [],
    isLoading: isLoadingTaskTypes,
    error: taskTypesError,
  } = useQuery<TaskType[]>({
    queryKey: ["/api/task-types"],
  });

  // Fetch user's daily tasks for today
  const {
    data: userTasks = [],
    isLoading: isLoadingUserTasks,
    error: userTasksError,
  } = useQuery<UserTask[]>({
    queryKey: ["/api/user-tasks"],
  });

  // Add a new task for today
  const addTaskMutation = useMutation({
    mutationFn: async (taskData: { task_name: string; priority?: number }) => {
      const res = await apiRequest("POST", "/api/user-tasks", taskData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-tasks"] });
      toast({
        title: "Task added",
        description: "Your daily task has been added successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add task",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update task priority
  const updatePriorityMutation = useMutation({
    mutationFn: async ({ id, priority }: { id: number; priority: number }) => {
      const res = await apiRequest(
        "PATCH",
        `/api/user-tasks/${id}/priority`,
        { priority }
      );
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-tasks"] });
      toast({
        title: "Priority updated",
        description: "Task priority has been updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update priority",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete a task
  const deleteTaskMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/user-tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-tasks"] });
      toast({
        title: "Task removed",
        description: "The task has been removed from your daily list.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to remove task",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Clear all tasks for today
  const clearTasksMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", "/api/user-tasks");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-tasks"] });
      toast({
        title: "Tasks cleared",
        description: "All your daily tasks have been cleared.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to clear tasks",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    taskTypes,
    userTasks,
    isLoading: isLoadingTaskTypes || isLoadingUserTasks,
    error: taskTypesError || userTasksError,
    addTask: addTaskMutation.mutate,
    updatePriority: updatePriorityMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    clearTasks: clearTasksMutation.mutate,
    isAddingTask: addTaskMutation.isPending,
    isUpdatingPriority: updatePriorityMutation.isPending,
    isDeletingTask: deleteTaskMutation.isPending,
    isClearingTasks: clearTasksMutation.isPending,
  };
}