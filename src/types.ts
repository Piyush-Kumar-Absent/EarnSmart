/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SideHustle {
  id: string;
  title: string;
  category: "Digital Services" | "Physical Sales" | "Gig Economy" | "Passive Income" | string;
  country: string;
  experienceType: "Personal Journey" | "Detailed Research";
  howToStart: string;
  toolsUsed: string[];
  initialCost: number;
  timeSpentWeekly: number; // hours/week
  firstEarningAmount: number;
  upvotes: number;
  verified: boolean;
  authorName: string;
  authorAvatar: string;
  dateCreated: string;
  imageProof?: string;
  views: number;
  aiFeasibilityScore?: number;
  aiConsultantReview?: string;
}

export interface StudentStory {
  id: string;
  authorName: string;
  authorAvatar: string;
  hustleTitle: string;
  milestone: string;
  content: string;
  likes: number;
  timeAgo: string;
  commentsCount: number;
}

export interface LeaderboardEntry {
  rank: number;
  studentName: string;
  hustleName: string;
  category: string;
  earnings: number;
  verifiedExpert: boolean;
  avatar: string;
}
