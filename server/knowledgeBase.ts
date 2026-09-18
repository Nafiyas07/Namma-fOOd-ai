export interface KnowledgeEntry {
  id: string;
  topic: string;
  category: string;
  keywords: string[];
  content: string;
  tamilContent: string;
  practicalGuidance: string;
  practicalGuidanceTa: string;
}

export const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  {
    id: 'street-food-hygiene',
    topic: 'Street Food Hygiene and Serving Environment',
    category: 'Street food',
    keywords: ['street food', 'roadside', 'stall', 'cart', 'hygiene', 'dust', 'cover', 'flies', 'utensils', 'தெரு உணவு', 'சுத்தம்', 'ஈக்கள்'],
    content: 'Street food stalls operating in open ambient environments must maintain continuous coverage over cooked dishes to shield against vehicle dust, industrial particulates, and insect vectors. Clean serving utensils must be stored off bare cart tables.',
    tamilContent: 'சாலையோர உணவுக் கடைகளில் சமைத்த உணவுகள் தூசி, புகை மற்றும் பூச்சிகள் படாமல் நன்கு மூடப்பட்டிருக்க வேண்டும். பரிமாறும் பாத்திரங்கள் சுத்தமான தட்டுகளில் வைக்கப்பட வேண்டும்.',
    practicalGuidance: 'Prefer stalls where food containers have secure transparent or stainless covers, vendors use tongs or gloves, and cooking takes place actively on high heat.',
    practicalGuidanceTa: 'உணவு மூடப்பட்டிருக்கும் கடைகளிலும், பரிமாறுபவர் கரண்டி அல்லது கையுறை பயன்படுத்துகிறார்களா என்பதையும் பார்த்து வாங்கவும்.'
  },
  {
    id: 'oil-freshness-frying',
    topic: 'Frying Oil Quality & Repeated Usage Signs',
    category: 'Snacks',
    keywords: ['oil', 'frying', 'deep fried', 'samosa', 'bajji', 'vada', 'dark oil', 'foam', 'smoke', 'எண்ணெய்', 'பொரித்த', 'கருப்பு'],
    content: 'Repeatedly heated edible cooking oil undergoes thermal polymerisation and lipid oxidation. Visual cues of degraded oil include dark brown/black coloration, thick viscous foam on the surface during frying, and acrid smoking at low temperatures.',
    tamilContent: 'மீண்டும் மீண்டும் காய்ச்சப்படும் எண்ணெய் கருப்பாகவும், நுரைத்து பொங்கியும் காணப்படும். இதில் பலமுறை பொரித்த பலகாரங்களை தவிர்ப்பது நல்லது.',
    practicalGuidance: 'Observe the frying wok: fresh oil is golden amber and translucid. Avoid items from oil that appears murky, dark brown, or produces heavy blue-black smoke.',
    practicalGuidanceTa: 'எண்ணெய் தட்டையான பொன் நிறத்தில் இருக்க வேண்டும். அடர்ந்த கருமை அல்லது கரும்புகை வரும் எண்ணெயில் பொரித்ததை தவிர்க்கவும்.'
  },
  {
    id: 'beverage-ice-freshness',
    topic: 'Beverages, Fruit Juices & Ice Cube Safety',
    category: 'Beverages',
    keywords: ['beverage', 'juice', 'ice', 'water', 'tea', 'coffee', 'jigarthanda', 'milkshake', 'பானம்', 'ஐஸ்', 'ஜிகர்தண்டா', 'குளிர்'],
    content: 'Cold beverages and blended drinks often carry risk through commercial block ice prepared from non-potable water. Crushed industrial ice often has opaque cloudy patches and grit. Natural ingredients like badam pisin and nannari syrup should be stored in clean dispensers.',
    tamilContent: 'குளிர்பானங்கள் மற்றும் பழச்சாறுகளில் சேர்க்கப்படும் ஐஸ் கட்டிகள் சுத்தமான குடிநீரில் செய்யப்பட வேண்டும். தொழில்துறைக்கான கட்டை ஐஸை நேரடியாக கலப்பதை தவிர்க்கவும்.',
    practicalGuidance: 'Ask for beverages without ice if the source of ice is unverified block ice. For traditional drinks like Jigarthanda, ensure the milk and malai are maintained in chilled stainless containers.',
    practicalGuidanceTa: 'ஐஸ் கட்டிகளின் தரம் உறுதியில்லை என்றால் ஐஸ் இல்லாமல் குடிப்பது நல்லது. பால் மற்றும் மலாய் குளிர்ந்த பாத்திரங்களில் வைக்கப்பட்டுள்ளதா என பார்க்கவும்.'
  },
  {
    id: 'hot-holding-biryani-meals',
    topic: 'Cooked Foods, Biryani & Hot Holding Guidelines',
    category: 'Restaurant food',
    keywords: ['biryani', 'rice', 'meat', 'chicken', 'steaming', 'hot', 'temperature', 'meals', 'பிரியாணி', 'சூடாக', 'சாப்பாடு'],
    content: 'Cooked starch and rice dishes like biryani and fried rice must be held at or above 60°C (140°F) or chilled rapidly below 5°C. Storing warm rice at room temperature (20°C - 45°C) for over 2 hours encourages rapid multiplication of Bacillus cereus spores.',
    tamilContent: 'பிரியாணி, சாதம் போன்ற உணவுகள் ஆவி பறக்கும் அளவுக்கு சூடாகவோ அல்லது குளிர்சாதனப் பெட்டியிலோ இருக்க வேண்டும். அறை வெப்பநிலையில் நீண்ட நேரம் வைக்கப்பட்ட சாதத்தை தவிர்க்கவும்.',
    practicalGuidance: 'Look for active steam and fragrant fresh vapor. Avoid biryani or rice dishes displayed lukewarm in open metal handis for hours without underneath heating.',
    practicalGuidanceTa: 'சூடாக ஆவி பறக்கும் பிரியாணியைத் தேர்ந்தெடுக்கவும். நீண்ட நேரம் திறந்த நிலையில் ஆறிப்போன சாதத்தை தவிர்க்கவும்.'
  },
  {
    id: 'fruits-salads-vegetables',
    topic: 'Raw Fruits, Cut Vegetables & Fresh Produce',
    category: 'Fruits and vegetables',
    keywords: ['fruit', 'salad', 'vegetables', 'cut', 'sliced', 'watermelon', 'papaya', 'பழங்கள்', 'காய்கறிகள்', 'வெட்டப்பட்ட'],
    content: 'Pre-cut fruits and exposed salads displayed on street carts lack outer skin protection. Moisture and sugar promote rapid bacterial proliferation if exposed to ambient air and ambient temperatures exceeding 25°C.',
    tamilContent: 'முன்கூட்டியே வெட்டி வைக்கப்பட்ட பழங்களில் பாக்டீரியாக்கள் எளிதில் வளரும். புதிதாக உங்கள் கண் முன்னே நறுக்கப்படும் பழங்களை சாப்பிடவும்.',
    practicalGuidance: 'Request whole fruits to be freshly sliced in your presence rather than buying pre-sliced fruit plates exposed to ambient air and dust.',
    practicalGuidanceTa: 'முன்னரே வெட்டி வைத்த தட்டுகளை வாங்காமல், உங்கள் கண் முன்னே புதிதாக வெட்டித் தரும் பழங்களை உண்ணுங்கள்.'
  },
  {
    id: 'packaged-canned-food',
    topic: 'Packaged Food Sealing & Tamper Integrity',
    category: 'Packaged food',
    keywords: ['packaged', 'sealed', 'packet', 'can', 'tin', 'expiry', 'bloated', 'leaking', 'பாக்கெட்', 'டின்'],
    content: 'Packaged foods must have intact hermetic seals without micro-punctures or air leakage. Cans with convex bulging, severe dents along seams, or rusted joints indicate compromised sterility or anaerobic bacterial gas production.',
    tamilContent: 'பாக்கெட் உணவுகளில் காற்று கசிவு இல்லாமல் இருக்க வேண்டும். உப்பிய அல்லது நெளிந்த தகர டப்பாக்களை (canned food) வாங்கக் கூடாது.',
    practicalGuidance: 'Examine seals for tight pinch lines, verify manufacturing/expiry dates, and reject any pouch that feels unusually pressurized or greasy outside.',
    practicalGuidanceTa: 'பாக்கெட் சீல் சரியாக உள்ளதா என்பதையும், காலாவதி தேதியையும் சரிபார்க்கவும்.'
  },
  {
    id: 'dairy-sweets-authenticity',
    topic: 'Dairy, Traditional Sweets & Malai Freshness',
    category: 'Desserts',
    keywords: ['dairy', 'milk', 'sweet', 'gulab jamun', 'halwa', 'ice cream', 'jigarthanda', 'malai', 'பால்', 'இனிப்பு'],
    content: 'Dairy sweets made with khoa, condensed milk, and fresh cream spoil quickly in hot tropical climates. Signs of degradation include sour acidity, surface slime, unusual discoloration, or dry crumbling crusts.',
    tamilContent: 'பால் இனிப்புகள், கோவா, மலாய் போன்றவை சீக்கிரம் கெட்டுப்போகும் தன்மை கொண்டவை. புளிப்பு வாசனை, வறண்ட மேல் பகுதி இருந்தால் தவிர்க்கவும்.',
    practicalGuidance: 'Traditional milk sweets should have a rich milky aroma without sour notes. Purchase from reputable sweet shops with refrigerated display cases.',
    practicalGuidanceTa: 'பால் இனிப்புகளில் புளிப்பு வாசனை இருக்கக் கூடாது. குளிர்சாதன வசதியுள்ள சுத்தமான கடைகளில் வாங்குங்கள்.'
  }
];

export function retrieveRelevantKnowledge(query: string, category?: string): KnowledgeEntry[] {
  const normalizedQuery = query.toLowerCase();
  
  const scored = KNOWLEDGE_BASE.map(entry => {
    let score = 0;
    
    // Category match
    if (category && entry.category.toLowerCase().includes(category.toLowerCase())) {
      score += 4;
    }
    
    // Keyword match
    for (const kw of entry.keywords) {
      if (normalizedQuery.includes(kw.toLowerCase())) {
        score += 3;
      }
    }
    
    // Content match
    if (normalizedQuery.includes(entry.topic.toLowerCase())) {
      score += 5;
    }
    
    return { entry, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const relevant = scored.filter(s => s.score > 0).slice(0, 3).map(s => s.entry);
  
  // Return at least top 2 if no explicit score match
  if (relevant.length === 0) {
    return KNOWLEDGE_BASE.slice(0, 2);
  }
  return relevant;
}
