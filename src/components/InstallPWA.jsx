import React, { useState, useEffect } from 'react';
import { Download, X, Share, PlusSquare, Smartphone, CheckCircle } from 'lucide-react';
import { cafeConfig } from '../data/cafeConfig';

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  useEffect(() => {
    // 1. Check if already running in standalone/installed mode
    const isStandaloneMode = 
      window.matchMedia('(display-mode: standalone)').matches || 
      window.navigator.standalone === true;

    if (isStandaloneMode) {
      setIsStandalone(true);
      return;
    }

    // 2. Check if user recently dismissed banner in this session
    const isDismissed = sessionStorage.getItem('divine_pwa_dismissed');
    if (isDismissed) return;

    // 3. Detect iOS Safari
    const ua = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(ua);
    const isSafari = /safari/.test(ua) && !/chrome|crios|fxios/.test(ua);

    if (isIOSDevice && isSafari) {
      setIsIOS(true);
      // Wait 3 seconds after page loads before gently showing install suggestion
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    }

    // 4. Listen for Chrome/Edge/Android beforeinstallprompt event
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show install prompt 2.5s after load
      setTimeout(() => {
        setIsVisible(true);
      }, 2500);
    };

    const handleAppInstalled = () => {
      setInstalledSuccess(true);
      setIsVisible(false);
      setDeferredPrompt(null);
      setTimeout(() => setInstalledSuccess(false), 4000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setInstalledSuccess(true);
      setTimeout(() => setInstalledSuccess(false), 3000);
    }
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('divine_pwa_dismissed', 'true');
  };

  if (isStandalone) return null;

  return (
    <>
      {/* Toast notification upon successful install */}
      {installedSuccess && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#143826] text-white px-5 py-3 rounded-2xl shadow-2xl border border-olive-500/50 flex items-center gap-3 animate-in fade-in slide-in-from-top duration-300">
          <CheckCircle className="w-5 h-5 text-olive-400" />
          <span className="text-xs sm:text-sm font-medium">
            Divine Cafe installed! Open it directly from your home screen.
          </span>
        </div>
      )}

      {/* Floating Bottom / Banner Prompt */}
      {isVisible && (
        <div className="fixed bottom-20 md:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-[#143826] text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl border border-olive-500/40 backdrop-blur-md animate-in slide-in-from-bottom duration-500">
          <div className="flex items-start gap-3">
            {/* App Icon */}
            <img
              src="/pwa-icon.svg"
              alt="Divine Cafe Icon"
              className="w-12 h-12 rounded-xl border border-olive-400/50 shadow-md shrink-0 bg-[#0e271b] p-1"
            />

            {/* Content */}
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center justify-between gap-1">
                <h4 className="font-serif font-bold text-sm text-cream-100 truncate">
                  Install Divine Cafe App
                </h4>
                <button
                  onClick={handleDismiss}
                  className="p-1 text-cream-300/70 hover:text-white rounded-lg transition-colors -mr-1"
                  aria-label="Dismiss install banner"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[11px] sm:text-xs text-cream-200/80 leading-snug mt-0.5">
                Add to your phone for instant 1-tap ordering, faster loading & full screen mode.
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-2.5">
                <button
                  onClick={handleInstallClick}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-olive-500 hover:bg-olive-400 active:scale-95 text-[#0a1a12] font-semibold text-xs shadow-md transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isIOS ? 'Add to Home Screen' : 'Install App'}</span>
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-2.5 py-1.5 rounded-lg text-cream-300 hover:text-white text-xs font-medium transition-colors"
                >
                  Not now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* iOS Instructions Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#143826] text-white w-full max-w-sm rounded-3xl p-5 border border-olive-500/40 shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 right-4 p-1.5 text-cream-300/70 hover:text-white rounded-full bg-forest-900/80"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <img
                src="/pwa-icon.svg"
                alt="Divine Cafe"
                className="w-12 h-12 rounded-xl border border-olive-400/50 bg-[#0e271b] p-1"
              />
              <div>
                <h3 className="font-serif font-bold text-base text-cream-100">Install on iPhone</h3>
                <p className="text-xs text-olive-300">Fast 2-step setup</p>
              </div>
            </div>

            <div className="space-y-3 pt-2 text-xs text-cream-200 leading-relaxed border-t border-forest-800">
              <div className="flex items-center gap-3 bg-forest-900/60 p-2.5 rounded-xl border border-forest-700/50">
                <span className="w-6 h-6 rounded-full bg-olive-500 text-[#0a1a12] font-bold flex items-center justify-center text-xs shrink-0">
                  1
                </span>
                <span className="flex-1 flex items-center gap-1.5">
                  Tap the <Share className="w-4 h-4 text-olive-400 inline" /> <strong>Share</strong> button at bottom of Safari
                </span>
              </div>

              <div className="flex items-center gap-3 bg-forest-900/60 p-2.5 rounded-xl border border-forest-700/50">
                <span className="w-6 h-6 rounded-full bg-olive-500 text-[#0a1a12] font-bold flex items-center justify-center text-xs shrink-0">
                  2
                </span>
                <span className="flex-1 flex items-center gap-1.5">
                  Scroll down and tap <PlusSquare className="w-4 h-4 text-olive-400 inline" /> <strong>Add to Home Screen</strong>
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 rounded-xl bg-olive-500 text-[#0a1a12] font-bold text-xs hover:bg-olive-400 transition-colors shadow-md mt-2"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
