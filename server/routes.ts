import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import connectPg from "connect-pg-simple";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { 
  insertUserRegistrationSchema,
  insertUserBackendSchema,
  insertCalculationSchema,
  insertResourceSchema,
  insertContactMessageSchema,
  insertNetWorthSnapshotSchema,
  insertUserRoleSchema,
  insertPageContentSchema
} from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { objectStorageClient } from "./replit_integrations/object_storage";

// Configure multer for image uploads (memory storage for processing before upload)
const multerStorage = multer.memoryStorage();
const upload = multer({
  storage: multerStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.'));
    }
  },
});

// Get bucket name from environment
function getBucketName(): string {
  const bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID;
  if (!bucketId) {
    throw new Error('DEFAULT_OBJECT_STORAGE_BUCKET_ID not set');
  }
  return bucketId;
}

// Process and upload hero image to persistent object storage
async function processHeroImage(buffer: Buffer, originalName: string): Promise<{
  fileName: string;
  filePath: string;
  width: number;
  height: number;
  fileSize: number;
}> {
  const timestamp = Date.now();
  const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileName = `hero_${timestamp}_${sanitizedName.replace(/\.[^.]+$/, '')}.webp`;

  console.log('[Image Upload] Processing image:', originalName);

  // Process image: resize to max 1920px width (maintaining aspect ratio), convert to WebP for optimization
  const processedBuffer = await sharp(buffer)
    .resize(1920, 480, { 
      withoutEnlargement: true,
      fit: 'cover'
    })
    .webp({ quality: 90 })
    .toBuffer({ resolveWithObject: true });

  console.log('[Image Upload] Image processed, size:', processedBuffer.info.size);

  // Upload to object storage
  let bucketName = getBucketName();
  // Remove leading slash if present
  if (bucketName.startsWith('/')) {
    bucketName = bucketName.slice(1);
  }
  console.log('[Image Upload] Bucket name:', bucketName);
  
  const bucket = objectStorageClient.bucket(bucketName);
  const objectPath = `public/hero-images/${fileName}`;
  const file = bucket.file(objectPath);
  
  console.log('[Image Upload] Uploading to:', objectPath);
  
  await file.save(processedBuffer.data, {
    contentType: 'image/webp',
    metadata: {
      cacheControl: 'public, max-age=31536000',
    },
  });

  console.log('[Image Upload] File saved successfully');

  // Store the object storage path (served via our proxy endpoint)
  const proxyPath = `/api/storage/hero-images/${fileName}`;
  console.log('[Image Upload] Upload complete, proxy path:', proxyPath);

  return {
    fileName,
    filePath: proxyPath,
    width: processedBuffer.info.width,
    height: processedBuffer.info.height,
    fileSize: processedBuffer.info.size,
  };
}

// Delete image from object storage
async function deleteFromObjectStorage(filePath: string): Promise<void> {
  try {
    let bucketName = getBucketName();
    if (bucketName.startsWith('/')) {
      bucketName = bucketName.slice(1);
    }
    
    let objectPath: string | null = null;
    
    // Check if it's our proxy path
    if (filePath.startsWith('/api/storage/hero-images/')) {
      const fileName = filePath.replace('/api/storage/hero-images/', '');
      objectPath = `public/hero-images/${fileName}`;
    }
    // Check if it's an object storage URL
    else if (filePath.startsWith('https://storage.googleapis.com/')) {
      const url = new URL(filePath);
      const pathParts = url.pathname.split('/');
      objectPath = pathParts.slice(2).join('/');
    }
    
    if (objectPath) {
      const bucket = objectStorageClient.bucket(bucketName);
      const file = bucket.file(objectPath);
      const [exists] = await file.exists();
      if (exists) {
        await file.delete();
        console.log('[Image Delete] Deleted:', objectPath);
      }
    }
  } catch (error) {
    console.error('Error deleting from object storage:', error);
  }
}

