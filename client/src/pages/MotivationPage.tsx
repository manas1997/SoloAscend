import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuotes } from "@/hooks/useQuotes";
import { useAudio } from "@/hooks/useAudio";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimeSurge } from "@/components/anime-surge/AnimeSurge";

// List of character images
const characterImages: Record<string, string> = {
  "Sung Jin-Woo": "https://i.imgur.com/SBnIDdZ.png",
  "Cha Hae-In": "https://i.imgur.com/3jUjQQQ.png",
  "Go Gun-Hee": "https://i.imgur.com/yyLrGVl.png",
  "Baek Yoonho": "https://i.imgur.com/u6hcXjz.png",
  "System": "https://i.imgur.com/pP7fGIv.png",
  "default": "https://i.imgur.com/SBnIDdZ.png", // Default to Jin-Woo
};

export default function MotivationPage() {
  const { quote, isLoading, refreshQuote } = useQuotes();
  const { playing, togglePlay } = useAudio(quote?.audio_url || "");
  const [autoPlay, setAutoPlay] = useState(false);
  const [quoteHistory, setQuoteHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>("quotes");
  
  // Add current quote to history when it changes
  useEffect(() => {
    if (quote && !quoteHistory.some(q => q.id === quote.id)) {
      setQuoteHistory(prev => [quote, ...prev].slice(0, 10));
    }
  }, [quote]);
  
  // Auto-play quote when it changes if autoPlay is enabled
  useEffect(() => {
    if (autoPlay && quote?.audio_url && !playing) {
      togglePlay();
    }
  }, [quote, autoPlay]);
  
  const characterImage = quote ? 
    characterImages[quote.character || "default"] || characterImages.default :
    characterImages.default;
  
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-foreground sm:text-3xl sm:truncate font-poppins">
            Motivation Engine
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Draw inspiration from quotes and anime clips to boost your productivity
          </p>
        </div>
        
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          {activeTab === "quotes" && (
            <Button onClick={refreshQuote} className="glow-effect">
              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              New Quote
            </Button>
          )}
        </div>
      </div>
      
      {/* Motivation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="quotes">Quotes</TabsTrigger>
          <TabsTrigger value="anime">Anime Surge</TabsTrigger>
        </TabsList>
        
        <TabsContent value="quotes">
          {/* Current Quote Display */}
          <Card className="relative bg-gradient-to-r from-muted to-card shadow-lg overflow-hidden mb-8">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute right-0 bottom-0 w-40 h-40 -mb-6 -mr-6 opacity-30">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            
            <CardContent className="p-8">
              {isLoading ? (
                <div className="space-y-6">
                  <Skeleton className="h-32 w-full" />
                  <div className="flex items-center">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="ml-4">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-24 mt-2" />
                    </div>
                  </div>
                </div>
              ) : (
                <blockquote className="relative z-10">
                  <p className="text-2xl md:text-3xl font-medium text-foreground leading-relaxed font-poppins">
                    "{quote?.text || "I don't have colleagues. Perhaps all hunters are meant to be alone."}"
                  </p>
                  <footer className="mt-6 flex items-center">
                    <div className="h-16 w-16 rounded-full border-2 border-primary glow-effect">
                      <img 
                        src={characterImage} 
                        alt={quote?.character || "Character"} 
                        className="h-full w-full rounded-full object-cover"
                      />
                    </div>
                    <cite className="ml-4 not-italic">
                      <span className="text-lg font-semibold text-foreground">{quote?.character || "Sung Jin-Woo"}</span>
                      <span className="block text-sm text-muted-foreground">Solo Leveling</span>
                    </cite>
                    <div className="ml-auto flex space-x-2">
                      {quote?.audio_url && (
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={togglePlay}
                          className={`${playing ? "text-primary glow-effect" : "text-muted-foreground hover:text-foreground"}`}
                        >
                          {playing ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </Button>
                      )}
                    </div>
                  </footer>
                </blockquote>
              )}
            </CardContent>
          </Card>
          
          {/* Settings Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-play">Auto-play audio</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically play audio when a new quote loads
                    </p>
                  </div>
                  <Switch
                    id="auto-play"
                    checked={autoPlay}
                    onCheckedChange={setAutoPlay}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="schedule-quotes">Scheduled quotes</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive motivational quotes at set intervals
                    </p>
                  </div>
                  <Switch
                    id="schedule-quotes"
                    checked={false}
                    onCheckedChange={() => {}}
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Quote History */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Quote History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {quoteHistory.length === 0 ? (
                    <p className="text-muted-foreground italic text-center py-6">
                      Your quote history will appear here
                    </p>
                  ) : (
                    quoteHistory.map((historyQuote, index) => (
                      <div key={index} className="p-3 bg-muted rounded-md">
                        <p className="text-sm italic">"{historyQuote.text}"</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-muted-foreground">— {historyQuote.character}</span>
                          {historyQuote.audio_url && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                if (historyQuote.id === quote?.id) {
                                  togglePlay();
                                } else {
                                  refreshQuote();
                                  // In a real app, we would load this specific quote
                                }
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              </svg>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Character Quotes */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Characters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {Object.entries(characterImages).map(([name, image]) => {
                  if (name === 'default') return null;
                  
                  return (
                    <div 
                      key={name} 
                      className="flex flex-col items-center p-4 bg-muted rounded-lg cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => {
                        // In a real app, we would filter quotes by character
                        refreshQuote();
                      }}
                    >
                      <div className="h-16 w-16 rounded-full border-2 border-primary mb-2 overflow-hidden">
                        <img 
                          src={image} 
                          alt={name} 
                          className="h-full w-full object-cover" 
                        />
                      </div>
                      <span className="text-sm font-medium text-center">{name}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="anime">
          <AnimeSurge />
        </TabsContent>
      </Tabs>
    </div>
  );
}