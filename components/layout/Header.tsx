'use client';

import { UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export function Header() {
  const { isSignedIn } = useUser();
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(path);
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={isSignedIn ? '/dashboard' : '/'} className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">J</span>
            </div>
            <span className="text-xl font-bold text-foreground">Jobbsøk Assistent</span>
          </Link>

          {/* Navigation */}
          {isSignedIn ? (
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex gap-6">
                <Link
                  href="/dashboard"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/dashboard')
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Oversikt
                </Link>
                <Link
                  href="/jobs"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/jobs')
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Jobber
                </Link>
                <Link
                  href="/documents"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/documents')
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Dokumenter
                </Link>
              </nav>
              <ThemeToggle />
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link
                href="/sign-in"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Logg inn
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:opacity-90 transition-colors duration-200"
              >
                Kom i gang
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        {isSignedIn && (
          <nav className="md:hidden flex gap-4 pb-4 overflow-x-auto">
            <Link
              href="/dashboard"
              className={`text-sm font-medium whitespace-nowrap transition-colors ${
                isActive('/dashboard')
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Oversikt
            </Link>
            <Link
              href="/jobs"
              className={`text-sm font-medium whitespace-nowrap transition-colors ${
                isActive('/jobs')
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Jobber
            </Link>
            <Link
              href="/documents"
              className={`text-sm font-medium whitespace-nowrap transition-colors ${
                isActive('/documents')
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Dokumenter
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
