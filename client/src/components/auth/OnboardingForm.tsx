import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth'; // Updated to use the correct auth hook

const onboardingSchema = z.object({
  goal: z.string().min(10, { message: 'Please enter a meaningful goal' }),
  targetDate: z.string().regex(/^\d{4}-\d{2}$/, { message: 'Please enter a valid month and year (YYYY-MM)' }),
  targetAmount: z.string().regex(/^\d+$/, { message: 'Please enter a valid number' }),
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

export function OnboardingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // If user is already onboarded (has existing data), redirect immediately
  // This prevents the onboarding loop
  useEffect(() => {
    if (user && window.location.pathname !== '/') {
      console.log("User already has data, redirecting to dashboard...");
      window.location.href = '/';
    }
  }, [user]);
  
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
    
    setIsSubmitting(true);
    try {
      // Create the project using the API
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.goal,
          description: `Target: $${parseInt(data.targetAmount).toLocaleString()} by ${data.targetDate}`,
          status: 'active',
          end_date: new Date(`${data.targetDate}-01`).toISOString(),
          user_id: user.id,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Project creation error:', errorData);
        throw new Error(`Failed to create project: ${JSON.stringify(errorData)}`);
      }
      
      // Update user as onboarded
      const userResponse = await fetch('/api/user/onboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        console.error('Onboarding error:', errorData);
        throw new Error(`Failed to update onboarding status: ${JSON.stringify(errorData)}`);
      }
      
      toast({
        title: "Onboarding complete!",
        description: "Your journey to becoming a billionaire begins now.",
      });
      
      console.log("Onboarding successful, redirecting to dashboard...");
      
      // Display a visible message for the user
      const successElement = document.createElement('div');
      successElement.innerHTML = '<div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); display: flex; justify-content: center; align-items: center; z-index: 9999;"><div style="background: white; padding: 2rem; border-radius: 0.5rem; text-align: center;"><h2 style="margin-bottom: 1rem; color: #10b981;">Onboarding Complete!</h2><p style="margin-bottom: 1rem;">Your journey begins now. Redirecting to dashboard...</p><div style="height: 4px; width: 100%; background: #e5e7eb; overflow: hidden;"><div style="height: 100%; width: 0; background: #10b981; animation: progress 1.5s linear forwards;"></div></div></div></div><style>@keyframes progress { 0% { width: 0; } 100% { width: 100%; }}</style>';
      document.body.appendChild(successElement);
      
      // Add a short delay before redirecting to ensure toast is seen
      setTimeout(() => {
        // Force a full page reload to the dashboard to clear any stale state
        window.location.replace("/");
      }, 2000);
      
    } catch (error) {
      console.error("Onboarding error:", error);
      
      toast({
        title: "Onboarding failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      
      // Enable form again after error
      setIsSubmitting(false);
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
              <Button type="submit" disabled={isSubmitting} className="w-full glow-effect">
                {isSubmitting ? (
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
