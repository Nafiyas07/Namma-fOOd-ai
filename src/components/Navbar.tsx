import React, { useState } from 'react';
import { 
  Scan, 
  History, 
  MessageSquare, 
  Cpu, 
  User as UserIcon, 
  Languages, 
  Menu, 
  X, 
  Sparkles,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useLanguage } from '../context/LanguageContext.js';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { user, logout, openAuthModal } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { id: 'analyze', label: t('navAnalyze'), icon: Scan },
    { id: 'history', label: t('navHistory'), icon: History },
    { id: 'assistant', label: t('navAssistant'), icon: MessageSquare },
    { id: 'architecture', label: t('navHowItWorks'), icon: Cpu },
  ];

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8E4DC] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Identity */}
          <div 
            id="brand-logo"
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full border border-[#114232]/30 bg-white flex items-center justify-center shadow-xs group-hover:border-[#114232] transition-colors">
              <div className="w-5 h-5 rounded-full border-2 border-[#114232] flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#114232]" />
              </div>
            </div>
            <div>
              <span className="font-editorial text-2xl font-semibold tracking-wide text-[#1C1E1D] block leading-none">
                Namma <span className="font-sans text-xl font-bold tracking-tight text-[#114232]">fOOd-AI</span>
              </span>
              <span className="text-[11px] text-[#6E8576] tracking-wider uppercase font-medium mt-1 block">
                {t('tagline')}
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-white/80 border border-[#E8E4DC] px-2 py-1.5 rounded-full shadow-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#114232] text-white shadow-xs'
                      : 'text-[#2C302E] hover:text-[#114232] hover:bg-[#F5F2EB]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#E8DFD0]' : 'text-[#6E8576]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right utility actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Switcher */}
            <button
              id="language-toggle-btn"
              onClick={toggleLanguage}
              title="Switch language between English and Tamil"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E8E4DC] bg-white text-xs font-semibold text-[#2C302E] hover:border-[#114232]/40 transition-colors shadow-xs"
            >
              <Languages className="w-3.5 h-3.5 text-[#114232]" />
              <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
            </button>

            {/* User Profile / Auth */}
            {user ? (
              <div className="relative">
                <button
                  id="user-profile-menu-btn"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E8E4DC] bg-white hover:bg-[#F5F2EB] transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-[#114232]/10 border border-[#114232]/20 flex items-center justify-center text-[#114232] font-semibold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-medium text-[#1C1E1D] max-w-[100px] truncate">
                    {user.name}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E8E4DC] rounded-xl shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-[#E8E4DC]">
                      <p className="text-xs font-semibold text-[#1C1E1D] truncate">{user.name}</p>
                      <p className="text-[11px] text-[#6E8576] truncate">{user.email}</p>
                    </div>
                    <button
                      id="dropdown-profile-btn"
                      onClick={() => {
                        handleNavClick('profile');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-[#2C302E] hover:bg-[#FAF8F5] flex items-center gap-2"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-[#6E8576]" />
                      <span>{t('navProfile')}</span>
                    </button>
                    <button
                      id="dropdown-logout-btn"
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="sign-in-btn"
                onClick={() => openAuthModal('login')}
                className="px-5 py-2 rounded-full bg-[#114232] text-white text-xs font-semibold tracking-wide hover:bg-[#0E3B2C] transition-colors shadow-xs"
              >
                {t('navSignIn')}
              </button>
            )}
          </div>

          {/* Mobile menu hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              id="mobile-language-toggle"
              onClick={toggleLanguage}
              className="p-2 rounded-lg border border-[#E8E4DC] bg-white text-xs font-medium"
            >
              {language === 'en' ? 'தமிழ்' : 'EN'}
            </button>
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border border-[#E8E4DC] bg-white text-[#1C1E1D]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E8E4DC] bg-[#FAF8F5] px-4 pt-3 pb-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#114232] text-white'
                    : 'bg-white border border-[#E8E4DC] text-[#1C1E1D]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#E8DFD0]' : 'text-[#6E8576]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <button
            id="mobile-nav-profile"
            onClick={() => handleNavClick('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              currentTab === 'profile'
                ? 'bg-[#114232] text-white'
                : 'bg-white border border-[#E8E4DC] text-[#1C1E1D]'
            }`}
          >
            <UserIcon className="w-4 h-4 text-[#6E8576]" />
            <span>{t('navProfile')}</span>
          </button>

          {user ? (
            <button
              id="mobile-sign-out"
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-red-200 text-red-700 bg-red-50 text-sm font-medium mt-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out ({user.name})</span>
            </button>
          ) : (
            <button
              id="mobile-sign-in"
              onClick={() => {
                openAuthModal('login');
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 rounded-xl bg-[#114232] text-white text-sm font-medium mt-2 shadow-xs"
            >
              {t('navSignIn')}
            </button>
          )}
        </div>
      )}
    </header>
  );
};
