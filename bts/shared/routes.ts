import { z } from 'zod';
import { insertCellTowerSchema, cellTowers, apiKeys } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  towers: {
    list: {
      method: 'GET' as const,
      path: '/api/v1/towers' as const,
      // Query parameters schema
      input: z.object({
        mcc: z.coerce.number().optional(),
        mnc: z.coerce.number().optional(),
        lac: z.coerce.number().optional(),
        cellId: z.coerce.number().optional(),
        lat: z.coerce.number().optional(),
        lon: z.coerce.number().optional(),
        radius: z.coerce.number().optional().default(1000), // Default 1km radius
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof cellTowers.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/v1/towers/:id' as const,
      responses: {
        200: z.custom<typeof cellTowers.$inferSelect>(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
  },
  keys: {
    generate: {
      method: 'POST' as const,
      path: '/api/v1/keys/generate' as const,
      input: z.object({}), // No input needed, public generator
      responses: {
        201: z.object({
          key: z.string(),
          status: z.literal("active"),
          createdAt: z.string(),
          message: z.string()
        }),
      },
    },
  },
};

// ============================================
// HELPER
// ============================================
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

// ============================================
// TYPES
// ============================================
export type TowerSearchInput = z.infer<typeof api.towers.list.input>;
export type KeyGenerateResponse = z.infer<typeof api.keys.generate.responses[201]>;
