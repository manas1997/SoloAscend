import { useState, useRef, useEffect } from "react";
import { useAnimeReels } from "@/hooks/useAnimeReels";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Zap, X, Instagram, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AnimeSurge() {
  const { reels, isLoadingReels, randomReel, getRandomReel, isLoadingRandomReel } = useAnimeReels();
  const [isFullScreenReelOpen, setIsFullScreenReelOpen] = useState(false);
  const [currentReel, setCurrentReel] = useState<any>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Reset video loaded state when random reel changes
  useEffect(() => {
    if (randomReel) {
      setCurrentReel(randomReel);
      setIsVideoLoaded(false);
      setVideoError(false);
    }
  }, [randomReel]);

  // Function to handle "Need Motivation" button click
  const handleNeedMotivation = async () => {
    try {
      await getRandomReel();
      setIsFullScreenReelOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get a random motivation reel",
        variant: "destructive",
      });
    }
  };

  // Handle video loaded
  const handleVideoLoaded = () => {
    setIsVideoLoaded(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        toast({
          title: "Playback Error",
          description: "Couldn't autoplay video. Please click to play manually.",
          variant: "destructive",
        });
      });
    }
  };

  // Handle video error
  const handleVideoError = () => {
    setVideoError(true);
    setIsVideoLoaded(false);
    toast({
      title: "Video Error",
      description: "Failed to load the video. Please try another one.",
      variant: "destructive",
    });
  };

  // Close full screen reel and reset
  const handleCloseReel = () => {
    setIsFullScreenReelOpen(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Component Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Anime Surge</h2>
          <p className="text-muted-foreground">Anime-themed motivational clips to boost your energy</p>
        </div>
        <Button 
          onClick={handleNeedMotivation}
          className="bg-gradient-to-r from-primary/80 to-primary glow-effect"
          disabled={isLoadingRandomReel}
        >
          {isLoadingRandomReel ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <Zap className="mr-2 h-4 w-4" />
              Need Motivation
            </>
          )}
        </Button>
      </div>

      {/* Reels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoadingReels ? (
          // Loading skeletons
          Array(6).fill(0).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))
        ) : reels.length === 0 ? (
          // Empty state
          <Card className="col-span-full p-6 text-center">
            <p className="text-muted-foreground mb-4">No anime reels available yet.</p>
            <p className="text-sm">Anime surge reels will appear here when added.</p>
          </Card>
        ) : (
          // Reels grid
          reels.map((reel) => (
            <Card key={reel.id} className="overflow-hidden group hover:border-primary transition-colors">
              <div className="relative h-48 bg-black">
                <img 
                  src={reel.thumbnail_url} 
                  alt={reel.quote}
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-80 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="bg-black/50 border-white text-white hover:bg-black/70 hover:text-white"
                    onClick={() => {
                      setCurrentReel(reel);
                      setIsFullScreenReelOpen(true);
                    }}
                  >
                    <Zap className="h-6 w-6" />
                  </Button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  <p className="text-white text-sm font-medium truncate">{reel.quote}</p>
                </div>
              </div>
              <CardFooter className="p-3 flex justify-between items-center">
                <div className="text-xs">
                  <span className="font-semibold">{reel.character}</span>
                </div>
                <a 
                  href={`https://instagram.com/${reel.source_account}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-primary flex items-center"
                >
                  <Instagram className="h-3 w-3 mr-1" />
                  {reel.source_account}
                </a>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {/* Full Screen Reel Dialog */}
      <Dialog 
        open={isFullScreenReelOpen} 
        onOpenChange={setIsFullScreenReelOpen}
      >
        <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] p-0 bg-black border-primary/50 overflow-hidden">
          <div className="relative flex flex-col h-full">
            {/* Video and Loading States */}
            <div className="relative h-full w-full bg-black flex items-center justify-center">
              {currentReel && (
                <>
                  {!isVideoLoaded && !videoError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                      <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    </div>
                  )}
                  
                  {videoError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10">
                      <p className="text-white mb-2">Failed to load video</p>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setVideoError(false);
                          if (videoRef.current) {
                            videoRef.current.load();
                          }
                        }}
                      >
                        Retry
                      </Button>
                    </div>
                  )}
                  
                  <video
                    ref={videoRef}
                    src={currentReel.video_url}
                    className={`h-full w-full object-contain ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
                    loop
                    controls
                    onLoadedData={handleVideoLoaded}
                    onError={handleVideoError}
                  />
                  
                  {/* Quote Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                    <blockquote className="text-white text-xl md:text-2xl font-medium leading-relaxed">
                      "{currentReel.quote}"
                    </blockquote>
                    <div className="flex justify-between items-center mt-2 text-white/80">
                      <p className="font-medium">{currentReel.character}</p>
                      <a 
                        href={`https://instagram.com/${currentReel.source_account}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs flex items-center hover:text-primary/80 transition-colors"
                      >
                        <Instagram className="h-3 w-3 mr-1" />
                        {currentReel.source_account}
                      </a>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {/* Close Button */}
            <Button 
              className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full bg-black/50 text-white hover:bg-black/70"
              onClick={handleCloseReel}
              variant="ghost"
              size="icon"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}