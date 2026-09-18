/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext.js';
import { LanguageProvider, useLanguage } from './context/LanguageContext.js';
import { Navbar } from './components/Navbar.js';
import { LandingView } from './components/LandingView.js';
import { AnalyzeView } from './components/AnalyzeView.js';
import { ResultView } from './components/ResultView.js';
import { HistoryView } from './components/HistoryView.js';
import { AssistantView } from './components/AssistantView.js';
import { HowItWorksView } from './components/HowItWorksView.js';
import { ProfileView } from './components/ProfileView.js';
import { AuthModal } from './components/AuthModal.js';
import { FoodLensAnalysis } from './types.js';
import { ShieldCheck, Heart, Sparkles } from 'lucide-react';

function MainApp() {
  const { t } = useLanguage();
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [currentAnalysis, setCurrentAnalysis] = useState<FoodLensAnalysis | null>(null);
  const [assistantPrompt, setAssistantPrompt] = useState<string>('');
  const [preselectedCategory, setPreselectedCategory] = useState<string>('Restaurant food');

  const handleAnalysisComplete = (analysis: FoodLensAnalysis) => {
    setCurrentAnalysis(analysis);
    setCurrentTab('result');
  };

  const handleSelectHistoryItem = (analysis: FoodLensAnalysis) => {
    setCurrentAnalysis(analysis);
    setCurrentTab('result');
  };

  const handleAskAssistant = (foodName: string, summary: string) => {
    setAssistantPrompt(summary);
    setCurrentTab('assistant');
  };

  const handleCategorySelectFromLanding = (category: string) => {
    setPreselectedCategory(category);
    setCurrentTab('analyze');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1C1E1D] selection:bg-[#114232]/10 selection:text-[#114232]">
      {/* Navigation */}
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main View Container */}
      <main className="flex-1">
        {currentTab === 'landing' && (
          <LandingView
            onAnalyzeClick={() => setCurrentTab('analyze')}
            onExploreArchitecture={() => setCurrentTab('architecture')}
            onSelectCategory={handleCategorySelectFromLanding}
          />
        )}

        {currentTab === 'analyze' && (
          <AnalyzeView
            onAnalysisComplete={handleAnalysisComplete}
            preselectedCategory={preselectedCategory}
          />
        )}

        {currentTab === 'result' && currentAnalysis && (
          <ResultView
            analysis={currentAnalysis}
            onAnalyzeAnother={() => setCurrentTab('analyze')}
            onAskAssistant={handleAskAssistant}
          />
        )}

        {currentTab === 'history' && (
          <HistoryView
            onSelectAnalysis={handleSelectHistoryItem}
            onNavigateToAnalyze={() => setCurrentTab('analyze')}
          />
        )}

        {currentTab === 'assistant' && (
          <AssistantView initialPrompt={assistantPrompt} />
        )}

        {currentTab === 'architecture' && <HowItWorksView />}

        {currentTab === 'profile' && <ProfileView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E8E4DC] bg-white mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-[#E8E4DC]">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-6 h-6 rounded-full border border-[#114232] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#114232]" />
                </div>
                <span className="font-editorial text-xl font-semibold text-[#1C1E1D]">
                  Namma fOOd-AI
                </span>
              </div>
              <p className="text-xs text-[#6E8576]">
                “See food differently.” AI-assisted food safety, visual quality, and authenticity intelligence.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-[#2C302E]">
              <button
                onClick={() => setCurrentTab('analyze')}
                className="hover:text-[#114232] transition-colors"
              >
                Analyze Food
              </button>
              <button
                onClick={() => setCurrentTab('architecture')}
                className="hover:text-[#114232] transition-colors"
              >
                Architecture & Methodology
              </button>
              <button
                onClick={() => setCurrentTab('assistant')}
                className="hover:text-[#114232] transition-colors"
              >
                Bilingual Assistant
              </button>
              <button
                onClick={() => setCurrentTab('history')}
                className="hover:text-[#114232] transition-colors"
              >
                Archive History
              </button>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#8A9A86]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#114232]" />
              <span>
                Namma fOOd-AI evaluates visible characteristics from photography. It is not a laboratory microbiological or chemical certification.
              </span>
            </div>
            <span>© {new Date().getFullYear()} Namma fOOd-AI. All rights reserved.</span>
          </div>
        </div>
      </footer>

      {/* Global Auth Modal */}
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <MainApp />
      </LanguageProvider>
    </AuthProvider>
  );
}
