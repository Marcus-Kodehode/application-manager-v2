'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">😕</div>
        <h2 className="text-2xl font-bold text-foreground mb-3">
          Oops! Noe gikk galt
        </h2>
        <p className="text-muted mb-6">
          Vi beklager, men det oppstod en uventet feil. Dette kan være midlertidig, så prøv gjerne igjen.
        </p>
        {error.message && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-700 dark:text-red-300 font-mono">
              {error.message}
            </p>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            🔄 Prøv igjen
          </button>
          <a
            href="/"
            className="px-6 py-3 border border-border rounded-lg hover:bg-accent font-medium transition-colors duration-200 text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 inline-block"
          >
            🏠 Gå til forsiden
          </a>
        </div>
      </div>
    </div>
  );
}
