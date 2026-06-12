/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Sparkles, 
  UploadCloud, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  Coins, 
  Clock, 
  Wrench, 
  MapPin, 
  User, 
  Heart, 
  MessageSquare, 
  Filter, 
  DollarSign, 
  X, 
  ChevronRight, 
  Info, 
  Trophy, 
  Compass, 
  Flame, 
  TrendingUp, 
  BookOpen,
  Calendar,
  Layers,
  ThumbsUp,
  UserCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SideHustle, StudentStory, LeaderboardEntry } from "./types";

export default function App() {
  // Tabs and general navigation
  const [activeTab, setActiveTab] = useState<"submit" | "explore" | "stories" | "leaderboard">("submit");
  const [hustles, setHustles] = useState<SideHustle[]>([]);
  const [stories, setStories] = useState<StudentStory[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Slide out drawer states
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedHustle, setSelectedHustle] = useState<SideHustle | null>(null);

  // Filter & search states for 'Explore'
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [budgetGoal, setBudgetGoal] = useState<number>(300);
  const [budgetHours, setBudgetHours] = useState<number>(10);
  const [recommendedHustles, setRecommendedHustles] = useState<SideHustle[]>([]);

  // Simple Story Draft Input
  const [newStoryContent, setNewStoryContent] = useState("");
  const [newStoryTitle, setNewStoryTitle] = useState("");

  // Step wizard form states
  const [currentStep, setCurrentStep] = useState(1);
  const [ideaName, setIdeaName] = useState("");
  const [category, setCategory] = useState("Digital Services");
  const [country, setCountry] = useState("United Kingdom");
  const [experienceType, setExperienceType] = useState<"Personal Journey" | "Detailed Research">("Personal Journey");
  const [howToStart, setHowToStart] = useState("");
  const [toolsUsed, setToolsUsed] = useState("");
  const [initialCost, setInitialCost] = useState("");
  const [timeSpentWeekly, setTimeSpentWeekly] = useState("");
  const [firstEarningAmount, setFirstEarningAmount] = useState("");
  const [uploadedProof, setUploadedProof] = useState<string>("");
  const [proofSelection, setProofSelection] = useState<string>(""); // either mock or local file

  // Form AI valuation feedback trigger
  const [aiReviewPending, setAiReviewPending] = useState(false);
  const [aiReviewResult, setAiReviewResult] = useState<{
    score: number;
    review: string;
    risks: string[];
    optimizationTips: string[];
    usingSimulation?: boolean;
  } | null>(null);

  const [formSubmitted, setFormSubmitted] = useState(false);

  // User credentials configuration
  const [userProfile, setUserProfile] = useState({
    name: "Sanjana Ray",
    badge: "Student Innovator",
    rank: 6,
    college: "Student Money Lab",
    targetSavings: 500,
    savedHustleIds: ["hustle-1", "hustle-3"] as string[],
    email: "sanjanaray497@gmail.com"
  });

  // Mock proof presets for quick testing
  const MOCK_PROOFS = [
    { name: "Paypal Student Invoice.png", url: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=400" },
    { name: "Stripe Earnings Dashboard.png", url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=400" },
    { name: "Campus Delivery Log.png", url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=400" }
  ];

  // Load from backend
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [hRes, sRes, lRes] = await Promise.all([
        fetch("/api/hustles"),
        fetch("/api/stories"),
        fetch("/api/leaderboard")
      ]);
      const hData = await hRes.json();
      const sData = await sRes.json();
      const lData = await lRes.json();
      
      setHustles(hData);
      setStories(sData);
      setLeaderboard(lData);
    } catch (e) {
      console.error("Error loading server-side endpoints:", e);
    } finally {
      setLoading(false);
    }
  };

  // Upvote tool function
  const handleUpvote = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(`/api/hustles/${id}/upvote`, { method: "POST" });
      if (response.ok) {
        const updated = await response.json();
        setHustles(prev => prev.map(h => h.id === id ? updated : h));
        if (selectedHustle && selectedHustle.id === id) {
          setSelectedHustle(updated);
        }
      }
    } catch (err) {
      console.error("Upvote call failed:", err);
    }
  };

  // Likes tool function for student stories
  const handleLikeStory = async (id: string) => {
    try {
      const response = await fetch(`/api/stories/${id}/like`, { method: "POST" });
      if (response.ok) {
        const updated = await response.json();
        setStories(prev => prev.map(s => s.id === id ? updated : s));
      }
    } catch (err) {
      console.error("Like call failed:", err);
    }
  };

  // Run AI Advisor analysis on the current wizard data
  const requestAIAdvisorFeedback = async () => {
    if (!ideaName) return;
    setAiReviewPending(true);
    setAiReviewResult(null);
    try {
      const response = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: ideaName,
          category,
          country,
          initialCost: Number(initialCost) || 0,
          timeSpentWeekly: Number(timeSpentWeekly) || 0,
          firstEarningAmount: Number(firstEarningAmount) || 0,
          howToStart,
          toolsUsed: toolsUsed.split(",").map(t => t.trim()).filter(Boolean)
        })
      });
      if (response.ok) {
        const data = await response.json();
        setAiReviewResult(data);
      }
    } catch (err) {
      console.error("AI Advisor call failed:", err);
    } finally {
      setAiReviewPending(false);
    }
  };

  // Submit the multi-step form to the server database
  const handleFormSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaName) return;

    setLoading(true);
    try {
      const toolArray = toolsUsed.split(",").map(t => t.trim()).filter(Boolean);
      const postBody = {
        title: ideaName,
        category,
        country,
        experienceType,
        howToStart,
        toolsUsed: toolArray,
        initialCost: Number(initialCost) || 0,
        timeSpentWeekly: Number(timeSpentWeekly) || 0,
        firstEarningAmount: Number(firstEarningAmount) || 0,
        imageProof: uploadedProof || undefined,
        authorName: userProfile.name,
        authorAvatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=Sanjana`,
        aiFeasibilityScore: aiReviewResult?.score || undefined,
        aiConsultantReview: aiReviewResult?.review || undefined
      };

      const response = await fetch("/api/hustles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postBody)
      });

      if (response.ok) {
        const newHustle = await response.json();
        setFormSubmitted(true);
        // Refresh local listings to reflect the new dynamic entry instantly
        fetchData();
      }
    } catch (err) {
      console.error("Form submit failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Client-side quick file selection simulator
  const handleProofSimulatedSelection = (url: string) => {
    setUploadedProof(url);
    setProofSelection(url);
  };

  // Dynamic file upload to base64
  const handleLocalFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedProof(reader.result as string);
        setProofSelection(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save hustle internally in profile
  const toggleSaveHustle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setUserProfile(prev => {
      const isSaved = prev.savedHustleIds.includes(id);
      const newSaved = isSaved 
        ? prev.savedHustleIds.filter(val => val !== id) 
        : [...prev.savedHustleIds, id];
      return { ...prev, savedHustleIds: newSaved };
    });
  };

  // Post a brand new student story instantly
  const handlePostStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoryContent || !newStoryTitle) return;

    try {
      // Mock insert on backend by submitting a mini-guide draft, or save locally in state
      // For immediate user feedback in Stories tab, inject custom item
      const customStory: StudentStory = {
        id: `story-custom-${Date.now()}`,
        authorName: userProfile.name,
        authorAvatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=Sanjana`,
        hustleTitle: newStoryTitle,
        milestone: "Student Progress Update",
        content: newStoryContent,
        likes: 1,
        timeAgo: "Just now",
        commentsCount: 0
      };

      setStories(prev => [customStory, ...prev]);
      setNewStoryTitle("");
      setNewStoryContent("");
    } catch (err) {
      console.error(err);
    }
  };

  // Calculate dynamic recommendations based on budget planning wizard
  useEffect(() => {
    if (hustles.length > 0) {
      const filtered = hustles.filter(h => {
        // High compatibility matching: hours spent <= available hours, and first earning potential matches scale
        const meetsHours = h.timeSpentWeekly <= budgetHours + 4;
        const meetsInvestment = h.initialCost <= budgetGoal;
        return meetsHours && meetsInvestment;
      });
      setRecommendedHustles(filtered.slice(0, 3));
    }
  }, [hustles, budgetGoal, budgetHours]);

  const stepLabels = [
    "Basic Details",
    "Experience",
    "The Guide / Blueprint",
    "Proof & AI Valuation"
  ];

  // Render Category indicators
  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case "Digital Services":
        return { bg: "bg-teal-500/10 text-teal-400 border-teal-500/20", dot: "bg-teal-400" };
      case "Physical Sales":
        return { bg: "bg-orange-500/10 text-orange-400 border-orange-500/20", dot: "bg-orange-400" };
      case "Gig Economy":
        return { bg: "bg-[#00e676]/10 text-primary border-primary/20", dot: "bg-[#00e676]" };
      case "Passive Income":
        return { bg: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", dot: "bg-yellow-400" };
      default:
        return { bg: "bg-gray-500/10 text-gray-400 border-gray-500/20", dot: "bg-gray-400" };
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-sans antialiased text-body-md transition-colors selection:bg-primary selection:text-on-primary">
      
      {/* Background Aurora Blur Orbs as described in Design Philosophy */}
      <div className="fixed top-[-10%] right-[-15%] w-[45vw] h-[45vw] bg-primary/10 blur-[130px] rounded-full -z-10 pointer-events-none"></div>
      <div className="fixed bottom-[-15%] left-[-15%] w-[50vw] h-[50vw] bg-tertiary/5 blur-[160px] rounded-full -z-10 pointer-events-none"></div>

      {/* Modern Fixed Header */}
      <header className="fixed top-0 w-full z-50 bg-[#0d150e]/80 backdrop-blur-xl border-b border-outline-variant shadow-sm px-4 md:px-12 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab("submit")}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-tertiary flex items-center justify-center shadow-lg shadow-primary/20">
              <Coins className="w-6 h-6 text-on-primary" />
            </div>
            <span className="font-display text-2xl font-bold tracking-tight text-primary">EarnSmart</span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => { setActiveTab("explore"); setFormSubmitted(false); }}
              className={`font-medium transition-all duration-200 cursor-pointer text-[15px] relative py-1 ${
                activeTab === "explore" 
                  ? "text-primary font-bold border-b-2 border-primary" 
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              Explore
            </button>
            <button
              onClick={() => { setActiveTab("submit"); setFormSubmitted(false); }}
              className={`font-medium transition-all duration-200 cursor-pointer text-[15px] relative py-1 ${
                activeTab === "submit" 
                  ? "text-primary font-bold border-b-2 border-primary" 
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              Submit
            </button>
            <button
              onClick={() => { setActiveTab("stories"); setFormSubmitted(false); }}
              className={`font-medium transition-all duration-200 cursor-pointer text-[15px] relative py-1 ${
                activeTab === "stories" 
                  ? "text-primary font-bold border-b-2 border-primary" 
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              Stories
            </button>
            <button
              onClick={() => { setActiveTab("leaderboard"); setFormSubmitted(false); }}
              className={`font-medium transition-all duration-200 cursor-pointer text-[15px] relative py-1 ${
                activeTab === "leaderboard" 
                  ? "text-primary font-bold border-b-2 border-primary" 
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              Leaderboard
            </button>
          </nav>

          {/* User Session Action Area */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => { setProfileOpen(true); }}
              className="text-on-surface-variant text-[14px] hover:text-primary font-medium transition-colors hidden sm:block"
            >
              How It Works
            </button>
            <button 
              id="profile-toggle-btn"
              onClick={() => setProfileOpen(true)}
              className="bg-primary text-on-primary font-bold px-6 py-2.5 rounded-full hover:shadow-lg hover:shadow-primary/20 active:scale-95 transition-all text-sm flex items-center gap-2"
            >
              <div className="w-5 h-5 rounded-full overflow-hidden bg-white/20">
                <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Sanjana" alt="profile" />
              </div>
              <span>Profile</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="pt-28 pb-20 px-4 md:px-12 max-w-7xl mx-auto">
        
        {/* TAB CONTROLLERS FOR MOBILE */}
        <div className="flex md:hidden bg-surface-container border border-outline-variant rounded-xl p-1 mb-8 overflow-x-auto justify-between gap-1">
          {["explore", "submit", "stories", "leaderboard"].map((t) => (
            <button
              key={t}
              onClick={() => { setActiveTab(t as any); setFormSubmitted(false); }}
              className={`flex-1 py-2 text-center rounded-lg text-xs font-semibold capitalize transition-all whitespace-nowrap px-3 ${
                activeTab === t 
                  ? "bg-primary text-on-primary shadow-sm" 
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* 1. SUBMIT TAB (STUDENT WIZARD FORM) */}
        {activeTab === "submit" && (
          <div className="max-w-3xl mx-auto">
            {/* Header section matching screenshot */}
            <div className="mb-12 text-center">
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                Share Your <span className="aurora-text">Money Move</span>
              </h1>
              <p className="text-on-surface-variant text-lg max-w-xl mx-auto">
                Help other students earn by sharing your authentic side-hustle journey. High-quality guides get featured on our leaderboard.
              </p>
            </div>

            {!formSubmitted ? (
              <div className="glass-panel p-6 md:p-10 rounded-2xl relative overflow-hidden">
                
                {/* Step Percentage Tracker */}
                <div className="mb-8">
                  <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
                    <span>Step {currentStep} of 4: {stepLabels[currentStep - 1]}</span>
                    <span>{currentStep * 25}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-surface-container rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full aurora-gradient" 
                      initial={{ width: "25%" }}
                      animate={{ width: `${currentStep * 25}%` }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                  </div>
                </div>

                <form onSubmit={handleFormSubmission} className="space-y-8">
                  
                  {/* STEP 1: BASIC DETAILS */}
                  {currentStep === 1 && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <h2 className="font-display text-2xl font-semibold text-primary">The Essentials</h2>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                            IDEA NAME
                          </label>
                          <input 
                            type="text"
                            required
                            value={ideaName}
                            onChange={(e) => setIdeaName(e.target.value)}
                            className="w-full bg-[#081009] border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-xl p-4 text-on-surface outline-none transition-all"
                            placeholder="e.g. Campus Coffee Delivery"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                              CATEGORY
                            </label>
                            <select 
                              value={category}
                              onChange={(e) => setCategory(e.target.value)}
                              className="w-full bg-[#081009] border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-xl p-4 text-on-surface outline-none transition-all appearance-none"
                            >
                              <option value="Digital Services">Digital Services</option>
                              <option value="Physical Sales">Physical Sales</option>
                              <option value="Gig Economy">Gig Economy</option>
                              <option value="Passive Income">Passive Income</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                              COUNTRY OR ZONE
                            </label>
                            <input 
                              type="text"
                              required
                              value={country}
                              onChange={(e) => setCountry(e.target.value)}
                              className="w-full bg-[#081009] border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-xl p-4 text-on-surface outline-none transition-all"
                              placeholder="e.g. United Kingdom"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: EXPERIENCE TYPE CARD CHOOSERS */}
                  {currentStep === 2 && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div>
                        <h2 className="font-display text-2xl font-semibold text-primary">Your Experience</h2>
                        <p className="text-on-surface-variant text-sm mt-1">
                          How did you validate this idea? We prioritize real-world testing.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div 
                          onClick={() => setExperienceType("Personal Journey")}
                          className={`glass-panel p-6 rounded-2xl cursor-pointer transition-all border ${
                            experienceType === "Personal Journey" 
                              ? "border-primary bg-primary/5 shadow-[0_0_15px_rgba(117,255,158,0.1)]" 
                              : "border-outline-variant"
                          }`}
                        >
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <User className="w-6 h-6 text-primary" />
                          </div>
                          <h3 className="font-bold text-lg mb-2">Personal Journey</h3>
                          <p className="text-sm text-on-surface-variant">
                            I actually did this and made real money. This is my step-by-step blueprint.
                          </p>
                        </div>

                        <div 
                          onClick={() => setExperienceType("Detailed Research")}
                          className={`glass-panel p-6 rounded-2xl cursor-pointer transition-all border ${
                            experienceType === "Detailed Research" 
                              ? "border-primary bg-primary/5 shadow-[0_0_15px_rgba(117,255,158,0.1)]" 
                              : "border-outline-variant"
                          }`}
                        >
                          <div className="w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center mb-4">
                            <Search className="w-6 h-6 text-tertiary" />
                          </div>
                          <h3 className="font-bold text-lg mb-2">Detailed Research</h3>
                          <p className="text-sm text-on-surface-variant">
                            I haven't executed it yet, but I've done deep research on the market viability.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: THE BLUEPRINT GUIDE DETAILS */}
                  {currentStep === 3 && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <h2 className="font-display text-2xl font-semibold text-primary">The Blueprint</h2>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                            HOW DID YOU START? (STEPS)
                          </label>
                          <textarea 
                            required
                            rows={4}
                            value={howToStart}
                            onChange={(e) => setHowToStart(e.target.value)}
                            className="w-full bg-[#081009] border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-xl p-4 text-on-surface outline-none transition-all text-sm resize-none"
                            placeholder="Provide your step-by-step startup guide..."
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                            TOOLS USED
                          </label>
                          <input 
                            type="text"
                            value={toolsUsed}
                            onChange={(e) => setToolsUsed(e.target.value)}
                            className="w-full bg-[#081009] border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-xl p-4 text-on-surface outline-none transition-all text-sm"
                            placeholder="e.g. Notion, Figma, Canva, WhatsApp..."
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                              INITIAL COST ($)
                            </label>
                            <input 
                              type="number"
                              required
                              min="0"
                              value={initialCost}
                              onChange={(e) => setInitialCost(e.target.value)}
                              className="w-full bg-[#081009] border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-xl p-3 text-on-surface outline-none transition-all text-sm"
                              placeholder="0"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                              TIME SPENT (HRS/WK)
                            </label>
                            <input 
                              type="number"
                              required
                              min="1"
                              value={timeSpentWeekly}
                              onChange={(e) => setTimeSpentWeekly(e.target.value)}
                              className="w-full bg-[#081009] border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-xl p-3 text-on-surface outline-none transition-all text-sm"
                              placeholder="5"
                            />
                          </div>

                          <div className="col-span-1 sm:col-span-2">
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                              FIRST EARNING AMOUNT ($)
                            </label>
                            <input 
                              type="number"
                              required
                              min="0"
                              value={firstEarningAmount}
                              onChange={(e) => setFirstEarningAmount(e.target.value)}
                              className="w-full bg-[#081009] border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-xl p-3 text-on-surface outline-none transition-all text-sm"
                              placeholder="100.00"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 4: PROOF AND ARTIFICIAL INTELLIGENCE CONSULTANT CO-PILOT */}
                  {currentStep === 4 && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div>
                        <h2 className="font-display text-2xl font-semibold text-primary font-bold">Proof &amp; AI Valuation</h2>
                        <p className="text-on-surface-variant text-xs mt-1">
                          Submit physical evidence screenshots or trigger the Gemini Student Coach model to analyze the commercial feasibility.
                        </p>
                      </div>

                      {/* File Uploader Shell */}
                      <div className="border-2 border-dashed border-outline-variant rounded-xl p-6 text-center hover:border-primary transition-all cursor-pointer bg-surface-container/20 group relative">
                        <input 
                          type="file" 
                          accept="image/*" 
                          id="file-element"
                          onChange={handleLocalFileUpload} 
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                        />
                        <UploadCloud className="w-10 h-10 text-on-surface-variant group-hover:text-primary mx-auto mb-3 transition-colors" />
                        <h3 className="font-bold text-sm mb-1">Upload Real Screenshot Proof</h3>
                        <p className="text-on-surface-variant text-xs mb-3">
                          Receipts, client review letters, payouts log (Max 10MB)
                        </p>
                        {proofSelection && (
                          <div className="inline-flex items-center gap-2 bg-primary/20 text-primary border border-primary/30 py-1 px-3 rounded-full text-xs font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Loaded: {proofSelection.substring(0, 25)}...</span>
                          </div>
                        )}
                      </div>

                      {/* Quick Mock Sample selector in case they don't have real files */}
                      <div className="space-y-2">
                        <span className="block text-xs font-bold text-on-surface-variant uppercase tracking-wide">
                          Or select a simulated proof invoice:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {MOCK_PROOFS.map((proof, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => handleProofSimulatedSelection(proof.url)}
                              className={`py-2 px-3 rounded-lg border text-xs font-semibold text-left truncate flex items-center gap-2 transition-all cursor-pointer ${
                                uploadedProof === proof.url 
                                  ? "border-primary bg-primary/10 text-primary" 
                                  : "border-outline-variant bg-surface-container/40 hover:bg-surface-container text-on-surface-variant"
                              }`}
                            >
                              <span className="w-2 h-2 rounded-full bg-primary" />
                              <span className="truncate">{proof.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* AI Advisor Validation Section */}
                      <div className="bg-surface-container-low border border-outline-variant rounded-xl p-5 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-tertiary" />
                            <span className="font-bold text-sm text-on-surface">EarnSmart AI Startup Review</span>
                          </div>
                          
                          <button
                            type="button"
                            onClick={requestAIAdvisorFeedback}
                            disabled={aiReviewPending}
                            className="text-xs bg-tertiary text-on-tertiary hover:opacity-90 font-bold py-1.5 px-3 rounded-full transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                          >
                            <Flame className="w-3 h-3" />
                            <span>{aiReviewResult ? "Re-evaluate" : "Analyze Idea"}</span>
                          </button>
                        </div>

                        {aiReviewPending && (
                          <div className="flex flex-col items-center justify-center py-4 space-y-2">
                            <motion.div 
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
                            />
                            <p className="text-xs text-on-surface-variant animate-pulse">
                              Consulting Gemini 3.5 model... Calculating student workloads...
                            </p>
                          </div>
                        )}

                        {aiReviewResult && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-on-surface-variant uppercase font-bold">Feasibility Score:</span>
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-28 bg-surface-container rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-primary" 
                                    style={{ width: `${aiReviewResult.score}%` }}
                                  />
                                </div>
                                <span className={`text-sm font-bold ${aiReviewResult.score >= 80 ? "text-primary" : "text-tertiary"}`}>
                                  {aiReviewResult.score}/100
                                </span>
                              </div>
                            </div>

                            <p className="text-xs text-on-surface-variant leading-relaxed italic bg-black/20 p-3 rounded-lg border border-outline-variant/30">
                              "{aiReviewResult.review}"
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                              <div className="space-y-1">
                                <span className="font-bold text-red-400 block mb-1">Critical Student Risks:</span>
                                {aiReviewResult.risks.map((risk, idx) => (
                                  <div key={idx} className="flex items-start gap-1 text-on-surface-variant">
                                    <span className="text-red-400 font-bold">•</span>
                                    <span>{risk}</span>
                                  </div>
                                ))}
                              </div>

                              <div className="space-y-1">
                                <span className="font-bold text-primary block mb-1">Growth Action Points:</span>
                                {aiReviewResult.optimizationTips.map((tip, idx) => (
                                  <div key={idx} className="flex items-start gap-1 text-on-surface-variant">
                                    <span className="text-primary font-bold">✓</span>
                                    <span>{tip}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {!aiReviewResult && !aiReviewPending && (
                          <div className="flex items-start gap-3 p-3 bg-surface-container-high/40 rounded-lg">
                            <Info className="w-5 h-5 text-tertiary flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-on-surface-variant leading-relaxed">
                              Submitting with AI analysis significantly increases visibility on the home explore feed and ensures a <span className="text-tertiary font-bold">Verified Expert</span> evaluation.
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Form Step Buttons */}
                  <div className="flex justify-between items-center pt-6 border-t border-outline-variant/30">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                      className={`flex items-center gap-2 text-on-surface-variant hover:text-on-surface font-bold px-6 py-3 rounded-lg transition-colors cursor-pointer ${
                        currentStep === 1 ? "invisible" : ""
                      }`}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>

                    <div className="flex-grow"></div>

                    {currentStep < 4 ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (currentStep === 1 && !ideaName) return;
                          setCurrentStep(prev => prev + 1);
                        }}
                        className="bg-primary text-on-primary font-bold px-8 py-3 rounded-full hover:shadow-[0_0_20px_rgba(117,255,158,0.3)] active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <span>Next Step</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="bg-primary text-on-primary font-bold px-10 py-3 rounded-full hover:shadow-[0_0_20px_rgba(117,255,158,0.4)] active:scale-95 transition-all cursor-pointer"
                      >
                        Publish Money Move
                      </button>
                    )}
                  </div>

                </form>
              </div>
            ) : (
              /* Success confirmation panel on successful submission */
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel text-center p-10 rounded-2xl space-y-6"
              >
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-primary/10">
                  <CheckCircle2 className="w-12 h-12 text-primary" />
                </div>

                <div className="space-y-2">
                  <h2 className="font-display text-3xl font-bold text-on-surface">Money Move Published!</h2>
                  <p className="text-on-surface-variant max-w-md mx-auto">
                    Your dynamic walkthrough "{ideaName}" is now live in the global directory and shared on the student board.
                  </p>
                </div>

                {aiReviewResult && (
                  <div className="max-w-md mx-auto bg-surface-container p-4 rounded-xl text-left border border-outline-variant text-xs space-y-2">
                    <div className="flex items-center gap-1 font-bold text-primary">
                      <Sparkles className="w-4 h-4" />
                      <span>AI Review Saved with Guide</span>
                    </div>
                    <p className="text-on-surface-variant italic">
                      "Feasibility rating of {aiReviewResult.score}/100 based on standard workload parameters."
                    </p>
                  </div>
                )}

                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => {
                      // Reset state
                      setIdeaName("");
                      setHowToStart("");
                      setToolsUsed("");
                      setInitialCost("");
                      setTimeSpentWeekly("");
                      setFirstEarningAmount("");
                      setUploadedProof("");
                      setProofSelection("");
                      setAiReviewResult(null);
                      setCurrentStep(1);
                      setFormSubmitted(false);
                    }}
                    className="border border-outline-variant text-on-surface max-md:text-xs font-bold py-2.5 px-6 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    Submit Another
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab("explore");
                      setFormSubmitted(false);
                    }}
                    className="bg-primary text-on-primary max-md:text-xs font-bold py-2.5 px-6 rounded-full transition-shadow hover:shadow-lg hover:shadow-primary/20 cursor-pointer"
                  >
                    View in Explore Feed
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* 2. EXPLORE TAB (DIRECTORY OF SIDE HUSTLES) */}
        {activeTab === "explore" && (
          <div className="space-y-10">
            {/* Exploration Header */}
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
                Vetted Student <span className="text-primary">Side Hustles</span>
              </h1>
              <p className="text-on-surface-variant mt-1.5 text-sm md:text-base">
                Discover, compute, and deploy real money experiments shared by students worldwide.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* FILTER SIDEBAR & PLANNER WIDGET */}
              <div className="col-span-1 lg:col-span-4 space-y-6">
                
                {/* Text Filter search */}
                <div className="glass-panel p-5 rounded-xl space-y-4">
                  <h3 className="font-bold text-sm text-primary flex items-center gap-1.5 uppercase tracking-wide">
                    <Filter className="w-4 h-4" />
                    <span>Search Filters</span>
                  </h3>
                  
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Search key, e.g. Notion, coffee..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#081009] border border-outline-variant rounded-lg py-2.5 pl-10 pr-4 text-xs text-on-surface focus:border-primary outline-none transition-all"
                    />
                    <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-3" />
                  </div>

                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                      Category
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {["All", "Digital Services", "Physical Sales", "Gig Economy", "Passive Income"].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setFilterCategory(cat)}
                          className={`py-1.5 px-3 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                            filterCategory === cat 
                              ? "bg-primary text-on-primary" 
                              : "bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* INTERACTIVE BUDGET FINDER & TIME BUDGET CALCULATOR */}
                <div className="glass-panel p-5 rounded-xl space-y-5 bg-gradient-to-br from-[#19221a]/30 to-[#0d150e]/90">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-tertiary" />
                    <h3 className="font-bold text-sm text-primary">Student Budget Matchmaker</h3>
                  </div>

                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Set your funding targets and maximum weekly study hours, and we'll filter matches.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1.5">
                        <span className="text-on-surface-variant">MAX SETUP BUDGET</span>
                        <span className="text-primary font-mono">${budgetGoal}</span>
                      </div>
                      <input 
                        type="range"
                        min="0"
                        max="1000"
                        step="25"
                        value={budgetGoal}
                        onChange={(e) => setBudgetGoal(Number(e.target.value))}
                        className="w-full h-1.5 bg-[#081009] rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1.5">
                        <span className="text-on-surface-variant">WEEKLY HOURS AVAILABLE</span>
                        <span className="text-primary font-mono">{budgetHours} hrs/wk</span>
                      </div>
                      <input 
                        type="range"
                        min="2"
                        max="30"
                        step="1"
                        value={budgetHours}
                        onChange={(e) => setBudgetHours(Number(e.target.value))}
                        className="w-full h-1.5 bg-[#081009] rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                    </div>
                  </div>

                  {recommendedHustles.length > 0 ? (
                    <div className="space-y-3 pt-3 border-t border-outline-variant/30">
                      <span className="block text-xs font-bold text-tertiary uppercase tracking-wide">
                        Matching Solutions ({recommendedHustles.length}):
                      </span>
                      <div className="space-y-2">
                        {recommendedHustles.map((rec) => (
                          <div 
                            key={rec.id}
                            onClick={() => setSelectedHustle(rec)}
                            className="p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 hover:border-primary/40 cursor-pointer flex justify-between items-center transition-all"
                          >
                            <div>
                              <p className="font-bold text-xs truncate max-w-[150px]">{rec.title}</p>
                              <span className="text-[10px] text-on-surface-variant font-medium">{rec.category}</span>
                            </div>
                            <div className="text-right text-xs">
                              <span className="text-primary font-bold font-mono">${rec.firstEarningAmount}</span>
                              <span className="text-[10px] text-on-surface-variant block">est. initial pay</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-on-surface-variant italic pt-2">
                      Try adjusting sliders to match more university side hustles.
                    </p>
                  )}
                </div>

              </div>

              {/* SIDE HUSTLE SHOWN GRID */}
              <div className="col-span-1 lg:col-span-8">
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="glass-panel p-6 rounded-xl animate-pulse h-40" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    
                    {hustles
                      .filter((h) => {
                        const matchesSearch = h.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          h.howToStart.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          h.toolsUsed.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
                        const matchesCategory = filterCategory === "All" || h.category === filterCategory;
                        return matchesSearch && matchesCategory;
                      })
                      .map((hustle) => {
                        const catStyle = getCategoryTheme(hustle.category);
                        return (
                          <motion.div
                            key={hustle.id}
                            layoutId={hustle.id}
                            onClick={() => setSelectedHustle(hustle)}
                            className="glass-panel p-6 rounded-2xl cursor-pointer hover:border-primary flex flex-col md:flex-row justify-between gap-6 transition-all"
                          >
                            <div className="space-y-4 flex-1">
                              
                              <div className="flex flex-wrap items-center gap-3">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${catStyle.bg}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${catStyle.dot}`} />
                                  <span>{hustle.category}</span>
                                </span>

                                <span className="text-xs text-on-surface-variant flex items-center gap-1 font-medium">
                                  <MapPin className="w-3.5 h-3.5" />
                                  <span>{hustle.country}</span>
                                </span>

                                {hustle.verified && (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-tertiary bg-tertiary/10 border border-tertiary/20 py-0.5 px-2 rounded-full">
                                    <UserCheck className="w-3 h-3" />
                                    <span>Verified Proof</span>
                                  </span>
                                )}
                              </div>

                              <div className="space-y-1">
                                <h3 className="font-display text-xl font-bold hover:text-primary transition-colors">
                                  {hustle.title}
                                </h3>
                                <p className="text-sm text-on-surface-variant line-clamp-2">
                                  {hustle.howToStart}
                                </p>
                              </div>

                              {/* Student meta info */}
                              <div className="flex items-center gap-3 pt-2">
                                <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container bg-primary/20">
                                  <img src={hustle.authorAvatar} alt="avatar" />
                                </div>
                                <div>
                                  <span className="text-xs font-bold block">{hustle.authorName}</span>
                                  <span className="text-[10px] text-on-surface-variant">shared on {hustle.dateCreated}</span>
                                </div>
                              </div>

                            </div>

                            {/* Stat block */}
                            <div className="flex md:flex-col justify-between items-end gap-4 min-w-[120px] max-md:border-t max-md:border-outline-variant/30 max-md:pt-4">
                              <div className="text-right">
                                <span className="text-xs text-on-surface-variant uppercase font-bold tracking-wide">First Earning</span>
                                <div className="text-xl font-mono font-bold text-primary">${hustle.firstEarningAmount}</div>
                              </div>

                              <div className="text-right">
                                <span className="text-xs text-on-surface-variant uppercase font-semibold block">Weekly hours</span>
                                <div className="text-sm font-semibold">{hustle.timeSpentWeekly} hours/wk</div>
                              </div>

                              <div className="flex items-center gap-3 w-full md:justify-end">
                                <button
                                  onClick={(e) => handleUpvote(hustle.id, e)}
                                  className="flex items-center justify-center gap-1.5 bg-surface-container hover:bg-primary/20 border border-outline-variant hover:border-primary/40 text-on-surface py-1.5 px-3 rounded-xl transition-all font-bold text-xs cursor-pointer group"
                                >
                                  <ThumbsUp className="w-3.5 h-3.5 text-on-surface-variant group-hover:text-primary" />
                                  <span>{hustle.upvotes}</span>
                                </button>

                                <button
                                  onClick={(e) => toggleSaveHustle(hustle.id, e)}
                                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                                    userProfile.savedHustleIds.includes(hustle.id) 
                                      ? "bg-red-500/10 border-red-500/30 text-red-400" 
                                      : "bg-surface-container border-outline-variant text-on-surface-variant hover:text-on-surface"
                                  }`}
                                >
                                  <Heart className="w-3.5 h-3.5 fill-current" />
                                </button>
                              </div>
                            </div>

                          </motion.div>
                        );
                      })}

                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* 3. STORIES TAB (LIVE STUDENT LOGS) */}
        {activeTab === "stories" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left form to add simple logs */}
            <div className="col-span-1 lg:col-span-4 space-y-6">
              
              <div className="glass-panel p-5 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Plus className="w-5 h-5 text-[#00e676]" />
                  <h3 className="font-bold text-sm uppercase tracking-wide">Share Your Milestones</h3>
                </div>

                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Did you make a sale? Hit an active hours goal? Share your micro update with standard stats below.
                </p>

                <form onSubmit={handlePostStory} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                      Side Hustle Associated
                    </label>
                    <input 
                      type="text"
                      required
                      value={newStoryTitle}
                      onChange={(e) => setNewStoryTitle(e.target.value)}
                      className="w-full bg-[#081009] border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-lg p-2.5 text-xs text-on-surface outline-none"
                      placeholder="e.g. Canva Templates"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                      Message / Achievement update
                    </label>
                    <textarea 
                      required
                      rows={4}
                      value={newStoryContent}
                      onChange={(e) => setNewStoryContent(e.target.value)}
                      className="w-full bg-[#081009] border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-lg p-2.5 text-xs text-on-surface outline-none resize-none"
                      placeholder="e.g. Just reached $150 total client earnings during finals week..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#00e676] text-on-primary font-bold py-2 rounded-lg text-xs transition-shadow hover:shadow-[0_0_15px_rgba(0,230,118,0.3)] cursor-pointer"
                  >
                    Post Log Update
                  </button>
                </form>
              </div>

              {/* Interactive platform highlight stat box */}
              <div className="glass-panel p-5 rounded-2xl bg-gradient-to-tr from-[#19221a] to-background border-dashed border-outline/40">
                <span className="text-[10px] uppercase text-on-surface-variant font-bold tracking-wider">LAB TOTALS</span>
                
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <span className="text-xs text-on-surface-variant">Active Students</span>
                    <p className="text-lg font-bold text-primary font-mono mt-0.5">840+</p>
                  </div>
                  <div>
                    <span className="text-xs text-on-surface-variant">Earnings Shared</span>
                    <p className="text-lg font-bold text-tertiary font-mono mt-0.5">$18,450</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right List of feed cards */}
            <div className="col-span-1 lg:col-span-8 space-y-4">
              <div className="border-b border-outline-variant/30 pb-4 mb-4">
                <h2 className="font-display text-2xl font-bold tracking-tight">Active Student Stories</h2>
                <p className="text-on-surface-variant text-xs mt-1">
                  Live reports and stream updates from students executing money experiments.
                </p>
              </div>

              {stories.length === 0 ? (
                <div className="p-8 text-center text-on-surface-variant">
                  No active student stories found. Submit yours now!
                </div>
              ) : (
                stories.map((story) => (
                  <motion.div 
                    key={story.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-6 rounded-2xl space-y-4 hover:border-primary/50 transition-all"
                  >
                    
                    <div className="flex items-center justify-between">
                      {/* Author Info */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 overflow-hidden border border-primary/20">
                          <img src={story.authorAvatar} alt="Avatar" />
                        </div>
                        <div>
                          <span className="font-bold text-sm block leading-tight">{story.authorName}</span>
                          <span className="text-[10px] text-on-surface-variant">{story.timeAgo}</span>
                        </div>
                      </div>

                      {/* Milestone Chip */}
                      <div className="bg-tertiary/10 border border-tertiary/20 text-tertiary text-[10px] font-bold py-1 px-3 rounded-full">
                        {story.milestone}
                      </div>
                    </div>

                    <div className="space-y-1 bg-black/10 p-4 rounded-xl border border-outline-variant/20">
                      <span className="text-[10px] uppercase font-bold text-primary tracking-wide block">
                        hustle reference: {story.hustleTitle}
                      </span>
                      <p className="text-sm text-on-surface leading-relaxed whitespace-pre-wrap">
                        {story.content}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-semibold text-on-surface-variant pt-1">
                      <button 
                        onClick={() => handleLikeStory(story.id)}
                        className="flex items-center gap-1.5 hover:text-red-400 transition-colors cursor-pointer group"
                      >
                        <Heart className="w-4 h-4 text-on-surface-variant group-hover:text-red-400 group-hover:fill-current" />
                        <span>{story.likes} Hearts</span>
                      </button>

                      <div className="flex items-center gap-1.5 cursor-pointer hover:text-primary transition-colors">
                        <MessageSquare className="w-4 h-4" />
                        <span>{story.commentsCount} comments</span>
                      </div>
                    </div>

                  </motion.div>
                ))
              )}
            </div>

          </div>
        )}

        {/* 4. LEADERBOARD TAB (RANKINGS TABLE) */}
        {activeTab === "leaderboard" && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-tertiary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-6 h-6 text-tertiary" />
              </div>
              <h1 className="font-display text-3xl font-bold">EarnSmart Student Leaderboard</h1>
              <p className="text-on-surface-variant text-sm max-w-md mx-auto">
                Ranks of top student performers based on actual verified payouts shared with backing evidence blocks.
              </p>
            </div>

            <div className="glass-panel rounded-2xl overflow-hidden border border-outline-variant/40">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#151e16] text-on-surface-variant text-xs font-bold uppercase tracking-wider border-b border-outline-variant/40">
                      <th className="py-4 px-6 text-center w-16">Rank</th>
                      <th className="py-4 px-6">Student &amp; Venture</th>
                      <th className="py-4 px-6 hidden sm:table-cell">Category</th>
                      <th className="py-4 px-6 text-right">Verified Earnings</th>
                      <th className="py-4 px-6 text-center w-24">Badge</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20 text-sm">
                    {leaderboard.map((item, index) => (
                      <tr 
                        key={index} 
                        className={`hover:bg-[#151e16]/40 transition-colors ${
                          item.studentName === userProfile.name ? "bg-[#19221a]/50" : ""
                        }`}
                      >
                        <td className="py-4 px-6 text-center font-bold">
                          {item.rank === 1 && <span className="text-yellow-400 font-mono text-base">👑 1</span>}
                          {item.rank === 2 && <span className="text-gray-400 font-mono text-base">🥈 2</span>}
                          {item.rank === 3 && <span className="text-orange-400 font-mono text-base">🥉 3</span>}
                          {item.rank > 3 && <span className="text-on-surface-variant font-mono">{item.rank}</span>}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary/10 overflow-hidden">
                              <img src={item.avatar} alt="avatar" />
                            </div>
                            <div>
                              <span className="font-bold block text-on-surface">{item.studentName}</span>
                              <span className="text-xs text-on-surface-variant italic font-medium">{item.hustleName}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 hidden sm:table-cell">
                          <span className="text-xs bg-surface-container py-1 px-2.5 rounded-lg border border-outline-variant/20">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right font-bold text-primary font-mono text-base">
                          ${item.earnings.toLocaleString()}
                        </td>
                        <td className="py-4 px-6 text-center">
                          {item.verifiedExpert ? (
                            <span className="bg-tertiary/10 text-tertiary text-[10px] font-bold py-1 px-2.5 rounded-full border border-tertiary/20">
                              Expert
                            </span>
                          ) : (
                            <span className="bg-surface-container text-on-surface-variant text-[10px] font-bold py-1 px-2.5 rounded-full border border-outline-variant/20">
                              Amateur
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* 5. SIDE DETAIL MODAL DRAWER FOR SELECTED HUSTLE (EXPLORE) */}
      <AnimatePresence>
        {selectedHustle && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            
            {/* Modal Overlay backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedHustle(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            />

            {/* Slide-over Pane */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="relative w-full max-w-xl h-full bg-[#151e16] border-l border-outline-variant shadow-2xl overflow-y-auto p-6 md:p-8 space-y-8 z-10"
            >
              
              {/* Top toolbar */}
              <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-on-surface-variant bg-surface-container py-1 px-3 rounded-full border border-outline-variant/20">
                    ID: {selectedHustle.id.toUpperCase()}
                  </span>
                </div>
                <button 
                  onClick={() => setSelectedHustle(null)}
                  className="p-1.5 rounded-full bg-surface-container border border-outline-variant/30 text-on-surface-variant hover:text-on-surface cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Title & Core metadata */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  {selectedHustle.category}
                </span>
                <h2 className="font-display text-2xl md:text-3xl font-bold leading-tight">
                  {selectedHustle.title}
                </h2>
                
                <div className="flex flex-wrap gap-4 text-xs font-semibold text-on-surface-variant pt-1">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{selectedHustle.country}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>{selectedHustle.timeSpentWeekly} hrs/wk</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Coins className="w-4 h-4 text-primary" />
                    <span>Cost: ${selectedHustle.initialCost}</span>
                  </div>
                </div>
              </div>

              {/* Author Badge */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[#0d150e]/60 border border-outline-variant/20">
                <div className="w-10 h-10 rounded-full bg-primary/25 overflow-hidden">
                  <img src={selectedHustle.authorAvatar} alt="Author" />
                </div>
                <div>
                  <span className="block font-bold text-sm text-on-surface">{selectedHustle.authorName}</span>
                  <span className="text-[10px] text-on-surface-variant italic">Venture Author &amp; Student</span>
                </div>
                <div className="flex-grow"></div>
                {selectedHustle.verified && (
                  <span className="text-[10px] font-bold text-tertiary bg-tertiary/10 py-1 px-3 border border-tertiary/30 rounded-full">
                    Expert
                  </span>
                )}
              </div>

              {/* Financial Stats Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-surface-container rounded-xl border border-outline-variant">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">FIRST EARNED AMOUNT</span>
                  <p className="text-2xl font-mono font-bold text-[#00e676] mt-1">${selectedHustle.firstEarningAmount}</p>
                </div>
                <div className="p-4 bg-surface-container rounded-xl border border-outline-variant">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">UPVOTE INDEX</span>
                  <p className="text-2xl font-mono font-bold text-primary mt-1">{selectedHustle.upvotes} Votes</p>
                </div>
              </div>

              {/* Step Blueprint how to start */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-primary uppercase tracking-wide">The Venture Blueprint</h3>
                <div className="bg-background/80 p-5 rounded-xl border border-outline-variant/40 text-[13px] text-on-surface leading-loose whitespace-pre-line font-medium">
                  {selectedHustle.howToStart}
                </div>
              </div>

              {/* Required Assets / Tools used */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-on-surface-variant uppercase tracking-wide">Pre-required Tools used:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedHustle.toolsUsed.length === 0 ? (
                    <span className="text-xs text-on-surface-variant font-medium">None required</span>
                  ) : (
                    selectedHustle.toolsUsed.map((tool) => (
                      <span 
                        key={tool} 
                        className="bg-surface-container text-xs font-bold text-on-surface-variant border border-outline-variant/30 py-1 px-3 rounded-lg flex items-center gap-1"
                      >
                        <Wrench className="w-3 h-3 text-[#00e676]" />
                        <span>{tool}</span>
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* AI Expert Consultant Analysis Review */}
              <div className="bg-gradient-to-tr from-[#19221a] to-background border border-primary/30 rounded-xl p-5 space-y-4 shadow-lg shadow-primary/5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-tertiary" />
                  <h4 className="font-bold text-sm text-primary">EarnSmart AI Advisor</h4>
                </div>

                {selectedHustle.aiFeasibilityScore ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-on-surface-variant uppercase tracking-wide">University feasibility score:</span>
                      <span className="text-xs font-bold text-primary font-mono">{selectedHustle.aiFeasibilityScore}/100</span>
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed font-semibold italic bg-black/10 p-3 rounded-lg">
                      "{selectedHustle.aiConsultantReview}"
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-on-surface-variant">
                      Generate a dynamic Gemini audit to obtain risk scoring, competitive analysis, and campus growth-hacks.
                    </p>

                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          const response = await fetch("/api/ai/analyze", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(selectedHustle)
                          });
                          if (response.ok) {
                            const resData = await response.json();
                            const updatedHustle = {
                              ...selectedHustle,
                              aiFeasibilityScore: resData.score,
                              aiConsultantReview: resData.review
                            };
                            setSelectedHustle(updatedHustle);
                            setHustles(prev => prev.map(h => h.id === selectedHustle.id ? updatedHustle : h));
                          }
                        } catch (e) {
                          console.error(e);
                        }
                      }}
                      className="bg-primary hover:bg-primary-container text-on-primary font-bold text-xs py-2 px-4 rounded-lg transition-all"
                    >
                      Audit Idea with Gemini Flash
                    </button>
                  </div>
                )}
              </div>

              {/* Proof Image display */}
              {selectedHustle.imageProof && (
                <div className="space-y-3">
                  <h3 className="font-bold text-sm text-on-surface-variant uppercase tracking-wide">Verified Proof</h3>
                  <div className="rounded-xl overflow-hidden border border-outline-variant">
                    <img 
                      src={selectedHustle.imageProof} 
                      alt="Verified Invoice Proof Proof" 
                      className="w-full h-auto object-cover max-h-56"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              )}

              {/* Call to action */}
              <div className="flex gap-4 border-t border-outline-variant/30 pt-6">
                <button
                  onClick={(e) => handleUpvote(selectedHustle.id, e)}
                  className="flex-1 bg-primary text-on-primary font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-primary/20 active:scale-95 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>Upvote Guide ({selectedHustle.upvotes})</span>
                </button>
                <button
                  onClick={(e) => toggleSaveHustle(selectedHustle.id, e)}
                  className={`py-3 px-4 rounded-xl border transition-colors cursor-pointer ${
                    userProfile.savedHustleIds.includes(selectedHustle.id) 
                      ? "bg-red-500/10 border-red-500/30 text-red-400" 
                      : "bg-[#19221a] border-outline-variant text-on-surface-variant"
                  }`}
                >
                  <Heart className="w-5 h-5 fill-current" />
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. PROFILE & HOW IT WORKS SIDEBAR PANEL (DRAWER) */}
      <AnimatePresence>
        {profileOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            
            {/* Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setProfileOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            />

            {/* Sidebar content */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="relative w-full max-w-md h-full bg-[#151e16] border-l border-outline-variant shadow-2xl overflow-y-auto p-6 md:p-8 space-y-6 z-10"
            >
              <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
                <h3 className="font-display text-xl font-bold text-primary flex items-center gap-1.5">
                  <User className="w-5 h-5 text-primary" />
                  <span>Student Dashboard</span>
                </h3>
                <button 
                  onClick={() => setProfileOpen(false)}
                  className="p-1.5 rounded-full bg-surface-container border border-outline-variant/30 text-on-surface-variant hover:text-on-surface cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Avatar detail */}
              <div className="flex items-center gap-4 bg-background/50 p-4 rounded-xl border border-outline-variant/30">
                <div className="w-14 h-14 rounded-full bg-primary/20 overflow-hidden border-2 border-primary/40">
                  <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Sanjana" alt="profile" />
                </div>
                <div>
                  <h4 className="font-bold text-base">{userProfile.name}</h4>
                  <div className="text-[11px] text-on-surface-variant flex items-center gap-1.5 font-semibold mt-1">
                    <span className="bg-primary/25 border border-primary/20 text-primary py-0.5 px-2 rounded-full font-bold">
                      {userProfile.badge}
                    </span>
                    <span className="text-tertiary"># Rank {userProfile.rank}</span>
                  </div>
                </div>
              </div>

              {/* Educational info on how the system leverages student credentials */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block">How EarnSmart Lab Works</span>
                <div className="text-xs text-on-surface-variant leading-relaxed space-y-2 bg-black/20 p-4 rounded-xl border border-outline-variant/30">
                  <p>
                    1. <strong className="text-primary font-bold">Design / Document</strong> your blueprint including detailed costs, tools, and hourly metrics.
                  </p>
                  <p>
                    2. <strong className="text-primary font-bold font-bold">Submit a Proof</strong> invoice or dashboard photo to request verification bounds.
                  </p>
                  <p>
                    3. <strong className="text-primary font-bold">Run Gemini AI</strong> content scans to evaluate study balance compatibility score index constraints.
                  </p>
                </div>
              </div>

              {/* Target budget progress bar */}
              <div className="p-4 bg-surface-container rounded-xl border border-outline-variant/30 space-y-3">
                <div className="flex justify-between items-center text-xs font-bold uppercase">
                  <span>Funding Goal: {userProfile.college}</span>
                  <span className="text-primary font-mono">${userProfile.targetSavings}</span>
                </div>
                <div className="h-2 w-full bg-[#081009] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-tertiary" style={{ width: "65%" }}></div>
                </div>
                <p className="text-[10px] text-on-surface-variant">
                  You are making great progress towards your textbook budget! Check saved side hustles.
                </p>
              </div>

              {/* Selected state Saved Hustles list */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block">
                  Bookmarked Ventures ({userProfile.savedHustleIds.length})
                </span>
                
                <div className="space-y-2">
                  {userProfile.savedHustleIds.length === 0 ? (
                    <p className="text-xs text-on-surface-variant italic">No bookmarked side hustles yet.</p>
                  ) : (
                    hustles
                      .filter(h => userProfile.savedHustleIds.includes(h.id))
                      .map(saved => (
                        <div 
                          key={saved.id}
                          onClick={() => { setSelectedHustle(saved); setProfileOpen(false); }}
                          className="flex items-center justify-between p-3 rounded-lg bg-background hover:bg-surface-container border border-outline-variant/30 hover:border-primary/40 cursor-pointer transition-all"
                        >
                          <div>
                            <span className="font-bold text-xs text-on-surface truncate block max-w-[170px]">
                              {saved.title}
                            </span>
                            <span className="text-[9px] text-on-surface-variant font-medium">by {saved.authorName}</span>
                          </div>
                          
                          <div className="text-right text-xs">
                            <span className="text-primary font-bold font-mono">${saved.firstEarningAmount}</span>
                            <span className="text-[9px] text-on-surface-variant block uppercase tracking-wider">Estimated pay</span>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>

              {/* Developer details metadata */}
              <div className="pt-4 border-t border-outline-variant/30 text-center text-[10px] text-on-surface-variant space-y-1 font-semibold text-center">
                <p>Authentic workspace profile linked securely</p>
                <p className="text-primary font-mono">{userProfile.email}</p>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Decorative Brand Footer */}
      <footer className="bg-surface-container border-t border-outline-variant w-full py-12 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8 px-4 md:px-12">
          
          <div className="space-y-4">
            <div className="font-display text-2xl text-on-surface font-bold flex items-center gap-1.5">
              <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                <Coins className="w-4 h-4 text-on-primary" />
              </div>
              <span className="font-display">EarnSmart</span>
            </div>
            <p className="text-on-surface-variant max-w-xs text-xs">
              The decentralized laboratory for student financial experiments.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <h4 className="font-bold text-primary text-xs uppercase tracking-wider mb-2">Resource</h4>
              <a onClick={() => { setActiveTab("stories"); setFormSubmitted(false); }} className="block text-on-surface-variant hover:text-primary transition-colors text-xs cursor-pointer">Community</a>
              <a onClick={() => { setProfileOpen(true); }} className="block text-on-surface-variant hover:text-primary transition-colors text-xs cursor-pointer">Guidelines</a>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-primary text-xs uppercase tracking-wider mb-2">Legal</h4>
              <a className="block text-on-surface-variant hover:text-primary transition-colors text-xs cursor-pointer">Terms</a>
              <a className="block text-on-surface-variant hover:text-primary transition-colors text-xs cursor-pointer">Privacy</a>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-primary text-xs uppercase tracking-wider mb-2">Stay Updated</h4>
              <a className="block text-on-surface-variant hover:text-primary transition-colors text-xs cursor-pointer">Newsletter Subscribe</a>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-12 mt-10 pt-6 border-t border-outline-variant/30 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-on-surface-variant">
          <p>© 2026 Student Money Lab. All rights reserved.</p>
          <div className="flex gap-4 font-mono text-[10px]">
            <span>UTC TIME: 2026-06-12</span>
            <span>SYSTEM LIVE</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
