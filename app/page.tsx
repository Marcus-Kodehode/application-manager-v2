import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function LandingPage() {
  const { userId } = await auth();
  
  // Hvis bruker er innlogget, redirect til dashboard
  if (userId) {
    redirect('/dashboard');
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">J</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Jobbsøk Assistent</h1>
          </div>
          <div className="flex gap-3">
            <Link
              href="/sign-in"
              className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              Logg inn
            </Link>
            <Link
              href="/sign-up"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Kom i gang
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-20 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Hold oversikt over jobbsøknaden din
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            En enkel og kraftig verktøy for å organisere jobbsøknader, holde styr på intervjuer, 
            og aldri gå glipp av en oppfølging.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/sign-up"
              className="px-8 py-3 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              Start gratis
            </Link>
            <Link
              href="#features"
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 text-lg rounded-lg hover:border-gray-400 transition-colors"
            >
              Les mer
            </Link>
          </div>
        </div>

        {/* Features */}
        <div id="features" className="py-20">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Alt du trenger for en vellykket jobbsøk
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Kanban Board</h4>
              <p className="text-gray-600">
                Organiser søknader i kolonner: Søkt, Screening, Intervju, Tilbud. 
                Dra og slipp for å oppdatere status.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Oppgaver & Påminnelser</h4>
              <p className="text-gray-600">
                Legg til oppgaver med deadlines. Få oversikt over hva som må gjøres 
                og når du må følge opp.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Notater & Dokumenter</h4>
              <p className="text-gray-600">
                Lagre notater fra intervjuer, last opp CV og søknader. 
                Alt på ett sted.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Timeline & Historikk</h4>
              <p className="text-gray-600">
                Se hele historikken for hver søknad. Når søkte du? Når var intervjuet? 
                Alt er logget.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Privat & Sikkert</h4>
              <p className="text-gray-600">
                Dine data er kun dine. Ingen deling, ingen tracking uten samtykke. 
                Full kontroll.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💾</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Eksporter Data</h4>
              <p className="text-gray-600">
                Eksporter alle søknader til CSV når som helst. 
                Dine data, ditt eierskap.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="py-20 text-center">
          <div className="bg-blue-600 rounded-2xl p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">Klar til å komme i gang?</h3>
            <p className="text-xl mb-8 text-blue-100">
              Opprett en gratis konto og få kontroll på jobbsøket ditt i dag.
            </p>
            <Link
              href="/sign-up"
              className="inline-block px-8 py-3 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-blue-50 transition-colors"
            >
              Start gratis nå
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600">
          <p>© 2025 Jobbsøk Assistent. Laget med ❤️ for jobbsøkere.</p>
        </div>
      </footer>
    </div>
  );
}
