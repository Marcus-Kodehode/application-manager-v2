# Jobbsøk-assistent v2 – Progression

## 🎯 Mål
En rask, trygg og personlig jobbsøk-assistent med Kanban-pipeline, detaljsider, dokumenthåndtering, og full personvern-kontroll.

## 🔧 Stack
- **Frontend**: Next.js 16 (App Router), React Server Components
- **Auth**: Clerk
- **Database**: MongoDB Atlas + **Mongoose** (ikke Prisma!)
- **Validering**: Zod (delt klient/server)
- **UI**: Tailwind + shadcn/ui
- **Forms**: react-hook-form + zodResolver
- **Filopplasting**: Vercel Blob
- **i18n**: next-intl (norsk/engelsk)
- **Deploy**: Vercel

---

## ✅ Ferdig

### Setup & Fundament
- [x] Initial Next.js setup (eksisterende)
- [x] Dependencies installert (package.json oppdatert)
  - [x] Mongoose for MongoDB
  - [x] Clerk for auth
  - [x] Zod for validering
  - [x] react-hook-form
  - [x] @dnd-kit for drag-and-drop
  - [ ] next-intl for i18n (venter på Next.js 16 support)
  - [x] Vercel Blob
  - [x] Utility libraries (clsx, tailwind-merge, date-fns, lucide-react)

### Database & Models
- [x] MongoDB connection setup (lib/db.ts)
- [x] Mongoose schemas opprettet:
  - [x] UserProfile
  - [x] Job (med JobStatus enum)
  - [x] Note
  - [x] Task
  - [x] Document (med DocType enum)
  - [x] Event (med EventType enum)
  - [x] Contact
  - [x] AnalyticsEvent
  - [x] Indekser: userId, jobId, status, dueAt

### Validering & Auth
- [x] Zod schemas (lib/validation.ts):
  - [x] jobCreateSchema, jobUpdateSchema
  - [x] taskCreateSchema, taskUpdateSchema
  - [x] noteCreateSchema
  - [x] contactCreateSchema
  - [x] documentUploadSchema
- [x] Auth helpers (lib/auth.ts)
- [x] Clerk middleware setup

### Server Actions
- [x] Job actions (lib/actions/jobs.ts):
  - [x] createJob
  - [x] updateJob
  - [x] deleteJob
  - [x] moveJobStatus
  - [x] getJobs (med filtre)
  - [x] getJobById
- [x] Task actions (lib/actions/tasks.ts):
  - [x] createTask
  - [x] updateTask
  - [x] toggleTask
  - [x] deleteTask
  - [x] getTasksByJob
  - [x] getUpcomingTasks
- [x] Note actions (lib/actions/notes.ts):
  - [x] createNote
  - [x] deleteNote
  - [x] getNotesByJob

### UI & Pages
- [x] Layout med Clerk provider
- [x] Dashboard (/) - landing page
- [x] /jobs - liste med Kanban-visning
- [x] /jobs/new - opprett jobb
- [x] JobForm komponent
- [x] /documents - placeholder
- [x] Utility functions (lib/utils.ts)

### Config
- [x] .env.local.example opprettet
- [x] TypeScript global types

---

### Jobb DetalUD
de
- [x] Vis jobbinforma
- [x] Rediger jobb (inlineing)
- [x] Slett jobb (med bekreftelse)
- [x] Tilbake til jobbliste

## 🚧 Pågående

### Neste prioritet
ver**
  - [ ] Legg til notater per obb
  - [ ] Opprett oppgaver med deadlin
  - [ ] Marker oppgav
  
nger**
  -t
