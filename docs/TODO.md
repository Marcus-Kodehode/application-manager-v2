# TODO - Jobbsøk Assistent v2

> **Merk**: For fullstendig oversikt over hva som er gjort, se [CHANGELOG.md](./CHANGELOG.md)

## 🚀 Neste Prioritet

### 1. Kanban Drag-and-Drop Forbedringer
- [ ] Implementer faktisk drag-and-drop med @dnd-kit
- [ ] Visuell feedback under dragging
- [ ] Smooth animations ved drop
- [ ] Undo funksjonalitet
- [ ] Bulk move (flytt flere jobber samtidig)

### 2. Søk & Filtre Forbedringer
- [ ] Avansert søk (søk i notater, oppgaver, kontakter)
- [ ] Lagrede søk/filtre
- [ ] Sortering (dato, alfabetisk, status)
- [ ] Bulk actions (slett, endre status på flere)

### 3. iCal Feed
- [ ] `/api/ical/[jobId]/route.ts`
- [ ] Generer .ics fil for intervjuer
- [ ] Test med Google Calendar

### 4. Analytics & Personvern
- [ ] Cookie banner komponent
- [ ] logEvent server action
- [ ] Analytics dashboard i /settings/privacy
- [ ] Samtykke-håndtering
- [ ] "Slett alle data" funksjon

### 5. Sikkerhet
- [ ] Rate-limit middleware
- [ ] CSP headers
- [ ] Security headers (X-Frame-Options, etc.)
- [ ] Input sanitization
- [ ] MIME type validation

### 6. Settings Pages
- [ ] `/app/settings/profile/page.tsx`
- [ ] `/app/settings/account/page.tsx` (Clerk)
- [ ] `/app/settings/privacy/page.tsx`
- [ ] Locale switcher (nb/en)

### 7. i18n (next-intl)
- [ ] Setup next-intl
- [ ] `messages/nb.json`
- [ ] `messages/en.json`
- [ ] Oversett alle UI tekster
- [ ] Språk-switcher i header

### 8. Mobile Optimalisering
- [ ] Responsive Kanban
- [ ] Floating action button
- [ ] Sheet/Dialog for mobile
- [ ] Touch gestures
- [ ] Test på mobil

### Testing
- [ ] Vitest setup
- [ ] Test Zod schemas
- [ ] Test server actions (mocked)
- [ ] Playwright setup
- [ ] E2E test: Login → Create job → Move status
- [ ] Postman collection for API routes

### A11y
- [ ] Tastaturnavigasjon
- [ ] ARIA labels
- [ ] Focus indicators
- [ ] Screen reader testing
- [ ] Kontrast sjekk (4.5:1)

### Deploy
- [ ] Vercel project setup
- [ ] Miljøvariabler i Vercel
- [ ] Production deploy
- [ ] Test i prod
- [ ] Custom domain (optional)

## 🎨 Design & Styling

### Theme System ✅
- [✅] Dark/Light mode toggle
- [✅] CSS variabler for farger
- [✅] ThemeProvider setup
- [✅] Design system dokumentasjon

### Komponent Styling (Følg DESIGN_SYSTEM.md)
- [✅] Header
- [✅] ThemeToggle
- [✅] Footer
- [✅] Landing page
- [✅] Dashboard
- [✅] Jobs page
- [✅] JobsFilter
- [✅] Job detail page
- [ ] Documents page
- [ ] JobForm
- [ ] KanbanBoard
- [ ] JobsFilter
- [ ] CSVManager
- [ ] All tabs (Timeline, Notes, Tasks, Files, Contacts)

### Polish
- [ ] Konsistent spacing (8px grid)
- [ ] Smooth transitions (150-300ms)
- [ ] Hover states på alle buttons
- [ ] Focus states for accessibility
- [ ] Loading states
- [ ] Empty states
- [ ] Error states

## 🐛 Bugs & Issues

- [ ] (ingen kjente bugs ennå)

## 💡 Nice-to-have (V2 backlog)

- [ ] Mail snippets (kopier-knapp)
- [ ] Auto-events i timeline
- [ ] Google Calendar toveis sync
- [ ] E-post templates
- [ ] Auto-uttrekk fra annonsetekst
- [ ] Smart forslag
- [ ] PWA support
- [ ] Offline mode
- [ ] Deling (read-only lenke)
- [ ] Bulk operations
- [ ] Advanced filters
- [ ] Saved searches
- [ ] Notifications (in-app + email)

## 📝 Dokumentasjon

- [x] README.md
- [x] SETUP.md
- [x] progression.md
- [x] PROJECT_STRUCTURE.md
- [x] MONGOOSE_NOTES.md
- [x] TODO.md (denne filen)
- [ ] API documentation
- [ ] Component documentation
- [ ] Deployment guide

## 🎯 Suksesskriterier

### MVP er ferdig når:
- [x] Bruker kan opprette konto
- [x] Bruker kan opprette jobber
- [x] Bruker kan se jobber i liste
- [x] Bruker kan se jobbdetaljer
- [x] Bruker kan flytte jobber mellom statuser (drag-drop)
- [x] Bruker kan legge til notater
- [x] Bruker kan legge til oppgaver
- [x] Bruker kan laste opp dokumenter
- [x] Bruker kan eksportere til CSV
- [ ] Alt er sikkert (userId-filter, rate-limit)
- [ ] Alt fungerer på Vercel

### Klar for produksjon når:
- [ ] Alle MVP features fungerer
- [ ] Testing er gjort (Vitest + Playwright)
- [ ] A11y er verifisert
- [ ] Mobile fungerer perfekt
- [ ] Performance er god (Lighthouse >90)
- [ ] Sikkerhet er på plass
- [ ] Dokumentasjon er komplett

---

**Start her**: Kjør `npm install` og følg [SETUP.md](./SETUP.md)!
