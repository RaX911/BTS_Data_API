import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useGenerateApiKey() {
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(api.keys.generate.path, {
        method: api.keys.generate.method,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) throw new Error("Failed to generate API key");
      return api.keys.generate.responses[201].parse(await res.json());
    },
  });
}
