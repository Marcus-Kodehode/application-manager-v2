# TODO - Jobbsøk Assistent v2

## 🚀 Umiddelbare neste steg

### 1. Setup & Test (gjør dette først!) ✅
- [✅] Kjør `npm install`
- [✅] Opprett MongoDB Atlas cluster
- [✅] Opprett Clerk app
- [✅] Kopier `.env.local.example` til `.env.local`
- [✅] Fyll inn MONGODB_URI og CLERK keys
- [✅] Kjør `npm run dev`
- [✅] Test: Opprett bruker og første jobb

### 2. Jobbdetalj Side (høy prioritet) ✅
- [✅] Opprett `/app/jobs/[id]/page.tsx`
- [✅] Tabs komponent (Timeline, Notes, Tasks, Files, Contacts)
- [✅] Timeline tab - vis Event historikk
- [✅] Notes tab - vis og opprett notater
- [✅] Tasks tab - vis og opprett oppgaver
- [✅] Integrer med eksisterende actions

### 3. Kanban Drag-and-Drop✅
- [✅] Installer @dnd-kit (allerede i package.json)
- [✅] Opprett Kanban komponent med DnD
- [✅] Integrer moveJobStatus action
- [✅] Smooth animations
- [✅] Mobile touch support

### 4. UI Forbedringer
- [ ] Installer shadcn/ui komponenter:
  - [ ] `npx shadcn@latest init`
  - [ ] Button, Card, Dialog, Tabs, Badge, Input, Select
- [ ] Erstatt basic HTML elements med shadcn
- [ ] Konsistent styling
- [ ] Loading states
- [ ] Error states
- [ ] Empty states

## 📅 Uke 1 (fortsetter)

### Dokumenthåndtering✅
- [✅] Setup Vercel Blob
- [✅] Upload komponent
- [✅] Document actions (upload, delete)
- [✅] Files tab i jobbdetalj
- [✅] Filtype validering (PDF, DOCX, PNG, WEBP)
- [✅] Størrelse limit (5-10 MB)

### Søk & Filtre
- [ ] Søkefelt i /jobs
- [ ] Filter på status
- [ ] Filter på tags
- [ ] Filter på remote
- [ ] Filter på location

### CSV Eksport/Import
- [ ] Eksporter jobber til CSV
- [ ] Importer jobber fra CSV
- [ ] Validering av import data

## 📅 Uke 2

### iCal Feed
- [ ] `/api/ical/[jobId]/route.ts`
- [ ] Generer .ics fil for intervjuer
- [ ] Test med Google Calendar

### Analytics & Personvern
- [ ] Cookie banner komponent
- [ ] logEvent server action
- [ ] Analytics dashboard i /settings/privacy
- [ ] Samtykke-håndtering
- [ ] "Slett alle data" funksjon

### Sikkerhet
- [ ] Rate-limit middleware
- [ ] CSP headers
- [ ] Security headers (X-Frame-Options, etc.)
- [ ] Input sanitization
- [ ] MIME type validation

### Settings Pages
- [ ] `/app/settings/profile/page.tsx`
- [ ] `/app/settings/account/page.tsx` (Clerk)
- [ ] `/app/settings/privacy/page.tsx`
- [ ] Locale switcher (nb/en)

## 📅 Uke 3

### i18n (next-intl)
- [ ] Setup next-intl
- [ ] `messages/nb.json`
- [ ] `messages/en.json`
- [ ] Oversett alle UI tekster
- [ ] Språk-switcher i header

### Mobile Optimalisering
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

## 🎨 Design Polish

### Styling
- [ ] Konsistent spacing (8px grid)
- [ ] Konsistent border radius
- [ ] Konsistent shadows
- [ ] Hover states
- [ ] Active states
- [ ] Disabled states

### Animasjoner
- [ ] Page transitions
- [ ] Card hover effects
- [ ] Button feedback
- [ ] Loading spinners
- [ ] Success/error toasts

### Ikoner
- [ ] Lucide React ikoner
- [ ] Konsistent størrelse (18-20px)
- [ ] Konsistent stroke width

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
- [ ] Bruker kan se jobbdetaljer
- [ ] Bruker kan flytte jobber mellom statuser (drag-drop)
- [ ] Bruker kan legge til notater
- [ ] Bruker kan legge til oppgaver
- [ ] Bruker kan laste opp dokumenter
- [ ] Bruker kan eksportere til CSV
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
