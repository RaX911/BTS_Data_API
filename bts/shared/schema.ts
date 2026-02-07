import { pgTable, text, serial, integer, doublePrecision, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

export const cellTowers = pgTable("cell_towers", {
  id: serial("id").primaryKey(),
  mcc: integer("mcc").notNull(), // Mobile Country Code (510 for Indonesia)
  mnc: integer("mnc").notNull(), // Mobile Network Code
  lac: integer("lac").notNull(), // Location Area Code
  cellId: integer("cell_id").notNull(), // Cell ID
  lat: doublePrecision("lat").notNull(),
  lon: doublePrecision("lon").notNull(),
  radio: text("radio").notNull(), // GSM, LTE, UMTS, 5G
  range: integer("range").default(1000), // Coverage range in meters
  
  // Location Hierarchy
  province: text("province").notNull(),
  district: text("district").notNull(), // Kabupaten/Kota
  subdistrict: text("subdistrict").notNull(), // Kecamatan
  village: text("village").notNull(), // Kelurahan/Desa
  address: text("address"), // Full formatted address
  
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const apiKeys = pgTable("api_keys", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  lastUsedAt: timestamp("last_used_at"),
});

// === SCHEMAS ===

export const insertCellTowerSchema = createInsertSchema(cellTowers).omit({ 
  id: true, 
  updatedAt: true 
});

export const insertApiKeySchema = createInsertSchema(apiKeys).omit({ 
  id: true, 
  createdAt: true, 
  lastUsedAt: true,
  isActive: true 
});

// === TYPES ===

export type CellTower = typeof cellTowers.$inferSelect;
export type InsertCellTower = z.infer<typeof insertCellTowerSchema>;

export type ApiKey = typeof apiKeys.$inferSelect;
export type InsertApiKey = z.infer<typeof insertApiKeySchema>;

// === API TYPES ===

export interface TowerSearchQuery {
  mcc?: number;
  mnc?: number;
  lac?: number;
  cellId?: number;
  lat?: number;
  lon?: number;
  radius?: number; // Search radius in meters if lat/lon provided
}

export interface ApiKeyResponse {
  key: string;
  status: "active";
  createdAt: string;
}

export interface TowerResponse extends CellTower {
  distance?: number; // Distance in meters if searched by lat/lon
}
