import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Zap, X, Award, Clock } from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti"; // TypeScript definition in client/src/types/canvas-confetti.d.ts

interface MotivationMeteorProps {
  onComplete?: () => void;
}

// Anime motivational quote list
const quotes = [
  {
    text: "If you don't like your destiny, don't accept it. Instead, have the courage to change it the way you want it to be.",
    author: "Naruto Uzumaki (Naruto)"
  },
  {
    text: "The only ones who should kill are those who are prepared to be killed.",
    author: "Lelouch (Code Geass)"
  },
  {
    text: "If you don't take risks, you can't create a future.",
    author: "Monkey D. Luffy (One Piece)"
  },
  {
    text: "It's not always possible to do what we want to do, but it's important to believe in something before you actually do it.",
    author: "Might Guy (Naruto)"
  },
  {
    text: "I'll leave tomorrow's problems to tomorrow's me.",
    author: "Saitama (One Punch Man)"
  },
  {
    text: "If you can't do something, then don't. Focus on what you can do.",
    author: "Shiroe (Log Horizon)"
  },
  {
    text: "A person grows when they are able to overcome hardships. Protection is important, but there are some things that people must learn on their own.",
    author: "Jiraiya (Naruto)"
  },
  {
    text: "The moment you think of giving up, think of the reason why you held on so long.",
    author: "Natsu Dragneel (Fairy Tail)"
  },
  {
    text: "Power isn't determined by your size, but by the size of your heart and dreams!",
    author: "Monkey D. Luffy (One Piece)"
  },
  {
    text: "Whatever you lose, you'll find it again. But what you throw away you'll never get back.",
    author: "Kenshin Himura (Rurouni Kenshin)"
  },
  {
    text: "The only thing we're allowed to do is to believe that we won't regret the choice we made.",
    author: "Levi Ackerman (Attack on Titan)"
  },
  {
    text: "Giving up kills people. When people reject giving up... they finally win the right to transcend humanity.",
    author: "Aiz Wallenstein (DanMachi)"
  },
  {
    text: "I don't want to conquer anything. I just think that the guy with the most freedom in this whole ocean... that's the Pirate King!",
    author: "Monkey D. Luffy (One Piece)"
  },
  {
    text: "If you don't share someone's pain, you can never understand them.",
    author: "Nagato (Naruto)"
  },
  {
    text: "Sometimes I do feel like I'm a failure. Like there's no hope for me. But even so, I'm not gonna give up. Ever!",
    author: "Izuku Midoriya (My Hero Academia)"
  },
  {
    text: "A king without greed is no king at all.",
    author: "Gilgamesh (Fate/Zero)"
  },
  {
    text: "Become stronger than anyone else, then everyone will be safe from any kind of danger.",
    author: "Sung Jin-Woo (Solo Leveling)"
  },
  {
    text: "I'll never give up... even if I die.",
    author: "Natsu Dragneel (Fairy Tail)"
  },
  {
    text: "Nobody knows what the future holds. That's why its potential is infinite.",
    author: "Rintarou Okabe (Steins;Gate)"
  },
  {
    text: "It's not the face that makes someone a monster, it's the choices they make with their lives.",
    author: "Naruto Uzumaki (Naruto)"
  },
  {
    text: "If you're hungry, eat. Sleep when you're sleepy. And when you see the enemy, defeat them.",
    author: "Yami Sukehiro (Black Clover)"
  },
  {
    text: "I'll devour whatever stands in my way, even if it's a god.",
    author: "Asta (Black Clover)"
  },
  {
    text: "A goal is not always meant to be reached, it often serves simply as something to aim at.",
    author: "Son Goku (Dragon Ball)"
  },
  {
    text: "I'm going to surpass my limits right here and now!",
    author: "Asta (Black Clover)"
  },
  {
    text: "More than scoring and winning, I want to make each and every play shine.",
    author: "Isagi Yoichi (Blue Lock)"
  }
];

// Micro-challenge list
const challenges = [
  {
    title: "Power Minute",
    description: "Do 20 push-ups, sit-ups, or jumping jacks right now.",
    duration: "1 minute",
    icon: <Zap className="h-8 w-8 text-primary" />
  },
  {
    title: "Deep Focus",
    description: "Close all social media tabs and focus on your most important task for 5 minutes.",
    duration: "5 minutes",
    icon: <Clock className="h-8 w-8 text-primary" />
  },
  {
    title: "Gratitude Moment",
    description: "Write down three things you're grateful for right now.",
    duration: "2 minutes",
    icon: <Award className="h-8 w-8 text-primary" />
  },
  {
    title: "Mind Cleanse",
    description: "Take 10 deep breaths, focusing only on your breathing.",
    duration: "1 minute",
    icon: <Zap className="h-8 w-8 text-primary" />
  },
  {
    title: "Idea Sprint",
    description: "Brainstorm 5 solutions to a problem you're currently facing.",
    duration: "3 minutes",
    icon: <Award className="h-8 w-8 text-primary" />
  },
  {
    title: "Clarity Break",
    description: "Stand up, stretch, and drink a glass of water.",
    duration: "2 minutes",
    icon: <Clock className="h-8 w-8 text-primary" />
  },
  {
    title: "Next Action",
    description: "Identify the very next physical action needed to move your most important project forward.",
    duration: "3 minutes",
    icon: <Zap className="h-8 w-8 text-primary" />
  },
  {
    title: "Declutter Sprint",
    description: "Clear all visible clutter from your workspace in the next 2 minutes.",
    duration: "2 minutes",
    icon: <Clock className="h-8 w-8 text-primary" />
  },
  {
    title: "Visualization",
    description: "Close your eyes and visualize yourself successfully completing your current goal.",
    duration: "2 minutes",
    icon: <Award className="h-8 w-8 text-primary" />
  },
  {
    title: "Text Encouragement",
    description: "Send a quick encouraging message to someone in your life who might need it.",
    duration: "1 minute",
    icon: <Zap className="h-8 w-8 text-primary" />
  }
];

