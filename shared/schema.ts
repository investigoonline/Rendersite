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

// Session storage table
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
  'admin',
  'content_manager',
  'guest_user',
  'preferred_client',
  'client',
  'unregistered'
]);

// User storage table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  phone: varchar("phone", { length: 20 }),
  password: varchar("password", { length: 255 }),
  passwordHint: varchar("password_hint", { length: 255 }),
  profileImageUrl: varchar("profile_image_url"),
  role: userRoleEnum("role").default('client'),
  isEmailVerified: boolean("is_email_verified").default(false),
  emailVerificationToken: varchar("email_verification_token"),
  resetPasswordToken: varchar("reset_password_token"),
  resetPasswordExpires: timestamp("reset_password_expires"),
  authType: varchar("auth_type").default("traditional"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Inactive users table - for temporarily deleted users
export const inactiveUsers = pgTable("inactive_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  originalUserId: varchar("original_user_id").notNull(),
  email: varchar("email"),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  phone: varchar("phone", { length: 20 }),
  password: varchar("password", { length: 255 }),
  passwordHint: varchar("password_hint", { length: 255 }),
  profileImageUrl: varchar("profile_image_url"),
  role: userRoleEnum("role").default('client'),
  isEmailVerified: boolean("is_email_verified").default(false),
  authType: varchar("auth_type").default("traditional"),
  originalCreatedAt: timestamp("original_created_at"),
  deactivatedAt: timestamp("deactivated_at").defaultNow(),
  deactivatedBy: varchar("deactivated_by"),
  reason: text("reason"),
});

// User audit action enum
export const userAuditActionEnum = pgEnum('user_audit_action', [
  'created',
  'updated',
  'activated',
  'deactivated',
  'soft_deleted',
  'restored',
  'permanent_deleted',
  'role_changed',
  'login',
  'logout'
]);

// User audit history table - tracks all user changes
export const userAuditHistory = pgTable("user_audit_history", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  userEmail: varchar("user_email"),
  action: userAuditActionEnum("action").notNull(),
  performedBy: varchar("performed_by"),
  performedByEmail: varchar("performed_by_email"),
  details: jsonb("details"),
  previousState: jsonb("previous_state"),
  newState: jsonb("new_state"),
  ipAddress: varchar("ip_address", { length: 45 }),
  createdAt: timestamp("created_at").defaultNow(),
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
  'credit_debt',
  'currency_tools'
]);

