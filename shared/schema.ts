import { pgTable, text, serial, integer, boolean, timestamp, foreignKey, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  avatar_url: text("avatar_url"),
  level: integer("level").notNull().default(1),
  created_at: timestamp("created_at").defaultNow(),
  onboarded: boolean("onboarded").default(false),
});

// Missions table
export const missions = pgTable("missions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull(), // "Easy", "Medium", "Hard"
  time_required: integer("time_required").notNull(), // in minutes
  project_id: integer("project_id").references(() => projects.id),
  created_at: timestamp("created_at").defaultNow(),
  user_id: integer("user_id").references(() => users.id),
});

// Progress table - track mission completion
export const progress = pgTable("progress", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id),
  mission_id: integer("mission_id").notNull().references(() => missions.id),
  date: timestamp("date").defaultNow(),
  status: text("status").notNull(), // "completed", "skipped", "delayed"
  mood: text("mood"), // "focused", "motivated", "drained"
  energy_level: integer("energy_level"), // 1-5
  notes: text("notes"),
});

// Quotes table
export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  character: text("character"),
  audio_url: text("audio_url"),
});

// User settings table
export const user_settings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id).unique(),
  quote_frequency: text("quote_frequency").default("daily"), // "hourly", "daily", "weekly"
  voice_volume: integer("voice_volume").default(80), // 0-100
  preferred_focus_hours: text("preferred_focus_hours").default("9-17"), // "9-17" format
  theme: text("theme").default("dark"), // "dark", "light"
});

// Projects table
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  start_date: timestamp("start_date").defaultNow(),
  end_date: timestamp("end_date"),
  status: text("status").notNull(), // "planning", "active", "completed", "paused"
  user_id: integer("user_id").notNull().references(() => users.id),
});

// Project tasks (sub-missions)
export const project_tasks = pgTable("project_tasks", {
  id: serial("id").primaryKey(),
  project_id: integer("project_id").notNull().references(() => projects.id),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("pending"), // "pending", "in_progress", "completed"
  deadline: timestamp("deadline"),
});

// Anime Reels for motivation
export const anime_reels = pgTable("anime_reels", {
  id: serial("id").primaryKey(),
  video_url: text("video_url").notNull(),
  thumbnail_url: text("thumbnail_url").notNull(),
  quote: text("quote").notNull(),
  character: text("character").notNull(),
  source_account: text("source_account").notNull(),
  date_added: timestamp("date_added").defaultNow(),
});

// Task types for selection
export const task_types = pgTable("task_types", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  category: text("category"),
  icon: text("icon"),
});

// User daily tasks selection
export const user_tasks = pgTable("user_tasks", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id),
  task_name: text("task_name").notNull(),
  priority: integer("priority").notNull().default(5),
  task_date: date("task_date").defaultNow(),
});

// Schema validations for insert operations
export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true, 
  created_at: true,
  level: true,
  onboarded: true
});

export const insertMissionSchema = createInsertSchema(missions).omit({ 
  id: true, 
  created_at: true 
});

export const insertProgressSchema = createInsertSchema(progress).omit({ 
  id: true, 
  date: true 
});

export const insertQuoteSchema = createInsertSchema(quotes).omit({ 
  id: true 
});

export const insertUserSettingsSchema = createInsertSchema(user_settings).omit({ 
  id: true 
});

export const insertProjectSchema = createInsertSchema(projects).omit({ 
  id: true, 
  start_date: true 
});

export const insertProjectTaskSchema = createInsertSchema(project_tasks).omit({ 
  id: true 
});

export const insertAnimeReelSchema = createInsertSchema(anime_reels).omit({ 
  id: true,
  date_added: true
});

export const insertTaskTypeSchema = createInsertSchema(task_types).omit({
  id: true
});

export const insertUserTaskSchema = createInsertSchema(user_tasks).omit({
  id: true,
  task_date: true
});

// Types for use throughout the application
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Mission = typeof missions.$inferSelect;
export type InsertMission = z.infer<typeof insertMissionSchema>;

export type Progress = typeof progress.$inferSelect;
export type InsertProgress = z.infer<typeof insertProgressSchema>;

export type Quote = typeof quotes.$inferSelect;
export type InsertQuote = z.infer<typeof insertQuoteSchema>;

export type UserSettings = typeof user_settings.$inferSelect;
export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type ProjectTask = typeof project_tasks.$inferSelect;
export type InsertProjectTask = z.infer<typeof insertProjectTaskSchema>;

export type AnimeReel = typeof anime_reels.$inferSelect;
export type InsertAnimeReel = z.infer<typeof insertAnimeReelSchema>;

export type TaskType = typeof task_types.$inferSelect;
export type InsertTaskType = z.infer<typeof insertTaskTypeSchema>;

export type UserTask = typeof user_tasks.$inferSelect;
export type InsertUserTask = z.infer<typeof insertUserTaskSchema>;
