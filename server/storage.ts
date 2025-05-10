import { users, type User, type InsertUser, missions, type Mission, type InsertMission, progress, type Progress, type InsertProgress, quotes, type Quote, type InsertQuote, user_settings, type UserSettings, type InsertUserSettings, projects, type Project, type InsertProject, project_tasks, type ProjectTask, type InsertProjectTask, anime_reels, type AnimeReel, type InsertAnimeReel, task_types, type TaskType, type InsertTaskType, user_tasks, type UserTask, type InsertUserTask } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import connectPg from "connect-pg-simple";
import { db } from "./db";
import { pool } from "./db";
import { eq, sql, and, desc, lte } from "drizzle-orm";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Mission operations
  getMission(id: number): Promise<Mission | undefined>;
  getMissionsByUserId(userId: number): Promise<Mission[]>;
  createMission(mission: InsertMission): Promise<Mission>;
  
  // Progress operations
  getProgress(id: number): Promise<Progress | undefined>;
  getProgressByUserId(userId: number): Promise<Progress[]>;
  createProgress(progressData: InsertProgress): Promise<Progress>;
  
  // Quote operations
  getQuote(id: number): Promise<Quote | undefined>;
  getRandomQuote(): Promise<Quote | undefined>;
  createQuote(quote: InsertQuote): Promise<Quote>;
  
  // User settings operations
  getUserSettings(id: number): Promise<UserSettings | undefined>;
  getUserSettingsByUserId(userId: number): Promise<UserSettings | undefined>;
  createUserSettings(settings: InsertUserSettings): Promise<UserSettings>;
  
  // Project operations
  getProject(id: number): Promise<Project | undefined>;
  getProjectsByUserId(userId: number): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  
  // Project task operations
  getProjectTask(id: number): Promise<ProjectTask | undefined>;
  getTasksByProjectId(projectId: number): Promise<ProjectTask[]>;
  createProjectTask(task: InsertProjectTask): Promise<ProjectTask>;
  
  // Anime Reels operations
  getAnimeReel(id: number): Promise<AnimeReel | undefined>;
  getAllAnimeReels(): Promise<AnimeReel[]>;
  getRandomAnimeReel(): Promise<AnimeReel | undefined>;
  createAnimeReel(reel: InsertAnimeReel): Promise<AnimeReel>;
  
  // Task Types operations
  getTaskType(id: number): Promise<TaskType | undefined>;
  getAllTaskTypes(): Promise<TaskType[]>;
  createTaskType(taskType: InsertTaskType): Promise<TaskType>;
  
  // User Tasks operations
  getUserTask(id: number): Promise<UserTask | undefined>;
  getUserTasksByUserId(userId: number, date?: Date): Promise<UserTask[]>;
  createUserTask(userTask: InsertUserTask): Promise<UserTask>;
  updateUserTaskPriority(id: number, priority: number): Promise<UserTask>;
  deleteUserTask(id: number): Promise<void>;
  clearUserTasks(userId: number, date?: Date): Promise<void>;

  // Session store
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  public sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
    
    // Seed initial data
    this.seedQuotesIfEmpty();
    this.seedTaskTypesIfEmpty();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values({
      ...userData,
      level: 1,
      onboarded: false
      // created_at will be set by defaultNow()
    }).returning();
    return user;
  }

  // Mission operations
  async getMission(id: number): Promise<Mission | undefined> {
    const [mission] = await db.select().from(missions).where(eq(missions.id, id));
    return mission;
  }

  async getMissionsByUserId(userId: number): Promise<Mission[]> {
    return await db.select().from(missions).where(eq(missions.user_id, userId));
  }

  async createMission(missionData: InsertMission): Promise<Mission> {
    const [mission] = await db.insert(missions).values({
      ...missionData
      // created_at will be set by defaultNow()
    }).returning();
    return mission;
  }

  // Progress operations
  async getProgress(id: number): Promise<Progress | undefined> {
    const [progressItem] = await db.select().from(progress).where(eq(progress.id, id));
    return progressItem;
  }

  async getProgressByUserId(userId: number): Promise<Progress[]> {
    return await db.select().from(progress).where(eq(progress.user_id, userId));
  }

  async createProgress(progressData: InsertProgress): Promise<Progress> {
    const [progressItem] = await db.insert(progress).values({
      ...progressData
      // date will be set by defaultNow()
    }).returning();
    return progressItem;
  }

  // Quote operations
  async getQuote(id: number): Promise<Quote | undefined> {
    const [quote] = await db.select().from(quotes).where(eq(quotes.id, id));
    return quote;
  }

  async getRandomQuote(): Promise<Quote | undefined> {
    // PostgreSQL's RANDOM() function to get a random quote
    const [quote] = await db.select().from(quotes).orderBy(sql`RANDOM()`).limit(1);
    return quote;
  }

  async createQuote(quoteData: InsertQuote): Promise<Quote> {
    const [quote] = await db.insert(quotes).values(quoteData).returning();
    return quote;
  }

  // User settings operations
  async getUserSettings(id: number): Promise<UserSettings | undefined> {
    const [setting] = await db.select().from(user_settings).where(eq(user_settings.id, id));
    return setting;
  }

  async getUserSettingsByUserId(userId: number): Promise<UserSettings | undefined> {
    const [setting] = await db.select().from(user_settings).where(eq(user_settings.user_id, userId));
    return setting;
  }

  async createUserSettings(settingsData: InsertUserSettings): Promise<UserSettings> {
    const [setting] = await db.insert(user_settings).values(settingsData).returning();
    return setting;
  }

  // Project operations
  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async getProjectsByUserId(userId: number): Promise<Project[]> {
    return await db.select().from(projects).where(eq(projects.user_id, userId));
  }

  async createProject(projectData: InsertProject): Promise<Project> {
    // start_date will be set by defaultNow()
    const [project] = await db.insert(projects).values({
      ...projectData
    }).returning();
    return project;
  }

  // Project task operations
  async getProjectTask(id: number): Promise<ProjectTask | undefined> {
    const [task] = await db.select().from(project_tasks).where(eq(project_tasks.id, id));
    return task;
  }

  async getTasksByProjectId(projectId: number): Promise<ProjectTask[]> {
    return await db.select().from(project_tasks).where(eq(project_tasks.project_id, projectId));
  }

  async createProjectTask(taskData: InsertProjectTask): Promise<ProjectTask> {
    const [task] = await db.insert(project_tasks).values(taskData).returning();
    return task;
  }
  
  // Anime Reel operations
  async getAnimeReel(id: number): Promise<AnimeReel | undefined> {
    const [reel] = await db.select().from(anime_reels).where(eq(anime_reels.id, id));
    return reel;
  }
  
  async getAllAnimeReels(): Promise<AnimeReel[]> {
    return await db.select().from(anime_reels);
  }
  
  async getRandomAnimeReel(): Promise<AnimeReel | undefined> {
    const [reel] = await db.select().from(anime_reels).orderBy(sql`RANDOM()`).limit(1);
    return reel;
  }
  
  async createAnimeReel(reelData: InsertAnimeReel): Promise<AnimeReel> {
    const [reel] = await db.insert(anime_reels).values(reelData).returning();
    return reel;
  }
  
  // Task Types operations
  async getTaskType(id: number): Promise<TaskType | undefined> {
    const [taskType] = await db.select().from(task_types).where(eq(task_types.id, id));
    return taskType;
  }
  
  async getAllTaskTypes(): Promise<TaskType[]> {
    return await db.select().from(task_types);
  }
  
  async createTaskType(taskTypeData: InsertTaskType): Promise<TaskType> {
    const [taskType] = await db.insert(task_types).values(taskTypeData).returning();
    return taskType;
  }
  
  // User Tasks operations
  async getUserTask(id: number): Promise<UserTask | undefined> {
    const [userTask] = await db.select().from(user_tasks).where(eq(user_tasks.id, id));
    return userTask;
  }
  
  async getUserTasksByUserId(userId: number, date?: Date): Promise<UserTask[]> {
    if (date) {
      const formattedDate = date.toISOString().split('T')[0];
      return await db.select().from(user_tasks)
        .where(and(
          eq(user_tasks.user_id, userId),
          eq(sql`DATE(${user_tasks.task_date})`, sql`DATE(${formattedDate})`)
        ))
        .orderBy(user_tasks.priority);
    }
    
    return await db.select().from(user_tasks)
      .where(eq(user_tasks.user_id, userId))
      .orderBy(user_tasks.priority);
  }
  
  async createUserTask(userTaskData: InsertUserTask): Promise<UserTask> {
    const [userTask] = await db.insert(user_tasks).values(userTaskData).returning();
    return userTask;
  }
  
  async updateUserTaskPriority(id: number, priority: number): Promise<UserTask> {
    const [userTask] = await db
      .update(user_tasks)
      .set({ priority })
      .where(eq(user_tasks.id, id))
      .returning();
    
    if (!userTask) {
      throw new Error("User task not found");
    }
    
    return userTask;
  }
  
  async deleteUserTask(id: number): Promise<void> {
    await db.delete(user_tasks).where(eq(user_tasks.id, id));
  }
  
  async clearUserTasks(userId: number, date?: Date): Promise<void> {
    if (date) {
      const formattedDate = date.toISOString().split('T')[0];
      await db.delete(user_tasks)
        .where(and(
          eq(user_tasks.user_id, userId),
          eq(sql`DATE(${user_tasks.task_date})`, sql`DATE(${formattedDate})`)
        ));
    } else {
      await db.delete(user_tasks).where(eq(user_tasks.user_id, userId));
    }
  }
  
  // Seed task types if the task_types table is empty
  private async seedTaskTypesIfEmpty() {
    try {
      const existingTaskTypes = await db.select().from(task_types).limit(1);
      
      if (existingTaskTypes.length === 0) {
        const defaultTaskTypes = [
          { name: "Workout", category: "Health", icon: "dumbbell" },
          { name: "Running", category: "Health", icon: "running" },
          { name: "Meditation", category: "Wellness", icon: "brain" },
          { name: "Coding Practice", category: "Professional", icon: "code" },
          { name: "Reading", category: "Personal", icon: "book" },
          { name: "Learning", category: "Education", icon: "graduation-cap" },
          { name: "Writing", category: "Professional", icon: "pen" },
          { name: "Project Work", category: "Professional", icon: "briefcase" },
          { name: "Language Study", category: "Education", icon: "language" },
          { name: "Meal Prep", category: "Health", icon: "utensils" },
          { name: "Family Time", category: "Personal", icon: "users" },
          { name: "Networking", category: "Professional", icon: "handshake" },
          { name: "Job Search", category: "Professional", icon: "search" },
          { name: "Journaling", category: "Personal", icon: "book-open" },
          { name: "Yoga", category: "Health", icon: "pray" }
        ];
        
        for (const taskType of defaultTaskTypes) {
          await this.createTaskType(taskType as InsertTaskType);
        }
      }
    } catch (error) {
      // Table doesn't exist yet - this is expected on first run
      // Tables will be created when db:push is run
      console.log("Task types table not found - skipping task types seeding until after schema push");
    }
  }

  // Seed quotes if the quotes table is empty
  private async seedQuotesIfEmpty() {
    try {
      const existingQuotes = await db.select().from(quotes).limit(1);
      
      if (existingQuotes.length === 0) {
        const soloLevelingQuotes = [
          {
            text: "I don't have colleagues. Perhaps all hunters are meant to be alone.",
            character: "Sung Jin-Woo",
            audio_url: "https://soloascend.com/audio/quote1.mp3"
          },
          {
            text: "I alone level up.",
            character: "Sung Jin-Woo",
            audio_url: "https://soloascend.com/audio/quote2.mp3"
          },
          {
            text: "The strong prey on the weak. That is the absolute law of this world.",
            character: "Sung Jin-Woo",
            audio_url: "https://soloascend.com/audio/quote3.mp3"
          },
          {
            text: "Daily Quest has been issued. Time Limit: 24 hours.",
            character: "System",
            audio_url: "https://soloascend.com/audio/quote4.mp3"
          },
          {
            text: "You have been chosen as the Player. Complete all missions to level up.",
            character: "System",
            audio_url: "https://soloascend.com/audio/quote5.mp3"
          }
        ];
        
        for (const quote of soloLevelingQuotes) {
          await this.createQuote(quote as InsertQuote);
        }
      }
    } catch (error) {
      // Table doesn't exist yet - this is expected on first run
      // Tables will be created when db:push is run
      console.log("Quotes table not found - skipping quote seeding until after schema push");
    }
  }
}

