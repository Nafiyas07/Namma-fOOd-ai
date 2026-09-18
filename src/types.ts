export type Language = 'en' | 'ta';

export interface User {
  id: string;
  name: string;
  email: string;
  preferredLanguage: Language;
  createdAt: string;
}

export interface FoodLensAnalysis {
  id: string;
  userId: string;
  imageReference: string;
  foodName: string;
  foodCategory: string;
  location?: string;
  foodType?: string;
  userNote?: string;
  overallScore: number;
  hygieneScore: number;
  visualQualityScore: number;
  servingConditionScore: number;
  observations: string[];
  potentialConcerns: string[];
  positiveIndicators: string[];
  practicalTips: string[];
  confidence: string;
  limitations: string[];
  createdAt: string;
}

export interface AnalysisInput {
  imageBase64: string;
  foodName?: string;
  location?: string;
  foodType?: string;
  userNote?: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  role: 'user' | 'assistant';
  message: string;
  language?: Language;
  createdAt: string;
  sources?: string[];
}

export interface FoodSample {
  id: string;
  name: string;
  category: string;
  location: string;
  foodType: string;
  note: string;
  imageUrl: string;
}
