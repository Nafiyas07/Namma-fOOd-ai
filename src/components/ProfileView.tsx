import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Calendar, 
  Languages, 
  BarChart2, 
  LogOut, 
  Check, 
  Loader2, 
  Sparkles 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useLanguage } from '../context/LanguageContext.js';
import { api } from '../lib/api.js';

export const ProfileView: React.FC = () => {
  const { user, logout, updateProfile } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [name, setName] = useState(user?.name || '');
  const [prefLang, setPrefLang] = useState<'en' | 'ta'>(user?.preferredLanguage || 'en');
  const [analysisCount, setAnalysisCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPrefLang(user.preferredLanguage || 'en');
      api.getProfile().then((p) => {
        if (p.analysisCount !== undefined) setAnalysisCount(p.analysisCount);
      }).catch(() => {});
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      await updateProfile({ name, preferredLanguage: prefLang });
      setLanguage(prefLang);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert('Failed to update profile settings.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#E8E4DC] flex items-center justify-center mx-auto text-[#114232]">
          <UserIcon className="w-5 h-5" />
        </div>
        <h2 className="font-editorial text-2xl text-[#1C1E1D]">Please Sign In</h2>
        <p className="text-xs text-[#6E8576]">
          Sign in to view your profile, manage language settings, and track personal food assessments.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="max-w-xl mb-8">
        <span className="text-xs uppercase font-bold tracking-widest text-[#114232]">
          Account Settings
        </span>
        <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-[#1C1E1D] mt-1">
          Consumer Profile
        </h1>
        <p className="text-xs text-[#6E8576] mt-1">
          Manage your personal preferences, primary interface language, and food record history.
        </p>
      </div>

      <div className="bg-white border border-[#E8E4DC] rounded-3xl p-6 sm:p-8 luxury-shadow space-y-8">
        {/* User Card Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-[#E8E4DC]">
          <div className="w-16 h-16 rounded-2xl bg-[#FAF8F5] border border-[#114232]/20 flex items-center justify-center text-[#114232] font-editorial text-2xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-editorial text-xl font-medium text-[#1C1E1D]">{user.name}</h3>
            <p className="text-xs text-[#6E8576] flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5 text-[#8A9A86]" />
              <span>{user.email}</span>
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC]">
            <span className="text-[11px] uppercase tracking-wider text-[#6E8576] flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-[#114232]" />
              <span>Total Food Analyses</span>
            </span>
            <span className="font-editorial text-2xl font-bold text-[#1C1E1D] block mt-1">
              {analysisCount}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC]">
            <span className="text-[11px] uppercase tracking-wider text-[#6E8576] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#114232]" />
              <span>Member Since</span>
            </span>
            <span className="text-xs font-semibold text-[#1C1E1D] block mt-2">
              {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Preferences Form */}
        <form onSubmit={handleSaveProfile} className="space-y-5 pt-2">
          {savedSuccess && (
            <div className="p-3 rounded-xl bg-[#F5F2EB] border border-[#114232]/20 text-xs text-[#114232] flex items-center gap-2">
              <Check className="w-4 h-4 text-[#114232]" />
              <span>Profile preferences updated successfully.</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#2C302E] mb-1.5">
              Display Name
            </label>
            <input
              id="profile-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E4DC] bg-[#FAF8F5] text-xs text-[#1C1E1D] focus:outline-none focus:ring-2 focus:ring-[#114232]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2C302E] mb-1.5 flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-[#6E8576]" />
              <span>Preferred Language (முதன்மை மொழி)</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPrefLang('en')}
                className={`py-2.5 px-4 rounded-xl border text-xs font-semibold text-center transition-all ${
                  prefLang === 'en'
                    ? 'border-[#114232] bg-[#FAF8F5] text-[#114232] shadow-2xs'
                    : 'border-[#E8E4DC] bg-white text-[#6E8576]'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setPrefLang('ta')}
                className={`py-2.5 px-4 rounded-xl border text-xs font-semibold text-center transition-all font-tamil ${
                  prefLang === 'ta'
                    ? 'border-[#114232] bg-[#FAF8F5] text-[#114232] shadow-2xs'
                    : 'border-[#E8E4DC] bg-white text-[#6E8576]'
                }`}
              >
                தமிழ் (Tamil)
              </button>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-[#E8E4DC]">
            <button
              id="save-profile-btn"
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#114232] text-white text-xs font-semibold hover:bg-[#0E3B2C] transition-colors flex items-center gap-2 shadow-xs"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Save Changes</span>
            </button>

            <button
              type="button"
              onClick={logout}
              className="px-4 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
