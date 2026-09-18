import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export interface DBUser {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  preferred_language: 'en' | 'ta';
  created_at: string;
}

export interface DBAnalysis {
  id: string;
  user_id: string;
  image_reference: string;
  food_name: string;
  food_category: string;
  location?: string;
  food_type?: string;
  user_note?: string;
  overall_score: number;
  hygiene_score: number;
  visual_quality_score: number;
  serving_condition_score: number;
  observations: string[];
  concerns: string[];
  positive_indicators: string[];
  recommendations: string[];
  confidence: string;
  limitations: string[];
  created_at: string;
}

export interface DBChatMessage {
  id: string;
  user_id: string;
  role: 'user' | 'assistant';
  message: string;
  created_at: string;
}

interface DatabaseSchema {
  users: DBUser[];
  analyses: DBAnalysis[];
  chat_messages: DBChatMessage[];
}

const DATA_DIR = path.join(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'foodlens.db.json');

class FoodLensDatabase {
  private data: DatabaseSchema = {
    users: [],
    analyses: [],
    chat_messages: [],
  };

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } else {
        this.seedInitialData();
        this.save();
      }
    } catch (err) {
      console.error('Error initializing database, using initial memory seed:', err);
      this.seedInitialData();
    }
  }

  private save() {
    try {
      const tempFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempFile, DB_FILE);
    } catch (err) {
      console.error('Failed to persist database file:', err);
    }
  }

  private seedInitialData() {
    const demoPasswordHash = bcrypt.hashSync('password123', 10);
    const demoUserId = 'user_demo_01';

    const demoUser: DBUser = {
      id: demoUserId,
      name: 'Nafiya Consumer',
      email: 'nafiya@foodlens.ai',
      password_hash: demoPasswordHash,
      preferred_language: 'en',
      created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    };

    const initialAnalyses: DBAnalysis[] = [
      {
        id: 'ana_sample_01',
        user_id: demoUserId,
        image_reference: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
        food_name: 'Hyderabadi Chicken Biryani',
        food_category: 'Restaurant food',
        location: 'Chennai Central',
        food_type: 'Restaurant food',
        user_note: 'Dine-in restaurant, freshly served in handi with visible vapor',
        overall_score: 84,
        hygiene_score: 86,
        visual_quality_score: 88,
        serving_condition_score: 79,
        observations: [
          'Long grain Basmati rice grains are distinct, well-separated, and visibly un-mushy.',
          'Garnish of fried brown onions (birista) and chopped coriander appears fresh without wilting.',
          'Food appears actively hot based on surface moisture sheen and light visible condensation.'
        ],
        concerns: [
          'Accompaniment raita bowl should be monitored for cold temperature retention.'
        ],
        positive_indicators: [
          'Clean porcelain plate presentation with no greasy fingerprints or surface residue.',
          'Even saffron coloration without artificial pooling of heavy food dye.',
          'Tender visible chicken pieces well-coated in aromatic masala.'
        ],
        recommendations: [
          'Ensure the accompanying onion raita is chilled to maintain optimal curd probiotic stability.',
          'Consume while actively steaming to experience prime textural and culinary quality.'
        ],
        confidence: 'High visual clarity',
        limitations: [
          'Visual assessment only; internal core cooking temperature cannot be verified from photography.',
          'Not a laboratory certification for microbial safety or spices adulteration.'
        ],
        created_at: new Date(Date.now() - 2 * 86400000).toISOString()
      },
      {
        id: 'ana_sample_02',
        user_id: demoUserId,
        image_reference: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80',
        food_name: 'Crispy Samosas & Mint Chutney',
        food_category: 'Snacks',
        location: 'T Nagar Market',
        food_type: 'Street food',
        user_note: 'Evening tea snack from a bustling street cart',
        overall_score: 71,
        hygiene_score: 68,
        visual_quality_score: 76,
        serving_condition_score: 69,
        observations: [
          'Golden brown crust texture indicates crisp puffing with minimal oil seepage.',
          'Serving paper plate shows slight excess grease absorption near base corner.',
          'Chutney dispenser was kept open to ambient street air during assembly.'
        ],
        concerns: [
          'Open sauce bowl exposed to ambient particulate drift near roadway traffic.',
          'Frying oil in the background cauldron showed slight dark oxidation tint.'
        ],
        positive_indicators: [
          'Crispy, golden-fried exterior without uneven charring or burning.',
          'Served straight from warm wire draining rack rather than pre-bagged.'
        ],
        recommendations: [
          'Prefer vendors who keep chutneys in squeeze bottles or covered glass containers.',
          'Request hot batches directly from the oil strainer to ensure thermal safety.'
        ],
        confidence: 'Moderate confidence',
        limitations: [
          'Microbial load and inner potato filling freshness cannot be determined visually.',
          'Image cannot ascertain whether frying oil meets total polar compound (TPC) thresholds.'
        ],
        created_at: new Date(Date.now() - 1 * 86400000).toISOString()
      },
      {
        id: 'ana_sample_03',
        user_id: demoUserId,
        image_reference: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
        food_name: 'Madurai Jigarthanda Special',
        food_category: 'Beverages',
        location: 'Madurai Famous Shop',
        food_type: 'Traditional/local foods',
        user_note: 'Cold dessert drink with almond gum (badam pisin) and basundi malai',
        overall_score: 88,
        hygiene_score: 89,
        visual_quality_score: 92,
        serving_condition_score: 84,
        observations: [
          'Distinct layered appearance: gelatinous badam pisin foundation, rich reduced milk, and creamy malai scoop on top.',
          'Clean glass tumbler with pristine rim and no sticky overflow down exterior walls.',
          'Condensed milk exhibits rich natural ivory-beige tint characteristic of slow reduction.'
        ],
        concerns: [
          'High dairy content requires continuous refrigeration under 4°C in tropical heat.'
        ],
        positive_indicators: [
          'Ingredients dispensed directly from chilled stainless steel containers.',
          'No synthetic neon red colorants; natural nannari herbal syrup tones evident.',
          'Thick textured malai scoop holds structural shape without weeping excess liquid.'
        ],
        recommendations: [
          'Consume immediately upon serving while cold to enjoy optimal mouthfeel and dairy freshness.',
          'Verify that the seller maintains ice blocks in insulated chests rather than floor racks.'
        ],
        confidence: 'High visual clarity',
        limitations: [
          'Purity of badam pisin gum and absence of adulterated starches require biochemical testing.',
          'Water source used for freezing cannot be visually verified.'
        ],
        created_at: new Date(Date.now() - 4 * 3600000).toISOString()
      }
    ];

    this.data.users.push(demoUser);
    this.data.analyses.push(...initialAnalyses);
  }

  // Users
  getUserByEmail(email: string): DBUser | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  getUserById(id: string): DBUser | undefined {
    return this.data.users.find(u => u.id === id);
  }

  createUser(user: Omit<DBUser, 'id' | 'created_at'>): DBUser {
    const newUser: DBUser = {
      ...user,
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      created_at: new Date().toISOString()
    };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  updateUser(id: string, updates: Partial<Omit<DBUser, 'id' | 'created_at'>>): DBUser | null {
    const user = this.getUserById(id);
    if (!user) return null;
    Object.assign(user, updates);
    this.save();
    return user;
  }

  // Analyses
  getAnalysesByUserId(userId: string): DBAnalysis[] {
    return this.data.analyses
      .filter(a => a.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  getAnalysisById(id: string): DBAnalysis | undefined {
    return this.data.analyses.find(a => a.id === id);
  }

  createAnalysis(analysis: Omit<DBAnalysis, 'id' | 'created_at'>): DBAnalysis {
    const newAnalysis: DBAnalysis = {
      ...analysis,
      id: `ana_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      created_at: new Date().toISOString()
    };
    this.data.analyses.unshift(newAnalysis);
    this.save();
    return newAnalysis;
  }

  deleteAnalysis(id: string, userId: string): boolean {
    const index = this.data.analyses.findIndex(a => a.id === id && a.user_id === userId);
    if (index === -1) return false;
    this.data.analyses.splice(index, 1);
    this.save();
    return true;
  }

  // Chat Messages
  getChatMessagesByUserId(userId: string): DBChatMessage[] {
    return this.data.chat_messages
      .filter(m => m.user_id === userId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }

  addChatMessage(userId: string, role: 'user' | 'assistant', message: string): DBChatMessage {
    const newMsg: DBChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      user_id: userId,
      role,
      message,
      created_at: new Date().toISOString()
    };
    this.data.chat_messages.push(newMsg);
    // Keep max 50 recent messages per user to maintain trim storage
    const userMsgs = this.data.chat_messages.filter(m => m.user_id === userId);
    if (userMsgs.length > 50) {
      const oldestId = userMsgs[0].id;
      this.data.chat_messages = this.data.chat_messages.filter(m => m.id !== oldestId);
    }
    this.save();
    return newMsg;
  }
}

export const db = new FoodLensDatabase();
