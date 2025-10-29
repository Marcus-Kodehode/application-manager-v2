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
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-primary-foreground font-bold text-lg">J</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">Jobbsøk Assistent</h1>
          </div>
          <div className="flex gap-3">
            <Link
              href="/sign-in"
              className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              Logg inn
            </Link>
            <Link
              href="/sign-up"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium shadow-sm"
            >
              Kom i gang
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-20 text-center">
          <h2 className="text-5xl font-bold text-foreground mb-6 animate-fade-in">
            Hold oversikt over jobbsøknaden din
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            En enkel og kraftig verktøy for å organisere jobbsøknader, holde styr på intervjuer, 
            og aldri gå glipp av en oppfølging.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/sign-up"
              className="px-8 py-3 bg-primary text-primary-foreground text-lg font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-lg"
            >
              Start gratis
            </Link>
            <Link
              href="#features"
              className="px-8 py-3 border-2 border-border text-foreground text-lg font-medium rounded-lg hover:bg-secondary transition-colors"
            >
              Les mer
            </Link>
          </div>
        </div>

        {/* Features */}
        <div id="features" className="py-20">
          <h3 className="text-3xl font-bold text-center text-foreground mb-12">
            Alt du trenger for en vellykket jobbsøk
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-2">Kanban Board</h4>
              <p className="text-muted-foreground leading-relaxed">
                Organiser søknader i kolonner: Søkt, Screening, Intervju, Tilbud. 
                Dra og slipp for å oppdatere status.
              </p>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-2">Oppgaver & Påminnelser</h4>
              <p className="text-muted-foreground leading-relaxed">
                Legg til oppgaver med deadlines. Få oversikt over hva som må gjøres 
                og når du må følge opp.
              </p>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-2">Notater & Dokumenter</h4>
              <p className="text-muted-foreground leading-relaxed">
                Lagre notater fra intervjuer, last opp CV og søknader. 
                Alt på ett sted.
              </p>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-2">Timeline & Historikk</h4>
              <p className="text-muted-foreground leading-relaxed">
                Se hele historikken for hver søknad. Når søkte du? Når var intervjuet? 
                Alt er logget.
              </p>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-error/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-2">Privat & Sikkert</h4>
              <p className="text-muted-foreground leading-relaxed">
                Dine data er kun dine. Ingen deling, ingen tracking uten samtykke. 
                Full kontroll.
              </p>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💾</span>
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-2">Eksporter Data</h4>
              <p className="text-muted-foreground leading-relaxed">
                Eksporter alle søknader til CSV når som helst. 
                Dine data, ditt eierskap.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="py-20 text-center">
          <div className="bg-primary rounded-2xl p-12 text-primary-foreground shadow-xl">
            <h3 className="text-3xl font-bold mb-4">Klar til å komme i gang?</h3>
            <p className="text-xl mb-8 opacity-90">
              Opprett en gratis konto og få kontroll på jobbsøket ditt i dag.
            </p>
            <Link
              href="/sign-up"
              className="inline-block px-8 py-3 bg-card text-foreground text-lg font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-lg"
            >
              Start gratis nå
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-muted-foreground">
          <p>© 2025 Jobbsøk Assistent. Laget med ❤️ for jobbsøkere.</p>
        </div>
      </footer>
    </div>
  );
}
