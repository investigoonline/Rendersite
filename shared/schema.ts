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

// User storage table - Required for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
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

// Create insert schemas
export const upsertUserSchema = createInsertSchema(users);
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

// Export types
export type UpsertUser = z.infer<typeof upsertUserSchema>;
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
