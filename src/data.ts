/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SideHustle, StudentStory, LeaderboardEntry } from "./types";

export const PRESEEDED_HUSTLES: SideHustle[] = [
  {
    id: "hustle-1",
    title: "Campus Coffee Delivery",
    category: "Gig Economy",
    country: "United Kingdom",
    experienceType: "Personal Journey",
    howToStart: "1. Map out the daily lecture hall schedules and identify critical 15-minute breaks.\n2. Build a simple pre-ordering Google Form linked to a WhatsApp Group where students order hot beverages.\n3. Buy a high-quality insulated backpack ($35) for carrying liquid cups safely.\n4. Deliver orders directly to seats right before classes start. Establish a reputation for being punctual!",
    toolsUsed: ["WhatsApp", "Google Forms", "Stripe", "Notion"],
    initialCost: 45,
    timeSpentWeekly: 12,
    firstEarningAmount: 180,
    upvotes: 342,
    verified: true,
    authorName: "Liam Mitchell",
    authorAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Liam",
    dateCreated: "2026-05-18",
    views: 1240,
    imageProof: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=400",
    aiFeasibilityScore: 88,
    aiConsultantReview: "Excellent physical gig hustle with low barrier to entry. Scalability is limited by peak delivery windows (breaks), but has exceptional unit economics due to proximity. Risk is low, but requires diligent temperature management."
  },
  {
    id: "hustle-2",
    title: "Aesthetic Course-Specific Notion Templates",
    category: "Passive Income",
    country: "United States",
    experienceType: "Personal Journey",
    howToStart: "1. Create high-fidelity Notion workspaces personalized for complex majors (e.g., Medicine, Computer Science).\n2. Record 60-second walkthrough tutorials for TikTok showing how the systems structure flashcards and deadline calculators.\n3. Distribute template downloads through Gumroad.\n4. Continually update templates based on students' active recall and spaced repetition feedback.",
    toolsUsed: ["Notion", "Gumroad", "Canva", "TikTok"],
    initialCost: 0,
    timeSpentWeekly: 4,
    firstEarningAmount: 450,
    upvotes: 495,
    verified: true,
    authorName: "Maya Rodriguez",
    authorAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Maya",
    dateCreated: "2026-06-01",
    views: 2480,
    imageProof: "https://images.unsplash.com/photo-1616469829941-c7200edec809?auto=format&fit=crop&q=80&w=400",
    aiFeasibilityScore: 92,
    aiConsultantReview: "Outstanding zero-overhead passive venture. Demonstrates great use of product ledger assets that scale globally. Main leverage point is localized niche targeting (e.g., major-specific schemas). Promotion efficiency on TikTok is vital."
  },
  {
    id: "hustle-3",
    title: "Dorm Room Duplex Printing Station",
    category: "Physical Sales",
    country: "Canada",
    experienceType: "Personal Journey",
    howToStart: "1. Purchase a fast duplex laser printing engine and bulk paper boxes.\n2. Set up a Telegram automated bot/inbox where students submit their lecture slides and homework files.\n3. Charge flat rates that are exactly 50% cheaper than the library's official queue lines.\n4. Deliver output packets to dorm mailboxes or directly outside student building doors during exam weeks.",
    toolsUsed: ["Telegram", "Brother Laser Printer", "Canva"],
    initialCost: 110,
    timeSpentWeekly: 8,
    firstEarningAmount: 230,
    upvotes: 184,
    verified: false,
    authorName: "Joe Brady",
    authorAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Joe",
    dateCreated: "2026-05-24",
    views: 890,
    imageProof: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=400",
    aiFeasibilityScore: 78,
    aiConsultantReview: "Strong seasonal demand, especially during finals or course sign-ups. Initial hardware cost is repaid quickly. Margins depend heavily on toner yields. Requires checking university dormitory utility/business policies."
  },
  {
    id: "hustle-4",
    title: "Vintage Depop Sportswear Reselling",
    category: "Physical Sales",
    country: "United Kingdom",
    experienceType: "Detailed Research",
    howToStart: "1. Visit thrift shops, charity events, and open-air flea markets outside the main university zones.\n2. Specialize in high-demand items (e.g., 90s vintage sweatshirts, brand windbreakers, retro track jackets).\n3. Take crisp, well-lit modeling photos against aesthetic brick backgrounds using natural afternoon sunlight.\n4. List items on Depop and Vinted, prioritizing accurate measurements and fast shipping.",
    toolsUsed: ["Depop", "Vinted", "Lightroom", "Instagram"],
    initialCost: 75,
    timeSpentWeekly: 10,
    firstEarningAmount: 290,
    upvotes: 215,
    verified: true,
    authorName: "Chloe Higgins",
    authorAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Chloe",
    dateCreated: "2026-06-05",
    views: 1032,
    imageProof: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=400",
    aiFeasibilityScore: 84,
    aiConsultantReview: "Very reliable vintage arbitrage model. Highly dependent on personal style taste and thrift locations. Scalability is linear to listing frequency. Excellent platform engagement on Depop ensures built-in traffic."
  },
  {
    id: "hustle-5",
    title: "Academic Lab Exam Study Audio Guides",
    category: "Digital Services",
    country: "Australia",
    experienceType: "Detailed Research",
    howToStart: "1. Summarize crucial scientific methodologies, lab safety codes, and biochemical formulas into punchy study audio files.\n2. record high-quality voiceover guides with mnemonic sound tricks and upload to a secure audio platform.\n3. License the bundles for $5/exam module.\n4. Partner with class study group chats to distribute the sample files.",
    toolsUsed: ["Audacity", "Gumroad", "Loom", "Notion"],
    initialCost: 20,
    timeSpentWeekly: 5,
    firstEarningAmount: 140,
    upvotes: 110,
    verified: false,
    authorName: "Sarah Chen",
    authorAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah",
    dateCreated: "2026-06-10",
    views: 450,
    aiFeasibilityScore: 80,
    aiConsultantReview: "Innovative hyper-targeted study aid. Great format for auditory learners seeking commute-time prep. Low cost of reproduction. Requires maintaining strict compliance with university academic integrity rules."
  }
];

