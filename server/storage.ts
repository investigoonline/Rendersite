import {
  users,
  guestAccounts,
  calculations,
  resources,
  contactMessages,
  netWorthSnapshots,
  type User,
  type UpsertUser,
  type InsertUserRegistration,
  type InsertUserBackend,
  type GuestAccount,
  type InsertGuestAccount,
  type Calculation,
  type InsertCalculation,
  type Resource,
  type InsertResource,
  type ContactMessage,
  type InsertContactMessage,
  type NetWorthSnapshot,
  type InsertNetWorthSnapshot,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// Generate secure random token
function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export interface IStorage {
  // User operations - Required for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Traditional registration operations
  createUser(user: InsertUserBackend): Promise<User>;
  updateUserPassword(userId: string, hashedPassword: string): Promise<void>;
  verifyUserEmail(userId: string, token: string): Promise<boolean>;
  
  // Guest account operations
  createGuestAccount(guest: InsertGuestAccount): Promise<GuestAccount>;
  getGuestAccount(id: string): Promise<GuestAccount | undefined>;
  getGuestAccountByEmail(email: string): Promise<GuestAccount | undefined>;
  verifyGuestAccount(id: string, token: string): Promise<boolean>;
  updateGuestActivity(id: string): Promise<void>;
  deleteGuestAccount(id: string): Promise<void>;
  cleanupExpiredGuests(): Promise<void>;
  
  // Calculation operations
  saveCalculation(calculation: InsertCalculation): Promise<Calculation>;
  getCalculations(userId?: string, guestId?: string): Promise<Calculation[]>;
  getCalculation(id: string): Promise<Calculation | undefined>;
  
  // Resource operations
  getResources(type?: string, category?: string): Promise<Resource[]>;
  getResource(id: string): Promise<Resource | undefined>;
  createResource(resource: InsertResource): Promise<Resource>;
  incrementResourceView(id: string): Promise<void>;
  
  // Contact operations
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
  
  // Net worth operations
  saveNetWorthSnapshot(snapshot: InsertNetWorthSnapshot): Promise<NetWorthSnapshot>;
  getNetWorthHistory(userId?: string, guestId?: string): Promise<NetWorthSnapshot[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations - Required for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Traditional registration operations
  async createUser(user: InsertUserBackend): Promise<User> {
    const hashedPassword = await bcrypt.hash(user.password!, 10);
    const emailVerificationToken = generateSecureToken();

    const [newUser] = await db
      .insert(users)
      .values({
        email: user.email!,
        firstName: user.firstName!,
        lastName: user.lastName!,
        phone: user.phone,
        password: hashedPassword,
        authType: "traditional",
        isEmailVerified: true,
        emailVerificationToken,
      })
      .returning();
    return newUser;
  }

  async updateUserPassword(userId: string, hashedPassword: string): Promise<void> {
    await db
      .update(users)
      .set({ 
        password: hashedPassword,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }

  async verifyUserEmail(userId: string, token: string): Promise<boolean> {
    const [updated] = await db
      .update(users)
      .set({ 
        isEmailVerified: true, 
        emailVerificationToken: null,
        updatedAt: new Date(),
      })
      .where(and(
        eq(users.id, userId),
        eq(users.emailVerificationToken, token)
      ))
      .returning();
    return !!updated;
  }

  // Guest account operations
  async createGuestAccount(guest: InsertGuestAccount): Promise<GuestAccount> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30-day expiration

    const verificationToken = generateSecureToken();

    const [guestAccount] = await db
      .insert(guestAccounts)
      .values({
        ...guest,
        expiresAt,
        verificationToken,
      })
      .returning();
    return guestAccount;
  }

  async getGuestAccount(id: string): Promise<GuestAccount | undefined> {
    const [guest] = await db
      .select()
      .from(guestAccounts)
      .where(eq(guestAccounts.id, id));
    return guest;
  }

  async getGuestAccountByEmail(email: string): Promise<GuestAccount | undefined> {
    const [guest] = await db
      .select()
      .from(guestAccounts)
      .where(eq(guestAccounts.email, email));
    return guest;
  }

  async verifyGuestAccount(id: string, token: string): Promise<boolean> {
    const [updated] = await db
      .update(guestAccounts)
      .set({ verified: true, verificationToken: null })
      .where(and(
        eq(guestAccounts.id, id),
        eq(guestAccounts.verificationToken, token)
      ))
      .returning();
    return !!updated;
  }

  async updateGuestActivity(id: string): Promise<void> {
    await db
      .update(guestAccounts)
      .set({ lastActivity: new Date() })
      .where(eq(guestAccounts.id, id));
  }

  async deleteGuestAccount(id: string): Promise<void> {
    await db
      .delete(guestAccounts)
      .where(eq(guestAccounts.id, id));
  }

  async cleanupExpiredGuests(): Promise<void> {
    await db
      .delete(guestAccounts)
      .where(sql`${guestAccounts.expiresAt} < ${new Date()}`);
  }

  // Calculation operations
  async saveCalculation(calculation: InsertCalculation): Promise<Calculation> {
    const [saved] = await db
      .insert(calculations)
      .values(calculation)
      .returning();
    return saved;
  }

  async getCalculations(userId?: string, guestId?: string): Promise<Calculation[]> {
    let whereConditions = [];
    
    if (userId) {
      whereConditions.push(eq(calculations.userId, userId));
    } else if (guestId) {
      whereConditions.push(eq(calculations.guestId, guestId));
    }
    
    if (whereConditions.length > 0) {
      return db
        .select()
        .from(calculations)
        .where(and(...whereConditions))
        .orderBy(desc(calculations.createdAt));
    }
    
    return db
      .select()
      .from(calculations)
      .orderBy(desc(calculations.createdAt));
  }

  async getCalculation(id: string): Promise<Calculation | undefined> {
    const [calculation] = await db
      .select()
      .from(calculations)
      .where(eq(calculations.id, id));
    return calculation;
  }

  // Resource operations
  async getResources(type?: string, category?: string): Promise<Resource[]> {
    let whereConditions = [eq(resources.published, true)];
    
    if (type) {
      whereConditions.push(eq(resources.type, type as any));
    }
    
    if (category) {
      whereConditions.push(eq(resources.category, category));
    }
    
    return db
      .select()
      .from(resources)
      .where(and(...whereConditions))
      .orderBy(desc(resources.createdAt));
  }

  async getResource(id: string): Promise<Resource | undefined> {
    const [resource] = await db
      .select()
      .from(resources)
      .where(eq(resources.id, id));
    return resource;
  }

  async createResource(resource: InsertResource): Promise<Resource> {
    const [created] = await db
      .insert(resources)
      .values(resource)
      .returning();
    return created;
  }

  async incrementResourceView(id: string): Promise<void> {
    await db
      .update(resources)
      .set({ viewCount: sql`${resources.viewCount} + 1` })
      .where(eq(resources.id, id));
  }

  // Contact operations
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [created] = await db
      .insert(contactMessages)
      .values(message)
      .returning();
    return created;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt));
  }

  // Net worth operations
  async saveNetWorthSnapshot(snapshot: InsertNetWorthSnapshot): Promise<NetWorthSnapshot> {
    const [saved] = await db
      .insert(netWorthSnapshots)
      .values(snapshot)
      .returning();
    return saved;
  }

  async getNetWorthHistory(userId?: string, guestId?: string): Promise<NetWorthSnapshot[]> {
    let whereConditions = [];
    
    if (userId) {
      whereConditions.push(eq(netWorthSnapshots.userId, userId));
    } else if (guestId) {
      whereConditions.push(eq(netWorthSnapshots.guestId, guestId));
    }
    
    if (whereConditions.length > 0) {
      return db
        .select()
        .from(netWorthSnapshots)
        .where(and(...whereConditions))
        .orderBy(desc(netWorthSnapshots.createdAt));
    }
    
    return db
      .select()
      .from(netWorthSnapshots)
      .orderBy(desc(netWorthSnapshots.createdAt));
  }
}

export const storage = new DatabaseStorage();
