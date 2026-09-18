import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Share2, 
  Bookmark, 
  MessageSquare, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Info, 
  Maximize2, 
  X, 
  Copy,
  Check,
  ShieldAlert,
  MapPin,
  Calendar
} from 'lucide-react';
import { FoodLensAnalysis } from '../types.js';
import { useLanguage } from '../context/LanguageContext.js';

interface ResultViewProps {
  analysis: FoodLensAnalysis;
  onAnalyzeAnother: () => void;
  onAskAssistant: (foodName: string, analysisSummary: string) => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  analysis,
  onAnalyzeAnother,
  onAskAssistant,
}) => {
  const { t } = useLanguage();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  const handleShare = () => {
    const summaryText = `FoodLens AI Insight for ${analysis.foodName} (${analysis.foodCategory}):\n` +
      `Overall Visual Score: ${analysis.overallScore}/100\n` +
      `Hygiene Indicators: ${analysis.hygieneScore}/100\n` +
      `Visual Quality: ${analysis.visualQualityScore}/100\n` +
      `Serving Condition: ${analysis.servingConditionScore}/100\n` +
      `Primary Tip: ${analysis.practicalTips[0] || 'Consume while fresh.'}\n\n` +
      `AI-assisted visual assessment via FoodLens AI.`;

    navigator.clipboard.writeText(summaryText);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 3000);
  };

  const handleSave = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  // Helper to format score colors
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-[#114232]';
    if (score >= 65) return 'text-[#B48B40]';
    return 'text-[#C55A38]';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-[#114232]';
    if (score >= 65) return 'bg-[#B48B40]';
    return 'bg-[#C55A38]';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Top Back / Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <button
          id="back-to-analyze-btn"
          onClick={onAnalyzeAnother}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#6E8576] hover:text-[#114232] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('analyzeAnother')}</span>
        </button>

        <div className="flex items-center gap-2">
          {savedToast && (
            <span className="text-xs font-medium text-[#114232] bg-[#F5F2EB] px-3 py-1 rounded-full border border-[#114232]/20 animate-in fade-in">
              Analysis saved to your history
            </span>
          )}
          {copiedToast && (
            <span className="text-xs font-medium text-[#114232] bg-[#F5F2EB] px-3 py-1 rounded-full border border-[#114232]/20 animate-in fade-in">
              Insight copied to clipboard
            </span>
          )}

          <button
            id="share-insight-btn"
            onClick={handleShare}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#E8E4DC] bg-white text-xs font-semibold text-[#2C302E] hover:border-[#114232]/40 transition-colors shadow-2xs"
          >
            {copiedToast ? <Check className="w-3.5 h-3.5 text-[#114232]" /> : <Share2 className="w-3.5 h-3.5 text-[#6E8576]" />}
            <span>{t('shareInsight')}</span>
          </button>

          <button
            id="save-analysis-btn"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#E8E4DC] bg-white text-xs font-semibold text-[#2C302E] hover:border-[#114232]/40 transition-colors shadow-2xs"
          >
            <Bookmark className="w-3.5 h-3.5 text-[#6E8576]" />
            <span>{t('saveAnalysis')}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Large Photo | Right Food Insight Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Food Photography with Zoom Toggle */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-white border border-[#E8E4DC] luxury-shadow p-2">
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-[#FAF8F5]">
              <img
                src={analysis.imageReference}
                alt={analysis.foodName}
                className="w-full h-full object-cover"
              />
              <button
                id="expand-food-image-btn"
                onClick={() => setIsImageModalOpen(true)}
                className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-md text-[#1C1E1D] hover:bg-white transition-all shadow-xs"
                title="Expand image in high resolution"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>{analysis.foodCategory}</span>
              </div>
            </div>
          </div>

          {/* Context Details Pill Card */}
          <div className="bg-white border border-[#E8E4DC] rounded-2xl p-4 text-xs space-y-2">
            <div className="flex items-center justify-between text-[#6E8576]">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#8A9A86]" />
                <span>Location: {analysis.location || 'Not specified'}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#8A9A86]" />
                <span>{new Date(analysis.createdAt).toLocaleDateString()}</span>
              </span>
            </div>
            {analysis.userNote && (
              <p className="text-[#2C302E] pt-2 border-t border-[#E8E4DC]/60 italic">
                “{analysis.userNote}”
              </p>
            )}
          </div>
        </div>

        {/* Right Column: “Your food insight” */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-[#E8E4DC] rounded-3xl p-6 sm:p-8 luxury-shadow space-y-8">
            {/* Header + Overall Score */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-[#E8E4DC]">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-[#114232]">
                  Your Food Insight
                </span>
                <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-[#1C1E1D] mt-1">
                  {analysis.foodName}
                </h1>
                <p className="text-xs text-[#6E8576] mt-1.5">
                  AI-assisted visual assessment grounded in culinary characteristics
                </p>
              </div>

              {/* Overall Score Badge */}
              <div className="flex items-center sm:flex-col items-end gap-2 shrink-0">
                <div className="w-20 h-20 rounded-2xl border border-[#E8E4DC] bg-[#FAF8F5] flex flex-col items-center justify-center p-2 shadow-2xs">
                  <span className={`font-editorial text-3xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                    {analysis.overallScore}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-[#8A9A86] font-semibold">
                    / 100
                  </span>
                </div>
                <span className="text-[11px] text-[#6E8576] font-medium sm:text-right">
                  Overall Score
                </span>
              </div>
            </div>

            {/* Three Thin Elegant Progress Bars */}
            <div className="space-y-4">
              {/* 1. Hygiene Indicators */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-[#2C302E]">{t('hygieneIndicators')}</span>
                  <span className="font-mono font-semibold text-[#1C1E1D]">{analysis.hygieneScore} / 100</span>
                </div>
                <div className="w-full h-2 bg-[#F5F2EB] rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-700 ${getScoreBg(analysis.hygieneScore)}`}
                    style={{ width: `${analysis.hygieneScore}%` }}
                  />
                </div>
              </div>

              {/* 2. Visual Quality */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-[#2C302E]">{t('visualQuality')}</span>
                  <span className="font-mono font-semibold text-[#1C1E1D]">{analysis.visualQualityScore} / 100</span>
                </div>
                <div className="w-full h-2 bg-[#F5F2EB] rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-700 ${getScoreBg(analysis.visualQualityScore)}`}
                    style={{ width: `${analysis.visualQualityScore}%` }}
                  />
                </div>
              </div>

              {/* 3. Serving Condition */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-[#2C302E]">{t('servingCondition')}</span>
                  <span className="font-mono font-semibold text-[#1C1E1D]">{analysis.servingConditionScore} / 100</span>
                </div>
                <div className="w-full h-2 bg-[#F5F2EB] rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-700 ${getScoreBg(analysis.servingConditionScore)}`}
                    style={{ width: `${analysis.servingConditionScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* WHAT WE NOTICED */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs uppercase font-bold tracking-widest text-[#114232] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{t('whatWeNoticed')}</span>
              </h3>
              <div className="space-y-2.5">
                {analysis.observations.map((obs, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] flex items-start gap-3 text-xs text-[#2C302E]">
                    <div className="w-4 h-4 rounded-full bg-[#114232]/10 text-[#114232] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <span className="leading-relaxed">{obs}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* POSITIVE INDICATORS & POTENTIAL CONCERNS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Positive Indicators */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#114232] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#114232]" />
                  <span>Positive Indicators</span>
                </span>
                <ul className="space-y-1.5 text-xs text-[#2C302E]">
                  {analysis.positiveIndicators.map((pos, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#114232] font-bold">•</span>
                      <span>{pos}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Potential Concerns */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#B48B40] flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#B48B40]" />
                  <span>Potential Concerns</span>
                </span>
                <ul className="space-y-1.5 text-xs text-[#2C302E]">
                  {analysis.potentialConcerns.map((con, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#B48B40] font-bold">•</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* A SIMPLE SUGGESTION */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#F5F2EB] border border-[#E8E4DC] space-y-2">
              <span className="text-xs uppercase font-bold tracking-widest text-[#114232]">
                {t('simpleSuggestion')}
              </span>
              <div className="space-y-1.5">
                {analysis.practicalTips.map((tip, idx) => (
                  <p key={idx} className="text-xs sm:text-sm text-[#1C1E1D] font-medium leading-relaxed">
                    👉 {tip}
                  </p>
                ))}
              </div>
            </div>

            {/* CONFIDENCE & SCIENTIFIC LIMITATIONS */}
            <div className="pt-2 border-t border-[#E8E4DC] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#6E8576] font-medium uppercase tracking-wider text-[10px]">
                  {t('confidence')}
                </span>
                <span className="font-semibold text-[#1C1E1D] bg-[#FAF8F5] px-2.5 py-1 rounded-md border border-[#E8E4DC]">
                  {analysis.confidence}
                </span>
              </div>

              {/* Scientific Limitations */}
              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/60 text-xs text-[#2C302E] space-y-1">
                <div className="flex items-center gap-1.5 text-amber-800 font-semibold text-[11px] uppercase tracking-wider">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                  <span>{t('limitations')}</span>
                </div>
                <p className="text-[11px] leading-relaxed text-[#6E8576]">
                  {analysis.limitations[0] || t('limitationsNote')}
                </p>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <button
                id="ask-assistant-about-food-btn"
                onClick={() => onAskAssistant(analysis.foodName, `I just analyzed ${analysis.foodName} (${analysis.foodCategory}) with an overall visual score of ${analysis.overallScore}/100. What precautions should I take?`)}
                className="flex-1 py-3 px-4 rounded-xl bg-[#114232] text-white text-xs font-semibold hover:bg-[#0E3B2C] transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <MessageSquare className="w-4 h-4 text-[#E8DFD0]" />
                <span>Ask Assistant about this food</span>
              </button>

              <button
                id="analyze-another-food-btn"
                onClick={onAnalyzeAnother}
                className="py-3 px-5 rounded-xl border border-[#E8E4DC] bg-white text-xs font-semibold text-[#2C302E] hover:border-[#114232]/40 transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#6E8576]" />
                <span>Analyze another</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* High-Res Image Fullscreen Modal */}
      {isImageModalOpen && (
        <div 
          id="image-zoom-modal"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div className="relative max-w-5xl max-h-[90vh]">
            <img
              src={analysis.imageReference}
              alt={analysis.foodName}
              className="max-h-[85vh] max-w-full rounded-2xl object-contain"
            />
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