export function MotivationMeteor({ onComplete }: MotivationMeteorProps) {
  const [open, setOpen] = useState(false);
  const [currentMode, setCurrentMode] = useState<"quote" | "challenge">("quote");
  const [isChallengeComplete, setIsChallengeComplete] = useState(false);
  const [quote, setQuote] = useState(quotes[0]);
  const [challenge, setChallenge] = useState(challenges[0]);
  const [timerValue, setTimerValue] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Function to get a random item from an array
  const getRandomItem = <T extends unknown>(array: T[]): T => {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  };

  // Show the motivation meteor
  const showMeteor = () => {
    // Randomly select quote and challenge
    setQuote(getRandomItem(quotes));
    setChallenge(getRandomItem(challenges));
    
    // Reset states
    setCurrentMode("quote");
    setIsChallengeComplete(false);
    setTimerValue(0);
    setIsTimerRunning(false);
    
    // Show dialog
    setOpen(true);
  };

  // Handle timer for challenges
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerRunning && timerValue > 0) {
      interval = setInterval(() => {
        setTimerValue((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            setIsChallengeComplete(true);
            // Launch confetti
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isTimerRunning, timerValue]);

  // Start challenge timer
  const startChallenge = () => {
    const durationString = challenge.duration.split(" ")[0];
    const durationMinutes = parseInt(durationString, 10);
    setTimerValue(durationMinutes * 60); // Convert to seconds
    setIsTimerRunning(true);
  };

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Complete the meteor interaction
  const handleCompletion = () => {
    setOpen(false);
    if (onComplete) onComplete();
  };

  return (
    <>
      <Button onClick={showMeteor} className="w-full">
        <Zap className="mr-2 h-4 w-4" />
        Motivation Meteorite
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          {currentMode === "quote" ? (
            // Quote view
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-primary" />
                  Motivation Meteorite
                </DialogTitle>
                <DialogDescription>
                  A burst of inspiration to keep you going
                </DialogDescription>
              </DialogHeader>
              
              <div className="p-6 my-4 bg-muted/40 rounded-lg border border-border">
                <blockquote className="text-lg italic">
                  "{quote.text}"
                </blockquote>
                <p className="mt-2 text-sm text-muted-foreground text-right">
                  — {quote.author}
                </p>
              </div>
              
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={handleCompletion}
                  className="sm:flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Close
                </Button>
                <Button
                  onClick={() => setCurrentMode("challenge")}
                  className="sm:flex-1"
                >
                  <Award className="h-4 w-4 mr-2" />
                  Try a Micro-Challenge
                </Button>
              </DialogFooter>
            </motion.div>
          ) : (
            // Challenge view
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-primary" />
                  {challenge.title}
                </DialogTitle>
                <DialogDescription>
                  {challenge.duration} micro-challenge
                </DialogDescription>
              </DialogHeader>
              
              <div className="p-6 my-4 bg-muted/40 rounded-lg border border-border">
                <div className="flex flex-col items-center mb-4">
                  {challenge.icon}
                </div>
                <p className="text-center mb-4">
                  {challenge.description}
                </p>
                
                {!isTimerRunning && !isChallengeComplete ? (
                  <Button
                    onClick={startChallenge}
                    className="w-full"
                  >
                    Start Challenge
                  </Button>
                ) : (
                  <div className="text-center">
                    {isTimerRunning ? (
                      <div className="font-mono text-2xl font-bold">
                        {formatTime(timerValue)}
                      </div>
                    ) : (
                      <div className="font-bold text-primary text-lg">
                        Challenge Completed!
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentMode("quote")}
                  disabled={isTimerRunning}
                  className="sm:flex-1"
                >
                  Back to Quote
                </Button>
                <Button
                  onClick={handleCompletion}
                  disabled={isTimerRunning && !isChallengeComplete}
                  className="sm:flex-1"
                >
                  {isChallengeComplete ? "Complete" : "Skip Challenge"}
                </Button>
              </DialogFooter>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}