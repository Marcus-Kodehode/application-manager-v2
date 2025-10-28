# Prosjektstruktur - Jobbsøk Assistent v2

## 📁 Komplett filstruktur

```
application-manager-v2/
├── app/                           # Next.js App Router
│   ├── jobs/
│   │   ├── new/
│   │   │   └── page.tsx          # Opprett ny jobb
│   │   ├── [id]/                 # Jobbdetalj (kommer)
│   │   └── page.tsx              # Jobbliste med Kanban
│   ├── documents/
│   │   └── page.tsx              # Dokumenthåndtering (placeholder)
│   ├── favicon.ico
│   ├── globals.css               # Global styling
│   ├── layout.tsx                # Root layout med Clerk
│   └── page.tsx                  # Dashboard / landing
│
├── components/
│   └── jobs/
│       └── JobForm.tsx           # Skjema for å opprette jobb
│
├── lib/
│   ├── actions/                  # Server Actions
│   │   ├── jobs.ts              # Job CRUD + moveJobStatus
│   │   ├── tasks.ts             # Task CRUD + toggle
│   │   └── notes.ts             # Note CRUD
│   ├── models/                   # Mongoose schemas
│   │   ├── UserProfile.ts       # Brukerinnstillinger
│   │   ├── Job.ts               # Jobbsøknader (med JobStatus enum)
│   │   ├── Note.ts              # Notater per jobb
│   │   ├── Task.ts              # Oppgaver med deadlines
│   │   ├── Document.ts          # Dokumenter (CV/CL)
│   │   ├── Event.ts             # Audit log (med EventType enum)
│   │   ├── Contact.ts           # Kontaktpersoner
│   │   └── AnalyticsEvent.ts    # Analytics (samtykke-styrt)
│   ├── auth.ts                   # Clerk auth helpers
│   ├── db.ts                     # MongoDB connection (cached)
│   ├── utils.ts                  # Utility functions (cn, formatDate)
│   └── validation.ts             # Zod schemas
│
├── types/
│   └── global.d.ts               # TypeScript global types
│
├── .env.local.example            # Miljøvariabler template
├── .gitignore
├── middleware.ts                 # Clerk auth middleware
├── next.config.ts
├── package.json                  # Dependencies
├── postcss.config.mjs
├── progression.md                # Arbeidsplan & status
├── PROJECT_STRUCTURE.md          # Denne filen
├── README.md                     # Prosjekt oversikt
├── SETUP.md                      # Installasjonsveiledning
└── tsconfig.json
```

## 🗂️ Filbeskrivelser

### App Router (`app/`)
- **page.tsx** - Dashboard med velkommen og quick links
- **jobs/page.tsx** - Kanban-visning av alle jobber gruppert etter status
- **jobs/new/page.tsx** - Skjema for å opprette ny jobbsøknad
- **documents/page.tsx** - Placeholder for dokumenthåndtering

### Komponenter (`components/`)
- **jobs/JobForm.tsx** - Client-side form for jobbopprettelse med validering

### Server Actions (`lib/actions/`)
- **jobs.ts** - createJob, updateJob, deleteJob, moveJobStatus, getJobs, getJobById
- **tasks.ts** - createTask, updateTask, toggleTask, deleteTask, getTasksByJob, getUpcomingTasks
- **notes.ts** - createNote, deleteNote, getNotesByJob

### Mongoose Models (`lib/models/`)
Alle modeller har:
- `userId` index for sikkerhet
- Timestamps der relevant
- Enums for status/type felter

**Job** - Hovedmodell for jobbsøknader
- Status: APPLIED, SCREENING, INTERVIEW, OFFER, REJECTED, ON_HOLD
- Felter: title, company, location, remote, source, url, salaryNote, tags, appliedAt, nextActionAt

**Task** - Oppgaver med deadlines
- Kan være knyttet til en jobb eller standalone
- done boolean, dueAt timestamp

**Note** - Markdown-notater per jobb
- content felt støtter markdown

**Event** - Audit log for alle viktige hendelser
- Type: STATUS_CHANGED, NOTE_ADDED, TASK_ADDED, TASK_DONE, FILE_ATTACHED
- payload JSON for ekstra data

**Document** - Filer (CV, søknader)
- Type: CV, COVER_LETTER, OTHER
- blobUrl til Vercel Blob storage

**Contact** - Kontaktpersoner per jobb
- name, email, phone, role

**UserProfile** - Brukerinnstillinger
- locale (nb/en)

**AnalyticsEvent** - Samtykke-styrt analytics
- name, props, ts

### Utilities (`lib/`)
- **auth.ts** - requireAuth(), getAuthUserId() - Clerk helpers
- **db.ts** - connectDB() - Cached MongoDB connection
- **utils.ts** - cn() for classnames, formatDate(), formatDateTime()
- **validation.ts** - Zod schemas for all input validering

### Config
- **middleware.ts** - Clerk auth protection for alle ruter unntatt /sign-in og /sign-up
- **.env.local.example** - Template for miljøvariabler
- **tsconfig.json** - TypeScript config med path aliases (@/)

## 🔐 Sikkerhet

Alle queries filtreres på `userId`:
```typescript
const jobs = await Job.find({ userId }).sort({ updatedAt: -1 });
```

Ingen bruker kan se eller endre andres data.

## 🎨 Styling

- Tailwind CSS for all styling
- Konsistent spacing (px-4, py-2, gap-4, etc.)
- Responsive design (md:, lg: breakpoints)
- Focus states for accessibility

## 📊 Dataflyt

1. **Bruker** → Fyller ut form
2. **Client Component** → Validerer og sender til Server Action
3. **Server Action** → Validerer med Zod, sjekker auth
4. **Mongoose** → Lagrer i MongoDB
5. **Event** → Logger endring for audit trail
6. **Revalidate** → Oppdaterer cache
7. **Redirect** → Sender bruker til riktig side

## 🚀 Neste steg

Se [progression.md](./progression.md) for hva som skal implementeres videre.
