import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

const onboardingSchema = z.object({
  goal: z.string().min(10, { message: 'Please enter a meaningful goal' }),
  targetDate: z.string().regex(/^\d{4}-\d{2}$/, { message: 'Please enter a valid month and year (YYYY-MM)' }),
  targetAmount: z.string().regex(/^\d+$/, { message: 'Please enter a valid number' }),
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

export function OnboardingForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, updateUserProfile } = useAuth();
  
  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      goal: 'Become a billionaire',
      targetDate: '2025-12',
      targetAmount: '1000000000',
    },
  });
  
  async function onSubmit(data: OnboardingFormValues) {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Create the main project for the goal
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
          name: data.goal,
          description: `Target: $${parseInt(data.targetAmount).toLocaleString()} by ${data.targetDate}`,
          status: 'active',
          end_date: new Date(`${data.targetDate}-01`).toISOString(),
          user_id: user.id,
        })
        .select()
        .single();
      
      if (projectError) throw projectError;
      
      // Update user as onboarded
      await supabase
        .from('users')
        .update({ onboarded: true })
        .eq('id', user.id);
      
      // Update user context
      updateUserProfile({ ...user, onboarded: true });
      
      toast({
        title: "Onboarding complete!",
        description: "Your journey to becoming a billionaire begins now.",
      });
    } catch (error) {
      toast({
        title: "Onboarding failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg">
      <CardHeader>
        <CardTitle>Welcome to SoloAscend</CardTitle>
        <CardDescription>
          Let's set up your journey to become a billionaire by the end of 2025
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="goal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Main Goal</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Become a billionaire by creating tech startups" {...field} />
                  </FormControl>
                  <FormDescription>This will be your primary objective</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="targetAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Amount ($)</FormLabel>
                    <FormControl>
                      <Input placeholder="1000000000" {...field} />
                    </FormControl>
                    <FormDescription>Your financial goal</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="targetDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Date</FormLabel>
                    <FormControl>
                      <Input placeholder="2025-12" {...field} />
                    </FormControl>
                    <FormDescription>Format: YYYY-MM</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <CardFooter className="flex justify-end px-0 pt-4">
              <Button type="submit" disabled={isLoading} className="w-full glow-effect">
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                    <span className="ml-2">Setting up...</span>
                  </div>
                ) : (
                  'Begin Your Journey'
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
