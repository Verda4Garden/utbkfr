import { useState } from 'react';
import { loginWithGoogle, loginWithGoogleRedirect } from '../firebase';
import { motion } from 'motion/react';
import { Stethoscope, Loader2, ExternalLink } from 'lucide-react';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (method: 'popup' | 'redirect' = 'popup') => {
    console.log(`Login button clicked (${method}), isLoading:`, isLoading);
    if (isLoading) return;
    setIsLoading(true);
    setErrorMsg(null);
    try {
      console.log(`Initiating Google Login via ${method}...`);
      if (method === 'popup') {
        await loginWithGoogle();
      } else {
        await loginWithGoogleRedirect();
      }
      console.log('Google Login initiated successfully');
    } catch (error: any) {
      // Ignore cancelled popup request or user closing the popup
      const ignoredErrors = ['auth/cancelled-popup-request', 'auth/popup-closed-by-user'];
      if (!ignoredErrors.includes(error.code)) {
        console.error('Login failed:', error);
        setErrorMsg(error.message || 'Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F0] dark:bg-[#0a0a0a] p-4 transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-[#151619] rounded-[32px] p-8 md:p-12 shadow-xl text-center border border-gray-100 dark:border-gray-800"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#5A5A40] rounded-full flex items-center justify-center text-white">
            <Stethoscope size={32} />
          </div>
        </div>
        
        <h1 className="text-3xl font-serif font-bold text-[#1a1a1a] dark:text-white mb-2">MedPrep UTBK</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 font-serif italic">Premium Preparation for Future Doctors</p>
        
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 text-red-500 text-sm rounded-2xl border border-red-100 dark:border-red-500/20 font-serif italic">
            {errorMsg}
          </div>
        )}
        
        <div className="space-y-4">
          <button
            onClick={() => handleLogin('popup')}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-medium py-3 px-4 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            )}
            {isLoading ? 'Signing in...' : 'Sign in with Google'}
          </button>

          <p className="text-xs text-gray-400 mt-4">
            Trouble signing in? 
            <button 
              onClick={() => handleLogin('redirect')}
              className="ml-1 text-[#5A5A40] font-semibold hover:underline inline-flex items-center gap-1"
            >
              Try Redirect Method <ExternalLink size={10} />
            </button>
          </p>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest font-medium">
            Join 10,000+ FK Aspirants
          </p>
        </div>
      </motion.div>
    </div>
  );
}