// Keep MemStorage class as fallback if needed
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private missions: Map<number, Mission>;
  private progressRecords: Map<number, Progress>;
  private quotesList: Map<number, Quote>;
  private userSettings: Map<number, UserSettings>;
  private projectsList: Map<number, Project>;
  private projectTasks: Map<number, ProjectTask>;
  private animeReels: Map<number, AnimeReel>;
  private taskTypes: Map<number, TaskType>;
  private userTasks: Map<number, UserTask>;
  
  private userIdCounter: number;
  private missionIdCounter: number;
  private progressIdCounter: number;
  private quoteIdCounter: number;
  private settingsIdCounter: number;
  private projectIdCounter: number;
  private taskIdCounter: number;
  private animeReelIdCounter: number;
  private taskTypeIdCounter: number;
  private userTaskIdCounter: number;

  public sessionStore: session.Store;
  
  constructor() {
    this.users = new Map();
    this.missions = new Map();
    this.progressRecords = new Map();
    this.quotesList = new Map();
    this.userSettings = new Map();
    this.projectsList = new Map();
    this.projectTasks = new Map();
    this.animeReels = new Map();
    this.taskTypes = new Map();
    this.userTasks = new Map();
    
    this.userIdCounter = 1;
    this.missionIdCounter = 1;
    this.progressIdCounter = 1;
    this.quoteIdCounter = 1;
    this.settingsIdCounter = 1;
    this.projectIdCounter = 1;
    this.taskIdCounter = 1;
    this.animeReelIdCounter = 1;
    this.taskTypeIdCounter = 1;
    this.userTaskIdCounter = 1;
    
    // Create memory store for sessions
    const MemoryStore = createMemoryStore(session);
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    // Initialize with some sample quotes
    this.seedQuotes();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const created_at = new Date();
    const user: User = { 
      ...userData, 
      id, 
      created_at, 
      level: 1, 
      onboarded: false,
      avatar_url: userData.avatar_url || null
    };
    this.users.set(id, user);
    return user;
  }

  // Mission operations
  async getMission(id: number): Promise<Mission | undefined> {
    return this.missions.get(id);
  }

  async getMissionsByUserId(userId: number): Promise<Mission[]> {
    return Array.from(this.missions.values()).filter(
      (mission) => mission.user_id === userId
    );
  }

  async createMission(missionData: InsertMission): Promise<Mission> {
    const id = this.missionIdCounter++;
    const created_at = new Date();
    const mission: Mission = { 
      ...missionData, 
      id, 
      created_at,
      description: missionData.description || null,
      project_id: missionData.project_id || null,
      user_id: missionData.user_id || null
    };
    this.missions.set(id, mission);
    return mission;
  }

  // Progress operations
  async getProgress(id: number): Promise<Progress | undefined> {
    return this.progressRecords.get(id);
  }

  async getProgressByUserId(userId: number): Promise<Progress[]> {
    return Array.from(this.progressRecords.values()).filter(
      (record) => record.user_id === userId
    );
  }

  async createProgress(progressData: InsertProgress): Promise<Progress> {
    const id = this.progressIdCounter++;
    const date = new Date();
    const progress: Progress = { 
      ...progressData, 
      id, 
      date,
      mood: progressData.mood || null,
      energy_level: progressData.energy_level || null,
      notes: progressData.notes || null
    };
    this.progressRecords.set(id, progress);
    return progress;
  }

  // Quote operations
  async getQuote(id: number): Promise<Quote | undefined> {
    return this.quotesList.get(id);
  }

  async getRandomQuote(): Promise<Quote | undefined> {
    const quotes = Array.from(this.quotesList.values());
    if (quotes.length === 0) return undefined;
    
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  }

  async createQuote(quoteData: InsertQuote): Promise<Quote> {
    const id = this.quoteIdCounter++;
    const quote: Quote = { 
      ...quoteData, 
      id,
      character: quoteData.character || null, 
      audio_url: quoteData.audio_url || null
    };
    this.quotesList.set(id, quote);
    return quote;
  }

  // User settings operations
  async getUserSettings(id: number): Promise<UserSettings | undefined> {
    return this.userSettings.get(id);
  }

  async getUserSettingsByUserId(userId: number): Promise<UserSettings | undefined> {
    return Array.from(this.userSettings.values()).find(
      (settings) => settings.user_id === userId
    );
  }

  async createUserSettings(settingsData: InsertUserSettings): Promise<UserSettings> {
    const id = this.settingsIdCounter++;
    const settings: UserSettings = { 
      ...settingsData, 
      id,
      quote_frequency: settingsData.quote_frequency || null,
      voice_volume: settingsData.voice_volume || null,
      preferred_focus_hours: settingsData.preferred_focus_hours || null,
      theme: settingsData.theme || null
    };
    this.userSettings.set(id, settings);
    return settings;
  }

  // Project operations
  async getProject(id: number): Promise<Project | undefined> {
    return this.projectsList.get(id);
  }

  async getProjectsByUserId(userId: number): Promise<Project[]> {
    return Array.from(this.projectsList.values()).filter(
      (project) => project.user_id === userId
    );
  }

  async createProject(projectData: InsertProject): Promise<Project> {
    const id = this.projectIdCounter++;
    const start_date = new Date();
    const project: Project = { 
      ...projectData, 
      id, 
      start_date,
      description: projectData.description || null,
      end_date: projectData.end_date ? new Date(projectData.end_date) : null,
      status: projectData.status || "active",
    };
    this.projectsList.set(id, project);
    return project;
  }

  // Project task operations
  async getProjectTask(id: number): Promise<ProjectTask | undefined> {
    return this.projectTasks.get(id);
  }

  async getTasksByProjectId(projectId: number): Promise<ProjectTask[]> {
    return Array.from(this.projectTasks.values()).filter(
      (task) => task.project_id === projectId
    );
  }

  async createProjectTask(taskData: InsertProjectTask): Promise<ProjectTask> {
    const id = this.taskIdCounter++;
    const task: ProjectTask = { 
      ...taskData, 
      id,
      description: taskData.description || null,
      status: taskData.status || "pending",
      deadline: taskData.deadline ? new Date(taskData.deadline) : null
    };
    this.projectTasks.set(id, task);
    return task;
  }
  
  // Anime Reel operations
  async getAnimeReel(id: number): Promise<AnimeReel | undefined> {
    return this.animeReels.get(id);
  }
  
  async getAllAnimeReels(): Promise<AnimeReel[]> {
    return Array.from(this.animeReels.values());
  }
  
  async getRandomAnimeReel(): Promise<AnimeReel | undefined> {
    const reels = Array.from(this.animeReels.values());
    if (reels.length === 0) return undefined;
    
    const randomIndex = Math.floor(Math.random() * reels.length);
    return reels[randomIndex];
  }
  
  async createAnimeReel(reelData: InsertAnimeReel): Promise<AnimeReel> {
    const id = this.animeReelIdCounter++;
    const date_added = new Date();
    const reel: AnimeReel = { ...reelData, id, date_added };
    this.animeReels.set(id, reel);
    return reel;
  }
  
  // Task Types operations
  async getTaskType(id: number): Promise<TaskType | undefined> {
    const taskType = this.taskTypes.get(id);
    return taskType ? { 
      ...taskType, 
      description: taskType.description || null,
      category: taskType.category || null,
      icon: taskType.icon || null 
    } : undefined;
  }
  
  async getAllTaskTypes(): Promise<TaskType[]> {
    return Array.from(this.taskTypes.values()).map(type => ({
      ...type,
      description: type.description || null,
      category: type.category || null,
      icon: type.icon || null
    }));
  }
  
  async createTaskType(taskTypeData: InsertTaskType): Promise<TaskType> {
    const id = this.taskTypeIdCounter++;
    const taskType: TaskType = { 
      ...taskTypeData, 
      id,
      description: taskTypeData.description || null,
      category: taskTypeData.category || null,
      icon: taskTypeData.icon || null
    };
    this.taskTypes.set(id, taskType);
    return taskType;
  }
  
  // User Tasks operations
  async getUserTask(id: number): Promise<UserTask | undefined> {
    return this.userTasks.get(id);
  }
  
  async getUserTasksByUserId(userId: number, date?: Date): Promise<UserTask[]> {
    const tasks = Array.from(this.userTasks.values()).filter(
      task => task.user_id === userId
    );
    
    if (date) {
      const dateString = date.toISOString().split('T')[0]; // Get YYYY-MM-DD format
      return tasks.filter(task => {
        // Handle potential null values and do the comparison
        if (task.task_date) {
          const taskDate = new Date(task.task_date);
          return taskDate.toISOString().split('T')[0] === dateString;
        }
        return false;
      });
    }
    
    return tasks;
  }
  
  async createUserTask(userTaskData: InsertUserTask): Promise<UserTask> {
    const id = this.userTaskIdCounter++;
    const now = new Date();
    // For the in-memory implementation, we'll use the same Date object
    // and handle conversion during comparison operations
    const priority = userTaskData.priority || 5;
    
    // Using type assertion to work around the type system limitation
    // since the actual runtime behavior is correct
    const userTask = { 
      ...userTaskData, 
      id, 
      task_date: now,
      priority
    } as unknown as UserTask;
    this.userTasks.set(id, userTask);
    return userTask;
  }
  
  async updateUserTaskPriority(id: number, priority: number): Promise<UserTask> {
    const userTask = this.userTasks.get(id);
    if (!userTask) {
      throw new Error("User task not found");
    }
    
    const updatedTask = { ...userTask, priority };
    this.userTasks.set(id, updatedTask);
    return updatedTask;
  }
  
  async deleteUserTask(id: number): Promise<void> {
    this.userTasks.delete(id);
  }
  
  async clearUserTasks(userId: number, date?: Date): Promise<void> {
    const tasks = await this.getUserTasksByUserId(userId, date);
    for (const task of tasks) {
      this.userTasks.delete(task.id);
    }
  }
  
  private seedTaskTypes() {
    const defaultTaskTypes = [
      { name: "Workout", category: "Health", icon: "dumbbell" },
      { name: "Running", category: "Health", icon: "running" },
      { name: "Meditation", category: "Wellness", icon: "brain" },
      { name: "Coding Practice", category: "Professional", icon: "code" },
      { name: "Reading", category: "Personal", icon: "book" },
      { name: "Learning", category: "Education", icon: "graduation-cap" },
      { name: "Writing", category: "Professional", icon: "pen" },
      { name: "Project Work", category: "Professional", icon: "briefcase" },
      { name: "Language Study", category: "Education", icon: "language" },
      { name: "Meal Prep", category: "Health", icon: "utensils" },
      { name: "Family Time", category: "Personal", icon: "users" },
      { name: "Networking", category: "Professional", icon: "handshake" },
      { name: "Job Search", category: "Professional", icon: "search" },
      { name: "Journaling", category: "Personal", icon: "book-open" },
      { name: "Yoga", category: "Health", icon: "pray" }
    ];
    
    // Check if we already have task types
    if (this.taskTypes.size === 0) {
      defaultTaskTypes.forEach(task => {
        this.createTaskType(task);
      });
    }
  }

  // Seed initial data
  private seedQuotes() {
    const soloLevelingQuotes = [
      {
        text: "I don't have colleagues. Perhaps all hunters are meant to be alone.",
        character: "Sung Jin-Woo",
        audio_url: "https://soloascend.com/audio/quote1.mp3"
      },
      {
        text: "I alone level up.",
        character: "Sung Jin-Woo",
        audio_url: "https://soloascend.com/audio/quote2.mp3"
      },
      {
        text: "The strong prey on the weak. That is the absolute law of this world.",
        character: "Sung Jin-Woo",
        audio_url: "https://soloascend.com/audio/quote3.mp3"
      },
      {
        text: "Daily Quest has been issued. Time Limit: 24 hours.",
        character: "System",
        audio_url: "https://soloascend.com/audio/quote4.mp3"
      },
      {
        text: "You have been chosen as the Player. Complete all missions to level up.",
        character: "System",
        audio_url: "https://soloascend.com/audio/quote5.mp3"
      }
    ];

    soloLevelingQuotes.forEach(quote => {
      this.createQuote(quote);
    });
  }
}

// Use DatabaseStorage instead of MemStorage
export const storage = new DatabaseStorage();
