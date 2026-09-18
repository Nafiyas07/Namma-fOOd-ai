import { FoodLensAnalysis, User, AnalysisInput, ChatMessage } from '../types.js';

const TOKEN_KEY = 'foodlens_auth_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data as T;
}

export const api = {
  // Auth
  async register(name: string, email: string, password: string, confirmPassword?: string) {
    const res = await request<{ user: User; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, confirmPassword }),
    });
    setStoredToken(res.token);
    return res;
  },

  async login(email: string, password: string) {
    const res = await request<{ user: User; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setStoredToken(res.token);
    return res;
  },

  async getMe() {
    return request<{ user: User }>('/api/auth/me');
  },

  async logout() {
    setStoredToken(null);
    try {
      await request('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      // ignore
    }
  },

  // Profile
  async getProfile() {
    return request<User & { analysisCount: number }>('/api/profile');
  },

  async updateProfile(updates: { name?: string; preferredLanguage?: 'en' | 'ta' }) {
    return request<User>('/api/profile', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  // Analyses
  async analyzeFood(input: AnalysisInput, save: boolean = true) {
    const res = await request<{ analysis: any; saved: boolean }>('/api/analyses', {
      method: 'POST',
      body: JSON.stringify({
        imageBase64: input.imageBase64,
        foodName: input.foodName,
        location: input.location,
        foodType: input.foodType,
        userNote: input.userNote,
        save,
      }),
    });
    
    // Normalize properties for client TypeScript
    const a = res.analysis;
    const normalized: FoodLensAnalysis = {
      id: a.id,
      userId: a.user_id || a.userId,
      imageReference: a.image_reference || a.imageReference,
      foodName: a.food_name || a.foodName,
      foodCategory: a.food_category || a.foodCategory,
      location: a.location,
      foodType: a.food_type || a.foodType,
      userNote: a.user_note || a.userNote,
      overallScore: a.overall_score !== undefined ? a.overall_score : a.overallScore,
      hygieneScore: a.hygiene_score !== undefined ? a.hygiene_score : a.hygieneScore,
      visualQualityScore: a.visual_quality_score !== undefined ? a.visual_quality_score : a.visualQualityScore,
      servingConditionScore: a.serving_condition_score !== undefined ? a.serving_condition_score : a.servingConditionScore,
      observations: a.observations || [],
      potentialConcerns: a.concerns || a.potentialConcerns || [],
      positiveIndicators: a.positive_indicators || a.positiveIndicators || [],
      practicalTips: a.recommendations || a.practicalTips || [],
      confidence: a.confidence || 'Moderate confidence',
      limitations: a.limitations || [],
      createdAt: a.created_at || a.createdAt || new Date().toISOString(),
    };

    return { analysis: normalized, saved: res.saved };
  },

  async getAnalyses() {
    const res = await request<{ analyses: any[] }>('/api/analyses');
    const list: FoodLensAnalysis[] = res.analyses.map((a) => ({
      id: a.id,
      userId: a.user_id,
      imageReference: a.image_reference,
      foodName: a.food_name,
      foodCategory: a.food_category,
      location: a.location,
      foodType: a.food_type,
      userNote: a.user_note,
      overallScore: a.overall_score,
      hygieneScore: a.hygiene_score,
      visualQualityScore: a.visual_quality_score,
      servingConditionScore: a.serving_condition_score,
      observations: a.observations || [],
      potentialConcerns: a.concerns || [],
      positiveIndicators: a.positive_indicators || [],
      practicalTips: a.recommendations || [],
      confidence: a.confidence || 'Moderate',
      limitations: a.limitations || [],
      createdAt: a.created_at,
    }));
    return list;
  },

  async deleteAnalysis(id: string) {
    return request<{ success: boolean; message: string }>(`/api/analyses/${id}`, {
      method: 'DELETE',
    });
  },

  // Chat Assistant
  async sendChatMessage(message: string, language: 'en' | 'ta' = 'en', history: any[] = []) {
    return request<{ reply: string; sources: string[]; language: string }>('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message, language, history }),
    });
  },
};
