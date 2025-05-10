import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Get base URL for API requests - handles different environments including Replit
const getBaseUrl = () => {
  // Replit environment - use the same origin
  const currentUrl = window.location.origin;
  return currentUrl;
};

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Make sure URL is absolute for Replit environment
  const fullUrl = url.startsWith('http') ? url : `${getBaseUrl()}${url}`;
  
  console.log(`Making ${method} request to ${fullUrl}`, data ? { data } : '');
  
  const res = await fetch(fullUrl, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  console.log(`Response from ${fullUrl}:`, res.status, res.statusText);
  
  // For debugging in development: log all cookies
  console.log('Document cookies:', document.cookie);
  
  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Ensure URL is absolute
    const url = queryKey[0] as string;
    const fullUrl = url.startsWith('http') ? url : `${getBaseUrl()}${url}`;
    
    // Add additional logging during development
    console.log(`Fetching from ${fullUrl} with credentials`);
    
    const res = await fetch(fullUrl, {
      credentials: "include",
      headers: {
        "Accept": "application/json",
      },
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      console.log("Request returned 401, returning null as per configuration");
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
