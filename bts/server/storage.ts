import { db } from "./db";
import { cellTowers, apiKeys, type InsertCellTower, type CellTower, type ApiKey } from "@shared/schema";
import { eq, and, sql } from "drizzle-orm";
import { randomBytes } from "crypto";

export interface IStorage {
  // Tower operations
  searchTowers(params: {
    mcc?: number;
    mnc?: number;
    lac?: number;
    cellId?: number;
    lat?: number;
    lon?: number;
    radius?: number;
  }): Promise<CellTower[]>;
  
  getCellTower(id: number): Promise<CellTower | undefined>;
  createCellTower(tower: InsertCellTower): Promise<CellTower>;
  
  // API Key operations
  generateApiKey(): Promise<ApiKey>;
  validateApiKey(key: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async searchTowers(params: {
    mcc?: number;
    mnc?: number;
    lac?: number;
    cellId?: number;
    lat?: number;
    lon?: number;
    radius?: number;
  }): Promise<CellTower[]> {
    const conditions = [];

    if (params.mcc) conditions.push(eq(cellTowers.mcc, params.mcc));
    if (params.mnc) conditions.push(eq(cellTowers.mnc, params.mnc));
    if (params.lac) conditions.push(eq(cellTowers.lac, params.lac));
    if (params.cellId) conditions.push(eq(cellTowers.cellId, params.cellId));

    // Basic lat/lon proximity search (bounding box approximation for speed)
    // For a real production app with millions of rows, use PostGIS
    if (params.lat && params.lon && params.radius) {
      const degreesPerMeter = 1 / 111320; // Approximation
      const radiusDegrees = params.radius * degreesPerMeter;
      
      conditions.push(sql`${cellTowers.lat} BETWEEN ${params.lat - radiusDegrees} AND ${params.lat + radiusDegrees}`);
      conditions.push(sql`${cellTowers.lon} BETWEEN ${params.lon - radiusDegrees} AND ${params.lon + radiusDegrees}`);
    }

    if (conditions.length === 0) {
      // Return recent 50 if no params
      return await db.select().from(cellTowers).limit(50);
    }

    return await db.select().from(cellTowers).where(and(...conditions)).limit(100);
  }

  async getCellTower(id: number): Promise<CellTower | undefined> {
    const [tower] = await db.select().from(cellTowers).where(eq(cellTowers.id, id));
    return tower;
  }

  async createCellTower(tower: InsertCellTower): Promise<CellTower> {
    const [newTower] = await db.insert(cellTowers).values(tower).returning();
    return newTower;
  }

  async generateApiKey(): Promise<ApiKey> {
    const key = `cellid_${randomBytes(16).toString('hex')}`;
    const [apiKey] = await db.insert(apiKeys).values({
      key,
      isActive: true,
    }).returning();
    return apiKey;
  }

  async validateApiKey(key: string): Promise<boolean> {
    const [apiKey] = await db.select().from(apiKeys).where(and(
      eq(apiKeys.key, key),
      eq(apiKeys.isActive, true)
    ));
    
    if (apiKey) {
      // Async update last used
      db.update(apiKeys)
        .set({ lastUsedAt: new Date() })
        .where(eq(apiKeys.id, apiKey.id))
        .catch(err => console.error("Failed to update key usage", err));
      return true;
    }
    
    return false;
  }
}

export const storage = new DatabaseStorage();
