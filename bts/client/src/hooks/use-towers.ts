import { useQuery } from "@tanstack/react-query";
import { api, buildUrl, type TowerSearchInput } from "@shared/routes";

// Need to pass apiKey explicitly since it's not a cookie-based auth
export function useTowers(params: TowerSearchInput, apiKey: string | null) {
  return useQuery({
    queryKey: [api.towers.list.path, params, apiKey],
    queryFn: async () => {
      if (!apiKey) throw new Error("API Key required");
      
      const queryParams = params as Record<string, string | number>;
      const url = buildUrl(api.towers.list.path);
      
      // Convert params to URLSearchParams
      const searchParams = new URLSearchParams();
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });

      const res = await fetch(`${url}?${searchParams.toString()}`, {
        method: api.towers.list.method,
        headers: {
          'X-API-Key': apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (res.status === 401) throw new Error("Invalid API Key");
      if (!res.ok) throw new Error("Failed to fetch tower data");
      
      return api.towers.list.responses[200].parse(await res.json());
    },
    enabled: !!apiKey, // Only fetch if we have a key
    retry: false
  });
}
