import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card mt-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-primary-foreground font-bold">J</span>
              </div>
              <span className="font-bold text-lg text-foreground">Jobbsøk Assistent</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              Din personlige assistent for å holde oversikt over jobbsøknader, intervjuer og karrieremuligheter. 
              Enkel, effektiv og alltid oppdatert.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">
              Navigasjon
            </h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/dashboard" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors duration-150 inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                  <span className="ml-2">Oversikt</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/jobs" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors duration-150 inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                  <span className="ml-2">Jobber</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/documents" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors duration-150 inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                  <span className="ml-2">Dokumenter</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">
              Ressurser
            </h3>
            <ul className="space-y-4">
              <li>
                <a 
                  href="https://github.com/Marcus-Kodehode" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors duration-150 inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                  <span className="ml-2">GitHub</span>
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors duration-150 inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                  <span className="ml-2">Dokumentasjon</span>
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors duration-150 inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                  <span className="ml-2">Support</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Jobbsøk Assistent. Laget med ❤️ for jobbsøkere.
            </p>
            <div className="flex items-center gap-6">
              <a 
                href="#" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
              >
                Personvern
              </a>
              <a 
                href="#" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
              >
                Vilkår
              </a>
              <a 
                href="#" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
              >
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
