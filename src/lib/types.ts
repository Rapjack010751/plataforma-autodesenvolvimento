// Tipos do sistema de desenvolvimento pessoal

export type DevelopmentArea = 
  | 'professional' 
  | 'financial' 
  | 'physical' 
  | 'spiritual' 
  | 'relationships' 
  | 'learning';

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  area: DevelopmentArea;
  targetDate?: string;
  completed: boolean;
  progress: number;
  createdAt: string;
}

export interface Dream {
  id: string;
  userId: string;
  title: string;
  description: string;
  estimatedCost?: number;
  targetDate?: string;
  achieved: boolean;
  steps: DreamStep[];
  createdAt: string;
}

export interface DreamStep {
  id: string;
  title: string;
  completed: boolean;
}

export interface Activity {
  id: string;
  userId: string;
  title: string;
  description: string;
  area: DevelopmentArea;
  frequency: 'daily' | 'weekly' | 'monthly';
  completed: boolean;
  lastCompleted?: string;
}

export interface LearningGoal {
  id: string;
  userId: string;
  skill: string;
  description: string;
  resources: LearningResource[];
  progress: number;
  createdAt: string;
}

export interface LearningResource {
  id: string;
  title: string;
  type: 'video' | 'article' | 'course' | 'book' | 'practice';
  url?: string;
  completed: boolean;
}

export interface FinancialEntry {
  id: string;
  userId: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
  recurring: boolean;
}

export interface Suggestion {
  id: string;
  type: 'activity' | 'learning' | 'financial' | 'dream';
  title: string;
  description: string;
  area?: DevelopmentArea;
  priority: 'low' | 'medium' | 'high';
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  preferences: {
    notifications: boolean;
    focusAreas: DevelopmentArea[];
  };
}
