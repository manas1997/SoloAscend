import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import {
  insertUserSchema,
  insertMissionSchema,
  insertProgressSchema,
  insertQuoteSchema,
  insertUserSettingsSchema,
  insertProjectSchema,
  insertProjectTaskSchema,
  insertAnimeReelSchema,
  insertTaskTypeSchema,
  insertUserTaskSchema
} from "@shared/schema";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication with Passport
  setupAuth(app);

  // Middleware to check if user is authenticated
  const isAuthenticated = (req: Request, res: any, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };
  // Users routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Error creating user" });
      }
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user" });
    }
  });

  // Missions routes
  app.post("/api/missions", async (req, res) => {
    try {
      const missionData = insertMissionSchema.parse(req.body);
      const mission = await storage.createMission(missionData);
      res.status(201).json(mission);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Error creating mission" });
      }
    }
  });

  app.get("/api/missions/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const missions = await storage.getMissionsByUserId(userId);
      res.json(missions);
    } catch (error) {
      res.status(500).json({ message: "Error fetching missions" });
    }
  });

  // Progress routes
  app.post("/api/progress", async (req, res) => {
    try {
      const progressData = insertProgressSchema.parse(req.body);
      const progress = await storage.createProgress(progressData);
      res.status(201).json(progress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Error creating progress record" });
      }
    }
  });

  app.get("/api/progress/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const progressRecords = await storage.getProgressByUserId(userId);
      res.json(progressRecords);
    } catch (error) {
      res.status(500).json({ message: "Error fetching progress records" });
    }
  });

  // Quotes routes
  app.post("/api/quotes", async (req, res) => {
    try {
      const quoteData = insertQuoteSchema.parse(req.body);
      const quote = await storage.createQuote(quoteData);
      res.status(201).json(quote);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Error creating quote" });
      }
    }
  });

  app.get("/api/quotes/random", async (req, res) => {
    try {
      const quote = await storage.getRandomQuote();
      if (!quote) {
        return res.status(404).json({ message: "No quotes found" });
      }
      res.json(quote);
    } catch (error) {
      res.status(500).json({ message: "Error fetching random quote" });
    }
  });

  // User settings routes
  app.post("/api/user-settings", async (req, res) => {
    try {
      const settingsData = insertUserSettingsSchema.parse(req.body);
      const settings = await storage.createUserSettings(settingsData);
      res.status(201).json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Error creating user settings" });
      }
    }
  });

  app.get("/api/user-settings/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const settings = await storage.getUserSettingsByUserId(userId);
      
      if (!settings) {
        return res.status(404).json({ message: "User settings not found" });
      }
      
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user settings" });
    }
  });
  
  // User onboarding endpoint
  app.post("/api/user/onboard", isAuthenticated, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // This would update the user's onboarded status in a real implementation
      // For now, we'll just return success since we don't have this field in our schema
      res.status(200).json({ message: "User onboarded successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error updating onboarding status" });
    }
  });

  // Projects routes
  app.post("/api/projects", async (req, res) => {
    try {
      // Pre-process the data to handle date conversions
      let projectData = { ...req.body };
      
      // Handle end_date conversion if it's a string
      if (projectData.end_date && typeof projectData.end_date === 'string') {
        try {
          // Try to parse the date
          projectData.end_date = new Date(projectData.end_date);
        } catch (error) {
          console.error("Date parsing error:", error);
          return res.status(400).json({ message: "Invalid date format for end_date" });
        }
      }
      
      // Validate the data with the schema
      const validatedData = insertProjectSchema.parse(projectData);
      
      // Create the project
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      console.error("Project creation error:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Error creating project" });
      }
    }
  });

  app.get("/api/projects/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const projects = await storage.getProjectsByUserId(userId);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Error fetching projects" });
    }
  });

  // Project tasks routes
  app.post("/api/project-tasks", async (req, res) => {
    try {
      const taskData = insertProjectTaskSchema.parse(req.body);
      const task = await storage.createProjectTask(taskData);
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Error creating project task" });
      }
    }
  });

  app.get("/api/project-tasks/:projectId", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const tasks = await storage.getTasksByProjectId(projectId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Error fetching project tasks" });
    }
  });
  
  // Anime Reels routes
  app.get("/api/anime-reels", async (req, res) => {
    try {
      const reels = await storage.getAllAnimeReels();
      res.json(reels);
    } catch (error) {
      res.status(500).json({ message: "Error fetching anime reels" });
    }
  });
  
  app.get("/api/anime-reels/random", async (req, res) => {
    try {
      const reel = await storage.getRandomAnimeReel();
      if (!reel) {
        return res.status(404).json({ message: "No anime reels found" });
      }
      res.json(reel);
    } catch (error) {
      res.status(500).json({ message: "Error fetching random anime reel" });
    }
  });
  
  app.get("/api/anime-reels/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const reel = await storage.getAnimeReel(id);
      
      if (!reel) {
        return res.status(404).json({ message: "Anime reel not found" });
      }
      
      res.json(reel);
    } catch (error) {
      res.status(500).json({ message: "Error fetching anime reel" });
    }
  });
  
  app.post("/api/anime-reels", async (req, res) => {
    try {
      const reelData = insertAnimeReelSchema.parse(req.body);
      const reel = await storage.createAnimeReel(reelData);
      res.status(201).json(reel);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Error creating anime reel" });
      }
    }
  });
  
  // Task Types routes
  app.get("/api/task-types", async (req, res) => {
    try {
      const taskTypes = await storage.getAllTaskTypes();
      res.json(taskTypes);
    } catch (error) {
      res.status(500).json({ message: "Error fetching task types" });
    }
  });
  
  app.get("/api/task-types/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const taskType = await storage.getTaskType(id);
      
      if (!taskType) {
        return res.status(404).json({ message: "Task type not found" });
      }
      
      res.json(taskType);
    } catch (error) {
      res.status(500).json({ message: "Error fetching task type" });
    }
  });
  
  app.post("/api/task-types", isAuthenticated, async (req, res) => {
    try {
      const taskTypeData = insertTaskTypeSchema.parse(req.body);
      const taskType = await storage.createTaskType(taskTypeData);
      res.status(201).json(taskType);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Error creating task type" });
      }
    }
  });
  
  // User Tasks routes
  app.get("/api/user-tasks", isAuthenticated, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      let date = undefined;
      if (req.query.date) {
        date = new Date(req.query.date as string);
      }
      
      const tasks = await storage.getUserTasksByUserId(req.user.id, date);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user tasks" });
    }
  });
  
  app.post("/api/user-tasks", isAuthenticated, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Get existing tasks for today
      const today = new Date();
      const existingTasks = await storage.getUserTasksByUserId(req.user.id, today);
      
      // Check if user already has 5 tasks for today
      if (existingTasks.length >= 5) {
        return res.status(400).json({ 
          message: "You already have 5 tasks selected for today. Please remove a task before adding a new one."
        });
      }
      
      const userTaskData = insertUserTaskSchema.parse({
        ...req.body,
        user_id: req.user.id
      });
      
      const userTask = await storage.createUserTask(userTaskData);
      res.status(201).json(userTask);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Error creating user task" });
      }
    }
  });
  
  app.patch("/api/user-tasks/:id/priority", isAuthenticated, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const id = parseInt(req.params.id);
      const { priority } = req.body;
      
      if (typeof priority !== 'number' || priority < 1 || priority > 5) {
        return res.status(400).json({ message: "Priority must be a number between 1 and 5" });
      }
      
      const updatedTask = await storage.updateUserTaskPriority(id, priority);
      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ message: "Error updating task priority" });
    }
  });
  
  app.delete("/api/user-tasks/:id", isAuthenticated, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const id = parseInt(req.params.id);
      await storage.deleteUserTask(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting user task" });
    }
  });
  
  app.delete("/api/user-tasks", isAuthenticated, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      let date = undefined;
      if (req.query.date) {
        date = new Date(req.query.date as string);
      }
      
      await storage.clearUserTasks(req.user.id, date);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error clearing user tasks" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
