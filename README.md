# Jobbsøk Assistent v2

En personlig jobbsøk-tracker bygget med Next.js 16, Mongoose, og Clerk.

## 🚀 Kom i gang

### 1. Installer dependencies

```bash
npm install
```

### 2. Setup miljøvariabler

Kopier `.env.local.example` til `.env.local` og fyll inn:

```bash
cp .env.local.example .env.local
```

Du trenger:
- **MongoDB Atlas URI** - Opprett gratis cluster på [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- **Clerk Keys** - Opprett gratis app på [clerk.com](https://clerk.com)

### 3. Start utviklingsserver

```bash
npm run dev
```

Åpne [http://localhost:3000](http://localhost:3000) i nettleseren.

## 📁 Prosjektstruktur

```
├── app/                    # Next.js App Router
│   ├── jobs/              # Jobb-relaterte sider
│   ├── documents/         # Dokumenthåndtering
│   └── page.tsx           # Dashboard
├── components/            # React komponenter
│   └── jobs/             # Jobb-spesifikke komponenter
├── lib/
│   ├── models/           # Mongoose schemas
│   ├── actions/          # Server Actions
│   ├── db.ts             # MongoDB connection
│   ├── auth.ts           # Auth helpers
│   ├── validation.ts     # Zod schemas
│   └── utils.ts          # Utility functions
└── types/                # TypeScript types
```

## 🔧 Stack

- **Frontend**: Next.js 16 (App Router), React Server Components
- **Auth**: Clerk
- **Database**: MongoDB Atlas + Mongoose
- **Validering**: Zod
- **UI**: Tailwind CSS
- **Forms**: react-hook-form
- **Deploy**: Vercel

## 📋 Funksjoner

### ✅ Implementert
- Autentisering med Clerk
- Opprett og administrer jobbsøknader
- Kanban-visning med statuser (Søkt, Screening, Intervju, Tilbud, Avvist, På vent)
- Server Actions for all CRUD
- Streng userId-isolasjon

### 🚧 Under utvikling
- Jobbdetalj med tabs (Timeline, Notes, Tasks, Files, Contacts)
- Drag-and-drop i Kanban
- Dokumenthåndtering
- CSV eksport/import
- iCal feed
- Analytics & personvern

Se [progression.md](./progression.md) for full oversikt.

## 🔒 Sikkerhet

- Alle queries filtreres på `userId` - ingen bruker kan se andres data
- Clerk håndterer autentisering
- Zod validerer all input
- Rate-limiting kommer i neste fase

## 📝 Neste steg

1. **Installer dependencies**: `npm install`
2. **Setup .env.local** med MongoDB og Clerk keys
3. **Start dev server**: `npm run dev`
4. **Opprett første jobb** via UI

Se [progression.md](./progression.md) for detaljert arbeidsplan.

## 🆘 Problemer?

- Sjekk at MongoDB URI er korrekt
- Sjekk at Clerk keys er satt
- Sjekk at du har Node.js 18+ installert
- Se console for feilmeldinger

## 📄 Lisens

Privat prosjekt
