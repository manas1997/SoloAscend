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
  insertProjectTaskSchema
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

  // Projects routes
  app.post("/api/projects", async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      res.status(201).json(project);
    } catch (error) {
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

  const httpServer = createServer(app);
  return httpServer;
}
