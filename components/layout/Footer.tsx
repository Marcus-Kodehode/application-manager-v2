import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">J</span>
              </div>
              <span className="font-semibold text-gray-900">Jobbsøk Assistent</span>
            </div>
            <p className="text-sm text-gray-600">
              Din personlige verktøy for å holde oversikt over jobbsøknader og intervjuer.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Lenker</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Oversikt
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Jobber
                </Link>
              </li>
              <li>
                <Link href="/documents" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Dokumenter
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Info</h3>
            <p className="text-sm text-gray-600">
              Laget med ❤️ for jobbsøkere
            </p>
            <p className="text-xs text-gray-500 mt-2">
              © 2025 Jobbsøk Assistent
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
