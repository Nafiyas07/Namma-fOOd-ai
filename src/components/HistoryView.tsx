import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Trash2, 
  ExternalLink, 
  Calendar, 
  Sparkles, 
  ArrowRight, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';
import { FoodLensAnalysis } from '../types.js';
import { api } from '../lib/api.js';
import { useLanguage } from '../context/LanguageContext.js';
import { FOOD_CATEGORIES } from '../data/foodSamples.js';

interface HistoryViewProps {
  onSelectAnalysis: (analysis: FoodLensAnalysis) => void;
  onNavigateToAnalyze: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  onSelectAnalysis,
  onNavigateToAnalyze,
}) => {
  const { t } = useLanguage();
  const [analyses, setAnalyses] = useState<FoodLensAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'score_desc' | 'score_asc'>('newest');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await api.getAnalyses();
      setAnalyses(data);
    } catch (err) {
      console.warn('Could not fetch analyses history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to remove this food analysis from your history?')) {
      return;
    }

    setDeletingId(id);
    try {
      await api.deleteAnalysis(id);
      setAnalyses((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert('Failed to delete analysis record.');
    } finally {
      setDeletingId(null);
    }
  };

  // Filter & Sort Logic
  const filteredAnalyses = analyses
    .filter((a) => {
      const matchesSearch = 
        a.foodName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.foodCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (a.location && a.location.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = 
        selectedCategory === 'all' || 
        a.foodCategory.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'score_desc') {
        return b.overallScore - a.overallScore;
      }
      if (sortBy === 'score_asc') {
        return a.overallScore - b.overallScore;
      }
      return 0;
    });

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-[#114232] bg-[#114232]/10 border-[#114232]/30';
    if (score >= 65) return 'text-[#B48B40] bg-[#B48B40]/10 border-[#B48B40]/30';
    return 'text-[#C55A38] bg-[#C55A38]/10 border-[#C55A38]/30';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#114232]">
            Personal Archive
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-[#1C1E1D] mt-1">
            Food Analysis History
          </h1>
          <p className="text-xs text-[#6E8576] mt-1">
            Browse and review past AI visual inspections and hygiene indicators.
          </p>
        </div>

        <button
          onClick={onNavigateToAnalyze}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#114232] text-white text-xs font-semibold hover:bg-[#0E3B2C] transition-colors self-start md:self-auto shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>New Analysis</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E8E4DC] rounded-2xl p-4 mb-8 luxury-shadow flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#6E8576] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="history-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by food, category, city..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E8E4DC] bg-[#FAF8F5] text-xs text-[#1C1E1D] focus:outline-none focus:ring-2 focus:ring-[#114232]/20"
          />
        </div>

        {/* Category Pills & Sort */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Category Dropdown for clean mobile experience */}
          <select
            id="history-category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#E8E4DC] bg-[#FAF8F5] text-xs text-[#2C302E] focus:outline-none"
          >
            <option value="all">All Categories</option>
            {FOOD_CATEGORIES.filter(c => c.id !== 'all').map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <select
            id="history-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-[#E8E4DC] bg-[#FAF8F5] text-xs text-[#2C302E] focus:outline-none"
          >
            <option value="newest">Sort: Newest first</option>
            <option value="score_desc">Sort: Highest score</option>
            <option value="score_asc">Sort: Lowest score</option>
          </select>
        </div>
      </div>

      {/* History Content */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#114232] mx-auto" />
          <p className="text-xs text-[#6E8576]">Loading food analysis history...</p>
        </div>
      ) : filteredAnalyses.length === 0 ? (
        /* Empty State */
        <div 
          id="history-empty-state"
          className="p-12 text-center bg-white border border-[#E8E4DC] rounded-3xl luxury-shadow max-w-lg mx-auto space-y-4"
        >
          <div className="w-14 h-14 rounded-full bg-[#FAF8F5] border border-[#E8E4DC] flex items-center justify-center mx-auto text-[#114232]">
            <Sparkles className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <h3 className="font-editorial text-2xl font-normal text-[#1C1E1D]">
            {t('emptyHistoryTitle')}
          </h3>
          <p className="text-xs text-[#6E8576] max-w-sm mx-auto leading-relaxed">
            Whenever you photograph a meal or snack, your visual insights, hygiene indicators, and food safety observations are archived here.
          </p>
          <button
            id="empty-history-analyze-btn"
            onClick={onNavigateToAnalyze}
            className="mt-2 px-6 py-3 rounded-full bg-[#114232] text-white text-xs font-semibold hover:bg-[#0E3B2C] transition-colors inline-flex items-center gap-2 shadow-xs"
          >
            <span>{t('emptyHistoryBtn')}</span>
            <ArrowRight className="w-4 h-4 text-[#E8DFD0]" />
          </button>
        </div>
      ) : (
        /* Editorial Grid of Analysis Cards */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAnalyses.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectAnalysis(item)}
              className="bg-white border border-[#E8E4DC] rounded-2xl overflow-hidden luxury-shadow hover:border-[#114232]/40 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                {/* Image header */}
                <div className="relative aspect-16/10 bg-[#FAF8F5] overflow-hidden">
                  <img
                    src={item.imageReference}
                    alt={item.foodName}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-medium px-2.5 py-0.5 rounded-full">
                    {item.foodCategory}
                  </div>

                  {/* Score Pill */}
                  <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${getScoreColor(item.overallScore)}`}>
                    {item.overallScore} / 100
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-editorial text-lg font-medium text-[#1C1E1D] group-hover:text-[#114232] transition-colors line-clamp-1">
                      {item.foodName}
                    </h3>
                  </div>

                  <p className="text-xs text-[#6E8576] line-clamp-2">
                    {item.observations[0] || 'Visual food assessment record.'}
                  </p>

                  {/* Indicators Preview */}
                  <div className="grid grid-cols-3 gap-1.5 pt-2 text-[10px] text-center">
                    <div className="bg-[#FAF8F5] p-1.5 rounded-lg border border-[#E8E4DC]">
                      <span className="text-[#8A9A86] block">Hygiene</span>
                      <span className="font-semibold text-[#1C1E1D]">{item.hygieneScore}</span>
                    </div>
                    <div className="bg-[#FAF8F5] p-1.5 rounded-lg border border-[#E8E4DC]">
                      <span className="text-[#8A9A86] block">Quality</span>
                      <span className="font-semibold text-[#1C1E1D]">{item.visualQualityScore}</span>
                    </div>
                    <div className="bg-[#FAF8F5] p-1.5 rounded-lg border border-[#E8E4DC]">
                      <span className="text-[#8A9A86] block">Serving</span>
                      <span className="font-semibold text-[#1C1E1D]">{item.servingConditionScore}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer with Delete & Date */}
              <div className="px-5 py-3 border-t border-[#E8E4DC]/70 bg-[#FAF8F5]/60 flex items-center justify-between text-xs text-[#6E8576]">
                <span className="flex items-center gap-1 text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-[#8A9A86]" />
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleDelete(e, item.id)}
                    disabled={deletingId === item.id}
                    className="p-1.5 rounded-md hover:bg-red-50 text-[#8A9A86] hover:text-red-600 transition-colors"
                    title="Delete record"
                  >
                    {deletingId === item.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-red-500" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <span className="text-[#114232] font-semibold flex items-center gap-0.5 text-[11px]">
                    <span>View</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