// Financial calculations table
export const calculations = pgTable("calculations", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
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

// Resource types enum for permissions
export const resourceTypePermissionEnum = pgEnum('resource_type_permission', [
  'page',
  'calculator',
  'calculator_category',
  'resource_type'
]);

// Role permissions table - stores which roles have access to which resources
export const rolePermissions = pgTable("role_permissions", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  role: userRoleEnum("role").notNull(),
  resourceType: resourceTypePermissionEnum("resource_type").notNull(),
  resourceId: varchar("resource_id", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Login history table
export const loginHistory = pgTable("login_history", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  email: varchar("email", { length: 255 }).notNull(),
  loginAt: timestamp("login_at").defaultNow(),
  ipAddress: varchar("ip_address"),
  userAgent: varchar("user_agent"),
});

// Page content sections enum
export const contentSectionEnum = pgEnum('content_section', [
  'home_hero',
  'home_stats',
  'home_portfolio',
  'home_quick_actions',
  'home_calculators',
  'home_calculator_categories',
  'footer_company',
  'footer_platform',
  'footer_resources',
  'footer_company_details',
  'services_header',
  'services_stats',
  'services_investment',
  'services_strategic',
  'services_legacy',
  'services_risk',
  'services_special',
  'services_aggregation',
  'services_process',
  'services_why_choose',
  'services_commitment',
  'services_cta',
  'contact_header',
  'contact_office',
  'contact_phone',
  'contact_email',
  'contact_form_header',
  'contact_form_fields',
  'contact_quick_actions',
  'contact_support_features',
  'contact_business_hours',
  'contact_office_info',
  'contact_prospective_clients',
  'contact_current_clients',
  'resources_header',
  'resources_articles',
  'resources_videos',
  'resources_newsletters',
  'resources_flipbooks',
  'resources_faq',
  'resources_become_client',
  'resources_need_help',
  'about_header',
  'about_stats',
  'about_story',
  'about_mission_vision',
  'about_values',
  'about_leadership',
  'about_headquarters',
  'about_innovation',
  'about_security',
  'about_cta',
  'blog_header',
  'blog_featured',
  'blog_categories',
  'blog_cta',
  'dashboard_header',
  'dashboard_stats',
  'dashboard_user_distribution',
  'dashboard_engagement',
  'dashboard_system_status',
  'legal_privacy_policy',
  'legal_terms_of_service',
  'legal_disclosures',
  'disclosures_header',
  'home_wealth_creation',
  'home_wealth_protection',
  'home_wealth_preservation',
  'home_wealth_transfer',
  'process_header',
  'process_step',
  'calculator_page_header',
  'calculator_category_wealth_management',
  'calculator_category_loans_credit',
  'calculator_category_real_estate',
  'calculator_category_vehicle_financing',
  'calculator_category_retirement_inflation',
  'calculator_category_estate_planning',
  'calculator_category_taxes_iras',
  'calculator_category_credit_debt',
  'calculator_item',
  'calculator_net_worth',
  'calculator_loan_payoff',
  'calculator_mortgage',
  'calculator_retirement',
  'calculator_tax',
  'flipbook_header',
  'flipbook_item',
  'newsletter_header',
  'newsletter_article',
  'privacy_policy_header',
  'terms_of_service_header',
  'font_settings'
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

// Page content history table - tracks all changes for System Restore
export const pageContentHistory = pgTable("page_content_history", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  contentId: uuid("content_id").notNull(),
  page: varchar("page", { length: 50 }).notNull(),
  section: contentSectionEnum("section").notNull(),
  content: jsonb("content").notNull(),
  published: boolean("published").default(true),
  changedBy: varchar("changed_by").notNull(),
  changeType: varchar("change_type", { length: 20 }).notNull(), // 'create', 'update', 'delete'
  createdAt: timestamp("created_at").defaultNow(),
});

// Image assets table - stores uploaded hero images for pages
export const imageAssets = pgTable("image_assets", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  page: varchar("page", { length: 50 }).notNull(),
  section: varchar("section", { length: 100 }).notNull(),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  filePath: varchar("file_path", { length: 500 }).notNull(),
  originalName: varchar("original_name", { length: 255 }),
  mimeType: varchar("mime_type", { length: 100 }),
  fileSize: integer("file_size"),
  width: integer("width"),
  height: integer("height"),
  uploadedBy: varchar("uploaded_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Site settings table - stores global site configuration like font sizes
export const siteSettings = pgTable("site_settings", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  settingKey: varchar("setting_key", { length: 100 }).notNull().unique(),
  settingValue: text("setting_value").notNull(),
  settingType: varchar("setting_type", { length: 50 }).notNull(), // 'font', 'color', 'general'
  label: varchar("label", { length: 255 }),
  description: text("description"),
  updatedBy: varchar("updated_by"),
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
export const insertPageContentHistorySchema = createInsertSchema(pageContentHistory).omit({
  id: true,
  createdAt: true,
});
export const insertLoginHistorySchema = createInsertSchema(loginHistory).omit({
  id: true,
  loginAt: true,
});
export const insertRolePermissionSchema = createInsertSchema(rolePermissions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const insertImageAssetSchema = createInsertSchema(imageAssets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const insertSiteSettingSchema = createInsertSchema(siteSettings).omit({
  id: true,
  updatedAt: true,
});

// Export types
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type RolePermission = typeof rolePermissions.$inferSelect;
export type InsertRolePermission = z.infer<typeof insertRolePermissionSchema>;
export type InsertUserRegistration = z.infer<typeof insertUserRegistrationSchema>;
export type InsertUserBackend = z.infer<typeof insertUserBackendSchema>;
export type User = typeof users.$inferSelect;
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
export type PageContentHistory = typeof pageContentHistory.$inferSelect;
export type InsertPageContentHistory = z.infer<typeof insertPageContentHistorySchema>;
export type LoginHistory = typeof loginHistory.$inferSelect;
export type InsertLoginHistory = z.infer<typeof insertLoginHistorySchema>;
export type ImageAsset = typeof imageAssets.$inferSelect;
export type InsertImageAsset = z.infer<typeof insertImageAssetSchema>;
export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = z.infer<typeof insertSiteSettingSchema>;
export type InactiveUser = typeof inactiveUsers.$inferSelect;
export type UserAuditHistory = typeof userAuditHistory.$inferSelect;
