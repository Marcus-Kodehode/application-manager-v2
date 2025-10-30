import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">😕</div>
        <h1 className="text-4xl font-bold text-foreground mb-3">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-foreground mb-4">
          Siden finnes ikke
        </h2>
        <p className="text-muted mb-8">
          Vi beklager, men vi kunne ikke finne siden du leter etter. Den kan ha blitt flyttet eller slettet.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            🏠 Gå til forsiden
          </Link>
          <Link
            href="/jobs"
            className="px-6 py-3 border border-border rounded-lg hover:bg-accent font-medium transition-colors duration-200 text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            📋 Se jobber
          </Link>
        </div>
      </div>
    </div>
  );
}
