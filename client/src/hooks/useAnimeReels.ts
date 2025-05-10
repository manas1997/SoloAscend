import { useQuery, useMutation } from "@tanstack/react-query";
import { type AnimeReel, type InsertAnimeReel } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useAnimeReels() {
  const { toast } = useToast();

  // Get all anime reels
  const {
    data: reels = [],
    isLoading: isLoadingReels,
    error: reelsError,
    refetch: refetchReels
  } = useQuery<AnimeReel[]>({
    queryKey: ["/api/anime-reels"],
    retry: 1,
  });

  // Get random reel
  const {
    data: randomReel,
    isLoading: isLoadingRandomReel,
    error: randomReelError,
    refetch: refetchRandomReel
  } = useQuery<AnimeReel>({
    queryKey: ["/api/anime-reels/random"],
    enabled: false, // Don't fetch automatically, only when needed
    retry: 1,
  });

  // Create a new anime reel
  const createReelMutation = useMutation({
    mutationFn: async (reelData: InsertAnimeReel) => {
      const response = await apiRequest("POST", "/api/anime-reels", reelData);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Anime reel added successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/anime-reels"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to add anime reel: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Function to get a random reel
  const getRandomReel = async () => {
    return await refetchRandomReel();
  };

  return {
    reels,
    isLoadingReels,
    reelsError,
    refetchReels,
    randomReel,
    isLoadingRandomReel,
    randomReelError,
    getRandomReel,
    createReelMutation,
  };
}