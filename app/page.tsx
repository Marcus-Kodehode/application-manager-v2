import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export default async function LandingPage() {
  const { userId } = await auth();
  
  // Hvis bruker er innlogget, redirect til dashboard
  if (userId) {
    redirect('/dashboard');
  }
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-primary-foreground font-bold text-lg">J</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">Jobbsøk Assistent</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/sign-in"
              className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors font-medium"
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

      {/* Hero Section - Full viewport height */}
      <main>
        <div className="min-h-[calc(100vh-73px)] flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-8 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Gratis å bruke • Ingen kredittkort nødvendig
            </div>

            {/* Main heading */}
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight animate-fade-in">
              Ta kontroll over
              <span className="block text-primary mt-2">jobbsøket ditt</span>
            </h2>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Organiser søknader, spor fremdrift og aldri gå glipp av en mulighet. 
              Alt du trenger for et vellykket jobbsøk – på ett sted.
            </p>

            {/* CTA Buttons */}
            <div className="flex gap-4 justify-center flex-wrap mb-12">
              <Link
                href="/sign-up"
                className="group px-8 py-4 bg-primary text-primary-foreground text-lg font-semibold rounded-lg hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                Start gratis nå
                <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link
                href="#features"
                className="px-8 py-4 border-2 border-border text-foreground text-lg font-medium rounded-lg hover:bg-secondary transition-colors"
              >
                Se hvordan det fungerer
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground flex-wrap">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Ingen installasjon</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>100% privat</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Alltid oppdatert</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary/30">
          <div className="max-w-7xl mx-auto">
            {/* Section header */}
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                Funksjoner
              </span>
              <h3 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Alt du trenger for et
                <span className="block text-primary">vellykket jobbsøk</span>
              </h3>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Kraftige verktøy som gjør jobbsøket enklere og mer organisert
              </p>
            </div>

            {/* Feature grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group bg-card p-8 rounded-2xl shadow-sm border border-border hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-3xl">📋</span>
                </div>
                <h4 className="text-xl font-bold text-foreground mb-3">Kanban Board</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Visualiser søknadsprosessen med drag-and-drop. Flytt jobber mellom Søkt, Screening, Intervju og Tilbud.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group bg-card p-8 rounded-2xl shadow-sm border border-border hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-success to-success/60 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-3xl">✅</span>
                </div>
                <h4 className="text-xl font-bold text-foreground mb-3">Oppgaver & Deadlines</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Hold styr på hva som må gjøres. Sett deadlines og få oversikt over kommende oppfølginger.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group bg-card p-8 rounded-2xl shadow-sm border border-border hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-accent to-accent/60 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-3xl">📝</span>
                </div>
                <h4 className="text-xl font-bold text-foreground mb-3">Notater & Dokumenter</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Lagre intervjunotater og last opp CV, søknader og andre dokumenter. Alt samlet på ett sted.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="group bg-card p-8 rounded-2xl shadow-sm border border-border hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-warning to-warning/60 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-3xl">📊</span>
                </div>
                <h4 className="text-xl font-bold text-foreground mb-3">Timeline & Historikk</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Full oversikt over hver søknads reise. Se når du søkte, intervjudatoer og all aktivitet.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="group bg-card p-8 rounded-2xl shadow-sm border border-border hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-error to-error/60 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-3xl">🔒</span>
                </div>
                <h4 className="text-xl font-bold text-foreground mb-3">Privat & Sikkert</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Dine data tilhører deg. Ingen deling, ingen tracking uten samtykke. Full kontroll over informasjonen din.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="group bg-card p-8 rounded-2xl shadow-sm border border-border hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-3xl">💾</span>
                </div>
                <h4 className="text-xl font-bold text-foreground mb-3">Eksporter Data</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Ta med deg dataene dine. Eksporter alle søknader til JSON eller CSV når som helst.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Light mode: gradient blue, Dark mode: dark with subtle glow */}
            <div className="relative rounded-3xl p-12 md:p-16 text-center overflow-hidden shadow-2xl bg-gradient-to-br from-[#2563eb] via-[#1d4ed8] to-[#0891b2] dark:from-[#1e293b] dark:via-[#0f172a] dark:to-[#020617]">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 dark:bg-primary/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 dark:bg-accent/20 rounded-full blur-3xl"></div>
              
              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Klar til å ta kontroll?
                </h3>
                <p className="text-xl md:text-2xl text-white/95 mb-10 max-w-2xl mx-auto leading-relaxed">
                  Bli med tusenvis av jobbsøkere som har organisert søknadsprosessen sin.
                  Helt gratis, ingen kredittkort nødvendig.
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <Link
                    href="/sign-up"
                    className="group px-8 py-4 bg-white text-[#2563eb] text-lg font-bold rounded-xl hover:scale-105 transition-all shadow-xl hover:shadow-2xl"
                  >
                    Start gratis nå
                    <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                  <Link
                    href="/sign-in"
                    className="px-8 py-4 border-2 border-white/30 text-white text-lg font-semibold rounded-xl hover:bg-white/10 transition-colors backdrop-blur-sm"
                  >
                    Logg inn
                  </Link>
                </div>
                
                {/* Trust indicators */}
                <div className="mt-10 flex items-center justify-center gap-6 text-white/90 text-sm flex-wrap">
                  <div className="flex items-center gap-2 font-semibold">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Gratis for alltid</span>
                  </div>
                  <div className="flex items-center gap-2 font-semibold">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Ingen kredittkort</span>
                  </div>
                  <div className="flex items-center gap-2 font-semibold">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Klar på 2 minutter</span>
                  </div>
                </div>
              </div>
            </div>
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
