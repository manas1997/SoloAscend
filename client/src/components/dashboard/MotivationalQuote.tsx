import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuotes } from "@/hooks/useQuotes";
import { useAudio } from "@/hooks/useAudio";
import { Skeleton } from "@/components/ui/skeleton";

export function MotivationalQuote() {
  const { quote, isLoading, refreshQuote } = useQuotes();
  const { playing, togglePlay } = useAudio(quote?.audio_url);
  
  // Use these default character images if none are provided
  const characterImages: Record<string, string> = {
    "Sung Jin-Woo": "https://i.imgur.com/SBnIDdZ.png",
    "Cha Hae-In": "https://i.imgur.com/3jUjQQQ.png",
    "Go Gun-Hee": "https://i.imgur.com/yyLrGVl.png",
    "Baek Yoonho": "https://i.imgur.com/u6hcXjz.png",
    "System": "https://i.imgur.com/pP7fGIv.png",
    "default": "https://i.imgur.com/SBnIDdZ.png", // Default to Jin-Woo
  };
  
  const characterImage = quote ? 
    characterImages[quote.character] || characterImages.default :
    characterImages.default;
  
  return (
    <Card className="relative bg-gradient-to-r from-muted to-card shadow-lg overflow-hidden mb-8">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute right-0 bottom-0 w-40 h-40 -mb-6 -mr-6 opacity-30">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>
      
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <div className="flex items-center">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="ml-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16 mt-1" />
              </div>
            </div>
          </div>
        ) : (
          <blockquote className="relative z-10">
            <p className="text-lg md:text-xl font-medium text-foreground leading-relaxed font-poppins">
              "{quote?.text || "I don't have colleagues. Perhaps all hunters are meant to be alone."}"
            </p>
            <footer className="mt-2">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full border-2 border-primary glow-effect">
                  <img 
                    src={characterImage} 
                    alt={quote?.character || "Character"} 
                    className="h-full w-full rounded-full object-cover"
                  />
                </div>
                <cite className="ml-3 not-italic">
                  <span className="text-sm font-semibold text-foreground">{quote?.character || "Sung Jin-Woo"}</span>
                  <span className="block text-xs text-muted-foreground">Solo Leveling</span>
                </cite>
              </div>
              <div className="absolute top-0 right-0 flex space-x-1 mr-2 mt-2">
                {quote?.audio_url && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={togglePlay}
                    className={playing ? "text-primary" : "text-muted-foreground hover:text-foreground"}
                  >
                    {playing ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </Button>
                )}
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={refreshQuote}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </Button>
              </div>
            </footer>
          </blockquote>
        )}
      </CardContent>
    </Card>
  );
}