export const PRESEEDED_STORIES: StudentStory[] = [
  {
    id: "story-1",
    authorName: "Liam Mitchell",
    authorAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Liam",
    hustleTitle: "Campus Coffee Delivery",
    milestone: "$1,500 Total Delivered",
    content: "Passed a huge milestone today! I started this during exam week just hoping to make pocket money for groceries. Now I deliver to three main departments (Law, Engineering, and Business). The secret is being ultra-reliable—if class is at 9:00 AM, my orders land on their desks at 8:54 AM sharp. If you have a bike and a thermal pack, do this right now!",
    likes: 85,
    timeAgo: "2 days ago",
    commentsCount: 14
  },
  {
    id: "story-2",
    authorName: "Maya Rodriguez",
    authorAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Maya",
    hustleTitle: "Aesthetic Course-Specific Notion Templates",
    milestone: "Went Viral on TikTok (150k views!)",
    content: "Literally woke up to 89 sales notifications on Gumroad. I posted a 45-second video explaining how my spaced-repetition Notion dashboard automatically prompts medical students to study anatomical slides before they forget. If you've spent months building a solid workflow for your own college classes, clean it up, package it, and put it on Gumroad. Capitalize on what you already build for yourself!",
    likes: 124,
    timeAgo: "5 hours ago",
    commentsCount: 22
  },
  {
    id: "story-3",
    authorName: "Alex Wong",
    authorAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Alex",
    hustleTitle: "Depop Sportswear Reselling",
    milestone: "Secured 'Verified Expert' Badge",
    content: "I just got verified on EarnSmart! Uploaded proof of my last 3 resale payouts on Depop indicating over $600 earned in profit. For anyone starting thrift sourcing: avoid tourist-heavy shops. Drive or bus and search charity shops in quieter commuter towns. That's where you find retro Puma, Adidas, and Ralph Lauren sweaters for pennies.",
    likes: 62,
    timeAgo: "1 week ago",
    commentsCount: 9
  }
];

export const PRESEEDED_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    studentName: "Maya Rodriguez",
    hustleName: "Notion Architecture Blueprints",
    category: "Passive Income",
    earnings: 3420,
    verifiedExpert: true,
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Maya"
  },
  {
    rank: 2,
    studentName: "Liam Mitchell",
    hustleName: "Campus Coffee Delivery",
    category: "Gig Economy",
    earnings: 1850,
    verifiedExpert: true,
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Liam"
  },
  {
    rank: 3,
    studentName: "Chloe Higgins",
    hustleName: "Vintage Depop Sportswear Reselling",
    category: "Physical Sales",
    earnings: 1280,
    verifiedExpert: true,
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Chloe"
  },
  {
    rank: 4,
    studentName: "Joe Brady",
    hustleName: "Dorm Printing Command Center",
    category: "Physical Sales",
    earnings: 890,
    verifiedExpert: false,
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Joe"
  },
  {
    rank: 5,
    studentName: "Sarah Chen",
    hustleName: "Academic Study Audio Guides",
    category: "Digital Services",
    earnings: 650,
    verifiedExpert: false,
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah"
  }
];
