import React, { useState } from 'react';
import { Lock, User as UserIcon, ShieldAlert, Info, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { BalcadLogo } from '../BalcadLogo';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const LoginView: React.FC = () => {
  const { login, error, clearError } = useAuth();
  const { t } = useLanguage();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Check if user was redirected here due to disabled account
  React.useEffect(() => {
    const disabledMsg = localStorage.getItem('balcad_auth_disabled_msg');
    if (disabledMsg) {
      setLocalError('This user is disabled, please contact the Administrator');
      localStorage.removeItem('balcad_auth_disabled_msg');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = username.trim();
    const cleanPass = password.trim();

    if (!cleanUser || !cleanPass) {
      setLocalError('Fadlan geli username-ka iyo password-ka (Please enter both username and password).');
      return;
    }
    setLocalError(null);
    clearError();
    setLoading(true);

    try {
      await login(cleanUser, cleanPass);
    } catch (err: any) {
      const msg = String(err.message || '');
      if (
        msg.toLowerCase().includes('disabled') ||
        msg.toLowerCase().includes('xanniban') ||
        msg.toLowerCase().includes('administrator')
      ) {
        setLocalError('This user is disabled, please contact the Administrator');
      } else {
        setLocalError(err.message || 'Username-ka ama password-ka ma saxana.');
      }
    } finally {
      setLoading(false);
    }
  };

  const rawError = localError || error;
  const isUserDisabledError =
    rawError &&
    (rawError.toLowerCase().includes('disabled') ||
      rawError.toLowerCase().includes('xanniban') ||
      rawError.toLowerCase().includes('administrator'));

  const displayedError = isUserDisabledError
    ? 'This user is disabled, please contact the Administrator'
    : rawError;

  return (
    <div className="min-h-screen w-full bg-[#070A11] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Golden Glow and Dark Atmosphere */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Main Login Card */}
        <div className="bg-[#0E1422] border border-amber-500/25 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative">
          {/* Header Brand */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="py-2 px-4 rounded-2xl bg-[#080C15]/90 border border-amber-500/20 shadow-xl flex items-center justify-center max-w-full">
              <BalcadLogo size="xl" showUploadTrigger={true} />
            </div>
            <div className="mt-3 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-[11px] uppercase tracking-widest">
              Internal Admin & CRM
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Sign in with your username and password to access the portal.
            </p>
          </div>

          {/* Error Banner */}
          {displayedError && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-red-400 text-xs animate-shake font-medium">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <span>{displayedError}</span>
            </div>
          )}

          {/* Strict Authentication Form: Username and Password ONLY */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                {t('username')}
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder=""
                  className="w-full pl-10 pr-4 py-2.5 bg-[#141C30] border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                {t('password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=""
                  className="w-full pl-10 pr-10 py-2.5 bg-[#141C30] border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition p-1 cursor-pointer"
                  title={showPassword ? 'Qari Password-ka' : 'Muuji Password-ka'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 active:scale-[0.99] transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{t('login_button')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Strict Notice regarding Forgot Password policy */}
          <div className="mt-4 pt-4 border-t border-slate-800 text-center">
            <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-amber-400/80" />
              <span>{t('login_forgot_notice')}</span>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center mt-4 text-[11px] text-slate-500">
          Balcad Travel Agency • balcadtravel@gmail.com • 612483838 / 612141414
        </div>
      </div>
    </div>
  );
};
