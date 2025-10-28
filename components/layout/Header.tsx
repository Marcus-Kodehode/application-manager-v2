'use client';

import { UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={isSignedIn ? '/dashboard' : '/'} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">J</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Jobbsøk Assistent</span>
          </Link>

          {/* Navigation */}
          {isSignedIn ? (
            <div className="flex items-center gap-6">
              <nav className="hidden md:flex gap-6">
                <Link
                  href="/dashboard"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/dashboard')
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Oversikt
                </Link>
                <Link
                  href="/jobs"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/jobs')
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Jobber
                </Link>
                <Link
                  href="/documents"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/documents')
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Dokumenter
                </Link>
              </nav>
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/sign-in"
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Logg inn
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Kom i gang
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        {isSignedIn && (
          <nav className="md:hidden flex gap-4 pb-3 overflow-x-auto">
            <Link
              href="/dashboard"
              className={`text-sm font-medium whitespace-nowrap transition-colors ${
                isActive('/dashboard')
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Oversikt
            </Link>
            <Link
              href="/jobs"
              className={`text-sm font-medium whitespace-nowrap transition-colors ${
                isActive('/jobs')
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Jobber
            </Link>
            <Link
              href="/documents"
              className={`text-sm font-medium whitespace-nowrap transition-colors ${
                isActive('/documents')
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
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
