import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Quote } from '@shared/schema';
import { getQueryFn } from '@/lib/queryClient';

export function useQuotes() {
  const queryClient = useQueryClient();
  
  // Fetch a random quote
  const { data: quote, isLoading, refetch } = useQuery<Quote>({
    queryKey: ['/api/quotes/random'],
    queryFn: getQueryFn({ on401: 'throw' }),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
  
  // Function to refresh and get a new quote
  const refreshQuote = async () => {
    await queryClient.invalidateQueries({ queryKey: ['/api/quotes/random'] });
    return refetch();
  };
  
  return {
    quote,
    isLoading,
    refreshQuote,
  };
}