// Middleware to check if user has required role (using session data for consistency)
function requireRole(req: any, res: any, roles: string[]): boolean {
  const userRole = req.session?.user?.role;
  
  if (!req.session?.user?.id) {
    res.status(401).json({ message: "You must be logged in to access this resource" });
    return false;
  }

  if (!userRole || !roles.includes(userRole)) {
    res.status(403).json({ message: "You do not have permission to access this resource" });
    return false;
  }

  return true;
}

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
  // Trust proxy - required for production deployments
  app.set('trust proxy', 1);
  
  // Setup session middleware
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  
  const isProduction = process.env.NODE_ENV === "production";
  
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'lax' : 'lax',
      maxAge: sessionTtl,
      path: '/',
    },
  }));

  // Auth routes
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      if (req.session?.user) {
        const user = await storage.getUser(req.session.user.id);
        if (user) {
          return res.json({ ...user, authType: "traditional" });
        }
      }
      
      res.status(401).json({ message: "Please log in to access this resource" });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Unable to retrieve user information at this time" });
    }
  });

  // Logout route
  app.post('/api/auth/logout', async (req: any, res) => {
    try {
      if (req.session?.user) {
        req.session.destroy((err: any) => {
          if (err) {
            console.error("Error destroying session:", err);
            return res.status(500).json({ message: "Unable to complete logout. Please try again" });
          }
          res.json({ message: "You have been successfully logged out" });
        });
      } else {
        res.json({ message: "You are already logged out" });
      }
    } catch (error) {
      console.error("Error during logout:", error);
      res.status(500).json({ message: "Unable to complete logout. Please try again" });
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
        return res.status(400).json({ message: "Security verification failed. Please try again" });
      }
      
      // Check if email already exists
      const existingUser = await storage.getUserByEmail(userData.email!);
      if (existingUser) {
        return res.status(400).json({ message: "An account with this email address already exists" });
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
      console.error("Request body:", JSON.stringify(req.body, null, 2));
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      res.status(500).json({ message: "We're unable to create your account at this time. Please try again later" });
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
        return res.status(400).json({ message: "Security verification failed. Please try again" });
      }
      
      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user || user.authType !== "traditional") {
        return res.status(400).json({ message: "The email or password you entered is incorrect" });
      }
      
      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password!);
      if (!isValidPassword) {
        return res.status(400).json({ message: "The email or password you entered is incorrect" });
      }
      
      // Check if user account is disabled
      if (user.isActive === false) {
        return res.status(403).json({ message: "Your account was disabled. Contact IFS Admin to enable your account." });
      }
      
      // Email verification removed - users can login immediately after registration
      
      // Create session (store user in session including role)
      (req as any).session.user = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        authType: user.authType,
      };
      
      // Explicitly save session before sending response (critical for production)
      (req as any).session.save((err: any) => {
        if (err) {
          console.error("Error saving session:", err);
          return res.status(500).json({ message: "We're unable to complete your login at this time. Please try again" });
        }
        
        res.json({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          authType: user.authType,
        });
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "We're unable to log you in at this time. Please try again later" });
    }
  });

  // Get password hint
  app.post('/api/auth/password-hint', async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email address is required" });
      }
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "No account found with this email address" });
      }
      
      res.json({ 
        hint: user.passwordHint || null,
        hasHint: !!user.passwordHint
      });
    } catch (error) {
      console.error("Error getting password hint:", error);
      res.status(500).json({ message: "Unable to retrieve password hint at this time" });
    }
  });

  // Forgot password (placeholder for future email integration)
  app.post('/api/auth/forgot-password', async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email address is required" });
      }
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "No account found with this email address" });
      }
      
      // TODO: Implement email sending when email integration is ready
      // For now, just acknowledge the request
      res.json({ 
        message: "Password reset via email is not yet available. Please use your password hint or contact support.",
        emailSent: false 
      });
    } catch (error) {
      console.error("Error processing forgot password:", error);
      res.status(500).json({ message: "Unable to process your request at this time" });
    }
  });

  // Calculator routes
  app.post('/api/calculations', async (req, res) => {
    try {
      const calculationData = insertCalculationSchema.parse(req.body);
      
      const calculation = await storage.saveCalculation(calculationData);
      res.json(calculation);
    } catch (error) {
      console.error("Error saving calculation:", error);
      res.status(500).json({ message: "We're unable to save your calculation at this time" });
    }
  });

  app.get('/api/calculations', async (req, res) => {
    try {
      const { userId } = req.query;
      const calculations = await storage.getCalculations(userId as string);
      res.json(calculations);
    } catch (error) {
      console.error("Error fetching calculations:", error);
      res.status(500).json({ message: "We're unable to retrieve your calculations at this time" });
    }
  });

  app.get('/api/calculations/:id', async (req, res) => {
    try {
      const calculation = await storage.getCalculation(req.params.id);
      if (!calculation) {
        return res.status(404).json({ message: "The calculation you're looking for could not be found" });
      }
      res.json(calculation);
    } catch (error) {
      console.error("Error fetching calculation:", error);
      res.status(500).json({ message: "We're unable to retrieve this calculation at this time" });
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
      res.status(500).json({ message: "We're unable to load resources at this time" });
    }
  });

  app.get('/api/resources/:id', async (req, res) => {
    try {
      const resource = await storage.getResource(req.params.id);
      if (!resource) {
        return res.status(404).json({ message: "The resource you're looking for could not be found" });
      }
      
      // Increment view count
      await storage.incrementResourceView(resource.id);
      
      res.json(resource);
    } catch (error) {
      console.error("Error fetching resource:", error);
      res.status(500).json({ message: "We're unable to load this resource at this time" });
    }
  });

  app.post('/api/resources', async (req, res) => {
    try {
      // Only super_admin and content_manager can create resources
      const authorized = requireRole(req, res, ['super_admin', 'content_manager']);
      if (!authorized) return;

      const resourceData = insertResourceSchema.parse(req.body);
      const resource = await storage.createResource(resourceData);
      res.json(resource);
    } catch (error: any) {
      console.error("Error creating resource:", error);
      res.status(500).json({ message: error.message || "We're unable to create this resource at this time" });
    }
  });

  app.patch('/api/resources/:id', async (req, res) => {
    try {
      // Only super_admin and content_manager can update resources
      const authorized = requireRole(req, res, ['super_admin', 'content_manager']);
      if (!authorized) return;

      const resource = await storage.updateResource(req.params.id, req.body);
      res.json(resource);
    } catch (error) {
      console.error("Error updating resource:", error);
      res.status(500).json({ message: "We're unable to update this resource at this time" });
    }
  });

  app.delete('/api/resources/:id', async (req, res) => {
    try {
      // Only super_admin and content_manager can delete resources
      const authorized = requireRole(req, res, ['super_admin', 'content_manager']);
      if (!authorized) return;

      await storage.deleteResource(req.params.id);
      res.json({ message: "Resource has been deleted successfully" });
    } catch (error) {
      console.error("Error deleting resource:", error);
      res.status(500).json({ message: "We're unable to delete this resource at this time" });
    }
  });

  // Contact routes
  app.post('/api/contact', async (req, res) => {
    try {
      const messageData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(messageData);
      
      // TODO: Send notification email to admin
      
      res.json({ message: "Your message has been sent successfully. We'll get back to you soon" });
    } catch (error) {
      console.error("Error sending contact message:", error);
      res.status(500).json({ message: "We're unable to send your message at this time. Please try again later" });
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
      res.status(500).json({ message: "We're unable to save your net worth data at this time" });
    }
  });

  app.get('/api/networth/history', async (req, res) => {
    try {
      const { userId } = req.query;
      const history = await storage.getNetWorthHistory(userId as string);
      res.json(history);
    } catch (error) {
      console.error("Error fetching net worth history:", error);
      res.status(500).json({ message: "We're unable to retrieve your net worth history at this time" });
    }
  });

  // Role management routes
  app.get('/api/roles', async (req, res) => {
    try {
      const roles = await storage.getRoles();
      res.json(roles);
    } catch (error) {
      console.error("Error fetching roles:", error);
      res.status(500).json({ message: "We're unable to load role information at this time" });
    }
  });

  app.get('/api/roles/:id', async (req, res) => {
    try {
      const role = await storage.getRole(req.params.id);
      if (!role) {
        return res.status(404).json({ message: "The requested role could not be found" });
      }
      res.json(role);
    } catch (error) {
      console.error("Error fetching role:", error);
      res.status(500).json({ message: "We're unable to retrieve role information at this time" });
    }
  });

  // User-Role management routes
  app.get('/api/users/:userId/roles', async (req, res) => {
    try {
      const userRoles = await storage.getUserRoles(req.params.userId);
      res.json(userRoles);
    } catch (error) {
      console.error("Error fetching user roles:", error);
      res.status(500).json({ message: "We're unable to retrieve user role information at this time" });
    }
  });

  app.post('/api/users/:userId/roles', async (req, res) => {
    try {
      // Only super_admin and admin can assign roles
      const authorized = await requireRole(req, res, ['super_admin', 'admin']);
      if (!authorized) return;

      const roleData = insertUserRoleSchema.parse({
        userId: req.params.userId,
        roleId: req.body.roleId,
      });
      const userRole = await storage.assignRoleToUser(roleData.userId, roleData.roleId);
      res.json(userRole);
    } catch (error: any) {
      console.error("Error assigning role:", error);
      res.status(500).json({ message: error.message || "We're unable to assign this role at this time" });
    }
  });

  app.delete('/api/users/:userId/roles/:roleId', async (req, res) => {
    try {
      // Only super_admin and admin can remove roles
      const authorized = await requireRole(req, res, ['super_admin', 'admin']);
      if (!authorized) return;

      await storage.removeUserRole(req.params.userId, req.params.roleId);
      res.json({ message: "The role has been successfully removed" });
    } catch (error) {
      console.error("Error removing role:", error);
      res.status(500).json({ message: "We're unable to remove this role at this time" });
    }
  });

  app.get('/api/users/:userId/has-role/:roleName', async (req, res) => {
    try {
      const hasRole = await storage.checkUserHasRole(req.params.userId, req.params.roleName);
      res.json({ hasRole });
    } catch (error) {
      console.error("Error checking user role:", error);
      res.status(500).json({ message: "We're unable to verify user permissions at this time" });
    }
  });

  // Bootstrap super admin (one-time setup)
  app.post('/api/bootstrap', async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email address is required to create an administrator account" });
      }
      
      // Call bootstrap method which checks if super_admin already exists
      const user = await storage.bootstrapSuperAdmin(email);
      
      res.json({ 
        message: "Administrator account has been created successfully",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        }
      });
    } catch (error: any) {
      console.error("Error bootstrapping super admin:", error);
      res.status(400).json({ message: error.message || "We're unable to create the administrator account at this time" });
    }
  });

  // Admin routes for user management
  app.get('/api/admin/users', async (req, res) => {
    try {
      // Only super_admin and admin can view all users
      const authorized = await requireRole(req, res, ['super_admin', 'admin']);
      if (!authorized) return;

      const users = await storage.getAllUsersWithRoles();
      
      // Remove sensitive data
      const sanitizedUsers = users.map(user => ({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        authType: user.authType,
        isEmailVerified: user.isEmailVerified,
        isActive: user.isActive ?? true,
        createdAt: user.createdAt,
        role: user.role,
        roles: user.roles
      }));
      
      res.json(sanitizedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "We're unable to retrieve user information at this time" });
    }
  });

  // Update user role - super_admin and admin only
  app.put('/api/admin/users/:userId/role', async (req, res) => {
    try {
      // Only super_admin and admin can update user roles
      const authorized = await requireRole(req, res, ['super_admin', 'admin']);
      if (!authorized) return;

      const { userId } = req.params;
      const { role } = req.body;

      if (!role) {
        return res.status(400).json({ message: "Please specify a role for this user" });
      }

      // Validate role is one of the valid enum values
      const validRoles = ['super_admin', 'admin', 'content_manager', 'guest_user', 'preferred_client', 'client'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ message: "The specified role is not valid" });
      }

      const updatedUser = await storage.updateUserRole(userId, role);
      
      res.json({
        message: "User role has been updated successfully",
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          role: updatedUser.role,
        }
      });
    } catch (error: any) {
      console.error("Error updating user role:", error);
      res.status(500).json({ message: error.message || "We're unable to update the user role at this time" });
    }
  });

  // Update user active status - super_admin only
  app.put('/api/admin/users/:userId/active', async (req, res) => {
    try {
      const authorized = await requireRole(req, res, ['super_admin']);
      if (!authorized) return;

      const { userId } = req.params;
      const { isActive } = req.body;
      const session = req.session as any;

      if (typeof isActive !== 'boolean') {
        return res.status(400).json({ message: "Please specify whether the user should be active or inactive" });
      }

      const updatedUser = await storage.updateUserActiveStatus(userId, isActive, session?.user?.id);
      
      res.json({
        message: isActive ? "User account has been activated" : "User account has been deactivated",
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          isActive: updatedUser.isActive,
        }
      });
    } catch (error: any) {
      console.error("Error updating user active status:", error);
      res.status(500).json({ message: error.message || "We're unable to update the user status at this time" });
    }
  });

  // Soft delete user (move to inactive) - super_admin only
  app.post('/api/admin/users/:userId/soft-delete', async (req, res) => {
    try {
      const authorized = await requireRole(req, res, ['super_admin']);
      if (!authorized) return;

      const { userId } = req.params;
      const { reason } = req.body;
      const session = req.session as any;

      const inactiveUser = await storage.moveUserToInactive(userId, reason, session?.user?.id);
      
      res.json({
        message: "User has been moved to inactive status. They can be restored later.",
        inactiveUser: {
          id: inactiveUser.id,
          email: inactiveUser.email,
          deactivatedAt: inactiveUser.deactivatedAt,
        }
      });
    } catch (error: any) {
      console.error("Error soft deleting user:", error);
      res.status(500).json({ message: error.message || "We're unable to deactivate the user at this time" });
    }
  });

  // Permanent delete user - super_admin only
  app.delete('/api/admin/users/:userId/permanent', async (req, res) => {
    try {
      const authorized = await requireRole(req, res, ['super_admin']);
      if (!authorized) return;

      const { userId } = req.params;
      const session = req.session as any;

      await storage.permanentDeleteUser(userId, session?.user?.id);
      
      res.json({
        message: "User and all associated data have been permanently deleted",
      });
    } catch (error: any) {
      console.error("Error permanently deleting user:", error);
      res.status(500).json({ message: error.message || "We're unable to delete the user at this time" });
    }
  });

  // Get inactive users - super_admin only
  app.get('/api/admin/inactive-users', async (req, res) => {
    try {
      const authorized = await requireRole(req, res, ['super_admin']);
      if (!authorized) return;

      const inactiveUsers = await storage.getInactiveUsers();
      
      res.json(inactiveUsers.map(user => ({
        id: user.id,
        originalUserId: user.originalUserId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        deactivatedAt: user.deactivatedAt,
        deactivatedBy: user.deactivatedBy,
        reason: user.reason,
        originalCreatedAt: user.originalCreatedAt,
      })));
    } catch (error) {
      console.error("Error fetching inactive users:", error);
      res.status(500).json({ message: "We're unable to retrieve inactive users at this time" });
    }
  });

  // Restore inactive user - super_admin only
  app.post('/api/admin/inactive-users/:inactiveUserId/restore', async (req, res) => {
    try {
      const authorized = await requireRole(req, res, ['super_admin']);
      if (!authorized) return;

      const { inactiveUserId } = req.params;
      const session = req.session as any;

      const restoredUser = await storage.restoreInactiveUser(inactiveUserId, session?.user?.id);
      
      res.json({
        message: "User has been restored successfully",
        user: {
          id: restoredUser.id,
          email: restoredUser.email,
          firstName: restoredUser.firstName,
          lastName: restoredUser.lastName,
        }
      });
    } catch (error: any) {
      console.error("Error restoring user:", error);
      res.status(500).json({ message: error.message || "We're unable to restore the user at this time" });
    }
  });

  // Permanently delete inactive user - super_admin only
  app.delete('/api/admin/inactive-users/:inactiveUserId', async (req, res) => {
    try {
      const authorized = await requireRole(req, res, ['super_admin']);
      if (!authorized) return;

      const { inactiveUserId } = req.params;

      await storage.deleteInactiveUser(inactiveUserId);
      
      res.json({
        message: "Inactive user record has been permanently deleted",
      });
    } catch (error: any) {
      console.error("Error deleting inactive user:", error);
      res.status(500).json({ message: error.message || "We're unable to delete the inactive user at this time" });
    }
  });

  // Get user audit history - super_admin only
  app.get('/api/admin/audit-history', async (req, res) => {
    try {
      const authorized = await requireRole(req, res, ['super_admin']);
      if (!authorized) return;

      const { userId } = req.query;
      const auditHistory = await storage.getAuditHistory(userId as string | undefined);
      
      res.json(auditHistory);
    } catch (error) {
      console.error("Error fetching audit history:", error);
      res.status(500).json({ message: "We're unable to retrieve audit history at this time" });
    }
  });

  // Dashboard statistics for super_admin and admin
  app.get('/api/admin/dashboard-stats', async (req, res) => {
    try {
      // Only super_admin and admin can view dashboard stats
      const authorized = await requireRole(req, res, ['super_admin', 'admin']);
      if (!authorized) return;

      const [activeClients, totalCalculations, totalResources] = await Promise.all([
        storage.getActiveClientsCount(),
        storage.getTotalCalculationsCount(),
        storage.getTotalResourcesCount(),
      ]);

      const recentActivity = await storage.getRecentActivity(10);

      res.json({
        activeClients,
        totalCalculations,
        totalResources,
        recentActivity,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "We're unable to load dashboard statistics at this time" });
    }
  });

  // Login history for super_admin and admin
  app.get('/api/admin/login-history', async (req, res) => {
    try {
      // Only super_admin and admin can view login history
      const authorized = await requireRole(req, res, ['super_admin', 'admin']);
      if (!authorized) return;

      const limit = parseInt(req.query.limit as string) || 50;
      const history = await storage.getLoginHistory(limit);

      res.json(history);
    } catch (error) {
      console.error("Error fetching login history:", error);
      res.status(500).json({ message: "We're unable to retrieve login history at this time" });
    }
  });

  // Role permission routes
  app.get('/api/admin/role-permissions', async (req, res) => {
    try {
      const authorized = await requireRole(req, res, ['super_admin', 'admin']);
      if (!authorized) return;

      const permissions = await storage.getRolePermissions();
      res.json(permissions);
    } catch (error) {
      console.error("Error fetching role permissions:", error);
      res.status(500).json({ message: "Unable to fetch role permissions" });
    }
  });

  app.post('/api/admin/role-permissions', async (req, res) => {
    try {
      const authorized = await requireRole(req, res, ['super_admin', 'admin']);
      if (!authorized) return;

      const { permissions } = req.body;
      
      if (!Array.isArray(permissions)) {
        return res.status(400).json({ message: "Permissions must be an array" });
      }

      await storage.setRolePermissions(permissions);
      res.json({ message: "Permissions updated successfully" });
    } catch (error) {
      console.error("Error updating role permissions:", error);
      res.status(500).json({ message: "Unable to update role permissions" });
    }
  });

  // Get current user's permissions
  app.get('/api/user/permissions', async (req, res) => {
    try {
      const userId = req.session?.user?.id;
      const userRole = req.session?.user?.role;

      // If user is not logged in, return empty permissions (guest access)
      if (!userId) {
        return res.json([]);
      }

      // Get permissions for the user's role
      const permissions = await storage.getRolePermissionsByRole(userRole || 'client');
      
      // Debug: Log what we're returning
      console.log(`[DEBUG] User ${userId} (${userRole}) has ${permissions.length} permissions`);
      const calcPerms = permissions.filter(p => p.resourceType === 'calculator');
      console.log(`[DEBUG] Calculator permissions (${calcPerms.length}):`, calcPerms.map(p => p.resourceId));
      
      res.json(permissions);
    } catch (error) {
      console.error("Error fetching user permissions:", error);
      res.status(500).json({ message: "Unable to fetch permissions" });
    }
  });

  // Get unregistered permissions (for visitors who haven't logged in)
  app.get('/api/guest/permissions', async (req, res) => {
    try {
      // Return permissions for unregistered role (visitors who haven't logged in at all)
      const permissions = await storage.getRolePermissionsByRole('unregistered');
      res.json(permissions);
    } catch (error) {
      console.error("Error fetching unregistered permissions:", error);
      res.status(500).json({ message: "Unable to fetch permissions" });
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
      res.status(500).json({ message: "We're unable to load the content at this time" });
    }
  });

  app.get('/api/content/:id', async (req, res) => {
    try {
      const content = await storage.getPageContentById(req.params.id);
      if (!content) {
        return res.status(404).json({ message: "The requested content could not be found" });
      }
      res.json(content);
    } catch (error) {
      console.error("Error fetching content:", error);
      res.status(500).json({ message: "We're unable to load the content at this time" });
    }
  });

  app.post('/api/content', async (req, res) => {
    try {
      // Only super_admin and content_manager can create content
      const authorized = requireRole(req, res, ['super_admin', 'content_manager']);
      if (!authorized) return;

      const contentData = insertPageContentSchema.parse(req.body);
      const content = await storage.createPageContent(contentData);
      
      // Save to history
      await storage.createPageContentHistory({
        contentId: content.id,
        page: content.page,
        section: content.section,
        content: content.content,
        published: content.published || false,
        changedBy: req.session.user.email,
        changeType: 'create',
      });
      
      res.json(content);
    } catch (error: any) {
      console.error("Error creating content:", error);
      res.status(500).json({ message: error.message || "We're unable to create this content at this time" });
    }
  });

  app.patch('/api/content/:id', async (req, res) => {
    try {
      // Only super_admin and content_manager can update content
      const authorized = requireRole(req, res, ['super_admin', 'content_manager']);
      if (!authorized) return;

      const content = await storage.updatePageContent(req.params.id, req.body);
      
      // Save to history
      await storage.createPageContentHistory({
        contentId: content.id,
        page: content.page,
        section: content.section,
        content: content.content,
        published: content.published || false,
        changedBy: req.session.user.email,
        changeType: 'update',
      });
      
      res.json(content);
    } catch (error) {
      console.error("Error updating content:", error);
      res.status(500).json({ message: "We're unable to update this content at this time" });
    }
  });

  app.delete('/api/content/:id', async (req, res) => {
    try {
      // Only super_admin and content_manager can delete content
      const authorized = requireRole(req, res, ['super_admin', 'content_manager']);
      if (!authorized) return;

      // Get content before deleting for history
      const contentToDelete = await storage.getPageContentById(req.params.id);
      if (contentToDelete) {
        // Save to history
        await storage.createPageContentHistory({
          contentId: contentToDelete.id,
          page: contentToDelete.page,
          section: contentToDelete.section,
          content: contentToDelete.content,
          published: contentToDelete.published || false,
          changedBy: req.session.user.email,
          changeType: 'delete',
        });
      }

      await storage.deletePageContent(req.params.id);
      res.json({ message: "Content has been deleted successfully" });
    } catch (error) {
      console.error("Error deleting content:", error);
      res.status(500).json({ message: "We're unable to delete this content at this time" });
    }
  });

  // Page content history routes (super admin and admin only)
  app.get('/api/admin/content-history', async (req, res) => {
    try {
      const authorized = requireRole(req, res, ['super_admin', 'admin']);
      if (!authorized) return;

      const contentId = req.query.contentId as string | undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      
      const history = await storage.getPageContentHistory(contentId, limit);
      res.json(history);
    } catch (error) {
      console.error("Error fetching content history:", error);
      res.status(500).json({ message: "Unable to fetch content history" });
    }
  });

  app.post('/api/admin/content-history/:historyId/restore', async (req, res) => {
    try {
      const authorized = requireRole(req, res, ['super_admin', 'admin']);
      if (!authorized) return;

      const restored = await storage.restorePageContentFromHistory(req.params.historyId);
      
      // Save restoration action to history
      await storage.createPageContentHistory({
        contentId: restored.id,
        page: restored.page,
        section: restored.section,
        content: restored.content,
        published: restored.published || false,
        changedBy: req.session.user.email,
        changeType: 'update',
      });
      
      res.json({ message: "Content restored successfully", content: restored });
    } catch (error) {
      console.error("Error restoring content:", error);
      res.status(500).json({ message: "Unable to restore content" });
    }
  });

  // Site settings routes - font settings are public for CSS application
  app.get('/api/site-settings', async (req, res) => {
    try {
      const settingType = req.query.type as string | undefined;
      const settings = await storage.getSiteSettings(settingType);
      res.json(settings);
    } catch (error) {
      console.error("Error fetching site settings:", error);
      res.status(500).json({ message: "Unable to fetch site settings" });
    }
  });

  // Update site settings - requires admin or content manager role
  app.put('/api/admin/site-settings/:settingKey', async (req, res) => {
    try {
      const authorized = requireRole(req, res, ['super_admin', 'admin', 'content_manager']);
      if (!authorized) return;

      const { settingKey } = req.params;
      const { value } = req.body;

      if (value === undefined) {
        return res.status(400).json({ message: "Value is required" });
      }

      const updatedSetting = await storage.updateSiteSetting(
        settingKey,
        String(value),
        req.session.user?.email
      );

      if (!updatedSetting) {
        return res.status(404).json({ message: "Setting not found" });
      }

      res.json(updatedSetting);
    } catch (error) {
      console.error("Error updating site setting:", error);
      res.status(500).json({ message: "Unable to update site setting" });
    }
  });

  // Batch update site settings
  app.put('/api/admin/site-settings', async (req, res) => {
    try {
      const authorized = requireRole(req, res, ['super_admin', 'admin', 'content_manager']);
      if (!authorized) return;

      const { settings } = req.body;
      if (!settings || !Array.isArray(settings)) {
        return res.status(400).json({ message: "Settings array is required" });
      }

      const results = [];
      for (const setting of settings) {
        if (setting.key && setting.value !== undefined) {
          const updated = await storage.updateSiteSetting(
            setting.key,
            String(setting.value),
            req.session.user?.email
          );
          if (updated) results.push(updated);
        }
      }

      res.json(results);
    } catch (error) {
      console.error("Error updating site settings:", error);
      res.status(500).json({ message: "Unable to update site settings" });
    }
  });

  // Proxy endpoint to serve images from object storage
  // This is needed because the bucket has public access prevention enabled
  app.get('/api/storage/hero-images/:fileName', async (req, res) => {
    try {
      let bucketName = getBucketName();
      if (bucketName.startsWith('/')) {
        bucketName = bucketName.slice(1);
      }
      
      const { fileName } = req.params;
      const objectPath = `public/hero-images/${fileName}`;
      
      const bucket = objectStorageClient.bucket(bucketName);
      const file = bucket.file(objectPath);
      
      const [exists] = await file.exists();
      if (!exists) {
        return res.status(404).json({ message: "Image not found" });
      }
      
      const [metadata] = await file.getMetadata();
      
      res.set({
        'Content-Type': metadata.contentType || 'image/webp',
        'Cache-Control': 'public, max-age=31536000',
      });
      
      file.createReadStream().pipe(res);
    } catch (error) {
      console.error("Error serving image:", error);
      res.status(500).json({ message: "Unable to serve image" });
    }
  });

  // Image asset routes
  // NOTE: GET endpoints are intentionally public because:
  // 1. Hero images are displayed on public-facing pages to all website visitors
  // 2. The useDynamicImage hook on public pages needs to fetch image metadata
  // 3. Only filePath, page, section, and dimensions are returned - no sensitive data
  // 4. Upload/Delete operations ARE protected by requireRole middleware below
  app.get('/api/images', async (req, res) => {
    try {
      const page = req.query.page as string | undefined;
      const images = await storage.getImageAssets(page);
      // Return only public-safe fields
      const publicImages = images.map(img => ({
        id: img.id,
        page: img.page,
        section: img.section,
        filePath: img.filePath,
        width: img.width,
        height: img.height,
        createdAt: img.createdAt,
      }));
      res.json(publicImages);
    } catch (error) {
      console.error("Error fetching images:", error);
      res.status(500).json({ message: "Unable to fetch images" });
    }
  });

  app.get('/api/images/:page/:section', async (req, res) => {
    try {
      const { page, section } = req.params;
      const image = await storage.getImageAssetByPageSection(page, section);
      if (image) {
        // Return only public-safe fields
        res.json({
          id: image.id,
          page: image.page,
          section: image.section,
          filePath: image.filePath,
          width: image.width,
          height: image.height,
          createdAt: image.createdAt,
        });
      } else {
        res.status(404).json({ message: "Image not found" });
      }
    } catch (error) {
      console.error("Error fetching image:", error);
      res.status(500).json({ message: "Unable to fetch image" });
    }
  });

  app.post('/api/images/upload', upload.single('image'), async (req: any, res) => {
    try {
      const authorized = requireRole(req, res, ['super_admin', 'content_manager']);
      if (!authorized) return;

      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const { page, section } = req.body;
      if (!page || !section) {
        return res.status(400).json({ message: "Page and section are required" });
      }

      // Process the image
      const processedImage = await processHeroImage(req.file.buffer, req.file.originalname);

      // Check if an image already exists for this page/section
      const existingImage = await storage.getImageAssetByPageSection(page, section);

      let imageAsset;
      if (existingImage) {
        // Delete old file from object storage
        await deleteFromObjectStorage(existingImage.filePath);
        
        // Update existing record
        imageAsset = await storage.updateImageAsset(existingImage.id, {
          fileName: processedImage.fileName,
          filePath: processedImage.filePath,
          originalName: req.file.originalname,
          mimeType: 'image/webp',
          fileSize: processedImage.fileSize,
          width: processedImage.width,
          height: processedImage.height,
          uploadedBy: req.session.user?.id,
        });
      } else {
        // Create new record
        imageAsset = await storage.createImageAsset({
          page,
          section,
          fileName: processedImage.fileName,
          filePath: processedImage.filePath,
          originalName: req.file.originalname,
          mimeType: 'image/webp',
          fileSize: processedImage.fileSize,
          width: processedImage.width,
          height: processedImage.height,
          uploadedBy: req.session.user?.id,
        });
      }

      res.json({ 
        message: "Image uploaded successfully", 
        image: imageAsset 
      });
    } catch (error: any) {
      console.error("Error uploading image:", error);
      console.error("Error details:", error?.message);
      res.status(500).json({ message: "Unable to upload image", error: error?.message });
    }
  });

  app.delete('/api/images/:id', async (req, res) => {
    try {
      const authorized = requireRole(req, res, ['super_admin', 'content_manager']);
      if (!authorized) return;

      const image = await storage.getImageAsset(req.params.id);
      if (!image) {
        return res.status(404).json({ message: "Image not found" });
      }

      // Delete file from object storage
      await deleteFromObjectStorage(image.filePath);

      await storage.deleteImageAsset(req.params.id);
      res.json({ message: "Image deleted successfully" });
    } catch (error) {
      console.error("Error deleting image:", error);
      res.status(500).json({ message: "Unable to delete image" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
