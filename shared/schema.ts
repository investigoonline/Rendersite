import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  decimal,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - Required for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User roles enum
export const userRoleEnum = pgEnum('user_role', [
  'super_admin',
  'content_manager',
  'guest_user',
  'preferred_client',
  'client'
]);

// User storage table - Required for Replit Auth + Traditional Registration
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  phone: varchar("phone", { length: 20 }),
  password: varchar("password", { length: 255 }), // For traditional registration
  profileImageUrl: varchar("profile_image_url"),
  role: userRoleEnum("role").default('client'),
  isEmailVerified: boolean("is_email_verified").default(false),
  emailVerificationToken: varchar("email_verification_token"),
  resetPasswordToken: varchar("reset_password_token"),
  resetPasswordExpires: timestamp("reset_password_expires"),
  authType: varchar("auth_type").default("replit"), // "replit" or "traditional"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Guest account types enum
export const guestTypeEnum = pgEnum('guest_type', ['basic', 'enhanced', 'guided']);

// Guest accounts table
export const guestAccounts = pgTable("guest_accounts", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }),
  guestType: guestTypeEnum("guest_type").default('basic'),
  verified: boolean("verified").default(false),
  verificationToken: varchar("verification_token"),
  referralCode: varchar("referral_code"),
  advisorId: varchar("advisor_id"),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  lastActivity: timestamp("last_activity").defaultNow(),
});

// Calculator categories enum
export const calculatorCategoryEnum = pgEnum('calculator_category', [
  'wealth_management',
  'loans_credit',
  'real_estate',
  'vehicle_financing',
  'estate_planning',
  'retirement_inflation',
  'taxes_iras',
  'credit_debt'
]);

// Financial calculations table
export const calculations = pgTable("calculations", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  guestId: uuid("guest_id"),
  calculatorType: varchar("calculator_type").notNull(),
  category: calculatorCategoryEnum("category").notNull(),
  inputs: jsonb("inputs").notNull(),
  results: jsonb("results").notNull(),
  saved: boolean("saved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Resource types enum
export const resourceTypeEnum = pgEnum('resource_type', [
  'article',
  'video',
  'newsletter',
  'flipbook',
  'faq'
]);

// Resources table
export const resources = pgTable("resources", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  content: text("content"),
  type: resourceTypeEnum("type").notNull(),
  category: varchar("category"),
  tags: text("tags").array(),
  featured: boolean("featured").default(false),
  published: boolean("published").default(true),
  viewCount: integer("view_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Contact messages table
export const contactMessages = pgTable("contact_messages", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  preferredContact: varchar("preferred_contact").default('email'),
  status: varchar("status").default('new'),
  createdAt: timestamp("created_at").defaultNow(),
});

// Net worth tracking table
export const netWorthSnapshots = pgTable("net_worth_snapshots", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  guestId: uuid("guest_id"),
  totalAssets: decimal("total_assets", { precision: 15, scale: 2 }),
  totalLiabilities: decimal("total_liabilities", { precision: 15, scale: 2 }),
  netWorth: decimal("net_worth", { precision: 15, scale: 2 }),
  assetBreakdown: jsonb("asset_breakdown"),
  liabilityBreakdown: jsonb("liability_breakdown"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Roles table
export const roles = pgTable("roles", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: userRoleEnum("name").notNull().unique(),
  displayName: varchar("display_name", { length: 100 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User-Roles cross-reference table
export const userRoles = pgTable("user_roles", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  roleId: uuid("role_id").notNull(),
  assignedAt: timestamp("assigned_at").defaultNow(),
});

// Page content sections enum
export const contentSectionEnum = pgEnum('content_section', [
  'home_hero',
  'home_stats',
  'home_quick_actions',
  'home_calculators',
  'footer_company',
  'footer_platform',
  'footer_resources',
  'footer_company_details',
  'services_investment',
  'services_strategic',
  'services_legacy',
  'services_risk',
  'services_special',
  'services_aggregation',
  'contact_office',
  'contact_phone',
  'contact_email',
  'contact_form_header',
  'contact_quick_actions',
  'contact_support_features',
  'contact_business_hours',
  'contact_office_info',
  'contact_prospective_clients',
  'contact_current_clients',
  'resources_articles',
  'resources_videos',
  'resources_newsletters',
  'resources_flipbooks',
  'resources_faq'
]);

// Content management table
export const pageContent = pgTable("page_content", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  page: varchar("page", { length: 50 }).notNull(),
  section: contentSectionEnum("section").notNull(),
  content: jsonb("content").notNull(),
  published: boolean("published").default(true),
  updatedBy: varchar("updated_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Create insert schemas
export const upsertUserSchema = createInsertSchema(users);
export const insertUserRegistrationSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  profileImageUrl: true,
  isEmailVerified: true,
  emailVerificationToken: true,
  resetPasswordToken: true,
  resetPasswordExpires: true,
  authType: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Backend validation schema without confirmPassword field
export const insertUserBackendSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  profileImageUrl: true,
  isEmailVerified: true,
  emailVerificationToken: true,
  resetPasswordToken: true,
  resetPasswordExpires: true,
  authType: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export const insertGuestAccountSchema = createInsertSchema(guestAccounts).omit({
  id: true,
  createdAt: true,
  lastActivity: true,
  expiresAt: true,
  verificationToken: true,
});
export const insertCalculationSchema = createInsertSchema(calculations).omit({
  id: true,
  createdAt: true,
});
export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
});
export const insertNetWorthSnapshotSchema = createInsertSchema(netWorthSnapshots).omit({
  id: true,
  createdAt: true,
});
export const insertRoleSchema = createInsertSchema(roles).omit({
  id: true,
  createdAt: true,
});
export const insertUserRoleSchema = createInsertSchema(userRoles).omit({
  id: true,
  assignedAt: true,
});
export const insertPageContentSchema = createInsertSchema(pageContent).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Export types
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type InsertUserRegistration = z.infer<typeof insertUserRegistrationSchema>;
export type InsertUserBackend = z.infer<typeof insertUserBackendSchema>;
export type User = typeof users.$inferSelect;
export type GuestAccount = typeof guestAccounts.$inferSelect;
export type InsertGuestAccount = z.infer<typeof insertGuestAccountSchema>;
export type Calculation = typeof calculations.$inferSelect;
export type InsertCalculation = z.infer<typeof insertCalculationSchema>;
export type Resource = typeof resources.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type NetWorthSnapshot = typeof netWorthSnapshots.$inferSelect;
export type InsertNetWorthSnapshot = z.infer<typeof insertNetWorthSnapshotSchema>;
export type Role = typeof roles.$inferSelect;
export type InsertRole = z.infer<typeof insertRoleSchema>;
export type UserRole = typeof userRoles.$inferSelect;
export type InsertUserRole = z.infer<typeof insertUserRoleSchema>;
export type PageContent = typeof pageContent.$inferSelect;
export type InsertPageContent = z.infer<typeof insertPageContentSchema>;
