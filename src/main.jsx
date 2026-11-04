import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/react';
import App from './App';
import './index.css';

// Initialize Sentry Error Monitoring if VITE_SENTRY_DSN is configured
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [
      Sentry.browserTracingIntegration(),
    ],
    tracesSampleRate: 1.0,
    tracePropagationTargets: ['localhost', /^https:\/\/divinecafe/],
  });
}

// Register PWA service worker
if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('PWA service worker registration failed:', err);
    });
  });
}

function ErrorFallback() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FAF8F5] text-forest-950 text-center">
      <div className="w-16 h-16 rounded-full bg-forest-100 flex items-center justify-center text-forest-800 text-2xl font-bold mb-4 shadow-sm">
        🌿
      </div>
      <h1 className="text-xl font-serif font-bold text-forest-900 mb-2">Something went wrong</h1>
      <p className="text-sm text-forest-700 max-w-sm mb-6">
        We encountered an unexpected error. Please refresh the page to continue ordering.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-2.5 bg-forest-900 text-[#FAF7F2] font-semibold text-sm rounded-xl shadow hover:bg-forest-800 transition"
      >
        Refresh Page
      </button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
      <App />
    </Sentry.ErrorBoundary>
  </React.StrictMode>
);
