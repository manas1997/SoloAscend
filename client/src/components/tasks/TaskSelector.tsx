import { useState } from 'react';
import { useUserTasks } from '@/hooks/useUserTasks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Trash2, Plus, X, GripVertical, RotateCcw } from 'lucide-react';
import { TaskType, UserTask } from '@shared/schema';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export function TaskSelector() {
  const {
    taskTypes,
    userTasks,
    isLoading,
    addTask,
    updatePriority,
    deleteTask,
    clearTasks,
    isAddingTask,
    isUpdatingPriority,
    isDeletingTask,
    isClearingTasks
  } = useUserTasks();

  const [selectedTaskName, setSelectedTaskName] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  // Filter task types based on search query
  const filteredTaskTypes = taskTypes.filter(task => 
    task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (task.category && task.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Group task types by category
  const groupedTaskTypes = filteredTaskTypes.reduce((groups, task) => {
    const category = task.category || 'Other';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(task);
    return groups;
  }, {} as Record<string, TaskType[]>);

  const handleAddTask = () => {
    if (!selectedTaskName) return;
    
    addTask({ 
      task_name: selectedTaskName,
      priority: userTasks.length + 1 
    });
    
    setSelectedTaskName('');
  };

  const handleDragStart = (index: number) => {
    setDraggingIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggingIndex === null || draggingIndex === index) return;
    
    // Get the tasks to reorder
    const taskToMove = userTasks[draggingIndex];
    const targetTask = userTasks[index];
    
    // Update priorities
    updatePriority({ id: taskToMove.id, priority: targetTask.priority });
    updatePriority({ id: targetTask.id, priority: taskToMove.priority });
    
    // Update dragging index
    setDraggingIndex(index);
  };

  const handleDragEnd = () => {
    setDraggingIndex(null);
  };

  const getTaskCategoryColor = (category?: string | null) => {
    if (!category) return 'bg-slate-600 dark:bg-slate-700';
    
    const categoryColors: Record<string, string> = {
      'Health': 'bg-green-600 dark:bg-green-700',
      'Wellness': 'bg-blue-600 dark:bg-blue-700',
      'Professional': 'bg-purple-600 dark:bg-purple-700',
      'Personal': 'bg-amber-600 dark:bg-amber-700',
      'Education': 'bg-indigo-600 dark:bg-indigo-700'
    };
    
    return categoryColors[category] || 'bg-slate-600 dark:bg-slate-700';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const canAddTask = userTasks.length < 5 && selectedTaskName !== '';

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Selected Tasks Card */}
      <Card className="md:order-1 order-2">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Your Daily Top 5 Tasks</span>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={userTasks.length === 0 || isClearingTasks}
                >
                  {isClearingTasks ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  ) : (
                    <RotateCcw className="h-4 w-4 mr-1" />
                  )}
                  Reset
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear All Tasks?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove all your selected tasks for today. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => clearTasks()}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardTitle>
          <CardDescription>
            Drag to reorder tasks based on your priorities. You can select up to 5 tasks per day.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <div className="mb-3 rounded-full bg-muted p-3">
                <Plus className="h-6 w-6" />
              </div>
              <p>No tasks selected yet</p>
              <p className="text-sm">Select tasks from the list on the right</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Task</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userTasks
                    .sort((a, b) => a.priority - b.priority)
                    .map((task, index) => (
                      <TableRow 
                        key={task.id}
                        className={cn(
                          "transition-colors cursor-move",
                          draggingIndex === index && "bg-accent"
                        )}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnd={handleDragEnd}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <GripVertical size={16} className="mr-2 text-muted-foreground" />
                            {task.priority}
                          </div>
                        </TableCell>
                        <TableCell>{task.task_name}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteTask(task.id)}
                            disabled={isDeletingTask}
                          >
                            {isDeletingTask ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          {userTasks.length === 5 ? (
            <div className="w-full text-center text-amber-500 font-medium">
              You've reached your 5 task limit for today
            </div>
          ) : (
            <div className="w-full text-center">
              {userTasks.length === 0 
                ? "Start by adding your first task" 
                : `${5 - userTasks.length} more ${5 - userTasks.length === 1 ? 'task' : 'tasks'} available`}
            </div>
          )}
        </CardFooter>
      </Card>

      {/* Task Selection Card */}
      <Card className="md:order-2 order-1">
        <CardHeader>
          <CardTitle>Choose Your Tasks</CardTitle>
          <CardDescription>
            Select from our collection of tasks or create your own
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              {searchQuery && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <ScrollArea className="h-[300px]">
              <div className="space-y-6">
                {Object.keys(groupedTaskTypes).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No tasks found
                  </div>
                ) : (
                  Object.entries(groupedTaskTypes).map(([category, tasks]) => (
                    <div key={category} className="space-y-2">
                      <h3 className="text-sm font-medium text-foreground">{category}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {tasks.map((task) => (
                          <Button
                            key={task.id}
                            variant="outline"
                            className="justify-start h-auto py-2 px-3"
                            onClick={() => setSelectedTaskName(task.name)}
                          >
                            <span className="mr-2">
                              <span 
                                className={cn(
                                  "inline-block w-2 h-2 rounded-full",
                                  getTaskCategoryColor(task.category)
                                )}
                              />
                            </span>
                            <span className="text-left">{task.name}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            <div className="flex items-center space-x-2">
              <Input
                placeholder="Custom task name..."
                value={selectedTaskName}
                onChange={(e) => setSelectedTaskName(e.target.value)}
              />
              <Button
                onClick={handleAddTask}
                disabled={!canAddTask || isAddingTask}
              >
                {isAddingTask ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}