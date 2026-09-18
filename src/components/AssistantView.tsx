import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User as UserIcon, 
  Languages, 
  BookOpen, 
  ShieldCheck, 
  Loader2,
  RefreshCw
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.js';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../lib/api.js';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
  timestamp: string;
}

interface AssistantViewProps {
  initialPrompt?: string;
}

export const AssistantView: React.FC<AssistantViewProps> = ({ initialPrompt }) => {
  const { language, setLanguage, t } = useLanguage();
  const { user } = useAuth();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome_1',
      role: 'assistant',
      content: language === 'ta'
        ? 'வணக்கம்! நான் FoodLens AI உதவியாளர். உணவு சுகாதாரம், தரம் மற்றும் வாங்கும் போது கவனிக்க வேண்டியவை பற்றி என்னிடம் நீங்கள் தமிழிலோ அல்லது ஆங்கிலத்திலோ கேட்கலாம்.'
        : 'Welcome! I am FoodLens Assistant. Ask me anything about visible food hygiene, fresh food indicators, or precautions when buying street and restaurant food.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputMessage, setInputMessage] = useState(initialPrompt || '');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const quickPrompts = [
    {
      label: 'இந்த உணவு fresh-ஆ இருக்கா?',
      text: 'இந்த உணவு fresh-ஆ இருக்கா என்பதை எப்படி உறுதி செய்வது?',
      lang: 'ta',
    },
    {
      label: 'What should I check before buying street food?',
      text: 'What visible hygiene factors should I check before buying street food?',
      lang: 'en',
    },
    {
      label: 'இந்த food-ஐ வாங்கும்போது என்ன கவனிக்கணும்?',
      text: 'ரோட்டுக்கடைகளில் உணவு வாங்கும்போது என்ன முக்கியமான விஷயங்களை கவனிக்க வேண்டும்?',
      lang: 'ta',
    },
    {
      label: 'How can I identify visible signs of poor hygiene?',
      text: 'How can I identify visible signs of poor food hygiene in restaurants or stalls?',
      lang: 'en',
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // If opened with initial prompt from an analysis, send it automatically
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = (queryText || inputMessage).trim();
    if (!textToSend || loading) return;

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const historyPayload = messages.slice(-4).map((m) => ({
        role: m.role,
        message: m.content,
      }));

      // Detect Tamil script in input
      const hasTamilScript = /[\u0B80-\u0BFF]/.test(textToSend);
      const queryLanguage = hasTamilScript ? 'ta' : language;

      const res = await api.sendChatMessage(textToSend, queryLanguage, historyPayload);

      const assistantReply: Message = {
        id: `asst_${Date.now()}`,
        role: 'assistant',
        content: res.reply,
        sources: res.sources,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantReply]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        content:
          language === 'ta'
            ? 'மன்னிக்கவும், தகவலைப் பெறுவதில் தாமதம் ஏற்பட்டது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.'
            : 'Sorry, I encountered an issue retrieving that guidance. Please try asking again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#E8E4DC]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#114232]" />
            <span className="text-xs uppercase font-bold tracking-widest text-[#114232]">
              Grounded AI Intelligence
            </span>
          </div>
          <h1 className="font-editorial text-3xl font-normal text-[#1C1E1D] mt-1">
            {t('assistantName')}
          </h1>
          <p className="text-xs text-[#6E8576] mt-0.5">
            Bilingual food safety, hygiene cues, and preparation advice in English and தமிழ்.
          </p>
        </div>

        {/* Language selector */}
        <div className="flex items-center gap-1 bg-[#F5F2EB] p-1 rounded-full border border-[#E8E4DC] self-start sm:self-auto">
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              language === 'en' ? 'bg-white text-[#114232] shadow-2xs' : 'text-[#6E8576]'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('ta')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all font-tamil ${
              language === 'ta' ? 'bg-white text-[#114232] shadow-2xs' : 'text-[#6E8576]'
            }`}
          >
            தமிழ்
          </button>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="bg-white border border-[#E8E4DC] rounded-3xl luxury-shadow flex flex-col h-[580px] overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-5">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[88%] sm:max-w-[78%] ${
                  isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isUser
                      ? 'bg-[#114232] text-white'
                      : 'bg-[#FAF8F5] border border-[#E8E4DC] text-[#114232]'
                  }`}
                >
                  {isUser ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className="space-y-1.5">
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-[#114232] text-white rounded-tr-xs'
                        : 'bg-[#FAF8F5] border border-[#E8E4DC] text-[#1C1E1D] rounded-tl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.content}</p>

                    {/* Grounded Knowledge Source Citations */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-[#E8E4DC]/80 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#6E8576] flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-[#114232]" />
                          <span>Grounded Sources</span>
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.sources.map((source, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-white border border-[#E8E4DC] px-2 py-0.5 rounded-md text-[#2C302E]"
                            >
                              {source}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <span
                    className={`text-[10px] text-[#8A9A86] block ${
                      isUser ? 'text-right mr-1' : 'ml-1'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 max-w-[78%] mr-auto items-center">
              <div className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#E8E4DC] flex items-center justify-center text-[#114232]">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] text-xs text-[#6E8576] flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#114232]" />
                <span>Consulting food safety knowledge base...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompt Pills Bar */}
        <div className="px-6 py-2.5 bg-[#FAF8F5]/80 border-t border-[#E8E4DC] overflow-x-auto scrollbar-none flex items-center gap-2">
          <span className="text-[11px] font-semibold text-[#8A9A86] shrink-0">
            Suggested:
          </span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p.text)}
              disabled={loading}
              className="text-[11px] bg-white border border-[#E8E4DC] text-[#2C302E] hover:border-[#114232]/50 hover:bg-white px-3 py-1 rounded-full whitespace-nowrap shrink-0 transition-colors shadow-2xs"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Message Input Box */}
        <div className="p-4 bg-white border-t border-[#E8E4DC]">
          <div className="flex items-center gap-2">
            <input
              id="assistant-input-field"
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              placeholder={
                language === 'ta'
                  ? 'உணவு சுகாதாரம் அல்லது தரம் பற்றி கேளுங்கள்...'
                  : 'Ask about food hygiene, visible quality, or street food safety...'
              }
              className="flex-1 px-4 py-3 rounded-2xl border border-[#E8E4DC] bg-[#FAF8F5] text-xs sm:text-sm text-[#1C1E1D] focus:outline-none focus:ring-2 focus:ring-[#114232]/20 focus:border-[#114232]"
            />
            <button
              id="assistant-send-btn"
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || loading}
              className="p-3 rounded-2xl bg-[#114232] text-white hover:bg-[#0E3B2C] disabled:opacity-40 transition-colors shrink-0 shadow-xs"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-2 text-center">
            <span className="text-[10px] text-[#8A9A86] flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#114232]" />
              <span>Grounded in responsible food safety knowledge. Not medical diagnosis.</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
