import type { Express, Request, Response, NextFunction } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

// Middleware to check API key
const requireApiKey = async (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.header('X-API-Key') || req.query.api_key as string;
  
  if (!apiKey) {
    return res.status(401).json({ message: "Missing X-API-Key header" });
  }

  const isValid = await storage.validateApiKey(apiKey);
  if (!isValid) {
    return res.status(401).json({ message: "Invalid or inactive API Key" });
  }

  next();
};

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // === Public Routes ===

  // Generate API Key
  app.post(api.keys.generate.path, async (req, res) => {
    const key = await storage.generateApiKey();
    res.status(201).json({
      key: key.key,
      status: "active",
      createdAt: key.createdAt?.toISOString() || new Date().toISOString(),
      message: "API Key generated successfully. Use this key in the 'X-API-Key' header."
    });
  });

  // === Protected Routes ===
  
  // Search Towers
  app.get(api.towers.list.path, requireApiKey, async (req, res) => {
    try {
      // Clean query params
      const params = api.towers.list.input!.parse(req.query);
      const towers = await storage.searchTowers(params);
      res.json(towers);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.towers.get.path, requireApiKey, async (req, res) => {
    const tower = await storage.getCellTower(Number(req.params.id));
    if (!tower) {
      return res.status(404).json({ message: "Cell tower not found" });
    }
    res.json(tower);
  });

  // Seed data on startup if empty
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existing = await storage.searchTowers({});
  if (existing.length > 0) return;

  console.log("Seeding database with Indonesian Cell Towers...");

  const dummyTowers = [
    {
      mcc: 510, mnc: 10, lac: 4012, cellId: 21451,
      lat: -6.2088, lon: 106.8456,
      radio: "LTE",
      province: "DKI Jakarta",
      district: "Jakarta Selatan",
      subdistrict: "Setiabudi",
      village: "Kuningan",
      address: "Jl. HR Rasuna Said, Kuningan"
    },
    {
      mcc: 510, mnc: 11, lac: 5201, cellId: 63211,
      lat: -6.1751, lon: 106.8650,
      radio: "GSM",
      province: "DKI Jakarta",
      district: "Jakarta Pusat",
      subdistrict: "Gambir",
      village: "Gambir",
      address: "Area Monas"
    },
    {
      mcc: 510, mnc: 10, lac: 4015, cellId: 12345,
      lat: -7.2575, lon: 112.7521,
      radio: "LTE",
      province: "Jawa Timur",
      district: "Surabaya",
      subdistrict: "Gubeng",
      village: "Gubeng",
      address: "Jl. Gubeng Pojok"
    },
    {
      mcc: 510, mnc: 89, lac: 3021, cellId: 98765,
      lat: -8.6705, lon: 115.2126,
      radio: "5G",
      province: "Bali",
      district: "Denpasar",
      subdistrict: "Denpasar Barat",
      village: "Pemecutan",
      address: "Jl. Gajah Mada"
    },
    {
      mcc: 510, mnc: 1, lac: 1001, cellId: 55432,
      lat: -0.0263, lon: 109.3425,
      radio: "UMTS",
      province: "Kalimantan Barat",
      district: "Pontianak",
      subdistrict: "Pontianak Selatan",
      village: "Bansir Laut",
      address: "Jl. Ahmad Yani"
    }
  ];

  for (const tower of dummyTowers) {
    await storage.createCellTower(tower);
  }
  
  console.log("Seeding complete.");
}
