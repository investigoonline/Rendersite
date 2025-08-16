import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertGuestAccountSchema,
  insertCalculationSchema,
  insertContactMessageSchema,
  insertNetWorthSnapshotSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Guest account routes
  app.post('/api/guest/signup', async (req, res) => {
    try {
      const guestData = insertGuestAccountSchema.parse(req.body);
      
      // Check if email already exists
      const existing = await storage.getGuestAccountByEmail(guestData.email);
      if (existing) {
        return res.status(400).json({ message: "Email already registered" });
      }
      
      const guest = await storage.createGuestAccount(guestData);
      
      // TODO: Send verification email
      
      res.json({ 
        id: guest.id, 
        email: guest.email,
        expiresAt: guest.expiresAt,
        verified: guest.verified 
      });
    } catch (error) {
      console.error("Error creating guest account:", error);
      res.status(500).json({ message: "Failed to create guest account" });
    }
  });

  app.post('/api/guest/verify', async (req, res) => {
    try {
      const { id, token } = req.body;
      const verified = await storage.verifyGuestAccount(id, token);
      
      if (verified) {
        res.json({ message: "Account verified successfully" });
      } else {
        res.status(400).json({ message: "Invalid verification token" });
      }
    } catch (error) {
      console.error("Error verifying guest account:", error);
      res.status(500).json({ message: "Failed to verify account" });
    }
  });

  app.get('/api/guest/:id', async (req, res) => {
    try {
      const guest = await storage.getGuestAccount(req.params.id);
      if (!guest) {
        return res.status(404).json({ message: "Guest account not found" });
      }
      
      // Update last activity
      await storage.updateGuestActivity(guest.id);
      
      res.json({
        id: guest.id,
        email: guest.email,
        guestType: guest.guestType,
        verified: guest.verified,
        expiresAt: guest.expiresAt,
      });
    } catch (error) {
      console.error("Error fetching guest account:", error);
      res.status(500).json({ message: "Failed to fetch guest account" });
    }
  });

  // Calculator routes
  app.post('/api/calculations', async (req, res) => {
    try {
      const calculationData = insertCalculationSchema.parse(req.body);
      
      // Validate that either userId or guestId is provided
      if (!calculationData.userId && !calculationData.guestId) {
        return res.status(400).json({ message: "Either userId or guestId must be provided" });
      }
      
      const calculation = await storage.saveCalculation(calculationData);
      res.json(calculation);
    } catch (error) {
      console.error("Error saving calculation:", error);
      res.status(500).json({ message: "Failed to save calculation" });
    }
  });

  app.get('/api/calculations', async (req, res) => {
    try {
      const { userId, guestId } = req.query;
      const calculations = await storage.getCalculations(
        userId as string, 
        guestId as string
      );
      res.json(calculations);
    } catch (error) {
      console.error("Error fetching calculations:", error);
      res.status(500).json({ message: "Failed to fetch calculations" });
    }
  });

  app.get('/api/calculations/:id', async (req, res) => {
    try {
      const calculation = await storage.getCalculation(req.params.id);
      if (!calculation) {
        return res.status(404).json({ message: "Calculation not found" });
      }
      res.json(calculation);
    } catch (error) {
      console.error("Error fetching calculation:", error);
      res.status(500).json({ message: "Failed to fetch calculation" });
    }
  });

  // Resource routes
  app.get('/api/resources', async (req, res) => {
    try {
      const { type, category } = req.query;
      const resources = await storage.getResources(
        type as string, 
        category as string
      );
      res.json(resources);
    } catch (error) {
      console.error("Error fetching resources:", error);
      res.status(500).json({ message: "Failed to fetch resources" });
    }
  });

  app.get('/api/resources/:id', async (req, res) => {
    try {
      const resource = await storage.getResource(req.params.id);
      if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
      }
      
      // Increment view count
      await storage.incrementResourceView(resource.id);
      
      res.json(resource);
    } catch (error) {
      console.error("Error fetching resource:", error);
      res.status(500).json({ message: "Failed to fetch resource" });
    }
  });

  // Contact routes
  app.post('/api/contact', async (req, res) => {
    try {
      const messageData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(messageData);
      
      // TODO: Send notification email to admin
      
      res.json({ message: "Message sent successfully" });
    } catch (error) {
      console.error("Error sending contact message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Net worth routes
  app.post('/api/networth', async (req, res) => {
    try {
      const snapshotData = insertNetWorthSnapshotSchema.parse(req.body);
      const snapshot = await storage.saveNetWorthSnapshot(snapshotData);
      res.json(snapshot);
    } catch (error) {
      console.error("Error saving net worth snapshot:", error);
      res.status(500).json({ message: "Failed to save net worth snapshot" });
    }
  });

  app.get('/api/networth/history', async (req, res) => {
    try {
      const { userId, guestId } = req.query;
      const history = await storage.getNetWorthHistory(
        userId as string, 
        guestId as string
      );
      res.json(history);
    } catch (error) {
      console.error("Error fetching net worth history:", error);
      res.status(500).json({ message: "Failed to fetch net worth history" });
    }
  });

  // Utility routes
  app.post('/api/guest/cleanup', async (req, res) => {
    try {
      await storage.cleanupExpiredGuests();
      res.json({ message: "Cleanup completed" });
    } catch (error) {
      console.error("Error during cleanup:", error);
      res.status(500).json({ message: "Cleanup failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