ling
  - [ ] Status-endring via dragstyBedre   - [ ] naliteksjod-drop fun [ ] Drag-an Forbedrianban ] **K- [

---

### Uke 2: Kjernefunksjonalitet

- [ ] **Jobbdetalj (tabs)**
  - [ ] Timeline tab (Event-historikk)
  - [ ] Notes tab (markdown-støtte)
  - [ ] Tasks tab (med deadlines)
  - [ ] Files tab (vedlegg via Vercel Blob)
  - [ ] Contacts tab (kontaktpersoner)

- [ ] **Mine Dokumenter**
  - [ ] /documents - liste over CV/CL
  - [ ] Upload til Vercel Blob
  - [ ] DocumentGrid komponent
  - [ ] Server actions: uploadDocument, deleteDocument

- [ ] **Søk & Filtre**
  - [ ] Søk på tittel/firma/notes
  - [ ] Filter på status, tags, sted, remote
  - [ ] Tag-system

- [ ] **CSV Eksport/Import**
  - [ ] Eksporter jobber til CSV
  - [ ] Importer jobber fra CSV

- [ ] **iCal Feed**
  - [ ] GET /api/ical/[jobId] - generer .ics for intervjuer

- [ ] **Analytics & Personvern**
  - [ ] Cookie-banner (Functional vs Analytics)
  - [ ] logEvent server action
  - [ ] /settings/privacy - analytics dashboard
  - [ ] Samtykke-styrt tracking

- [ ] **Sikkerhet**
  - [ ] Rate-limit middleware (Edge)
  - [ ] CSP + security headers
  - [ ] Input-validering (max tags, filstørrelse, MIME-typer)
  - [ ] Streng userId-filter i alle queries

---

### Uke 3: Polish & Deploy

- [ ] **Settings**
  - [ ] /settings/profile - navn/locale/theme
  - [ ] /settings/account - Clerk account management
  - [ ] /settings/privacy - cookies/analytics/slett data

- [ ] **Mobile Optimalisering**
  - [ ] Floating +-knapp
  - [ ] Responsive kanban
  - [ ] Sheet/dialog for detaljer

- [ ] **A11y & UX**
  - [ ] Tastaturnavigasjon
  - [ ] ARIA labels
  - [ ] Fokusringer
  - [ ] Empty states
  - [ ] Loading states
  - [ ] Error states
  - [ ] Tooltips/hjelpetekst

- [ ] **Testing**
  - [ ] Vitest: Zod schemas + actions
  - [ ] Playwright: kritiske flows (login → create job → move status → create task)
  - [ ] Postman: API routes

- [ ] **Deploy**
  - [ ] Miljøvariabler (DATABASE_URL, CLERK_*, BLOB_TOKEN)
  - [ ] Vercel deploy
  - [ ] Røyktest i prod

---

## 📋 V2 Backlog (etter MVP)
- [ ] Google Calendar toveis sync
- [ ] E-postmaler med "send fra appen"
- [ ] Auto-uttrekk fra annonsetekst
- [ ] Smart forslag ("3 jobber i Screening uten oppfølging >7 dager")
- [ ] PWA: offline cache
- [ ] Deling (read-only lenke)

---

## 🚨 Kritiske Punkter (må være riktig!)
1. ✅ **Mongoose** (ikke Prisma) - enklere for MongoDB
2. ⚠️ **Streng userId-filter** i ALLE queries - ingen snarveier!
3. ⚠️ **Rate-limit** på mutasjoner
4. ⚠️ **Filtyper whitelist** + størrelse (5-10 MB max)
5. ⚠️ **Samtykke før analytics** - ingen tracking uten godkjenning
6. ✅ **CSV eksport** - brukeren eier sine data

---

## 📝 Notater
- Mongoose er bedre enn Prisma for MongoDB - native support, enklere schemas
- Vercel Edge Functions for rate-limiting
- Server Actions for all CRUD - minimerer API-støy
- RSC der mulig, klientkomp kun for interaktivitet

---

## 🎯 Status Oppsummering

### Hva er klart nå:
✅ **Komplett fundament** - Mongoose schemas, Zod validering, Clerk auth
✅ **Job CRUD** - Opprett, les, oppdater, slett jobber
✅ **Task system** - Oppgaver med deadlines
✅ **Note system** - Notater per jobb
✅ **Event logging** - Audit trail for endringer
✅ **Basic UI** - Dashboard, jobbliste, opprett jobb

### Neste prioritet:
1. **Jobbdetalj side** med tabs (Timeline, Notes, Tasks)
2. **Drag-and-drop Kanban** for enkel statusendring
3. **Dokumenthåndtering** med Vercel Blob
4. **CSV eksport/import**
5. **Sikkerhet** - rate-limiting, headers

### For å komme i gang:
1. Kjør `npm install`
2. Setup `.env.local` (se SETUP.md)
3. Kjør `npm run dev`
4. Opprett første jobb!

### Dokumentasjon:
- 📖 [README.md](./README.md) - Prosjekt oversikt
- 🚀 [SETUP.md](./SETUP.md) - Installasjonsveiledning (START HER!)
- 📁 [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Filstruktur forklart
- 🗄️ [MONGOOSE_NOTES.md](./MONGOOSE_NOTES.md) - Hvorfor Mongoose vs Prisma
- ✅ [TODO.md](./TODO.md) - Detaljert oppgaveliste

### Viktige filer opprettet:
```
✅ lib/db.ts                    - MongoDB connection
✅ lib/auth.ts                  - Clerk helpers
✅ lib/validation.ts            - Zod schemas
✅ lib/utils.ts                 - Utility functions
✅ lib/models/*.ts              - 8 Mongoose schemas
✅ lib/actions/*.ts             - Server Actions (jobs, tasks, notes)
✅ middleware.ts                - Clerk auth protection
✅ app/page.tsx                 - Dashboard
✅ app/jobs/page.tsx            - Jobbliste
✅ app/jobs/new/page.tsx        - Opprett jobb
✅ components/jobs/JobForm.tsx  - Job form
✅ .env.local.example           - Environment template
✅ package.json                 - Dependencies (klar for npm install)
```

**Alt er klart for `npm install` og utvikling! 🎉**
