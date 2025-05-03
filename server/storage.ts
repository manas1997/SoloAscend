import { users, type User, type InsertUser, missions, type Mission, type InsertMission, progress, type Progress, type InsertProgress, quotes, type Quote, type InsertQuote, user_settings, type UserSettings, type InsertUserSettings, projects, type Project, type InsertProject, project_tasks, type ProjectTask, type InsertProjectTask } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

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

  // Session store
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private missions: Map<number, Mission>;
  private progressRecords: Map<number, Progress>;
  private quotesList: Map<number, Quote>;
  private userSettings: Map<number, UserSettings>;
  private projectsList: Map<number, Project>;
  private projectTasks: Map<number, ProjectTask>;
  
  private userIdCounter: number;
  private missionIdCounter: number;
  private progressIdCounter: number;
  private quoteIdCounter: number;
  private settingsIdCounter: number;
  private projectIdCounter: number;
  private taskIdCounter: number;

  public sessionStore: session.Store;
  
  constructor() {
    this.users = new Map();
    this.missions = new Map();
    this.progressRecords = new Map();
    this.quotesList = new Map();
    this.userSettings = new Map();
    this.projectsList = new Map();
    this.projectTasks = new Map();
    
    this.userIdCounter = 1;
    this.missionIdCounter = 1;
    this.progressIdCounter = 1;
    this.quoteIdCounter = 1;
    this.settingsIdCounter = 1;
    this.projectIdCounter = 1;
    this.taskIdCounter = 1;
    
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
    const created_at = new Date().toISOString();
    const user: User = { ...userData, id, created_at, level: 1, onboarded: false };
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
    const created_at = new Date().toISOString();
    const mission: Mission = { ...missionData, id, created_at };
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
    const date = new Date().toISOString();
    const progress: Progress = { ...progressData, id, date };
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
    const quote: Quote = { ...quoteData, id };
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
    const settings: UserSettings = { ...settingsData, id };
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
    const start_date = projectData.start_date || new Date().toISOString();
    const project: Project = { ...projectData, id, start_date };
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
    const task: ProjectTask = { ...taskData, id };
    this.projectTasks.set(id, task);
    return task;
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

export const storage = new MemStorage();
