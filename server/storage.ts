import {
  users,
  guestAccounts,
  calculations,
  resources,
  contactMessages,
  netWorthSnapshots,
  roles,
  userRoles,
  pageContent,
  loginHistory,
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
  type Role,
  type InsertRole,
  type UserRole,
  type InsertUserRole,
  type PageContent,
  type InsertPageContent,
  type LoginHistory,
  type InsertLoginHistory,
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
  
  // Role operations
  getRoles(): Promise<Role[]>;
  getRole(id: string): Promise<Role | undefined>;
  getRoleByName(name: string): Promise<Role | undefined>;
  
  // User-Role operations
  assignRoleToUser(userId: string, roleId: string): Promise<UserRole>;
  getUserRoles(userId: string): Promise<(UserRole & { role: Role })[]>;
  removeUserRole(userId: string, roleId: string): Promise<void>;
  checkUserHasRole(userId: string, roleName: string): Promise<boolean>;
  getAllUsersWithRoles(): Promise<Array<User & { roles: Role[] }>>;
  bootstrapSuperAdmin(email: string): Promise<User>;
  updateUserRole(userId: string, roleName: string): Promise<User>;
  
  // Content operations
  getPageContent(page: string, section?: string): Promise<PageContent[]>;
  getPageContentById(id: string): Promise<PageContent | undefined>;
  createPageContent(content: InsertPageContent): Promise<PageContent>;
  updatePageContent(id: string, content: Partial<InsertPageContent>): Promise<PageContent>;
  deletePageContent(id: string): Promise<void>;
  
  // Admin dashboard operations
  getGuestUserCount(): Promise<number>;
  getActiveClientsCount(): Promise<number>;
  getTotalCalculationsCount(): Promise<number>;
  getTotalResourcesCount(): Promise<number>;
  getRecentActivity(limit: number): Promise<Array<{ type: string; description: string; timestamp: string }>>;
  
  // Login history operations
  createLoginHistory(login: InsertLoginHistory): Promise<LoginHistory>;
  getLoginHistory(limit?: number): Promise<LoginHistory[]>;
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
        isEmailVerified: false,
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

  // Role operations
  async getRoles(): Promise<Role[]> {
    return db.select().from(roles).orderBy(roles.displayName);
  }

  async getRole(id: string): Promise<Role | undefined> {
    const [role] = await db.select().from(roles).where(eq(roles.id, id));
    return role;
  }

  async getRoleByName(name: string): Promise<Role | undefined> {
    const [role] = await db.select().from(roles).where(eq(roles.name, name as any));
    return role;
  }

  // User-Role operations
  async assignRoleToUser(userId: string, roleId: string): Promise<UserRole> {
    const [userRole] = await db
      .insert(userRoles)
      .values({ userId, roleId })
      .returning();
    return userRole;
  }

  async getUserRoles(userId: string): Promise<(UserRole & { role: Role })[]> {
    const result = await db
      .select({
        id: userRoles.id,
        userId: userRoles.userId,
        roleId: userRoles.roleId,
        assignedAt: userRoles.assignedAt,
        role: roles,
      })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(userRoles.userId, userId));
    
    return result as (UserRole & { role: Role })[];
  }

  async removeUserRole(userId: string, roleId: string): Promise<void> {
    await db
      .delete(userRoles)
      .where(and(
        eq(userRoles.userId, userId),
        eq(userRoles.roleId, roleId)
      ));
  }

  async checkUserHasRole(userId: string, roleName: string): Promise<boolean> {
    const result = await db
      .select({ id: userRoles.id })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(and(
        eq(userRoles.userId, userId),
        eq(roles.name, roleName as any)
      ))
      .limit(1);
    
    return result.length > 0;
  }

  async getAllUsersWithRoles(): Promise<Array<User & { roles: Role[] }>> {
    // Get all users
    const allUsers = await db.select().from(users);
    
    // For each user, get their roles
    const usersWithRoles = await Promise.all(
      allUsers.map(async (user) => {
        const userRoleRecords = await this.getUserRoles(user.id);
        return {
          ...user,
          roles: userRoleRecords.map(ur => ur.role),
        };
      })
    );
    
    return usersWithRoles;
  }

  async bootstrapSuperAdmin(email: string): Promise<User> {
    // Check if any super_admin exists
    const existingSuperAdmins = await db
      .select({ id: userRoles.id })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(roles.name, 'super_admin'))
      .limit(1);
    
    if (existingSuperAdmins.length > 0) {
      throw new Error('A super admin already exists. Cannot bootstrap.');
    }
    
    // Get or create the user
    let user = await this.getUserByEmail(email);
    if (!user) {
      // Create user with minimal data
      const [newUser] = await db
        .insert(users)
        .values({
          email,
          firstName: 'Super',
          lastName: 'Admin',
          authType: 'replit',
          isEmailVerified: true,
        })
        .returning();
      user = newUser;
    }
    
    // Ensure super_admin role exists
    let superAdminRole = await this.getRoleByName('super_admin');
    if (!superAdminRole) {
      const [newRole] = await db
        .insert(roles)
        .values({
          name: 'super_admin',
          displayName: 'Super Admin',
          description: 'Full system access and user management',
        })
        .returning();
      superAdminRole = newRole;
    }
    
    // Assign super_admin role
    await this.assignRoleToUser(user.id, superAdminRole.id);
    
    return user;
  }

  async updateUserRole(userId: string, roleName: string): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({
        role: roleName as any,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    
    if (!updatedUser) {
      throw new Error('User not found');
    }
    
    return updatedUser;
  }

  // Content operations
  async getPageContent(page: string, section?: string): Promise<PageContent[]> {
    let whereConditions = [eq(pageContent.page, page)];
    
    if (section) {
      whereConditions.push(eq(pageContent.section, section as any));
    }
    
    return db
      .select()
      .from(pageContent)
      .where(and(...whereConditions))
      .orderBy(pageContent.section);
  }

  async getPageContentById(id: string): Promise<PageContent | undefined> {
    const [content] = await db
      .select()
      .from(pageContent)
      .where(eq(pageContent.id, id));
    return content;
  }

  async createPageContent(content: InsertPageContent): Promise<PageContent> {
    const [created] = await db
      .insert(pageContent)
      .values(content)
      .returning();
    return created;
  }

  async updatePageContent(id: string, content: Partial<InsertPageContent>): Promise<PageContent> {
    const [updated] = await db
      .update(pageContent)
      .set({
        ...content,
        updatedAt: new Date(),
      })
      .where(eq(pageContent.id, id))
      .returning();
    return updated;
  }

  async deletePageContent(id: string): Promise<void> {
    await db
      .delete(pageContent)
      .where(eq(pageContent.id, id));
  }

  // Admin dashboard operations
  async getGuestUserCount(): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(guestAccounts);
    return result[0]?.count || 0;
  }

  async getActiveClientsCount(): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(users)
      .where(eq(users.role, 'client'));
    return result[0]?.count || 0;
  }

  async getTotalCalculationsCount(): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(calculations);
    return result[0]?.count || 0;
  }

  async getTotalResourcesCount(): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(resources)
      .where(eq(resources.published, true));
    return result[0]?.count || 0;
  }

  async getRecentActivity(limit: number): Promise<Array<{ type: string; description: string; timestamp: string }>> {
    const recentCalculations = await db
      .select({
        type: sql<string>`'Calculation'`,
        description: calculations.calculatorType,
        timestamp: calculations.createdAt,
      })
      .from(calculations)
      .orderBy(desc(calculations.createdAt))
      .limit(limit);

    const recentGuests = await db
      .select({
        type: sql<string>`'Guest Signup'`,
        description: guestAccounts.email,
        timestamp: guestAccounts.createdAt,
      })
      .from(guestAccounts)
      .orderBy(desc(guestAccounts.createdAt))
      .limit(limit);

    const recentContacts = await db
      .select({
        type: sql<string>`'Contact Message'`,
        description: contactMessages.subject,
        timestamp: contactMessages.createdAt,
      })
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt))
      .limit(limit);

    const allActivity = [...recentCalculations, ...recentGuests, ...recentContacts]
      .filter(item => item.timestamp !== null)
      .sort((a, b) => new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime())
      .slice(0, limit)
      .map(item => ({
        type: item.type,
        description: item.description,
        timestamp: item.timestamp!.toISOString(),
      }));

    return allActivity;
  }

  // Login history operations
  async createLoginHistory(login: InsertLoginHistory): Promise<LoginHistory> {
    const [history] = await db
      .insert(loginHistory)
      .values(login)
      .returning();
    return history;
  }

  async getLoginHistory(limit: number = 50): Promise<LoginHistory[]> {
    const history = await db
      .select()
      .from(loginHistory)
      .orderBy(desc(loginHistory.loginAt))
      .limit(limit);
    return history;
  }
}

export const storage = new DatabaseStorage();
