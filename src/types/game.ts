export type GameCategory = 
  | 'puzzle' 
  | 'action' 
  | 'racing' 
  | 'arcade' 
  | 'adventure' 
  | 'brain-training';

export interface Game {
  id: string;
  title: string;
  slug: string;
  category: GameCategory;
  description: string;
  thumbnail: string;
  embedUrl: string;
  rating: number; // 1-5 scale (e.g. 4.8)
  ratingCount: number;
  plays: number;
  isFeatured: boolean;
  isPopular: boolean;
  isNew: boolean;
  createdAt: string;
  instructions: string;
  controls: {
    key: string;
    action: string;
  }[];
  tags: string[];
  developer?: string;
  builtinEngineId?: string; // id for built-in canvas game engine if available
}

export interface CategoryInfo {
  id: GameCategory;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  color: string;
  gradient: string;
}

export interface LeaderboardEntry {
  id: string;
  gameId: string;
  gameTitle: string;
  playerName: string;
  score: number;
  date: string;
  rank?: number;
  avatarColor: string;
}

export interface WaitlistEntry {
  id: string;
  email: string;
  plan: 'monthly' | 'yearly';
  createdAt: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
}
