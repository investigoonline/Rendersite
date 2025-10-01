import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertGuestAccountSchema,
  insertUserRegistrationSchema,
  insertUserBackendSchema,
  insertCalculationSchema,
  insertContactMessageSchema,
  insertNetWorthSnapshotSchema,
  insertUserRoleSchema,
  insertPageContentSchema
} from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// Safe arithmetic expression parser for captcha
function evaluateMathExpression(expression: string): number | null {
  // Remove all whitespace
  const cleaned = expression.replace(/\s/g, '');
  
  // Only allow digits, +, -, *, /, and parentheses
  if (!/^[\d+\-*/()]+$/.test(cleaned)) {
    return null;
  }
  
  try {
    return safeArithmeticEvaluator(cleaned);
  } catch {
    return null;
  }
}

// Safe arithmetic evaluator using recursive descent parser
function safeArithmeticEvaluator(expression: string): number {
  let index = 0;
  
  function parseNumber(): number {
    let num = '';
    while (index < expression.length && /\d/.test(expression[index])) {
      num += expression[index];
      index++;
    }
    return parseInt(num, 10);
  }
  
  function parseFactor(): number {
    if (expression[index] === '(') {
      index++; // skip '('
      const result = parseExpression();
      index++; // skip ')'
      return result;
    }
    
    if (expression[index] === '-') {
      index++; // skip '-'
      return -parseFactor();
    }
    
    if (expression[index] === '+') {
      index++; // skip '+'
      return parseFactor();
    }
    
    return parseNumber();
  }
  
  function parseTerm(): number {
    let result = parseFactor();
    
    while (index < expression.length && (expression[index] === '*' || expression[index] === '/')) {
      const operator = expression[index];
      index++;
      const rightOperand = parseFactor();
      
      if (operator === '*') {
        result *= rightOperand;
      } else {
        if (rightOperand === 0) {
          throw new Error('Division by zero');
        }
        result /= rightOperand;
      }
    }
    
    return result;
  }
  
  function parseExpression(): number {
    let result = parseTerm();
    
    while (index < expression.length && (expression[index] === '+' || expression[index] === '-')) {
      const operator = expression[index];
      index++;
      const rightOperand = parseTerm();
      
      if (operator === '+') {
        result += rightOperand;
      } else {
        result -= rightOperand;
      }
    }
    
    return result;
  }
  
  const result = parseExpression();
  
  // Ensure we've consumed the entire expression
  if (index !== expression.length) {
    throw new Error('Invalid expression');
  }
  
  return Math.round(result);
}

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
          return res.json({ ...user, authType: "traditional" });
        }
      }
      
      // Then check for Replit authentication
      if (req.user?.claims?.sub) {
        const userId = req.user.claims.sub;
        const user = await storage.getUser(userId);
        if (user) {
          return res.json({ ...user, authType: "replit" });
        }
        
        // For Replit users, create a virtual user object with claims data
        const replitUser = {
          id: userId,
          email: req.user.claims.email || `${userId}@replit.com`,
          firstName: req.user.claims.first_name || req.user.claims.name?.split(' ')[0] || 'User',
          lastName: req.user.claims.last_name || req.user.claims.name?.split(' ').slice(1).join(' ') || '',
          isEmailVerified: true,
          authType: "replit"
        };
        return res.json(replitUser);
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
      
      // Server-side captcha validation
      const { question, answer } = captcha;
      const expectedAnswer = evaluateMathExpression(question);
      if (expectedAnswer === null || parseInt(answer) !== expectedAnswer) {
        return res.status(400).json({ message: "Invalid captcha" });
      }
      
      // Check if email exists in guest accounts
      const guest = await storage.getGuestAccountByEmail(email);
      if (!guest) {
        return res.status(400).json({ message: "Email not found in guest accounts" });
      }
      
      // Check if guest account has expired
      if (guest.expiresAt && new Date() > guest.expiresAt) {
        return res.status(400).json({ message: "Guest account has expired" });
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
      const { captcha, confirmPassword, ...userFields } = req.body;
      const userData = insertUserBackendSchema.parse(userFields);
      
      // Server-side captcha validation
      const { question, answer } = captcha;
      const expectedAnswer = evaluateMathExpression(question);
      if (expectedAnswer === null || parseInt(answer) !== expectedAnswer) {
        return res.status(400).json({ message: "Invalid captcha" });
      }
      
      // Check if email already exists
      const existingUser = await storage.getUserByEmail(userData.email!);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }
      
      // Check if email exists in guest accounts (for upgrade flow)
      const existingGuest = await storage.getGuestAccountByEmail(userData.email!);
      
      const user = await storage.createUser(userData);
      
      // If this was a guest account upgrade, delete the guest account after successful registration
      if (existingGuest) {
        await storage.deleteGuestAccount(existingGuest.id);
        console.log(`Guest account ${existingGuest.id} deleted after successful upgrade to full account for email: ${userData.email}`);
      }
      
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
      console.error("Request body:", JSON.stringify(req.body, null, 2));
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      res.status(500).json({ message: "Failed to create user account" });
    }
  });

  // Traditional user login
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password, captcha } = req.body;
      
      // Server-side captcha validation
      const { question, answer } = captcha;
      const expectedAnswer = evaluateMathExpression(question);
      if (expectedAnswer === null || parseInt(answer) !== expectedAnswer) {
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
      
      // Email verification removed - users can login immediately after registration
      
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

  // Role management routes
  app.get('/api/roles', async (req, res) => {
    try {
      const roles = await storage.getRoles();
      res.json(roles);
    } catch (error) {
      console.error("Error fetching roles:", error);
      res.status(500).json({ message: "Failed to fetch roles" });
    }
  });

  app.get('/api/roles/:id', async (req, res) => {
    try {
      const role = await storage.getRole(req.params.id);
      if (!role) {
        return res.status(404).json({ message: "Role not found" });
      }
      res.json(role);
    } catch (error) {
      console.error("Error fetching role:", error);
      res.status(500).json({ message: "Failed to fetch role" });
    }
  });

  // User-Role management routes
  app.get('/api/users/:userId/roles', async (req, res) => {
    try {
      const userRoles = await storage.getUserRoles(req.params.userId);
      res.json(userRoles);
    } catch (error) {
      console.error("Error fetching user roles:", error);
      res.status(500).json({ message: "Failed to fetch user roles" });
    }
  });

  app.post('/api/users/:userId/roles', async (req, res) => {
    try {
      const roleData = insertUserRoleSchema.parse({
        userId: req.params.userId,
        roleId: req.body.roleId,
      });
      const userRole = await storage.assignRoleToUser(roleData.userId, roleData.roleId);
      res.json(userRole);
    } catch (error: any) {
      console.error("Error assigning role:", error);
      res.status(500).json({ message: error.message || "Failed to assign role" });
    }
  });

  app.delete('/api/users/:userId/roles/:roleId', async (req, res) => {
    try {
      await storage.removeUserRole(req.params.userId, req.params.roleId);
      res.json({ message: "Role removed successfully" });
    } catch (error) {
      console.error("Error removing role:", error);
      res.status(500).json({ message: "Failed to remove role" });
    }
  });

  app.get('/api/users/:userId/has-role/:roleName', async (req, res) => {
    try {
      const hasRole = await storage.checkUserHasRole(req.params.userId, req.params.roleName);
      res.json({ hasRole });
    } catch (error) {
      console.error("Error checking user role:", error);
      res.status(500).json({ message: "Failed to check user role" });
    }
  });

  // Content management routes
  app.get('/api/content', async (req, res) => {
    try {
      const { page, section } = req.query;
      const content = await storage.getPageContent(
        page as string,
        section as string | undefined
      );
      res.json(content);
    } catch (error) {
      console.error("Error fetching content:", error);
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  app.get('/api/content/:id', async (req, res) => {
    try {
      const content = await storage.getPageContentById(req.params.id);
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      res.json(content);
    } catch (error) {
      console.error("Error fetching content:", error);
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  app.post('/api/content', async (req, res) => {
    try {
      const contentData = insertPageContentSchema.parse(req.body);
      const content = await storage.createPageContent(contentData);
      res.json(content);
    } catch (error: any) {
      console.error("Error creating content:", error);
      res.status(500).json({ message: error.message || "Failed to create content" });
    }
  });

  app.patch('/api/content/:id', async (req, res) => {
    try {
      const content = await storage.updatePageContent(req.params.id, req.body);
      res.json(content);
    } catch (error) {
      console.error("Error updating content:", error);
      res.status(500).json({ message: "Failed to update content" });
    }
  });

  app.delete('/api/content/:id', async (req, res) => {
    try {
      await storage.deletePageContent(req.params.id);
      res.json({ message: "Content deleted successfully" });
    } catch (error) {
      console.error("Error deleting content:", error);
      res.status(500).json({ message: "Failed to delete content" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
