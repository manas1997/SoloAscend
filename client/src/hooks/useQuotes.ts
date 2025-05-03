import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getRandomQuote } from '@/lib/supabase';
import type { Quote } from '@shared/schema';

export function useQuotes() {
  const queryClient = useQueryClient();
  
  // Fetch a random quote
  const { data: quote, isLoading, refetch } = useQuery({
    queryKey: ['/api/quotes/random'],
    queryFn: async () => {
      return await getRandomQuote();
    },
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
