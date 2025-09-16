import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertGuestAccountSchema,
  insertUserRegistrationSchema,
  insertCalculationSchema,
  insertContactMessageSchema,
  insertNetWorthSnapshotSchema 
} from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcryptjs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      // Check for traditional authentication first
      if (req.session?.user) {
        const user = await storage.getUser(req.session.user.id);
        if (user) {
          return res.json(user);
        }
      }
      
      // Then check for Replit authentication
      if (req.user?.claims?.sub) {
        const userId = req.user.claims.sub;
        const user = await storage.getUser(userId);
        if (user) {
          return res.json(user);
        }
      }
      
      res.status(401).json({ message: "Unauthorized" });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Traditional logout route
  app.post('/api/auth/logout', async (req: any, res) => {
    try {
      if (req.session?.user) {
        req.session.destroy((err: any) => {
          if (err) {
            console.error("Error destroying session:", err);
            return res.status(500).json({ message: "Failed to logout" });
          }
          res.json({ message: "Logged out successfully" });
        });
      } else {
        res.json({ message: "Already logged out" });
      }
    } catch (error) {
      console.error("Error during logout:", error);
      res.status(500).json({ message: "Failed to logout" });
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

  // Guest login route - check if email exists in guest accounts
  app.post('/api/guest/login', async (req, res) => {
    try {
      const { email, captcha } = req.body;
      
      // Simple math captcha validation
      const { question, answer } = captcha;
      const expectedAnswer = eval(question.replace(/\s/g, ''));
      if (parseInt(answer) !== expectedAnswer) {
        return res.status(400).json({ message: "Invalid captcha" });
      }
      
      // Check if email exists in guest accounts
      const guest = await storage.getGuestAccountByEmail(email);
      if (!guest) {
        return res.status(400).json({ message: "Email not found in guest accounts" });
      }
      
      if (!guest.verified) {
        return res.status(400).json({ message: "Guest account not verified" });
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
      console.error("Error during guest login:", error);
      res.status(500).json({ message: "Failed to login" });
    }
  });

  // User registration routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const userData = insertUserRegistrationSchema.parse(req.body);
      const { captcha } = req.body;
      
      // Simple math captcha validation
      const { question, answer } = captcha;
      const expectedAnswer = eval(question.replace(/\s/g, ''));
      if (parseInt(answer) !== expectedAnswer) {
        return res.status(400).json({ message: "Invalid captcha" });
      }
      
      // Check if email already exists
      const existingUser = await storage.getUserByEmail(userData.email!);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }
      
      // Check if email exists in guest accounts
      const existingGuest = await storage.getGuestAccountByEmail(userData.email!);
      if (existingGuest) {
        return res.status(400).json({ message: "Email already registered as guest account" });
      }
      
      const user = await storage.createUser(userData);
      
      // TODO: Send verification email
      
      res.json({ 
        id: user.id, 
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isEmailVerified: user.isEmailVerified
      });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Failed to create user account" });
    }
  });

  // Traditional user login
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password, captcha } = req.body;
      
      // Simple math captcha validation
      const { question, answer } = captcha;
      const expectedAnswer = eval(question.replace(/\s/g, ''));
      if (parseInt(answer) !== expectedAnswer) {
        return res.status(400).json({ message: "Invalid captcha" });
      }
      
      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user || user.authType !== "traditional") {
        return res.status(400).json({ message: "Invalid email or password" });
      }
      
      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password!);
      if (!isValidPassword) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
      
      if (!user.isEmailVerified) {
        return res.status(400).json({ message: "Please verify your email before logging in" });
      }
      
      // Create session (store user in session)
      (req as any).session.user = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        authType: user.authType,
      };
      
      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        authType: user.authType,
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Failed to login" });
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
