/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

// Initialize environment variables
dotenv.config();

// In-memory databases that pre-populate from our data file
import { PRESEEDED_HUSTLES, PRESEEDED_STORIES, PRESEEDED_LEADERBOARD } from "./src/data";
import { SideHustle } from "./src/types";

let currentHustles = [...PRESEEDED_HUSTLES];
let currentStories = [...PRESEEDED_STORIES];
let currentLeaderboard = [...PRESEEDED_LEADERBOARD];

// Lazy-initialize Gemini client to avoid crashes if API key is not yet set
let googleAI: GoogleGenAI | null = null;
function getGoogleAI() {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!googleAI) {
    googleAI = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      }
    });
  }
  return googleAI;
}

async function main() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Log API requests
  app.use((req, res, next) => {
    console.log(`[API LOG] ${req.method} ${req.url}`);
    next();
  });

  // --- API Routes ---

  // Get all side hustles
  app.get("/api/hustles", (req, res) => {
    res.json(currentHustles);
  });

  // Add a new completed side hustle
  app.post("/api/hustles", (req, res) => {
    const data = req.body;
    if (!data.title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const newHustle: SideHustle = {
      id: `hustle-${Date.now()}`,
      title: data.title,
      category: data.category || "Gig Economy",
      country: data.country || "United Kingdom",
      experienceType: data.experienceType || "Personal Journey",
      howToStart: data.howToStart || "",
      toolsUsed: Array.isArray(data.toolsUsed) ? data.toolsUsed : [],
      initialCost: Number(data.initialCost) || 0,
      timeSpentWeekly: Number(data.timeSpentWeekly) || 0,
      firstEarningAmount: Number(data.firstEarningAmount) || 0,
      upvotes: 1, // Start with self-upvote
      verified: !!data.imageProof, // Auto-verified if proof submitted
      authorName: data.authorName || "Anonymous Student",
      authorAvatar: data.authorAvatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(data.authorName || "Anonymous")}`,
      dateCreated: new Date().toISOString().split("T")[0],
      imageProof: data.imageProof || undefined,
      views: 12,
      aiFeasibilityScore: data.aiFeasibilityScore || undefined,
      aiConsultantReview: data.aiConsultantReview || undefined,
    };

    currentHustles.unshift(newHustle);

    // If verified, add or update the student on the leaderboard
    if (newHustle.firstEarningAmount > 0) {
      // Find if student is already in leaderboard
      const existingIdx = currentLeaderboard.findIndex(l => l.studentName.toLowerCase() === newHustle.authorName.toLowerCase());
      if (existingIdx !== -1) {
        currentLeaderboard[existingIdx].earnings += newHustle.firstEarningAmount;
        currentLeaderboard[existingIdx].verifiedExpert = currentLeaderboard[existingIdx].verifiedExpert || newHustle.verified;
      } else {
        currentLeaderboard.push({
          rank: currentLeaderboard.length + 1,
          studentName: newHustle.authorName,
          hustleName: newHustle.title,
          category: newHustle.category,
          earnings: newHustle.firstEarningAmount,
          verifiedExpert: newHustle.verified,
          avatar: newHustle.authorAvatar,
        });
      }
      
      // Sort leaderboard by earnings
      currentLeaderboard.sort((a, b) => b.earnings - a.earnings);
      currentLeaderboard.forEach((item, index) => {
        item.rank = index + 1;
      });
    }

    // Add a corresponding Story post for community engagement
    currentStories.unshift({
      id: `story-${Date.now()}`,
      authorName: newHustle.authorName,
      authorAvatar: newHustle.authorAvatar,
      hustleTitle: newHustle.title,
      milestone: newHustle.verified ? "Verified Expert Submission" : "New Hustle Draft Shared",
      content: `Just launched my guide: "${newHustle.title}"! Initial costs were $${newHustle.initialCost} and it took me around ${newHustle.timeSpentWeekly} hours a week to start seeing a payout of $${newHustle.firstEarningAmount}. Check it out under the Submit tab!`,
      likes: 1,
      timeAgo: "Just now",
      commentsCount: 0
    });

    res.json(newHustle);
  });

  // Upvote a side hustle
  app.post("/api/hustles/:id/upvote", (req, res) => {
    const { id } = req.params;
    const index = currentHustles.findIndex(h => h.id === id);
    if (index !== -1) {
      currentHustles[index].upvotes += 1;
      return res.json(currentHustles[index]);
    }
    res.status(404).json({ error: "Hustle not found" });
  });

  // Get student stories
  app.get("/api/stories", (req, res) => {
    res.json(currentStories);
  });

  // Post a support structures "Likes" update in stories
  app.post("/api/stories/:id/like", (req, res) => {
    const { id } = req.params;
    const index = currentStories.findIndex(s => s.id === id);
    if (index !== -1) {
      currentStories[index].likes += 1;
      return res.json(currentStories[index]);
    }
    res.status(404).json({ error: "Story not found" });
  });

  // Get leaderboard rankings
  app.get("/api/leaderboard", (req, res) => {
    res.json(currentLeaderboard);
  });

  // Server-side AI Advisor endpoint using the official Google GenAI instructions
  app.post("/api/ai/analyze", async (req, res) => {
    const { title, category, country, initialCost, timeSpentWeekly, firstEarningAmount, howToStart, toolsUsed } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required for AI evaluation." });
    }

    const aiClient = getGoogleAI();

    // Setup an elegant fallback mock analysis in case the user has not configure a real GEMINI_API_KEY
    if (!aiClient) {
      console.log("[GEMINI ADVISOR] No authentic key detected, launching high-fidelity simulation model.");
      
      const categoryKeywords: Record<string, { score: number, review: string, risks: string[], tips: string[] }> = {
        "Digital Services": {
          score: 87,
          review: `An excellent zero-overhead candidate. Providing digital content or freelance workflows uses intellectual leverage without scaling inventory blockages.`,
          risks: ["Client-sourcing competition on massive platforms", "Under-pricing skilled service time"],
          tips: ["Anchor your prices to student agency budgets to prompt local referrals.", "Offer recurring packages instead of one-offs.", "Publish micro-portfolio pieces on Instagram."]
        },
        "Physical Sales": {
          score: 76,
          review: `Classic student arbitrage logic. Highly localizable, but physical product setups carry critical inventory overheads and room space bottlenecks.`,
          risks: ["Unsold inventory taking up dormitory shelf space", "Logistics and shipping overhead delays"],
          tips: ["Avoid bulk prepays; run an on-demand preorder model.", "Set up physical banners in student commons.", "Accept instant payment via local mobile payment QR codes."]
        },
        "Gig Economy": {
          score: 82,
          review: `High temporal flexibility, trading hours for capital immediately. High-quality immediate cash-flow with low asset accumulation.`,
          risks: ["Linear scaling (income is tightly bound strictly to hours worked)", "Potential physical fatigue during high-exam weeks"],
          tips: ["Charge prime-time surge rates during weekend events.", "Equip simple utility bags for frictionless fast travel.", "Group deliveries by dorm building block to preserve energy."]
        },
        "Passive Income": {
          score: 91,
          review: `The holy grail of student financial labs. High upfront time investment transforms completely into scale-free automated residual income over quarters.`,
          risks: ["Very slow initial growth and indexing phase", "Platform search engine algorithm changes"],
          tips: ["Focus intensely on specific student niches (e.g., specific law course summaries).", "Build templates for highly popular digital software.", "Leverage study shorts on YouTube or TikTok."]
        }
      };

      const match = categoryKeywords[category] || categoryKeywords["Digital Services"];
      // Randomize slightly
      const finalScore = Math.min(100, Math.max(30, match.score + Math.floor(Math.random() * 8) - 4));
      
      return res.json({
        score: finalScore,
        review: match.review + ` Evaluated for launch in ${country || 'global campuses'} with initial budget of $${initialCost || 0}.`,
        risks: match.risks,
        optimizationTips: match.tips,
        usingSimulation: true
      });
    }

    try {
      const promptText = `Analyze this college student side hustle idea and give an expert critique rate:
Hustle Title: "${title}"
Category: "${category}"
Location/Country: "${country}"
Initial Setup Cost: $${initialCost}
Weekly Time Allocation: ${timeSpentWeekly} hours
Estimated First Earnings: $${firstEarningAmount}
Blueprint Description: "${howToStart}"
Tools & Assets Proposed: "${(toolsUsed || []).join(', ')}"

Provide a professional, realistic study in JSON format.
Your output MUST contain EXACTLY these fields:
{
  "score": <number from 0 to 100 on feasibility, accounting for study schedule balance>,
  "review": "<2-3 sentences of sharp expert critique, highlighting strengths as a student startup>",
  "risks": ["<risk factor 1>", "<risk factor 2>"],
  "optimizationTips": ["<growth tip 1>", "<growth tip 2>", "<growth tip 3>"]
}`;

      const response = await aiClient.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptText,
        config: {
          systemInstruction: "You are EarnSmart AI, a brilliant university startup coach and venture economist advising student micro-entrepreneurs. You evaluate risk, startup overheads, and student workload. Return compact output in strict JSON. No markdown blocks.",
          responseMimeType: "application/json",
          temperature: 0.75,
        }
      });

      const textOutput = response.text || "{}";
      const cleaned = textOutput.replace(/```json/g, "").replace(/```/g, "").trim();
      const payload = JSON.parse(cleaned);

      res.json(payload);
    } catch (err: any) {
      console.error("[GEMINI ERROR] Failed to generate AI review:", err);
      res.status(500).json({ error: "AI evaluation stalled. Please verify your API key.", details: err.message });
    }
  });


  // --- Integrate Vite Client Middleware / Production Service ---

  if (process.env.NODE_ENV !== "production") {
    // Development mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("[DEV ENVIRONMENT] Vite development server connected to Express");
  } else {
    // Production mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("[PRODUCTION ENVIRONMENT] Under static serving at dist/");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EarnSmart server live at http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error("Critical server failure on startup:", err);
});
