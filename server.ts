import express, { Request, Response } from 'express';
import path from 'path';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db.js';
import { generateToken, requireAuth, optionalAuth, AuthenticatedRequest } from './server/auth.js';
import { analyzeFoodImage, answerAssistantQuery } from './server/geminiService.js';

dotenv.config();

const app = express();
const PORT = 3000;

// Body parser with 25MB limit for food photography uploads
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'FoodLens AI Platform',
    timestamp: new Date().toISOString(),
    aiEngine: process.env.GEMINI_API_KEY ? 'Gemini 3.8 Flash Active' : 'Heuristic Engine (Dev Mode)',
  });
});

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

// POST /api/auth/register
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    const existingUser = db.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email address already exists.' });
    }

    const password_hash = bcrypt.hashSync(password, 10);
    const newUser = db.createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password_hash,
      preferred_language: 'en',
    });

    const token = generateToken(newUser);
    return res.status(201).json({
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        preferredLanguage: newUser.preferred_language,
        createdAt: newUser.created_at,
      },
      token,
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Failed to create user account. Please try again.' });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isValid = bcrypt.compareSync(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken(user);
    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        preferredLanguage: user.preferred_language,
        createdAt: user.created_at,
      },
      token,
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal login error. Please try again.' });
  }
});

// GET /api/auth/me
app.get('/api/auth/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      preferredLanguage: user.preferred_language,
      createdAt: user.created_at,
    },
  });
});

// POST /api/auth/logout
app.post('/api/auth/logout', (req: Request, res: Response) => {
  res.json({ success: true, message: 'Logged out successfully.' });
});

// ==========================================
// PROFILE ROUTES
// ==========================================

// GET /api/profile
app.get('/api/profile', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const analyses = db.getAnalysesByUserId(user.id);
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    preferredLanguage: user.preferred_language,
    analysisCount: analyses.length,
    createdAt: user.created_at,
  });
});

// PATCH /api/profile
app.patch('/api/profile', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const { name, preferredLanguage } = req.body;

  const updates: Partial<{ name: string; preferred_language: 'en' | 'ta' }> = {};
  if (name && typeof name === 'string') updates.name = name.trim();
  if (preferredLanguage && (preferredLanguage === 'en' || preferredLanguage === 'ta')) {
    updates.preferred_language = preferredLanguage;
  }

  const updatedUser = db.updateUser(user.id, updates);
  if (!updatedUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.json({
    id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    preferredLanguage: updatedUser.preferred_language,
    createdAt: updatedUser.created_at,
  });
});

// ==========================================
// ANALYSES ROUTES
// ==========================================

// POST /api/analyses - Analyze food image and optionally save to user account
app.post('/api/analyses', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { imageBase64, foodName, location, foodType, userNote, save = true } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Image data is required for food visual analysis.' });
    }

    // Run AI Visual Assessment
    const result = await analyzeFoodImage(imageBase64, {
      foodName,
      location,
      foodType,
      userNote,
    });

    const userId = req.user ? req.user.id : 'user_demo_01';

    let savedAnalysis = null;
    if (save) {
      // Store image reference (for local files, store base64 or thumbnail)
      const imageReference = imageBase64.length > 500000 
        ? imageBase64.substring(0, 200000) // Trim thumbnail if huge
        : imageBase64;

      savedAnalysis = db.createAnalysis({
        user_id: userId,
        image_reference: imageReference,
        food_name: result.foodName || foodName || 'Assessed Food Item',
        food_category: result.foodCategory || foodType || 'General Food',
        location: location || '',
        food_type: foodType || '',
        user_note: userNote || '',
        overall_score: result.overallScore,
        hygiene_score: result.hygieneScore,
        visual_quality_score: result.visualQualityScore,
        serving_condition_score: result.servingConditionScore,
        observations: result.observations,
        concerns: result.potentialConcerns,
        positive_indicators: result.positiveIndicators,
        recommendations: result.practicalTips,
        confidence: result.confidence,
        limitations: result.limitations,
      });
    }

    return res.json({
      analysis: savedAnalysis || {
        ...result,
        id: `temp_${Date.now()}`,
        userId,
        imageReference: imageBase64,
        createdAt: new Date().toISOString(),
      },
      saved: !!savedAnalysis,
    });
  } catch (err) {
    console.error('Error executing food visual analysis:', err);
    return res.status(500).json({ error: 'Failed to complete visual food assessment. Please try again.' });
  }
});

// GET /api/analyses - List user's past analyses
app.get('/api/analyses', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const userAnalyses = db.getAnalysesByUserId(user.id);
  res.json({ analyses: userAnalyses });
});

// GET /api/analyses/:id - Get specific analysis
app.get('/api/analyses/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const analysis = db.getAnalysisById(id);

  if (!analysis) {
    return res.status(404).json({ error: 'Analysis record not found.' });
  }

  if (analysis.user_id !== req.user!.id) {
    return res.status(403).json({ error: 'Access denied to this analysis record.' });
  }

  res.json({ analysis });
});

// DELETE /api/analyses/:id - Delete analysis
app.delete('/api/analyses/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const success = db.deleteAnalysis(id, req.user!.id);

  if (!success) {
    return res.status(404).json({ error: 'Analysis record not found or unauthorized.' });
  }

  res.json({ success: true, message: 'Analysis deleted successfully.' });
});

// ==========================================
// CHAT / ASSISTANT ROUTES (RAG + Multilingual)
// ==========================================

// POST /api/chat - Conversational Assistant with RAG knowledge grounding
app.post('/api/chat', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { message, language = 'en', history = [] } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    const userId = req.user ? req.user.id : 'user_demo_01';

    // Store user message in DB
    db.addChatMessage(userId, 'user', message.trim());

    // Query RAG-augmented Assistant
    const result = await answerAssistantQuery(
      message.trim(),
      history,
      language === 'ta' ? 'ta' : 'en'
    );

    // Store assistant response in DB
    db.addChatMessage(userId, 'assistant', result.answer);

    return res.json({
      reply: result.answer,
      sources: result.sources,
      language,
    });
  } catch (err) {
    console.error('Chat error:', err);
    return res.json({
      reply:
        (req.body && req.body.language === 'ta')
          ? 'வணக்கம்! உணவு தரம் மற்றும் சுகாதாரம் குறித்து: உணவு வாங்கும் போது பாத்திரங்கள் சுத்தமாக மூடப்பட்டிருப்பதையும், சூடாக பரிமாறப்படுவதையும், சமைக்கும் இடம் சுத்தமாக பராமரிக்கப்படுவதையும் உறுதி செய்து கொள்ளுங்கள்.\n\nபொறுப்பான AI குறிப்பு: இது பார்வையில் தெரியும் தன்மைகளை அடிப்படையாகக் கொண்ட வழிகாட்டல் மட்டுமே.'
          : 'When evaluating food quality and hygiene: ensure food containers are kept covered from dust and insects, dishes are served piping hot or properly refrigerated, and vendor utensils are clean.\n\nResponsible AI Note: This is an AI-assisted visual assessment guide, not a laboratory certification.',
      sources: ['FSSAI Food Hygiene Fundamentals', 'Street Food Quality Guidelines'],
      language: req.body?.language || 'en',
    });
  }
});

// ==========================================
// VITE MIDDLEWARE & STATIC SERVING
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FoodLens AI Server operational on port ${PORT}`);
  });
}

startServer();
