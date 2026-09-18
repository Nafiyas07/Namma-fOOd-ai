import React, { useState } from 'react';
import { 
  Camera, 
  BrainCircuit, 
  FileSearch, 
  Compass, 
  Database, 
  Layers, 
  Mic, 
  Eye, 
  FileText, 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Workflow
} from 'lucide-react';

export const HowItWorksView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'journey' | 'system' | 'dataset' | 'multimodal'>('journey');

  const journeySteps = [
    {
      num: '01',
      title: 'Capture',
      subtitle: 'Input Acquisition',
      desc: 'Consumer captures a live photo via camera or uploads an existing meal image (street food, home cooking, restaurant plate, or beverage) along with optional context like food name, location, and serving notes.',
      icon: Camera,
    },
    {
      num: '02',
      title: 'Analyze',
      subtitle: 'Multimodal Processing',
      desc: 'The FoodLens visual reasoning pipeline processes image textures, container boundaries, steam/condensation, cleanliness indicators, and ingredient exposure using multimodal vision models.',
      icon: BrainCircuit,
    },
    {
      num: '03',
      title: 'Understand',
      subtitle: 'Contextual Synthesis',
      desc: 'Findings are grounded against curated food safety databases and regional culinary norms to generate structured scores for Hygiene Indicators, Visual Quality, and Serving Condition.',
      icon: FileSearch,
    },
    {
      num: '04',
      title: 'Decide',
      subtitle: 'Actionable Consumer Guidance',
      desc: 'The consumer receives clear, transparent guidance with explicit limitations and suggestions (e.g. temperature verification, storage precautions) to make confident decisions.',
      icon: Compass,
    },
  ];

  const systemNodes = [
    { label: 'User Meal Input', sub: 'Camera snapshot or image upload' },
    { label: 'Input Preprocessing', sub: 'Format check, resizing, lighting normalization' },
    { label: 'Vision Feature Extraction', sub: 'Texture, surface moisture, dish perimeter' },
    { label: 'Multimodal AI Reasoning', sub: 'Gemini 3.8 Flash visual intelligence' },
    { label: 'Knowledge Retrieval (RAG)', sub: 'FSSAI standards, regional culinary norms' },
    { label: 'Assessment Engine', sub: 'Granular score computation (0-100)' },
    { label: 'Explainable Insights', sub: 'Visual observations & potential concerns' },
    { label: 'Consumer Action', sub: 'Practical guidance & bilingual consultation' },
  ];

  const datasetSteps = [
    {
      stage: '1. Multi-Category Collection',
      details: 'Gather diverse real-world photography across all 11 food categories: street stalls, dining tables, home kitchens, and beverage shops in varied ambient lighting.',
    },
    {
      stage: '2. Metadata Tagging & Verification',
      details: 'Tag dish names, regional variants, thermal state (hot, chilled, ambient), serving container types, and vendor environment.',
    },
    {
      stage: '3. Duplicate & Blur De-duplication',
      details: 'Algorithmic filtering for perceptual hashing duplicates, motion blur, and underexposed captures.',
    },
    {
      stage: '4. Quality Control & Ethics Screening',
      details: 'Strip personally identifiable faces and license plates, ensuring adherence to ethical AI and privacy protocols.',
    },
    {
      stage: '5. Multi-Label Expert Annotation',
      details: 'Taxonomic labeling of visible hygiene cues (open vs covered dishes, utensil resting), garnish freshness, and plating integrity.',
    },
    {
      stage: '6. Expert & Peer Review',
      details: 'Culinary and food safety specialists review ambiguous ground truths and calibrate confidence thresholds.',
    },
    {
      stage: '7. Partitioning (Train / Val / Test)',
      details: 'Stratified cross-category splitting ensuring zero leak of vendor locations across training and evaluation sets.',
    },
    {
      stage: '8. Benchmark Testing & Continuous Deployment',
      details: 'Evaluation against real-world test sets to verify calibration, robustness, and refusal to claim invisible contamination.',
    },
  ];

  const multimodalPillars = [
    {
      title: 'Vision Signals',
      icon: Eye,
      items: ['Surface texture & crumb moisture', 'Container cleanliness & covers', 'Visible steam / chill condensation', 'Natural vs artificial coloration'],
    },
    {
      title: 'Audio Signals (Future)',
      icon: Mic,
      items: ['Oil crackle & deep-frying acoustics', 'Active boiling frequency signatures', 'Carbonation fizz and effervescence', 'Steam release hiss patterns'],
    },
    {
      title: 'Contextual Text',
      icon: FileText,
      items: ['Vendor location & environment', 'Identified recipe & ingredients', 'User-supplied sensory observations', 'Time of purchase & storage duration'],
    },
    {
      title: 'Domain Knowledge',
      icon: BookOpen,
      items: ['FSSAI hygiene regulations', 'Regional culinary traditions', 'Temperature danger zone standards', 'Thermal stability of dairy and meats'],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="max-w-3xl mb-10">
        <span className="text-xs uppercase font-bold tracking-widest text-[#114232]">
          Under The Hood
        </span>
        <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1C1E1D] mt-2">
          Technical Architecture & Methodology
        </h1>
        <p className="text-sm text-[#6E8576] mt-3">
          Explore how FoodLens AI bridges computer vision, contextual food science, and responsible multimodal reasoning.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-[#E8E4DC]">
        {[
          { id: 'journey', label: '1. User Journey' },
          { id: 'system', label: '2. System Pipeline' },
          { id: 'dataset', label: '3. Dataset Lifecycle' },
          { id: 'multimodal', label: '4. Future Multimodal Fusion' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-[#114232] text-white shadow-xs'
                : 'bg-white border border-[#E8E4DC] text-[#2C302E] hover:border-[#114232]/40'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: User Journey */}
      {activeTab === 'journey' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {journeySteps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="bg-white border border-[#E8E4DC] rounded-3xl p-6 luxury-shadow relative flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-bold text-[#C5A880] tracking-wider">
                        {step.num}
                      </span>
                      <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#E8E4DC] flex items-center justify-center text-[#114232]">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#6E8576]">
                      {step.subtitle}
                    </span>
                    <h3 className="font-editorial text-2xl font-medium text-[#1C1E1D] mt-1 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-xs text-[#6E8576] leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: System Architecture */}
      {activeTab === 'system' && (
        <div className="bg-white border border-[#E8E4DC] rounded-3xl p-8 luxury-shadow animate-in fade-in duration-300">
          <div className="max-w-2xl mb-8">
            <span className="text-xs uppercase font-bold tracking-widest text-[#114232]">
              End-to-End Flow
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl font-medium text-[#1C1E1D] mt-1">
              Data & Reasoning Pipeline
            </h2>
            <p className="text-xs text-[#6E8576] mt-2">
              Every query routes through rigorous preprocessing, vision extraction, RAG domain grounding, and calibrated scoring.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
            {systemNodes.map((node, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] relative group hover:border-[#114232]/40 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-full bg-[#114232] text-white text-[10px] font-bold flex items-center justify-center">
                    {idx + 1}
                  </div>
                  <span className="text-xs font-semibold text-[#1C1E1D]">{node.label}</span>
                </div>
                <p className="text-[11px] text-[#6E8576] pl-7 leading-relaxed">{node.sub}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Dataset Pipeline */}
      {activeTab === 'dataset' && (
        <div className="bg-white border border-[#E8E4DC] rounded-3xl p-8 luxury-shadow space-y-6 animate-in fade-in duration-300">
          <div className="max-w-2xl">
            <span className="text-xs uppercase font-bold tracking-widest text-[#114232]">
              Data Engineering
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl font-medium text-[#1C1E1D] mt-1">
              Real-World Food Dataset Pipeline
            </h2>
            <p className="text-xs text-[#6E8576] mt-2">
              Building robust food models requires systematic curation across varied street and restaurant conditions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {datasetSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] flex gap-3.5 items-start"
              >
                <div className="w-6 h-6 rounded-full bg-[#114232]/10 text-[#114232] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#1C1E1D] mb-1">{step.stage}</h4>
                  <p className="text-xs text-[#6E8576] leading-relaxed">{step.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Future Multimodal Intelligence */}
      {activeTab === 'multimodal' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-[#FAF8F5] border border-[#E8E4DC] rounded-3xl p-8">
            <div className="max-w-3xl mb-8">
              <span className="text-xs uppercase font-bold tracking-widest text-[#114232]">
                Multimodal Horizon
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl font-medium text-[#1C1E1D] mt-1">
                Vision + Audio + Text + Domain Knowledge Fusion
              </h2>
              <p className="text-xs sm:text-sm text-[#6E8576] mt-2 leading-relaxed">
                Future iterations of FoodLens AI synthesize visual inspection with live cooking audio (boiling, frying acoustics) and bilingual voice interactions in Tamil and English.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {multimodalPillars.map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white border border-[#E8E4DC] rounded-2xl p-5 luxury-shadow space-y-3"
                  >
                    <div className="flex items-center gap-2 text-[#114232]">
                      <Icon className="w-5 h-5 text-[#114232]" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C1E1D]">
                        {pillar.title}
                      </h4>
                    </div>
                    <ul className="space-y-2 text-xs text-[#6E8576]">
                      {pillar.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-[#114232] font-bold mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
