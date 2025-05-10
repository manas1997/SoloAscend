import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimeReel } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Flame, 
  X, 
  VolumeX, 
  Volume2, 
  ChevronLeft, 
  ChevronRight,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AnimeSurgeProps {
  onComplete?: () => void;
}

const SAMPLE_REELS = [
  {
    id: 1,
    video_url: "https://assets.mixkit.co/videos/preview/mixkit-white-dog-sitting-on-the-wooden-floor-1547-large.mp4",
    thumbnail_url: "https://via.placeholder.com/300x200",
    quote: "The difference between the novice and the master is that the master has failed more times than the novice has even tried.",
    character: "Itachi Uchiha",
    source_account: "@anime_motivation",
    anime_source: "Naruto",
    date_added: new Date()
  },
  {
    id: 2,
    video_url: "https://assets.mixkit.co/videos/preview/mixkit-man-holding-neon-light-1238-large.mp4",
    thumbnail_url: "https://via.placeholder.com/300x200",
    quote: "The moment you think of giving up, think of the reason why you held on so long.",
    character: "Natsu Dragneel",
    source_account: "@anime_quotes",
    anime_source: "Fairy Tail",
    date_added: new Date()
  },
  {
    id: 3,
    video_url: "https://assets.mixkit.co/videos/preview/mixkit-close-up-view-of-a-turning-galaxy-view-inside-space-31764-large.mp4",
    thumbnail_url: "https://via.placeholder.com/300x200",
    quote: "I'll become stronger than anyone else, so everyone will be safe from any kind of danger.",
    character: "Sung Jin-Woo",
    source_account: "@solo_leveling_official",
    anime_source: "Solo Leveling",
    date_added: new Date()
  }
];

export function AnimeSurge({ onComplete }: AnimeSurgeProps) {
  const [open, setOpen] = useState(false);
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Fetch anime reels from the API
  const { data: reels, isLoading, error } = useQuery<AnimeReel[]>({
    queryKey: ["/api/anime-reels"],
    enabled: open, // Only fetch when dialog is opened
  });
  
  // Use sample data for now, replace with actual data when API is ready
  const availableReels: (AnimeReel | typeof SAMPLE_REELS[0])[] = (reels && reels.length > 0) ? reels : SAMPLE_REELS;
  // Ensure the index is valid and provide a default reel if needed
  const safeIndex = Math.min(currentReelIndex, availableReels.length - 1);
  const currentReel = availableReels[safeIndex] || SAMPLE_REELS[0];
  
  // Toggle mute state
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };
  
  // Navigate to previous reel
  const prevReel = () => {
    setCurrentReelIndex((prev) => 
      prev === 0 ? (availableReels.length || 1) - 1 : prev - 1
    );
  };
  
  // Navigate to next reel
  const nextReel = () => {
    const length = availableReels?.length || 1;
    setCurrentReelIndex((prev) => 
      prev === length - 1 ? 0 : prev + 1
    );
  };
  
  // Fetch a random reel
  const { data: randomReel, refetch: refetchRandom } = useQuery<AnimeReel>({
    queryKey: ["/api/anime-reels/random"],
    enabled: false, // Don't fetch on component mount
  });
  
  // Show the Anime Surge dialog
  const showAnimeSurge = () => {
    setOpen(true);
    setCurrentReelIndex(Math.floor(Math.random() * (SAMPLE_REELS.length || 1)));
    setIsMuted(true);
  };
  
  // Load a random reel
  const loadRandomReel = async () => {
    try {
      const result = await refetchRandom();
      
      if (result.data) {
        // Find if this reel already exists in our availableReels
        const existingIndex = availableReels.findIndex(reel => reel.id === result.data?.id);
        
        if (existingIndex >= 0) {
          // If it exists, just navigate to that index
          setCurrentReelIndex(existingIndex);
        } else {
          // Otherwise, use random approach as fallback
          setCurrentReelIndex(Math.floor(Math.random() * (availableReels.length || 1)));
        }
      } else {
        // If no specific reel was returned, use random approach
        setCurrentReelIndex(Math.floor(Math.random() * (availableReels.length || 1)));
      }
    } catch (error) {
      console.error("Failed to load random reel:", error);
      // Fallback to random selection
      setCurrentReelIndex(Math.floor(Math.random() * (availableReels.length || 1)));
    }
  };
  
  // Reset video and mute state when reel changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.muted = isMuted;
      videoRef.current.play().catch(error => {
        console.error("Video playback failed:", error);
      });
    }
  }, [currentReelIndex, isMuted]);
  
  // Handle dialog close
  const handleClose = () => {
    setOpen(false);
    if (onComplete) onComplete();
  };
  
  return (
    <>
      <Button onClick={showAnimeSurge} className="w-full">
        <Flame className="mr-2 h-4 w-4" />
        Anime Surge
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] p-0 gap-0 overflow-hidden bg-black text-white border-none">
          <DialogTitle className="sr-only">Anime Surge: Motivational Clips</DialogTitle>
          <DialogDescription className="sr-only">Get inspired with motivational anime scenes</DialogDescription>
          {isLoading ? (
            <div className="h-[80vh] flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading motivational content...</span>
            </div>
          ) : error ? (
            <div className="h-[80vh] flex flex-col items-center justify-center p-4">
              <p className="text-center mb-4">
                Failed to load motivational content. Please try again later.
              </p>
              <Button onClick={handleClose}>Close</Button>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentReelIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative h-full w-full"
              >
                <div className="absolute inset-0 flex items-center justify-center bg-black">
                  <video 
                    ref={videoRef}
                    autoPlay 
                    loop 
                    muted={isMuted}
                    playsInline
                    className="w-full h-[80vh] object-cover"
                  >
                    <source src={currentReel.video_url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  
                  {/* Quote overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                    <blockquote className="text-xl md:text-2xl font-bold italic">
                      "{currentReel.quote}"
                    </blockquote>
                    <p className="mt-2 text-sm md:text-base text-white/80">
                      — {currentReel.character}
                    </p>
                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                      <p className="text-xs text-white/60">
                        {currentReel.anime_source || "Anime"}
                      </p>
                      <p className="text-xs text-white/60">
                        Via {currentReel.source_account}
                      </p>
                    </div>
                  </div>
                  
                  {/* Controls */}
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={loadRandomReel}
                      className="text-white hover:bg-white/20"
                      title="Load random clip"
                    >
                      <Flame className="h-5 w-5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={toggleMute}
                      className="text-white hover:bg-white/20"
                      title={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? (
                        <VolumeX className="h-5 w-5" />
                      ) : (
                        <Volume2 className="h-5 w-5" />
                      )}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={handleClose}
                      className="text-white hover:bg-white/20"
                      title="Close"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  {/* Navigation buttons */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={prevReel}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 h-10 w-10 rounded-full"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={nextReel}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 h-10 w-10 rounded-full"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}