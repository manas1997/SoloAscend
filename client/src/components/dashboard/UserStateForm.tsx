import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMissions } from '@/hooks/useMissions';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

type Mood = 'focused' | 'motivated' | 'drained';

export function UserStateForm() {
  const [energy, setEnergy] = useState<number>(3);
  const [mood, setMood] = useState<Mood>('motivated');
  const [timeAvailable, setTimeAvailable] = useState<number>(60);
  const [isLoading, setIsLoading] = useState(false);
  const { generateMissions } = useMissions();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const getEnergyLabel = (level: number): string => {
    switch (level) {
      case 1: return 'Very Low';
      case 2: return 'Low';
      case 3: return 'Medium';
      case 4: return 'High';
      case 5: return 'Very High';
      default: return 'Medium';
    }
  };
  
  const handleMoodSelect = (selectedMood: Mood) => {
    setMood(selectedMood);
  };
  
  const handleTimeChange = (value: string) => {
    setTimeAvailable(parseInt(value));
  };
  
  const handleGenerateMissions = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await generateMissions({
        userId: user.id,
        energy,
        mood,
        timeAvailable
      });
      
      toast({
        title: "Missions generated",
        description: "New missions have been created based on your current state.",
      });
    } catch (error) {
      toast({
        title: "Failed to generate missions",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-card-foreground">How are you feeling?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Energy Level */}
        <div>
          <Label className="block text-sm font-medium mb-2">Energy Level</Label>
          <div className="relative">
            <Slider
              value={[energy]}
              min={1}
              max={5}
              step={1}
              onValueChange={(values) => setEnergy(values[0])}
              className="mb-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
            </div>
            <div className="text-center mt-2">
              <span className="text-foreground text-sm font-medium">{getEnergyLabel(energy)} ({energy})</span>
            </div>
          </div>
        </div>
        
        {/* Mood Selection */}
        <div>
          <Label className="block text-sm font-medium mb-2">Current Mood</Label>
          <div className="grid grid-cols-3 gap-2">
            <Button
              type="button"
              variant="outline"
              className={`flex flex-col items-center justify-center py-3 transition-colors ${
                mood === 'focused' ? 'bg-primary bg-opacity-10 border-primary' : ''
              }`}
              onClick={() => handleMoodSelect('focused')}
            >
              <span className="text-xl mb-1">🧠</span>
              <span className="text-xs font-medium">Focused</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              className={`flex flex-col items-center justify-center py-3 transition-colors ${
                mood === 'motivated' ? 'bg-primary bg-opacity-10 border-primary' : ''
              }`}
              onClick={() => handleMoodSelect('motivated')}
            >
              <span className="text-xl mb-1">🔥</span>
              <span className="text-xs font-medium">Motivated</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              className={`flex flex-col items-center justify-center py-3 transition-colors ${
                mood === 'drained' ? 'bg-primary bg-opacity-10 border-primary' : ''
              }`}
              onClick={() => handleMoodSelect('drained')}
            >
              <span className="text-xl mb-1">😴</span>
              <span className="text-xs font-medium">Drained</span>
            </Button>
          </div>
        </div>
        
        {/* Time Available */}
        <div>
          <Label className="block text-sm font-medium mb-2">Time Available</Label>
          <Select defaultValue={timeAvailable.toString()} onValueChange={handleTimeChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select time available" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 minutes</SelectItem>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="60">1 hour</SelectItem>
              <SelectItem value="120">2 hours</SelectItem>
              <SelectItem value="240">4+ hours</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Generate Missions Button */}
        <Button
          className="w-full py-6 glow-effect"
          onClick={handleGenerateMissions}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generate Missions
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
