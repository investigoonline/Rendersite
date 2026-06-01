import {
  users,
  calculations,
  resources,
  contactMessages,
  netWorthSnapshots,
  roles,
  userRoles,
  pageContent,
  pageContentHistory,
  loginHistory,
  rolePermissions,
  imageAssets,
  siteSettings,
  inactiveUsers,
  userAuditHistory,
  type User,
  type UpsertUser,
  type InsertUserRegistration,
  type InsertUserBackend,
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
  type PageContentHistory,
  type InsertPageContentHistory,
  type LoginHistory,
  type InsertLoginHistory,
  type RolePermission,
  type InsertRolePermission,
  type ImageAsset,
  type InsertImageAsset,
  type InactiveUser,
  type UserAuditHistory,
  type SiteSetting,
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
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Traditional registration operations
  createUser(user: InsertUserBackend): Promise<User>;
  updateUser(userId: string, updates: Partial<User>): Promise<User | undefined>;
  updateUserPassword(userId: string, hashedPassword: string): Promise<void>;
  verifyUserEmail(userId: string, token: string): Promise<boolean>;
  
  // Calculation operations
  saveCalculation(calculation: InsertCalculation): Promise<Calculation>;
  getCalculations(userId: string): Promise<Calculation[]>;
  getCalculation(id: string, userId: string): Promise<Calculation | undefined>;
  
  // Resource operations
  getResources(type?: string, category?: string): Promise<Resource[]>;
  getResource(id: string): Promise<Resource | undefined>;
  createResource(resource: InsertResource): Promise<Resource>;
  updateResource(id: string, resource: Partial<InsertResource>): Promise<Resource>;
  deleteResource(id: string): Promise<void>;
  incrementResourceView(id: string): Promise<void>;
  
  // Contact operations
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
  
  // Net worth operations
  saveNetWorthSnapshot(snapshot: InsertNetWorthSnapshot): Promise<NetWorthSnapshot>;
  getNetWorthHistory(userId: string): Promise<NetWorthSnapshot[]>;
  
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
  
  // Page content history operations
  createPageContentHistory(history: InsertPageContentHistory): Promise<PageContentHistory>;
  getPageContentHistory(contentId?: string, limit?: number): Promise<PageContentHistory[]>;
  restorePageContentFromHistory(historyId: string): Promise<PageContent>;
  
  // Admin dashboard operations
  getActiveClientsCount(): Promise<number>;
  getTotalCalculationsCount(): Promise<number>;
  getTotalResourcesCount(): Promise<number>;
  getRecentActivity(limit: number): Promise<Array<{ type: string; description: string; timestamp: string }>>;
  
  // Login history operations
  createLoginHistory(login: InsertLoginHistory): Promise<LoginHistory>;
  getLoginHistory(limit?: number): Promise<LoginHistory[]>;
  
  // Role permission operations
  getRolePermissions(): Promise<RolePermission[]>;
  setRolePermissions(permissions: InsertRolePermission[]): Promise<void>;
  deleteAllRolePermissions(): Promise<void>;
  
  // Image asset operations
  getImageAssets(page?: string): Promise<ImageAsset[]>;
  getImageAsset(id: string): Promise<ImageAsset | undefined>;
  getImageAssetByPageSection(page: string, section: string): Promise<ImageAsset | undefined>;
  createImageAsset(asset: InsertImageAsset): Promise<ImageAsset>;
  updateImageAsset(id: string, asset: Partial<InsertImageAsset>): Promise<ImageAsset>;
  deleteImageAsset(id: string): Promise<void>;
  
  // Site settings operations
  getSiteSettings(settingType?: string): Promise<SiteSetting[]>;
  getSiteSetting(settingKey: string): Promise<SiteSetting | undefined>;
  updateSiteSetting(settingKey: string, settingValue: string, updatedBy?: string): Promise<SiteSetting>;
  upsertSiteSetting(settingKey: string, settingValue: string, settingType?: string, label?: string, updatedBy?: string): Promise<SiteSetting>;
  
  // User status management
  updateUserActiveStatus(userId: string, isActive: boolean, performedBy?: string): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Inactive users operations
  getInactiveUsers(): Promise<InactiveUser[]>;
  moveUserToInactive(userId: string, reason?: string, performedBy?: string): Promise<InactiveUser>;
  restoreInactiveUser(inactiveUserId: string, performedBy?: string): Promise<User>;
  deleteInactiveUser(inactiveUserId: string): Promise<void>;
  
  // User audit history operations
  createAuditEntry(entry: {
    userId: string;
    userEmail?: string;
    action: string;
    performedBy?: string;
    performedByEmail?: string;
    details?: any;
    previousState?: any;
    newState?: any;
    ipAddress?: string;
  }): Promise<UserAuditHistory>;
  getAuditHistory(userId?: string): Promise<UserAuditHistory[]>;
  
  // Permanent delete
  permanentDeleteUser(userId: string, performedBy?: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
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
    
    // Assign default guest_user role to new users
    const guestRole = await db
      .select()
      .from(roles)
      .where(eq(roles.name, 'guest_user'))
      .limit(1);
    
    if (guestRole.length > 0) {
      await this.assignRoleToUser(newUser.id, guestRole[0].id);
    }
    
    return newUser;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, userId))
      .returning();
    return updatedUser;
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

  // Calculation operations
  async saveCalculation(calculation: InsertCalculation): Promise<Calculation> {
    const [saved] = await db
      .insert(calculations)
      .values(calculation)
      .returning();
    return saved;
  }

  async getCalculations(userId: string): Promise<Calculation[]> {
    return db
      .select()
      .from(calculations)
      .where(eq(calculations.userId, userId))
      .orderBy(desc(calculations.createdAt));
  }

  async getCalculation(id: string, userId: string): Promise<Calculation | undefined> {
    const [calculation] = await db
      .select()
      .from(calculations)
      .where(and(eq(calculations.id, id), eq(calculations.userId, userId)));
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

  async updateResource(id: string, resource: Partial<InsertResource>): Promise<Resource> {
    const [updated] = await db
      .update(resources)
      .set({ ...resource, updatedAt: new Date() })
      .where(eq(resources.id, id))
      .returning();
    return updated;
  }

  async deleteResource(id: string): Promise<void> {
    await db.delete(resources).where(eq(resources.id, id));
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

  async getNetWorthHistory(userId: string): Promise<NetWorthSnapshot[]> {
    return db
      .select()
      .from(netWorthSnapshots)
      .where(eq(netWorthSnapshots.userId, userId))
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
          authType: 'oidc',
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

  // Page content history operations
  async createPageContentHistory(history: InsertPageContentHistory): Promise<PageContentHistory> {
    const [created] = await db
      .insert(pageContentHistory)
      .values(history)
      .returning();
    return created;
  }

  async getPageContentHistory(contentId?: string, limit: number = 50): Promise<PageContentHistory[]> {
    const query = db
      .select()
      .from(pageContentHistory)
      .orderBy(desc(pageContentHistory.createdAt))
      .limit(limit);

    if (contentId) {
      return query.where(eq(pageContentHistory.contentId, contentId));
    }

    return query;
  }

  async restorePageContentFromHistory(historyId: string): Promise<PageContent> {
    // Get the history record
    const [historyRecord] = await db
      .select()
      .from(pageContentHistory)
      .where(eq(pageContentHistory.id, historyId));

    if (!historyRecord) {
      throw new Error("History record not found");
    }

    // Update the current content with the historical content
    const [restored] = await db
      .update(pageContent)
      .set({
        content: historyRecord.content,
        published: historyRecord.published,
        updatedAt: new Date(),
      })
      .where(eq(pageContent.id, historyRecord.contentId))
      .returning();

    return restored;
  }

  // Admin dashboard operations
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

    const recentUserSignups = await db
      .select({
        type: sql<string>`'User Signup'`,
        description: users.email,
        timestamp: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt))
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

    const allActivity = [...recentCalculations, ...recentUserSignups, ...recentContacts]
      .filter(item => item.timestamp !== null && item.description !== null)
      .sort((a, b) => new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime())
      .slice(0, limit)
      .map(item => ({
        type: item.type,
        description: item.description!,
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

  // Role permission operations
  async getRolePermissions(): Promise<RolePermission[]> {
    const permissions = await db
      .select()
      .from(rolePermissions);
    return permissions;
  }

  async getRolePermissionsByRole(role: string): Promise<RolePermission[]> {
    const permissions = await db
      .select()
      .from(rolePermissions)
      .where(eq(rolePermissions.role, role as any));
    return permissions;
  }

  async setRolePermissions(permissions: InsertRolePermission[]): Promise<void> {
    // Delete existing permissions
    await db.delete(rolePermissions);
    
    // Insert new permissions
    if (permissions.length > 0) {
      await db.insert(rolePermissions).values(permissions);
    }
  }

  async deleteAllRolePermissions(): Promise<void> {
    await db.delete(rolePermissions);
  }

  // Image asset operations
  async getImageAssets(page?: string): Promise<ImageAsset[]> {
    if (page) {
      return db.select().from(imageAssets).where(eq(imageAssets.page, page)).orderBy(desc(imageAssets.createdAt));
    }
    return db.select().from(imageAssets).orderBy(desc(imageAssets.createdAt));
  }

  async getImageAsset(id: string): Promise<ImageAsset | undefined> {
    const [asset] = await db.select().from(imageAssets).where(eq(imageAssets.id, id));
    return asset;
  }

  async getImageAssetByPageSection(page: string, section: string): Promise<ImageAsset | undefined> {
    const [asset] = await db.select().from(imageAssets)
      .where(and(eq(imageAssets.page, page), eq(imageAssets.section, section)));
    return asset;
  }

  async createImageAsset(asset: InsertImageAsset): Promise<ImageAsset> {
    const [newAsset] = await db.insert(imageAssets).values(asset).returning();
    return newAsset;
  }

  async updateImageAsset(id: string, asset: Partial<InsertImageAsset>): Promise<ImageAsset> {
    const [updatedAsset] = await db.update(imageAssets)
      .set({ ...asset, updatedAt: new Date() })
      .where(eq(imageAssets.id, id))
      .returning();
    return updatedAsset;
  }

  async deleteImageAsset(id: string): Promise<void> {
    await db.delete(imageAssets).where(eq(imageAssets.id, id));
  }

  // Site settings operations
  async getSiteSettings(settingType?: string): Promise<SiteSetting[]> {
    if (settingType) {
      return db.select().from(siteSettings).where(eq(siteSettings.settingType, settingType));
    }
    return db.select().from(siteSettings);
  }

  async getSiteSetting(settingKey: string): Promise<SiteSetting | undefined> {
    const [setting] = await db.select().from(siteSettings).where(eq(siteSettings.settingKey, settingKey));
    return setting;
  }

  async updateSiteSetting(settingKey: string, settingValue: string, updatedBy?: string): Promise<SiteSetting> {
    const [updatedSetting] = await db.update(siteSettings)
      .set({ settingValue, updatedBy, updatedAt: new Date() })
      .where(eq(siteSettings.settingKey, settingKey))
      .returning();
    return updatedSetting;
  }

  async upsertSiteSetting(settingKey: string, settingValue: string, settingType: string = 'system', label?: string, updatedBy?: string): Promise<SiteSetting> {
    const [setting] = await db.insert(siteSettings)
      .values({ settingKey, settingValue, settingType, label: label || settingKey, updatedBy, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: siteSettings.settingKey,
        set: { settingValue, updatedBy, updatedAt: new Date() },
      })
      .returning();
    return setting;
  }

  // User status management
  async updateUserActiveStatus(userId: string, isActive: boolean, performedBy?: string): Promise<User> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) {
      throw new Error('User not found');
    }
    
    const [updatedUser] = await db.update(users)
      .set({ isActive, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    
    // Create audit entry
    await this.createAuditEntry({
      userId,
      userEmail: user.email || undefined,
      action: isActive ? 'activated' : 'deactivated',
      performedBy,
      previousState: { isActive: user.isActive },
      newState: { isActive },
    });
    
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users).orderBy(desc(users.createdAt));
  }

  // Inactive users operations
  async getInactiveUsers(): Promise<InactiveUser[]> {
    return db.select().from(inactiveUsers).orderBy(desc(inactiveUsers.deactivatedAt));
  }

  async moveUserToInactive(userId: string, reason?: string, performedBy?: string): Promise<InactiveUser> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) {
      throw new Error('User not found');
    }

    // Insert into inactive_users table
    const [inactiveUser] = await db.insert(inactiveUsers).values({
      originalUserId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      password: user.password,
      passwordHint: user.passwordHint,
      profileImageUrl: user.profileImageUrl,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      authType: user.authType,
      originalCreatedAt: user.createdAt,
      deactivatedBy: performedBy,
      reason,
    }).returning();

    // Delete user roles
    await db.delete(userRoles).where(eq(userRoles.userId, userId));
    
    // Delete from users table
    await db.delete(users).where(eq(users.id, userId));

    // Create audit entry
    await this.createAuditEntry({
      userId,
      userEmail: user.email || undefined,
      action: 'soft_deleted',
      performedBy,
      previousState: user,
      details: { reason, movedToInactiveId: inactiveUser.id },
    });

    return inactiveUser;
  }

  async restoreInactiveUser(inactiveUserId: string, performedBy?: string): Promise<User> {
    const [inactiveUser] = await db.select().from(inactiveUsers).where(eq(inactiveUsers.id, inactiveUserId));
    if (!inactiveUser) {
      throw new Error('Inactive user not found');
    }

    // Insert back into users table with new ID
    const [restoredUser] = await db.insert(users).values({
      email: inactiveUser.email,
      firstName: inactiveUser.firstName,
      lastName: inactiveUser.lastName,
      phone: inactiveUser.phone,
      password: inactiveUser.password,
      passwordHint: inactiveUser.passwordHint,
      profileImageUrl: inactiveUser.profileImageUrl,
      role: inactiveUser.role,
      isEmailVerified: inactiveUser.isEmailVerified,
      authType: inactiveUser.authType,
      isActive: true,
    }).returning();

    // Delete from inactive_users table
    await db.delete(inactiveUsers).where(eq(inactiveUsers.id, inactiveUserId));

    // Create audit entry
    await this.createAuditEntry({
      userId: restoredUser.id,
      userEmail: restoredUser.email || undefined,
      action: 'restored',
      performedBy,
      previousState: inactiveUser,
      newState: restoredUser,
      details: { restoredFromInactiveId: inactiveUserId, originalUserId: inactiveUser.originalUserId },
    });

    return restoredUser;
  }

  async deleteInactiveUser(inactiveUserId: string): Promise<void> {
    await db.delete(inactiveUsers).where(eq(inactiveUsers.id, inactiveUserId));
  }

  // User audit history operations
  async createAuditEntry(entry: {
    userId: string;
    userEmail?: string;
    action: string;
    performedBy?: string;
    performedByEmail?: string;
    details?: any;
    previousState?: any;
    newState?: any;
    ipAddress?: string;
  }): Promise<UserAuditHistory> {
    const [auditEntry] = await db.insert(userAuditHistory).values({
      userId: entry.userId,
      userEmail: entry.userEmail,
      action: entry.action as any,
      performedBy: entry.performedBy,
      performedByEmail: entry.performedByEmail,
      details: entry.details,
      previousState: entry.previousState,
      newState: entry.newState,
      ipAddress: entry.ipAddress,
    }).returning();
    return auditEntry;
  }

  async getAuditHistory(userId?: string): Promise<UserAuditHistory[]> {
    if (userId) {
      return db.select().from(userAuditHistory)
        .where(eq(userAuditHistory.userId, userId))
        .orderBy(desc(userAuditHistory.createdAt));
    }
    return db.select().from(userAuditHistory).orderBy(desc(userAuditHistory.createdAt));
  }

  // Permanent delete
  async permanentDeleteUser(userId: string, performedBy?: string): Promise<void> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) {
      throw new Error('User not found');
    }

    // Create audit entry before deletion
    await this.createAuditEntry({
      userId,
      userEmail: user.email || undefined,
      action: 'permanent_deleted',
      performedBy,
      previousState: user,
      details: { permanentlyDeleted: true },
    });

    // Delete user roles
    await db.delete(userRoles).where(eq(userRoles.userId, userId));
    
    // Delete calculations
    await db.delete(calculations).where(eq(calculations.userId, userId));
    
    // Delete net worth snapshots
    await db.delete(netWorthSnapshots).where(eq(netWorthSnapshots.userId, userId));
    
    // Delete login history
    await db.delete(loginHistory).where(eq(loginHistory.userId, userId));
    
    // Delete the user
    await db.delete(users).where(eq(users.id, userId));
  }
}

export const storage = new DatabaseStorage();
