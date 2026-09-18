import React from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Eye, 
  Sparkles, 
  Info, 
  Camera, 
  BrainCircuit, 
  FileSearch, 
  Compass,
  Utensils,
  Store,
  Home,
  Coffee,
  Cookie,
  Cake,
  Package,
  Wheat,
  Apple
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.js';
import { FOOD_CATEGORIES } from '../data/foodSamples.js';

interface LandingViewProps {
  onAnalyzeClick: () => void;
  onExploreArchitecture: () => void;
  onSelectCategory?: (category: string) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onAnalyzeClick,
  onExploreArchitecture,
  onSelectCategory
}) => {
  const { t } = useLanguage();

  const corePillars = [
    {
      step: '01',
      title: 'Capture',
      desc: 'Snap a live photo or upload an image of your meal, street food, or beverage.',
      icon: Camera
    },
    {
      step: '02',
      title: 'Analyze',
      desc: 'Multimodal vision models examine visible textures, containers, and serving condition.',
      icon: BrainCircuit
    },
    {
      step: '03',
      title: 'Understand',
      desc: 'Review structured observations, potential visual concerns, and positive indicators.',
      icon: FileSearch
    },
    {
      step: '04',
      title: 'Decide',
      desc: 'Receive immediate practical guidance to make informed consumption decisions.',
      icon: Compass
    }
  ];

  const whatWeLookFor = [
    {
      title: 'Food Appearance & Freshness',
      desc: 'Surface moisture sheen, crumb/grain integrity, oxidation discoloration, and natural coloration vs. synthetic dyes.',
    },
    {
      title: 'Visible Hygiene Indicators',
      desc: 'Covered vs. open container exposure, cleanliness of serving dishes, proximity to ambient dust or smoke.',
    },
    {
      title: 'Serving Condition & Handling',
      desc: 'Active steaming heat or proper chilling, utensil isolation, oil absorption, and garnish freshness.',
    },
    {
      title: 'Ingredient Exposure & Context',
      desc: 'Fusing vendor context, regional culinary standards, and dish-specific preparation rules.',
    }
  ];

  return (
    <div className="space-y-24 py-6 md:py-12">
      {/* HERO SECTION */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#114232]/20 bg-[#F5F2EB] text-[#114232] text-xs font-semibold tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{t('heroLabel')}</span>
              </div>

              <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#1C1E1D] leading-[1.12]">
                “See food <br />
                <span className="italic text-[#114232] font-medium">differently.</span>”
              </h1>

              <p className="text-base sm:text-lg text-[#2C302E]/80 max-w-xl font-normal leading-relaxed">
                {t('heroDesc')}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  id="hero-analyze-cta-btn"
                  onClick={onAnalyzeClick}
                  className="px-7 py-3.5 rounded-full bg-[#114232] text-white text-sm font-semibold tracking-wide hover:bg-[#0E3B2C] transition-all flex items-center gap-2.5 shadow-xs luxury-card-hover group"
                >
                  <span>{t('analyzeFood')}</span>
                  <ArrowRight className="w-4 h-4 text-[#E8DFD0] group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  id="hero-how-it-works-btn"
                  onClick={onExploreArchitecture}
                  className="px-6 py-3.5 rounded-full border border-[#E8E4DC] bg-white text-[#2C302E] text-sm font-semibold hover:border-[#114232]/40 transition-colors"
                >
                  {t('exploreHowItWorks')}
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-[#E8E4DC]/80 flex flex-wrap items-center gap-6 text-xs text-[#6E8576]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#114232]" />
                  <span>Responsible AI Grounded</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#114232]" />
                  <span>All 11 Food Categories</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#114232]" />
                  <span>English & தமிழ் Support</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual with Floating Insight Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-[#E8E4DC] bg-white luxury-shadow p-2">
                <div className="relative h-[380px] sm:h-[440px] rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=900&auto=format&fit=crop&q=80"
                    alt="Authentic Dum Biryani with fresh mint garnish"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  
                  {/* Subtle Floating Insight Widget */}
                  <div 
                    id="hero-floating-insight"
                    className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-[#E8E4DC] luxury-shadow"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-[#E8E4DC]/70">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#114232]" />
                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#6E8576]">
                          {t('visualInsight')}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="font-editorial text-xl font-bold text-[#114232]">78</span>
                        <span className="text-[11px] text-[#8A9A86]">/ 100</span>
                      </div>
                    </div>

                    {/* Three refined indicators */}
                    <div className="grid grid-cols-3 gap-2 py-2.5 text-center">
                      <div className="px-2 py-1 bg-[#FAF8F5] rounded-lg border border-[#E8E4DC]/50">
                        <span className="text-[10px] text-[#6E8576] block">Hygiene</span>
                        <span className="text-xs font-semibold text-[#114232]">Good</span>
                      </div>
                      <div className="px-2 py-1 bg-[#FAF8F5] rounded-lg border border-[#E8E4DC]/50">
                        <span className="text-[10px] text-[#6E8576] block">Quality</span>
                        <span className="text-xs font-semibold text-[#114232]">Strong</span>
                      </div>
                      <div className="px-2 py-1 bg-[#FAF8F5] rounded-lg border border-[#E8E4DC]/50">
                        <span className="text-[10px] text-[#6E8576] block">Serving</span>
                        <span className="text-xs font-semibold text-[#C5A880]">Moderate</span>
                      </div>
                    </div>

                    <p className="text-[10px] text-[#6E8576] text-center pt-1 border-t border-[#E8E4DC]/50 italic">
                      “AI-generated assessment based on visible characteristics in the uploaded image.”
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-[#114232]">The Core Experience</span>
          <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-[#1C1E1D] mt-2">
            Capture → Analyze → Understand → Decide
          </h2>
          <p className="text-sm text-[#6E8576] mt-3">
            A deliberate, four-step visual intelligence pipeline designed for everyday consumer clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {corePillars.map((p) => {
            const Icon = p.icon;
            return (
              <div 
                key={p.step} 
                className="bg-white border border-[#E8E4DC] rounded-2xl p-6 luxury-shadow relative group hover:border-[#114232]/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold text-[#C5A880] tracking-wider">{p.step}</span>
                  <div className="w-9 h-9 rounded-full bg-[#FAF8F5] border border-[#E8E4DC] flex items-center justify-center text-[#114232]">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="font-editorial text-xl font-medium text-[#1C1E1D] mb-2">{p.title}</h3>
                <p className="text-xs text-[#6E8576] leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* WHAT FOODLENS LOOKS FOR */}
      <section className="bg-white border-y border-[#E8E4DC] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-[#114232]">Visual Analysis Scope</span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-[#1C1E1D] mt-2">
              What Namma fOOd-AI evaluates in your food photo
            </h2>
            <p className="text-sm text-[#6E8576] mt-3">
              We extract actionable signals strictly from visible characteristics, avoiding unsubstantiated claims.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {whatWeLookFor.map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-[#114232]/10 text-[#114232] flex items-center justify-center font-editorial font-bold text-sm shrink-0">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="font-editorial text-lg font-medium text-[#1C1E1D] mb-1.5">{item.title}</h3>
                  <p className="text-xs text-[#6E8576] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUPPORTED FOOD CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-[#114232]">Universal Coverage</span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-[#1C1E1D] mt-2">
              Designed for all food categories
            </h2>
            <p className="text-sm text-[#6E8576] mt-2">
              From roadside street food stalls to fine dining and packaged groceries.
            </p>
          </div>
          <button
            onClick={onAnalyzeClick}
            className="mt-4 md:mt-0 text-xs font-semibold text-[#114232] hover:text-[#0E3B2C] flex items-center gap-1.5 underline underline-offset-4"
          >
            <span>Analyze any food item now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {FOOD_CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                if (onSelectCategory) onSelectCategory(cat.id);
                onAnalyzeClick();
              }}
              className="p-4 rounded-xl border border-[#E8E4DC] bg-white hover:border-[#114232]/50 hover:bg-[#FAF8F5] transition-all cursor-pointer luxury-card-hover group"
            >
              <span className="text-xs font-semibold text-[#1C1E1D] group-hover:text-[#114232] transition-colors block">
                {cat.label}
              </span>
              <span className="text-[11px] text-[#8A9A86] mt-1 block">Supported standard</span>
            </div>
          ))}
        </div>
      </section>

      {/* RESPONSIBLE AI MANDATE & SCIENTIFIC TRANSPARENCY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-[#F5F2EB] border border-[#E8E4DC] relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 text-[#114232] text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#114232]" />
              <span>Responsible AI Governance</span>
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-medium text-[#1C1E1D]">
              Clear boundaries. Absolute scientific honesty.
            </h2>
            <p className="text-xs sm:text-sm text-[#2C302E]/80 leading-relaxed">
              Namma fOOd-AI provides an <strong>AI-assisted visual assessment</strong> of visible food presentation, containers, and visible hygiene cues. Photographs cannot detect chemical adulterants, bacterial strains, invisible microbial toxins, or guaranteed authenticity.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] text-[#6E8576]">
              <span>• Not a laboratory certification</span>
              <span>• Not a medical diagnosis</span>
              <span>• Evaluates visible characteristics</span>
              <span>• Clear uncertainty communication</span>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="text-center max-w-2xl mx-auto px-4 sm:px-6">
        <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-[#1C1E1D]">
          Bring your food into focus.
        </h2>
        <p className="text-sm text-[#6E8576] mt-3 mb-8">
          Upload an image of your next meal or snack to receive structured, contextual insights in seconds.
        </p>
        <button
          id="final-cta-analyze-btn"
          onClick={onAnalyzeClick}
          className="px-8 py-4 rounded-full bg-[#114232] text-white text-sm font-semibold tracking-wide hover:bg-[#0E3B2C] transition-all shadow-xs luxury-card-hover"
        >
          {t('analyzeFood')}
        </button>
      </section>
    </div>
  );
};
