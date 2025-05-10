import React, { useState, useEffect } from 'react';
import { useQuotes } from '@/hooks/useQuotes';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { X, Sparkles, ZapIcon } from 'lucide-react';

// MicroChallenge interface
interface MicroChallenge {
  id: number;
  challenge: string;
  timeRequired: string;
  category: string;
}

// Collection of micro-challenges
const microChallenges: MicroChallenge[] = [
  {
    id: 1,
    challenge: "Take 3 deep breaths and focus on your main goal for today",
    timeRequired: "1 minute",
    category: "mindfulness"
  },
  {
    id: 2,
    challenge: "Write down 3 things you're grateful for right now",
    timeRequired: "2 minutes",
    category: "gratitude"
  },
  {
    id: 3,
    challenge: "Stand up and do 10 quick stretches to energize your body",
    timeRequired: "1 minute",
    category: "physical"
  },
  {
    id: 4,
    challenge: "Drink a full glass of water to rehydrate",
    timeRequired: "30 seconds",
    category: "health"
  },
  {
    id: 5,
    challenge: "Clear your workspace of distractions",
    timeRequired: "2 minutes",
    category: "productivity"
  },
  {
    id: 6,
    challenge: "Write down your most important task for the next hour",
    timeRequired: "1 minute",
    category: "focus"
  },
  {
    id: 7,
    challenge: "Text someone important to you a positive message",
    timeRequired: "2 minutes",
    category: "connection"
  },
  {
    id: 8,
    challenge: "Close your eyes and visualize achieving your biggest goal",
    timeRequired: "1 minute",
    category: "visualization"
  },
  {
    id: 9,
    challenge: "Do 20 jumping jacks to get your blood flowing",
    timeRequired: "1 minute",
    category: "energy"
  },
  {
    id: 10,
    challenge: "Listen to your favorite motivational song",
    timeRequired: "3 minutes",
    category: "motivation"
  }
];

export function MotivationMeteor() {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: '-100px', left: '50%' });
  const [isQuote, setIsQuote] = useState(true);
  const [microChallenge, setMicroChallenge] = useState<MicroChallenge | null>(null);
  const { quote, refreshQuote } = useQuotes();
  const { toast } = useToast();
  const [hasShownRecently, setHasShownRecently] = useState(false);

  // Randomly choose between showing a quote or micro-challenge
  const chooseRandomContent = () => {
    // 50% chance for quote, 50% for micro-challenge
    const showQuote = Math.random() > 0.5;
    setIsQuote(showQuote);
    
    if (!showQuote) {
      // Choose a random micro-challenge
      const randomIndex = Math.floor(Math.random() * microChallenges.length);
      setMicroChallenge(microChallenges[randomIndex]);
    }
  };

  // Trigger a meteor to appear at random position
  const triggerMeteor = () => {
    if (hasShownRecently) return;
    
    // Get a random position (biased towards the right side)
    const randomLeft = Math.floor(Math.random() * 60) + 20; // 20% to 80% of screen width
    
    // Set the initial position above the viewport
    setPosition({ top: '-100px', left: `${randomLeft}%` });
    
    // Choose what to show
    chooseRandomContent();
    
    // Make it visible
    setVisible(true);
    
    // Set cooldown to prevent too frequent meteors
    setHasShownRecently(true);
    setTimeout(() => setHasShownRecently(false), 5 * 60 * 1000); // 5 minute cooldown
    
    // Set a timer to automatically hide it
    setTimeout(() => {
      setVisible(false);
    }, 20000); // Hide after 20 seconds
  };

  // Handle accepting the challenge
  const acceptChallenge = () => {
    if (microChallenge) {
      toast({
        title: "Challenge Accepted!",
        description: `You've accepted the ${microChallenge.timeRequired} challenge. Good luck!`,
      });
    }
    setVisible(false);
  };

  // Periodically check if we should show a meteor
  useEffect(() => {
    // Initially wait 2 minutes before the first possibility
    const initialTimeout = setTimeout(() => {
      // Then set up intervals to randomly check if we should show a meteor
      const intervalId = setInterval(() => {
        // 15% chance to show a meteor each check
        if (Math.random() < 0.15) {
          triggerMeteor();
        }
      }, 4 * 60 * 1000); // Check every 4 minutes
      
      return () => clearInterval(intervalId);
    }, 2 * 60 * 1000);
    
    return () => clearTimeout(initialTimeout);
  }, []);

  // Debug function to force trigger meteor (for testing)
  const forceTrigger = () => {
    triggerMeteor();
  };

  if (!visible) {
    // Only show the debug button in development
    if (process.env.NODE_ENV === 'development') {
      return (
        <Button 
          onClick={forceTrigger} 
          className="fixed bottom-4 right-4 z-50 opacity-30 hover:opacity-100"
          size="sm"
          variant="outline"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Test Meteor
        </Button>
      );
    }
    return null;
  }

  return (
    <div 
      className="fixed z-50 transition-all duration-1000 ease-in-out transform"
      style={{ 
        top: visible ? '15%' : position.top, 
        left: position.left,
        translate: '-50% 0'
      }}
    >
      <div className="relative">
        {/* Meteor animation */}
        <div className="absolute inset-0 animate-meteor-glow rounded-full bg-primary/20 -z-10"></div>
        
        {/* Meteor content */}
        <div className="bg-card border shadow-lg rounded-lg p-4 max-w-md">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg flex items-center">
              <Sparkles className="h-5 w-5 text-primary mr-2" />
              {isQuote ? "Motivation Meteor" : "Micro-Challenge"}
            </h3>
            <Button variant="ghost" size="icon" onClick={() => setVisible(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="py-2">
            {isQuote ? (
              <>
                <blockquote className="italic text-muted-foreground mb-2">
                  "{quote?.text || "The secret of getting ahead is getting started."}"
                </blockquote>
                {quote?.character && (
                  <p className="text-sm font-medium">- {quote.character}</p>
                )}
              </>
            ) : (
              <>
                <div className="text-foreground mb-3">
                  {microChallenge?.challenge}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <div className="bg-primary/10 text-primary px-2 py-1 rounded mr-2">
                    {microChallenge?.timeRequired}
                  </div>
                  <div>{microChallenge?.category}</div>
                </div>
              </>
            )}
          </div>
          
          <div className="mt-3 flex justify-end">
            {isQuote ? (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setVisible(false)}
              >
                Dismiss
              </Button>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setVisible(false)}
                  className="mr-2"
                >
                  Not Now
                </Button>
                <Button 
                  size="sm" 
                  onClick={acceptChallenge}
                  className="bg-primary hover:bg-primary/90"
                >
                  <ZapIcon className="h-4 w-4 mr-2" />
                  Accept Challenge
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}